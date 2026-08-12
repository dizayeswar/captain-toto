export type AppRole = "ceo" | "admin" | "staff";

export type Profile = {
  id: string;
  full_name: string;
  role: AppRole;
  email?: string;
  created_at?: string;
};

export const ROLE_LABELS: Record<AppRole, string> = {
  ceo: "CEO",
  admin: "Admin",
  staff: "Staff",
};

export function canAccessFinance(role: AppRole): boolean {
  return role === "ceo" || role === "admin";
}

export function canManageUsers(role: AppRole): boolean {
  return role === "ceo" || role === "admin";
}

export function canPurgeRecycleBin(role: AppRole): boolean {
  return role === "ceo" || role === "admin";
}

export function canAssignRole(
  actor: AppRole,
  targetRole: AppRole,
  previousRole: AppRole
): boolean {
  if (actor === "ceo") return true;
  if (actor === "admin") {
    if (targetRole === "ceo" || previousRole === "ceo") return false;
    return targetRole === "admin" || targetRole === "staff";
  }
  return false;
}
