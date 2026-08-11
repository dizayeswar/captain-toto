import { getSupabase } from "./supabase";
import type {
  SupplierInvoice,
  SupplierInvoiceInput,
  SupplierInvoiceLine,
} from "./types";

// Re-export supplier directory CRUD from the shared suppliers module.
export {
  getSuppliers,
  getSupplier,
  getSupplierOptions,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "./suppliers";

const INV_TABLE = "supplier_invoices";
const LINES_TABLE = "supplier_invoice_lines";

function summarizeLines(lines: SupplierInvoiceLine[]) {
  const amount = lines.reduce((s, l) => s + (Number(l.amount) || 0), 0);
  const types = [...new Set(lines.map((l) => l.service_type).filter(Boolean))];
  const refs = lines.map((l) => l.booking_ref).filter(Boolean);
  return {
    amount,
    service_type: types.length === 0 ? "Other" : types.length === 1 ? types[0] : "Mixed",
    booking_ref: refs[0] ?? "",
  };
}

export function buildSupplierInvoice(
  input: SupplierInvoiceInput,
  invoiceId: string,
  id: string
): SupplierInvoice {
  const lines = (input.lines ?? []).map((l) => ({
    ...l,
    amount: Number(l.amount) || 0,
    description: l.description ?? "",
    booking_ref: l.booking_ref ?? "",
    notes: l.notes ?? "",
    service_type: l.service_type || "Other",
  }));
  const summary = summarizeLines(lines);
  const paid = Number(input.paid_usd) || 0;
  const refund = Number(input.refund_usd) || 0;
  const netPaid = paid - refund;
  return {
    id,
    invoice_id: invoiceId,
    invoice_date: input.invoice_date,
    due_date: input.due_date || null,
    supplier: input.supplier,
    supplier_invoice_no: input.supplier_invoice_no,
    booking_ref: summary.booking_ref,
    service_type: summary.service_type,
    currency: input.currency || "USD",
    invoice_amount: summary.amount,
    invoice_usd: summary.amount,
    paid_usd: paid,
    refund_usd: refund,
    net_paid_usd: netPaid,
    outstanding_usd: summary.amount - netPaid,
    invoice_status: input.invoice_status,
    payment_status: input.payment_status,
    notes: input.notes,
    lines,
  };
}

function nextInvCode(count: number) {
  return `SINV-${String(count + 1).padStart(4, "0")}`;
}

const demoInvoices: SupplierInvoice[] = [
  buildSupplierInvoice(
    {
      invoice_date: "2026-07-14",
      due_date: "",
      supplier: "Morocco Travel",
      supplier_invoice_no: "",
      currency: "USD",
      paid_usd: 9308,
      refund_usd: 0,
      invoice_status: "Open",
      payment_status: "Settled",
      notes: "",
      lines: [
        {
          service_type: "Hotel",
          booking_ref: "CTH-0002",
          description: "Hotel accommodation — BLUE MARINE HOTEL",
          amount: 9308,
          notes: "",
        },
      ],
    },
    "SINV-0001",
    "demo-sinv-1"
  ),
];

async function fetchLines(
  supabase: NonNullable<ReturnType<typeof getSupabase>>,
  invoiceId: string
): Promise<SupplierInvoiceLine[]> {
  const { data, error } = await supabase
    .from(LINES_TABLE)
    .select("*")
    .eq("invoice_id", invoiceId)
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data.map((r) => ({
    id: r.id,
    service_type: r.service_type ?? "Other",
    booking_ref: r.booking_ref ?? "",
    description: r.description ?? "",
    amount: Number(r.amount) || 0,
    notes: r.notes ?? "",
  }));
}

async function replaceLines(
  supabase: NonNullable<ReturnType<typeof getSupabase>>,
  invoiceId: string,
  lines: SupplierInvoiceLine[]
): Promise<void> {
  await supabase.from(LINES_TABLE).delete().eq("invoice_id", invoiceId);
  if (lines.length === 0) return;
  const rows = lines.map((l, i) => ({
    invoice_id: invoiceId,
    service_type: l.service_type,
    booking_ref: l.booking_ref,
    description: l.description,
    amount: l.amount,
    notes: l.notes,
    sort_order: i,
  }));
  const { error } = await supabase.from(LINES_TABLE).insert(rows);
  if (error) throw new Error(error.message);
}

export async function getSupplierInvoices(): Promise<SupplierInvoice[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return [...demoInvoices].sort((a, b) =>
      b.invoice_date.localeCompare(a.invoice_date)
    );
  }
  const { data, error } = await supabase
    .from(INV_TABLE)
    .select("*")
    .order("invoice_date", { ascending: false });
  if (error || !data) return [];
  // List view does not need line details.
  return data.map((r) => ({ ...(r as SupplierInvoice), lines: [] }));
}

