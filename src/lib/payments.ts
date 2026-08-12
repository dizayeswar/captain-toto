import { getSupabase } from "./supabase";
import { addToRecycleBin } from "./recycleBin";
import type { PaymentInvoice, PaymentInvoiceInput } from "./types";

const TABLE = "payment_invoices";

// Demo fallback (used only when Supabase isn't configured).
const demoStore: PaymentInvoice[] = [
  {
    id: "demo-pay-1",
    receipt_no: "CT-PR-0001",
    receipt_date: "2026-05-15",
    payer_type: "Individual",
    booking_id: "CT-0001",
    received_from: "Cicih Kasto",
    amount: 865,
    for_text: "Flight ticket EBL - CGK (Emirates)",
    notes: "",
    prepared_by: "Osman",
  },
];

function nextReceiptCode(count: number): string {
  return `CT-PR-${String(count + 1).padStart(4, "0")}`;
}

export async function getPaymentInvoices(): Promise<PaymentInvoice[]> {
  const supabase = await getSupabase();
  if (!supabase) {
    return [...demoStore].sort((a, b) =>
      b.receipt_date.localeCompare(a.receipt_date)
    );
  }
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("receipt_date", { ascending: false });
  if (error || !data) return [];
  return data as PaymentInvoice[];
}

export async function getPaymentInvoice(
  id: string
): Promise<PaymentInvoice | null> {
  const supabase = await getSupabase();
  if (!supabase) return demoStore.find((p) => p.id === id) ?? null;
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as PaymentInvoice;
}

export async function createPaymentInvoice(
  input: PaymentInvoiceInput
): Promise<PaymentInvoice> {
  const all = await getPaymentInvoices();
  const code = nextReceiptCode(all.length);

  const supabase = await getSupabase();
  if (!supabase) {
    const receipt: PaymentInvoice = {
      id: `demo-pay-${Date.now()}`,
      receipt_no: code,
      ...input,
    };
    demoStore.push(receipt);
    return receipt;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert({ receipt_no: code, ...input })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as PaymentInvoice;
}

export async function updatePaymentInvoice(
  id: string,
  input: PaymentInvoiceInput
): Promise<PaymentInvoice> {
  const supabase = await getSupabase();
  if (!supabase) {
    const idx = demoStore.findIndex((p) => p.id === id);
    if (idx >= 0) {
      demoStore[idx] = { ...demoStore[idx], ...input, id };
      return demoStore[idx];
    }
    throw new Error("Receipt not found");
  }
  const { data, error } = await supabase
    .from(TABLE)
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as PaymentInvoice;
}

export type PaymentGroupRow = {
  key: string;
  count: number;
  total: number;
};

export type PaymentSummary = {
  totalReceived: number;
  count: number;
  thisMonthTotal: number;
  thisMonthCount: number;
  averageReceipt: number;
  byMonth: PaymentGroupRow[];
  byStaff: PaymentGroupRow[];
  byPayerType: PaymentGroupRow[];
};

function groupSum(
  receipts: PaymentInvoice[],
  selector: (r: PaymentInvoice) => string
): PaymentGroupRow[] {
  const map = new Map<string, PaymentGroupRow>();
  for (const r of receipts) {
    const key = selector(r) || "—";
    const row = map.get(key) ?? { key, count: 0, total: 0 };
    row.count += 1;
    row.total += r.amount || 0;
    map.set(key, row);
  }
  return [...map.values()];
}

export function summarizePayments(
  receipts: PaymentInvoice[]
): PaymentSummary {
  const now = new Date();
  const curMonth = now.getMonth();
  const curYear = now.getFullYear();

  const totalReceived = receipts.reduce((s, r) => s + (r.amount || 0), 0);
  const thisMonth = receipts.filter((r) => {
    const d = new Date(r.receipt_date);
    return d.getMonth() === curMonth && d.getFullYear() === curYear;
  });
  const thisMonthTotal = thisMonth.reduce((s, r) => s + (r.amount || 0), 0);

  const byMonth = groupSum(receipts, (r) =>
    r.receipt_date ? r.receipt_date.slice(0, 7) : "—"
  ).sort((a, b) => b.key.localeCompare(a.key));

  const byStaff = groupSum(receipts, (r) => r.prepared_by).sort(
    (a, b) => b.total - a.total
  );

  const byPayerType = groupSum(receipts, (r) => r.payer_type).sort(
    (a, b) => b.total - a.total
  );

  return {
    totalReceived,
    count: receipts.length,
    thisMonthTotal,
    thisMonthCount: thisMonth.length,
    averageReceipt: receipts.length ? totalReceived / receipts.length : 0,
    byMonth,
    byStaff,
    byPayerType,
  };
}

export async function deletePaymentInvoice(id: string): Promise<void> {
  const row = await getPaymentInvoice(id);
  if (!row) return;
  await addToRecycleBin({
    entity_type: "payment_invoice",
    entity_id: id,
    label: `${row.receipt_no} · ${row.received_from || "—"} · ${row.amount}`,
    payload: row,
  });

  const supabase = await getSupabase();
  if (!supabase) {
    const idx = demoStore.findIndex((p) => p.id === id);
    if (idx >= 0) demoStore.splice(idx, 1);
    return;
  }
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function restorePaymentInvoice(row: PaymentInvoice): Promise<void> {
  const supabase = await getSupabase();
  if (!supabase) {
    if (!demoStore.some((p) => p.id === row.id)) demoStore.push(row);
    return;
  }
  const { error } = await supabase.from(TABLE).insert(row);
  if (error) throw new Error(error.message);
}
