export type AppRole = "ceo" | "admin" | "staff";

export type Profile = {
  id: string;
  full_name: string;
  role: AppRole;
  /** When true, login is blocked until CEO re-enables. */
  disabled?: boolean;
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

/** Full system data wipe — CEO only. */
export function canResetData(role: AppRole): boolean {
  return role === "ceo";
}

/** Create login accounts from the app — CEO only. */
export function canCreateUsers(role: AppRole): boolean {
  return role === "ceo";
}

/** Disable / re-enable login accounts — CEO only. */
export function canDisableUsers(role: AppRole): boolean {
  return role === "ceo";
}

/** View Settings → Audit log — CEO / Admin. */
export function canViewAuditLog(role: AppRole): boolean {
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
