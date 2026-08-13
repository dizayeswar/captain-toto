"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabaseConfig";
import { updateProfileRole } from "./auth";
import { revalidatePaths } from "./revalidate";
import type { AppRole } from "./roles";

export async function signInAction(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/").trim() || "/";

  if (!email || !password) {
    return { error: "Enter email and password." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: error.message };
  }

  revalidatePaths("/");
  redirect(next.startsWith("/") ? next : "/");
}

export async function signOutAction() {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  }
  revalidatePaths("/");
  redirect("/login");
}

export async function updateUserRoleAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "") as AppRole;
  if (!id || !["ceo", "admin", "staff"].includes(role)) {
    throw new Error("Invalid role update");
  }
  await updateProfileRole(id, role);
  revalidatePaths("/", "/settings/users");
  redirect("/settings/users");
}

export async function createUserAction(
  _prev: { error?: string; success?: string } | null,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured." };
  }

  const { requireRole, canAssignRole, ROLE_LABELS } = await import("./auth");
  const actor = await requireRole(["ceo"]);

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const role = String(formData.get("role") ?? "staff") as AppRole;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }
  if (!["ceo", "admin", "staff"].includes(role)) {
    return { error: "Invalid role." };
  }
  if (!canAssignRole(actor.role, role, "staff")) {
    return { error: "You are not allowed to assign that role." };
  }

  const { getAdminSupabase } = await import("./supabase/admin");
  const admin = getAdminSupabase();
  if (!admin) {
    return {
      error:
        "Missing SUPABASE_SERVICE_ROLE_KEY. Add it in Vercel (and .env.local), then redeploy.",
    };
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName || email.split("@")[0] },
  });

  if (error || !data.user) {
    return { error: error?.message ?? "Could not create user." };
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: data.user.id,
    full_name: fullName || email.split("@")[0],
    role,
  });

  if (profileError) {
    return {
      error: `Account created, but role/name failed: ${profileError.message}`,
    };
  }

  revalidatePaths("/settings/users");
  return {
    success: `Created ${email} as ${ROLE_LABELS[role]}.`,
  };
}

export async function resetDataAction(
  _prev: { error?: string; success?: boolean; moved?: number } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean; moved?: number }> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "").trim();

  if (confirm !== "RESET") {
    return { error: 'Type RESET in capital letters to confirm.' };
  }

  const { resetAllData } = await import("./resetData");
  const result = await resetAllData(password);
  if (!result.ok) {
    return { error: result.error };
  }

  revalidatePaths("/");
  return {
    success: true,
    moved: result.moved,
  };
}

export async function requestPasswordResetAction(
  _prev: { error?: string; success?: string } | null,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) {
    return { error: "Enter your email address." };
  }

  const supabase = await createServerSupabaseClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const origin =
    siteUrl ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success:
      "If that email has an account, a reset link was sent. Check your inbox.",
  };
}

export async function updatePasswordAction(
  _prev: { error?: string; success?: string } | null,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured." };
  }

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Reset session expired. Request a new link from the login page.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: error.message };
  }

  await supabase.auth.signOut();
  revalidatePaths("/");
  redirect("/login?password_updated=1");
}

/** Logged-in user changes password (requires current password). */
export async function changePasswordAction(
  _prev: { error?: string; success?: string } | null,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured." };
  }

  const current = String(formData.get("current_password") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!current) {
    return { error: "Enter your current password." };
  }
  if (password.length < 6) {
    return { error: "New password must be at least 6 characters." };
  }
  if (password !== confirm) {
    return { error: "New passwords do not match." };
  }
  if (password === current) {
    return { error: "New password must be different from the current one." };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "You must be signed in to change your password." };
  }

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: current,
  });
  if (verifyError) {
    return { error: "Current password is incorrect." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: error.message };
  }

  return { success: "Password updated successfully." };
}
