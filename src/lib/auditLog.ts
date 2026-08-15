import { getSupabase, isSupabaseConfigured } from "./supabase";
import { getCurrentProfile } from "./auth";

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "restore"
  | "purge"
  | "disable"
  | "enable"
  | "role_change"
  | "other";

export type AuditLog = {
  id: string;
  created_at: string;
  actor_id: string | null;
  actor_name: string;
  action: AuditAction;
  entity_type: string;
  entity_id: string;
  summary: string;
};

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  create: "Created",
  update: "Updated",
  delete: "Deleted",
  restore: "Restored",
  purge: "Purged",
  disable: "Disabled",
  enable: "Enabled",
  role_change: "Role change",
  other: "Other",
};

export const AUDIT_ENTITY_LABELS: Record<string, string> = {
  booking: "Ticket booking",
  invoice: "Ticket invoice",
  payment_invoice: "Payment invoice",
  hotel_booking: "Hotel booking",
  visa_case: "Visa case",
  supplier: "Supplier",
  supplier_invoice: "Supplier invoice",
  supplier_receipt: "Supplier receipt",
  expense: "Expense",
  finance_deposit: "Cash deposit",
  user: "User",
  airline_policy: "Airline policy",
  recycle_bin: "Recycle bin",
};

type WriteInput = {
  action: AuditAction;
  entity_type: string;
  entity_id?: string;
  summary: string;
};

const demoStore: AuditLog[] = [];

/** Fire-and-forget style write; never throws into the caller’s main flow. */
export async function writeAuditLog(input: WriteInput): Promise<void> {
  try {
    let actorId: string | null = null;
    let actorName = "System";

    if (isSupabaseConfigured) {
      const profile = await getCurrentProfile();
      if (profile) {
        actorId = profile.id === "demo" ? null : profile.id;
        actorName =
          profile.full_name?.trim() ||
          profile.email?.split("@")[0] ||
          "User";
      }
    }

    const row = {
      actor_id: actorId,
      actor_name: actorName,
      action: input.action,
      entity_type: input.entity_type,
      entity_id: input.entity_id ?? "",
      summary: input.summary.slice(0, 500),
    };

    const supabase = await getSupabase();
    if (!supabase) {
      demoStore.unshift({
        id: `demo-audit-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...row,
      });
      return;
    }

    const { error } = await supabase.from("audit_logs").insert(row);
    if (error) {
      console.error("[audit]", error.message);
    }
  } catch (err) {
    console.error("[audit]", err);
  }
}

export async function listAuditLogs(limit = 500): Promise<AuditLog[]> {
  const supabase = await getSupabase();
  if (!supabase) {
    return demoStore.slice(0, limit);
  }

  const { data, error } = await supabase
    .from("audit_logs")
    .select("id, created_at, actor_id, actor_name, action, entity_type, entity_id, summary")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error("[audit list]", error?.message);
    return [];
  }

  return data as AuditLog[];
}
