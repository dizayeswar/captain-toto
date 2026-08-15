import { cache } from "react";
import { redirect } from "next/navigation";
import { getSupabase, isSupabaseConfigured } from "./supabase";
import {
  canAssignRole,
  type AppRole,
  type Profile,
} from "./roles";

export type { AppRole, Profile } from "./roles";
export {
  ROLE_LABELS,
  canAccessFinance,
  canManageUsers,
  canPurgeRecycleBin,
  canResetData,
  canCreateUsers,
  canDisableUsers,
  canViewAuditLog,
  canAssignRole,
} from "./roles";

export async function getSessionUser() {
  if (!isSupabaseConfigured) return null;
  const supabase = await getSupabase();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Deduped per request so layout + page share one profile fetch. */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  if (!isSupabaseConfigured) {
    return {
      id: "demo",
      full_name: "Demo User",
      role: "ceo",
      disabled: false,
      email: "demo@local",
    };
  }
  const supabase = await getSupabase();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, disabled, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) {
    return {
      id: user.id,
      full_name: user.email?.split("@")[0] ?? "",
      role: "staff",
      disabled: false,
      email: user.email ?? "",
    };
  }

  return {
    ...(data as Omit<Profile, "email">),
    role: (data.role as AppRole) || "staff",
    disabled: Boolean((data as { disabled?: boolean }).disabled),
    email: user.email ?? "",
  };
});

export async function requireUser(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.disabled) {
    const supabase = await getSupabase();
    if (supabase) await supabase.auth.signOut();
    redirect("/login?disabled=1");
  }
  return profile;
}

export async function requireRole(roles: AppRole[]): Promise<Profile> {
  const profile = await requireUser();
  if (!roles.includes(profile.role)) {
    redirect("/");
  }
  return profile;
}

export async function listProfiles(): Promise<Profile[]> {
  if (!isSupabaseConfigured) {
    return [
      {
        id: "demo",
        full_name: "Demo User",
        role: "ceo",
        disabled: false,
        email: "demo@local",
      },
    ];
  }
  const supabase = await getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, disabled, created_at")
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return (data as Profile[]).map((p) => ({
    ...p,
    role: (p.role as AppRole) || "staff",
    disabled: Boolean(p.disabled),
  }));
}

export async function updateProfileRole(
  userId: string,
  role: AppRole
): Promise<void> {
  const actor = await requireRole(["ceo", "admin"]);
  const profiles = await listProfiles();
  const target = profiles.find((p) => p.id === userId);
  if (!target) throw new Error("User not found");
  if (!canAssignRole(actor.role, role, target.role)) {
    throw new Error("You are not allowed to set that role");
  }

  const supabase = await getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);
  if (error) throw new Error(error.message);
}

/** Soft-disable or re-enable a login. CEO only. Uses service role. */
export async function setProfileDisabled(
  userId: string,
  disabled: boolean
): Promise<void> {
  const actor = await requireRole(["ceo"]);
  if (actor.id === userId) {
    throw new Error("You cannot disable your own account");
  }

  const profiles = await listProfiles();
  const target = profiles.find((p) => p.id === userId);
  if (!target) throw new Error("User not found");

  if (disabled && target.role === "ceo") {
    const otherActiveCeos = profiles.filter(
      (p) => p.role === "ceo" && !p.disabled && p.id !== userId
    );
    if (otherActiveCeos.length === 0) {
      throw new Error("Cannot disable the last active CEO");
    }
  }

  const { getAdminSupabase } = await import("./supabase/admin");
  const admin = getAdminSupabase();
  if (!admin) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Add it in Vercel (and .env.local), then redeploy."
    );
  }

  const { error } = await admin
    .from("profiles")
    .update({ disabled })
    .eq("id", userId);
  if (error) throw new Error(error.message);

  // Block / unblock at Auth level so existing sessions cannot refresh
  const { error: banError } = await admin.auth.admin.updateUserById(userId, {
    ban_duration: disabled ? "876000h" : "none",
  });
  if (banError) {
    throw new Error(
      `Account marked ${disabled ? "disabled" : "enabled"}, but Auth ban failed: ${banError.message}`
    );
  }
}
