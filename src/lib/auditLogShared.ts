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
