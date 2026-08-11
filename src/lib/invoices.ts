import { getSupabase } from "./supabase";
import { INVOICE_AIRLINES } from "./lists";
import { addToRecycleBin } from "./recycleBin";
import type {
  Invoice,
  InvoiceInput,
  InvoicePassenger,
  InvoiceSegment,
  AirlinePolicy,
} from "./types";

const STANDARD_POLICY =
  "Ticket changes, cancellations, refunds, baggage, name correction and no-show rules depend on the airline fare conditions. Any change may require airline penalties, fare difference, tax difference and agency service charges. Refunds are subject to airline approval and ticket fare rules. Passenger is responsible for checking passport validity, visa requirements and travel documents before departure. Captain Toto is not responsible for denied boarding caused by missing visa, invalid passport, incorrect passenger information or government restrictions. Passenger must check all names, routes, dates and flight details before ticket issuance.";

// ---------------------------------------------------------------------------
// Demo fallback (used only when Supabase isn't configured)
// ---------------------------------------------------------------------------

const demoInvoices: Invoice[] = [
  {
    id: "demo-inv-1",
    invoice_no: "CT-TI-0001",
    invoice_date: "2026-02-05",
    booking_id: "CT-0001",
    airline: "Emirates",
    pnr: "FFBUR6",
    reservation_status: "Issued",
    client_name: "مام سەعد ( ئیمپایەر ڤیللیج )",
    notes: "",
    passengers: [
      {
        full_name: "CICIH KASTO",
        passport_no: "E1805139",
        nationality: "INDONESIA",
        date_of_birth: "1980-08-01",
        ticket_no: "176 2209935891",
        notes: "",
      },
    ],
    segments: [
      {
        seg_no: 1,
        airline: "Emirates",
        flight_no: "EK - 2071",
        route: "EBL - DXB",
        departure: "2026-04-05T15:00",
        arrival: "2026-04-05T20:00",
        travel_class: "Economy",
        baggage: "30 KG",
        notes: "",
      },
      {
        seg_no: 2,
        airline: "Emirates",
        flight_no: "EK - 346",
        route: "DXB - KUL",
        departure: "2026-05-05T03:10",
        arrival: "2026-05-05T14:25",
        travel_class: "Economy",
        baggage: "30 KG",
        notes: "",
      },
      {
        seg_no: 3,
        airline: "Emirates",
        flight_no: "EK - 3464",
        route: "KUL - CGK",
        departure: "2026-05-05T21:55",
        arrival: "2026-05-05T23:10",
        travel_class: "Economy",
        baggage: "30 KG",
        notes: "",
      },
    ],
  },
];

const demoPolicies: AirlinePolicy[] = ["General Airline", ...INVOICE_AIRLINES].map(
  (airline) => ({ airline, policy_text: STANDARD_POLICY })
);

function nextInvoiceCode(count: number): string {
  return `CT-TI-${String(count + 1).padStart(4, "0")}`;
}

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

export async function getInvoices(): Promise<Invoice[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return [...demoInvoices].sort((a, b) =>
      b.invoice_date.localeCompare(a.invoice_date)
    );
  }

  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .order("invoice_date", { ascending: false });

  if (error || !data) return [];
  return (data as Omit<Invoice, "passengers" | "segments">[]).map((row) => ({
    ...row,
    passengers: [],
    segments: [],
  }));
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  const supabase = getSupabase();
  if (!supabase) {
    return demoInvoices.find((i) => i.id === id) ?? null;
  }

  const { data: head, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !head) return null;

  const { data: passengers } = await supabase
    .from("invoice_passengers")
    .select("*")
    .eq("invoice_id", id)
    .order("sort_order", { ascending: true });

  const { data: segments } = await supabase
    .from("invoice_segments")
    .select("*")
    .eq("invoice_id", id)
    .order("sort_order", { ascending: true });

  return {
    ...(head as Omit<Invoice, "passengers" | "segments">),
    passengers: (passengers ?? []) as InvoicePassenger[],
    segments: (segments ?? []) as InvoiceSegment[],
  };
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