export async function getSupplierInvoice(
  id: string
): Promise<SupplierInvoice | null> {
  const supabase = getSupabase();
  if (!supabase) {
    return demoInvoices.find((i) => i.id === id) ?? null;
  }
  const { data, error } = await supabase
    .from(INV_TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  const lines = await fetchLines(supabase, id);
  return { ...(data as SupplierInvoice), lines };
}

export async function createSupplierInvoice(
  input: SupplierInvoiceInput
): Promise<SupplierInvoice> {
  const all = await getSupplierInvoices();
  const code = nextInvCode(all.length);
  const supabase = getSupabase();
  if (!supabase) {
    const row = buildSupplierInvoice(input, code, `demo-sinv-${Date.now()}`);
    demoInvoices.push(row);
    return row;
  }
  const row = buildSupplierInvoice(input, code, "");
  const { id: _id, created_at: _c, lines, ...payload } = row;
  const { data, error } = await supabase
    .from(INV_TABLE)
    .insert(payload)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  await replaceLines(supabase, data.id, lines);
  return { ...(data as SupplierInvoice), lines };
}

export async function updateSupplierInvoice(
  id: string,
  input: SupplierInvoiceInput
): Promise<SupplierInvoice> {
  const supabase = getSupabase();
  if (!supabase) {
    const idx = demoInvoices.findIndex((i) => i.id === id);
    if (idx < 0) throw new Error("Invoice not found");
    demoInvoices[idx] = buildSupplierInvoice(
      input,
      demoInvoices[idx].invoice_id,
      id
    );
    return demoInvoices[idx];
  }
  const existing = await getSupplierInvoice(id);
  if (!existing) throw new Error("Invoice not found");
  const row = buildSupplierInvoice(input, existing.invoice_id, id);
  const { id: _id, created_at: _c, invoice_id: _i, lines, ...payload } = row;
  const { data, error } = await supabase
    .from(INV_TABLE)
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  await replaceLines(supabase, id, lines);
  return { ...(data as SupplierInvoice), lines };
}

export async function deleteSupplierInvoice(id: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    const idx = demoInvoices.findIndex((i) => i.id === id);
    if (idx >= 0) demoInvoices.splice(idx, 1);
    return;
  }
  // Lines cascade if FK is set; delete explicitly for safety.
  await supabase.from(LINES_TABLE).delete().eq("invoice_id", id);
  const { error } = await supabase.from(INV_TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export type SupplierFinanceSummary = {
  openInvoices: number;
  outstanding: number;
  paidToSuppliers: number;
  refunded: number;
};

export function summarizeSupplierFinance(
  rows: SupplierInvoice[]
): SupplierFinanceSummary {
  return {
    openInvoices: rows.filter((r) => r.invoice_status === "Open").length,
    outstanding: rows.reduce((s, r) => s + (r.outstanding_usd || 0), 0),
    paidToSuppliers: rows.reduce((s, r) => s + (r.paid_usd || 0), 0),
    refunded: rows.reduce((s, r) => s + (r.refund_usd || 0), 0),
  };
}
