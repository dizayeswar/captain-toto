import { getSupabase } from "./supabase";
import { addToRecycleBin } from "./recycleBin";
import { nextSequentialCode, sortByCodeDesc } from "./sequentialCode";
import type {
  SupplierInvoice,
  SupplierPaymentReceipt,
  SupplierPaymentReceiptInput,
} from "./types";

const TABLE = "supplier_payment_receipts";

const demoStore: SupplierPaymentReceipt[] = [];

function nextCode(existing: string[]) {
  return nextSequentialCode(existing, "SPR-");
}

function buildReceipt(
  input: SupplierPaymentReceiptInput,
  receiptNo: string,
  id: string
): SupplierPaymentReceipt {
  return {
    id,
    receipt_no: receiptNo,
    receipt_date: input.receipt_date,
    supplier: input.supplier.trim(),
    amount: Number(input.amount) || 0,
    signature: input.signature.trim(),
    notes: input.notes.trim(),
    source_invoice_id: input.source_invoice_id?.trim() || "",
    source_invoice_no: input.source_invoice_no?.trim() || "",
  };
}

export async function getSupplierPaymentReceipts(): Promise<
  SupplierPaymentReceipt[]
> {
  const supabase = await getSupabase();
  if (!supabase) {
    return sortByCodeDesc(demoStore, (r) => r.receipt_no);
  }
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("receipt_no", { ascending: false });
  if (error || !data) return [];
  return sortByCodeDesc(
    (data as SupplierPaymentReceipt[]).map((r) => ({
      ...r,
      source_invoice_id: r.source_invoice_id ?? "",
      source_invoice_no: r.source_invoice_no ?? "",
    })),
    (r) => r.receipt_no
  );
}

export async function getSupplierPaymentReceipt(
  id: string
): Promise<SupplierPaymentReceipt | null> {
  const supabase = await getSupabase();
  if (!supabase) return demoStore.find((r) => r.id === id) ?? null;
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  const r = data as SupplierPaymentReceipt;
  return {
    ...r,
    source_invoice_id: r.source_invoice_id ?? "",
    source_invoice_no: r.source_invoice_no ?? "",
  };
}

export async function findReceiptBySourceInvoice(
  invoiceId: string
): Promise<SupplierPaymentReceipt | null> {
  if (!invoiceId) return null;
  const supabase = await getSupabase();
  if (!supabase) {
    return demoStore.find((r) => r.source_invoice_id === invoiceId) ?? null;
  }
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("source_invoice_id", invoiceId)
    .maybeSingle();
  if (error || !data) return null;
  const r = data as SupplierPaymentReceipt;
  return {
    ...r,
    source_invoice_id: r.source_invoice_id ?? "",
    source_invoice_no: r.source_invoice_no ?? "",
  };
}

export async function createSupplierPaymentReceipt(
  input: SupplierPaymentReceiptInput
): Promise<SupplierPaymentReceipt> {
  const all = await getSupplierPaymentReceipts();
  const code = nextCode(all.map((r) => r.receipt_no));
  const supabase = await getSupabase();
  if (!supabase) {
    const row = buildReceipt(input, code, `demo-spr-${Date.now()}`);
    demoStore.push(row);
    return row;
  }
  const row = buildReceipt(input, code, "");
  const { id: _id, created_at: _c, ...payload } = row;
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as SupplierPaymentReceipt;
}

export async function updateSupplierPaymentReceipt(
  id: string,
  input: SupplierPaymentReceiptInput
): Promise<SupplierPaymentReceipt> {
  const supabase = await getSupabase();
  if (!supabase) {
    const idx = demoStore.findIndex((r) => r.id === id);
    if (idx < 0) throw new Error("Receipt not found");
    const code = demoStore[idx].receipt_no;
    demoStore[idx] = buildReceipt(input, code, id);
    return demoStore[idx];
  }
  const existing = await getSupplierPaymentReceipt(id);
  if (!existing) throw new Error("Receipt not found");
  const row = buildReceipt(input, existing.receipt_no, id);
  const { id: _id, created_at: _c, receipt_no: _n, ...payload } = row;
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as SupplierPaymentReceipt;
}

export async function deleteSupplierPaymentReceipt(id: string): Promise<void> {
  const row = await getSupplierPaymentReceipt(id);
  if (!row) return;
  await addToRecycleBin({
    entity_type: "supplier_receipt",
    entity_id: id,
    label: `${row.receipt_no} · ${row.supplier || "—"} · ${row.amount}`,
    payload: row,
  });

  const supabase = await getSupabase();
  if (!supabase) {
    const idx = demoStore.findIndex((r) => r.id === id);
    if (idx >= 0) demoStore.splice(idx, 1);
    return;
  }
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function restoreSupplierPaymentReceipt(
  row: SupplierPaymentReceipt
): Promise<void> {
  const supabase = await getSupabase();
  if (!supabase) {
    if (!demoStore.some((r) => r.id === row.id)) demoStore.push(row);
    return;
  }
  const { error } = await supabase.from(TABLE).insert(row);
  if (error) throw new Error(error.message);
}

/**
 * When a supplier invoice is Settled, create (or refresh) a printable payment receipt.
 * Amount uses net paid to the supplier. Returns the receipt, or null if not settled.
 */
export async function ensureReceiptForSettledInvoice(
  invoice: SupplierInvoice
): Promise<SupplierPaymentReceipt | null> {
  if (invoice.payment_status !== "Settled") return null;

  const amount =
    Number(invoice.net_paid_usd) ||
    Number(invoice.paid_usd) ||
    Number(invoice.invoice_usd) ||
    0;
  const today = new Date().toISOString().slice(0, 10);
  const payload: SupplierPaymentReceiptInput = {
    receipt_date: invoice.invoice_date || today,
    supplier: invoice.supplier,
    amount,
    signature: "",
    notes: `Auto from ${invoice.invoice_id}`,
    source_invoice_id: invoice.id,
    source_invoice_no: invoice.invoice_id,
  };

  const existing = await findReceiptBySourceInvoice(invoice.id);
  if (existing) {
    // Keep any signature the user already wrote; refresh amount/supplier/date.
    return updateSupplierPaymentReceipt(existing.id, {
      ...payload,
      signature: existing.signature || payload.signature,
      notes: existing.notes || payload.notes,
    });
  }

  return createSupplierPaymentReceipt(payload);
}
