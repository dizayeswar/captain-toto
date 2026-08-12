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

export async function getCurrentProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured) {
    return {
      id: "demo",
      full_name: "Demo User",
      role: "ceo",
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
    .select("id, full_name, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) {
    return {
      id: user.id,
      full_name: user.email?.split("@")[0] ?? "",
      role: "staff",
      email: user.email ?? "",
    };
  }

  return {
    ...(data as Omit<Profile, "email">),
    role: (data.role as AppRole) || "staff",
    email: user.email ?? "",
  };
}

export async function requireUser(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
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
        email: "demo@local",
      },
    ];
  }
  const supabase = await getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return (data as Profile[]).map((p) => ({
    ...p,
    role: (p.role as AppRole) || "staff",
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
