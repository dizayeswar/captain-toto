/** Client-safe supplier link helpers (no Supabase imports). */

export type SupplierLinkOption = {
  ref: string;
  service_type: string;
  /** Supplier name used for auto-fill filtering */
  supplier: string;
  label: string;
  amount: number;
  description: string;
  client_name: string;
  pnr: string;
  route: string;
  issue_date: string;
};

function norm(s: string) {
  return s.trim().toLowerCase();
}

/** Filter link options by supplier name and inclusive date range (YYYY-MM-DD). */
export function filterSupplierLinkOptions(
  options: SupplierLinkOption[],
  supplier: string,
  dateFrom: string,
  dateTo: string
): SupplierLinkOption[] {
  const s = norm(supplier);
  if (!s) return [];

  return options.filter((o) => {
    if (norm(o.supplier) !== s) return false;
    const d = (o.issue_date || "").slice(0, 10);
    if (!d) return false;
    if (dateFrom && d < dateFrom) return false;
    if (dateTo && d > dateTo) return false;
    return true;
  });
}
