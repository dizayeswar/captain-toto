import { getSupabase } from "./supabase";
import { addToRecycleBin } from "./recycleBin";
import type { VisaCase, VisaCaseInput } from "./types";

const TABLE = "visa_cases";

export function buildVisaCase(
  input: VisaCaseInput,
  visaId: string,
  id: string
): VisaCase {
  const appointment = Number(input.appointment_fee) || 0;
  const document = Number(input.document_fee) || 0;
  const extra = Number(input.extra_charges) || 0;
  const total = appointment + document + extra;
  const paid = Number(input.amount_paid_usd) || 0;

  return {
    id,
    visa_id: visaId,
    created_date: input.created_date,
    client_name: input.client_name.trim(),
    phone: input.phone,
    email: input.email,
    passport_no: input.passport_no,
    nationality: input.nationality,
    destination_country: input.destination_country,
    visa_type: input.visa_type,
    entry_type: input.entry_type,
    travel_date: input.travel_date || null,
    application_date: input.application_date || null,
    appointment_date: input.appointment_date || null,
    decision_date: input.decision_date || null,
    case_status: input.case_status,
    priority: input.priority,
    staff: input.staff,
    currency: input.currency || "USD",
    appointment_fee: appointment,
    document_fee: document,
    extra_charges: extra,
    total_sale_usd: total,
    amount_paid_usd: paid,
    balance_usd: total - paid,
    payment_status: input.payment_status,
    documents_result: input.documents_result,
    passport_received: input.passport_received,
    passport_returned: input.passport_returned,
    provider: input.provider,
    provider_reference: input.provider_reference,
    supplier_name: input.supplier_name,
    supplier_code: input.supplier_code,
    notes: input.notes,
  };
}

function nextCode(count: number) {
  return `CTV-${String(count + 1).padStart(4, "0")}`;
}

const demoStore: VisaCase[] = [
  buildVisaCase(
    {
      created_date: "2026-07-02",
      client_name: "Mohammed Maghdid Mohammed",
      phone: "7504526258",
      email: "cinesherwani@gmail.com",
      passport_no: "A18099330",
      nationality: "IRAQ",
      destination_country: "UNITED KINGDOM",
      visa_type: "Tourist",
      entry_type: "Multiple Entry",
      travel_date: "2026-07-02",
      application_date: "",
      appointment_date: "2026-07-03",
      decision_date: "",
      case_status: "Appointment Booked",
      priority: "VIP",
      staff: "Admin",
      currency: "USD",
      appointment_fee: 189,
      document_fee: 175,
      extra_charges: 36,
      amount_paid_usd: 0,
      payment_status: "Unpaid",
      documents_result: "Documents Ready",
      passport_received: "Yes",
      passport_returned: "Yes",
      provider: "VFS GLOBAL",
      provider_reference: "GWF088684376",
      supplier_name: "Captain ToTo",
      supplier_code: "SUP-0001",
      notes: "",
    },
    "CTV-0001",
    "demo-visa-1"
  ),
];

export async function getVisaCases(): Promise<VisaCase[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return [...demoStore].sort((a, b) =>
      b.created_date.localeCompare(a.created_date)
    );
  }
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_date", { ascending: false });
  if (error || !data) return [];
  return data as VisaCase[];
}

export async function getVisaCase(id: string): Promise<VisaCase | null> {
  const supabase = getSupabase();
  if (!supabase) return demoStore.find((v) => v.id === id) ?? null;
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as VisaCase;
}

export async function createVisaCase(input: VisaCaseInput): Promise<VisaCase> {
  const all = await getVisaCases();
  const code = nextCode(all.length);
  const supabase = getSupabase();
  if (!supabase) {
    const row = buildVisaCase(input, code, `demo-visa-${Date.now()}`);
    demoStore.push(row);
    return row;
  }
  const row = buildVisaCase(input, code, "");
  const { id: _id, created_at: _c, ...payload } = row;
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as VisaCase;
}

export async function updateVisaCase(
  id: string,
  input: VisaCaseInput
): Promise<VisaCase> {
  const supabase = getSupabase();
  if (!supabase) {
    const idx = demoStore.findIndex((v) => v.id === id);
    if (idx < 0) throw new Error("Visa case not found");
    demoStore[idx] = buildVisaCase(input, demoStore[idx].visa_id, id);
    return demoStore[idx];
  }
  const existing = await getVisaCase(id);
  if (!existing) throw new Error("Visa case not found");
  const row = buildVisaCase(input, existing.visa_id, id);
  const { id: _id, created_at: _c, visa_id: _v, ...payload } = row;
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as VisaCase;
}

export async function deleteVisaCase(id: string): Promise<void> {
  const row = await getVisaCase(id);
  if (!row) return;
  await addToRecycleBin({
    entity_type: "visa_case",
    entity_id: id,
    label: `${row.visa_id} · ${row.client_name || "—"} · ${row.destination_country || "—"}`,
    payload: row,
  });

  const supabase = getSupabase();
  if (!supabase) {
    const idx = demoStore.findIndex((v) => v.id === id);
    if (idx >= 0) demoStore.splice(idx, 1);
    return;
  }
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function restoreVisaCase(row: VisaCase): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    if (!demoStore.some((v) => v.id === row.id)) demoStore.push(row);
    return;
  }
  const { error } = await supabase.from(TABLE).insert(row);
  if (error) throw new Error(error.message);
}

export type VisaSummary = {
  total: number;
  approved: number;
  appointments: number;
  outstanding: number;
  totalSales: number;
};

export function summarizeVisas(rows: VisaCase[]): VisaSummary {
  const now = Date.now();
  const in30 = now + 30 * 86400000;
  return {
    total: rows.length,
    approved: rows.filter((r) => r.case_status === "Approved").length,
    appointments: rows.filter((r) => {
      if (!r.appointment_date) return false;
      const t = new Date(r.appointment_date).getTime();
      return t >= now && t <= in30;
    }).length,
    outstanding: rows.reduce((s, r) => s + (r.balance_usd || 0), 0),
    totalSales: rows.reduce((s, r) => s + (r.total_sale_usd || 0), 0),
  };
}
