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

export async function resetDataAction(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
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
  return { success: true };
}
