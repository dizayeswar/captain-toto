"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabaseConfig";
import { updateProfileRole } from "./auth";
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

  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/");
}

export async function signOutAction() {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function updateUserRoleAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "") as AppRole;
  if (!id || !["ceo", "admin", "staff"].includes(role)) {
    throw new Error("Invalid role update");
  }
  await updateProfileRole(id, role);
  revalidatePath("/", "layout");
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

  revalidatePath("/", "layout");
  revalidatePath("/settings/users");
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

  revalidatePath("/", "layout");
  return {
    success: true,
    moved: result.moved,
  };
}
