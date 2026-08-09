import { getSupabase } from "./supabase";
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
  const supabase = getSupabase();
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
  const supabase = getSupabase();
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

  const supabase = getSupabase();
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
  const supabase = getSupabase();
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

export async function deletePaymentInvoice(id: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    const idx = demoStore.findIndex((p) => p.id === id);
    if (idx >= 0) demoStore.splice(idx, 1);
    return;
  }
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}