export async function createInvoice(input: InvoiceInput): Promise<Invoice> {
  const all = await getInvoices();
  const code = nextInvoiceCode(all.length);

  const supabase = getSupabase();
  if (!supabase) {
    const invoice: Invoice = {
      id: `demo-inv-${Date.now()}`,
      invoice_no: code,
      invoice_date: input.invoice_date,
      booking_id: input.booking_id,
      airline: input.airline,
      pnr: input.pnr,
      reservation_status: input.reservation_status,
      client_name: input.client_name,
      notes: input.notes,
      passengers: input.passengers,
      segments: input.segments,
    };
    demoInvoices.push(invoice);
    return invoice;
  }

  const { data: head, error } = await supabase
    .from("invoices")
    .insert({
      invoice_no: code,
      invoice_date: input.invoice_date,
      booking_id: input.booking_id,
      airline: input.airline,
      pnr: input.pnr,
      reservation_status: input.reservation_status,
      client_name: input.client_name,
      notes: input.notes,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);

  const invoiceId = (head as { id: string }).id;
  await insertChildren(supabase, invoiceId, input);

  return (await getInvoice(invoiceId))!;
}

export async function updateInvoice(
  id: string,
  input: InvoiceInput
): Promise<Invoice> {
  const supabase = getSupabase();
  if (!supabase) {
    const idx = demoInvoices.findIndex((i) => i.id === id);
    if (idx >= 0) {
      demoInvoices[idx] = {
        ...demoInvoices[idx],
        ...input,
        id,
      };
      return demoInvoices[idx];
    }
    throw new Error("Invoice not found");
  }

  const { error } = await supabase
    .from("invoices")
    .update({
      invoice_date: input.invoice_date,
      booking_id: input.booking_id,
      airline: input.airline,
      pnr: input.pnr,
      reservation_status: input.reservation_status,
      client_name: input.client_name,
      notes: input.notes,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  // Replace children (simplest reliable approach).
  await supabase.from("invoice_passengers").delete().eq("invoice_id", id);
  await supabase.from("invoice_segments").delete().eq("invoice_id", id);
  await insertChildren(supabase, id, input);

  return (await getInvoice(id))!;
}

async function insertChildren(
  supabase: NonNullable<ReturnType<typeof getSupabase>>,
  invoiceId: string,
  input: InvoiceInput
): Promise<void> {
  const passengers = input.passengers
    .filter((p) => p.full_name.trim() !== "")
    .map((p, i) => ({
      invoice_id: invoiceId,
      full_name: p.full_name,
      passport_no: p.passport_no,
      nationality: p.nationality,
      date_of_birth: p.date_of_birth || null,
      ticket_no: p.ticket_no,
      notes: p.notes,
      sort_order: i,
    }));

  const segments = input.segments
    .filter((s) => s.route.trim() !== "" || s.flight_no.trim() !== "")
    .map((s, i) => ({
      invoice_id: invoiceId,
      seg_no: i + 1,
      airline: s.airline,
      flight_no: s.flight_no,
      route: s.route,
      departure: s.departure,
      arrival: s.arrival,
      travel_class: s.travel_class,
      baggage: s.baggage,
      notes: s.notes,
      sort_order: i,
    }));

  if (passengers.length > 0) {
    const { error } = await supabase
      .from("invoice_passengers")
      .insert(passengers);
    if (error) throw new Error(error.message);
  }
  if (segments.length > 0) {
    const { error } = await supabase.from("invoice_segments").insert(segments);
    if (error) throw new Error(error.message);
  }
}

export async function deleteInvoice(id: string): Promise<void> {
  const row = await getInvoice(id);
  if (!row) return;
  await addToRecycleBin({
    entity_type: "invoice",
    entity_id: id,
    label: `${row.invoice_no} · ${row.client_name || "—"} · ${row.airline || "—"}`,
    payload: row,
  });

  const supabase = getSupabase();
  if (!supabase) {
    const idx = demoInvoices.findIndex((i) => i.id === id);
    if (idx >= 0) demoInvoices.splice(idx, 1);
    return;
  }
  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function restoreInvoice(row: Invoice): Promise<void> {
  const supabase = getSupabase();
  const { passengers, segments, ...head } = row;

  if (!supabase) {
    if (!demoInvoices.some((i) => i.id === row.id)) {
      demoInvoices.push({
        ...head,
        passengers: passengers ?? [],
        segments: segments ?? [],
      });
    }
    return;
  }

  const { error } = await supabase.from("invoices").insert(head);
  if (error) throw new Error(error.message);

  const passengerRows = (passengers ?? []).map((p, i) => ({
    invoice_id: row.id,
    full_name: p.full_name,
    passport_no: p.passport_no,
    nationality: p.nationality,
    date_of_birth: p.date_of_birth || null,
    ticket_no: p.ticket_no,
    notes: p.notes,
    sort_order: i,
  }));
  const segmentRows = (segments ?? []).map((s, i) => ({
    invoice_id: row.id,
    seg_no: s.seg_no || i + 1,
    airline: s.airline,
    flight_no: s.flight_no,
    route: s.route,
    departure: s.departure,
    arrival: s.arrival,
    travel_class: s.travel_class,
    baggage: s.baggage,
    notes: s.notes,
    sort_order: i,
  }));

  if (passengerRows.length > 0) {
    const { error: pErr } = await supabase
      .from("invoice_passengers")
      .insert(passengerRows);
    if (pErr) throw new Error(pErr.message);
  }
  if (segmentRows.length > 0) {
    const { error: sErr } = await supabase
      .from("invoice_segments")
      .insert(segmentRows);
    if (sErr) throw new Error(sErr.message);
  }
}

// ---------------------------------------------------------------------------
// Airline policies
// ---------------------------------------------------------------------------

export async function getAirlinePolicies(): Promise<AirlinePolicy[]> {
  const supabase = getSupabase();
  if (!supabase) return [...demoPolicies];

  const { data, error } = await supabase
    .from("airline_policies")
    .select("*")
    .order("airline", { ascending: true });
  if (error || !data) return [];
  return data as AirlinePolicy[];
}

export async function getPolicyForAirline(airline: string): Promise<string> {
  const policies = await getAirlinePolicies();
  const match = policies.find((p) => p.airline === airline);
  if (match) return match.policy_text;
  const general = policies.find((p) => p.airline === "General Airline");
  return general?.policy_text ?? STANDARD_POLICY;
}

export async function upsertPolicy(
  airline: string,
  policyText: string
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    const idx = demoPolicies.findIndex((p) => p.airline === airline);
    if (idx >= 0) demoPolicies[idx].policy_text = policyText;
    else demoPolicies.push({ airline, policy_text: policyText });
    return;
  }
  const { error } = await supabase
    .from("airline_policies")
    .upsert({ airline, policy_text: policyText }, { onConflict: "airline" });
  if (error) throw new Error(error.message);
}
