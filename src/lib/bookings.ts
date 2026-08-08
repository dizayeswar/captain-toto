import { getSupabase, isSupabaseConfigured } from "./supabase";
import { MONTH_NAMES } from "./lists";
import type { Booking, BookingInput } from "./types";

const TABLE = "bookings";

// ---------------------------------------------------------------------------
// Demo fallback store
// ---------------------------------------------------------------------------
// When Supabase isn't configured yet, we keep bookings in memory so the app is
// fully usable for a demo. Data lives for the life of the dev server process
// and resets on restart. Connect Supabase (see .env.example) to persist.

const demoStore: Booking[] = [
  buildBooking(
    {
      booking_date: "2026-05-15",
      client_name: "Cicih Kasto",
      client_type: "Individual",
      route: "EBL - CGK",
      airline: "Emirates",
      ticket_cost: 850,
      service_fee: 15,
      payment_status: "Paid",
      issued: true,
      handled_by: "Osman",
      payment_method: "Cash",
      debt: 0,
      supplier_name: "Captain ToTo",
      supplier_code: "SUP-0001",
    },
    "CT-0001",
    "demo-1"
  ),
];

// ---------------------------------------------------------------------------
// Derived-field helpers
// ---------------------------------------------------------------------------

/** Fill in computed fields (totals, profit, month/year) from raw input. */
export function buildBooking(
  input: BookingInput,
  bookingId: string,
  id: string
): Booking {
  const ticket = Number(input.ticket_cost) || 0;
  const fee = Number(input.service_fee) || 0;
  const total = ticket + fee;
  const date = new Date(input.booking_date);
  const valid = !Number.isNaN(date.getTime());

  return {
    id,
    booking_id: bookingId,
    booking_date: input.booking_date,
    client_name: input.client_name.trim(),
    client_type: input.client_type,
    route: input.route,
    airline: input.airline,
    ticket_cost: ticket,
    service_fee: fee,
    total_paid: total,
    payment_status: input.payment_status,
    issued: Boolean(input.issued),
    handled_by: input.handled_by,
    payment_method: input.payment_method,
    profit: total - ticket,
    debt: Number(input.debt) || 0,
    supplier_name: input.supplier_name,
    supplier_code: input.supplier_code,
    month: valid ? date.getUTCMonth() + 1 : 0,
    year: valid ? date.getUTCFullYear() : 0,
  };
}

function nextBookingCode(count: number): string {
  return `CT-${String(count + 1).padStart(4, "0")}`;
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function getBookings(): Promise<Booking[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return [...demoStore].sort((a, b) =>
      b.booking_date.localeCompare(a.booking_date)
    );
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("booking_date", { ascending: false });

  if (error || !data) return [];
  return data as Booking[];
}

export async function getBooking(id: string): Promise<Booking | null> {
  const supabase = getSupabase();
  if (!supabase) {
    return demoStore.find((b) => b.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as Booking;
}

export async function createBooking(input: BookingInput): Promise<Booking> {
  const all = await getBookings();
  const code = nextBookingCode(all.length);

  const supabase = getSupabase();
  if (!supabase) {
    const booking = buildBooking(input, code, `demo-${Date.now()}`);
    demoStore.push(booking);
    return booking;
  }

  const draft = buildBooking(input, code, "");
  // Let the database generate the id.
  const { id: _omit, ...row } = draft;
  void _omit;
  const { data, error } = await supabase
    .from(TABLE)
    .insert(row)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Booking;
}

export async function updateBooking(
  id: string,
  input: BookingInput
): Promise<Booking> {
  const existing = await getBooking(id);
  const code = existing?.booking_id ?? "CT-0000";

  const supabase = getSupabase();
  if (!supabase) {
    const idx = demoStore.findIndex((b) => b.id === id);
    const updated = buildBooking(input, code, id);
    if (idx >= 0) demoStore[idx] = updated;
    return updated;
  }

  const draft = buildBooking(input, code, id);
  const { id: _omit, created_at: _c, ...row } = draft;
  void _omit;
  void _c;
  const { data, error } = await supabase
    .from(TABLE)
    .update(row)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Booking;
}

export async function deleteBooking(id: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    const idx = demoStore.findIndex((b) => b.id === id);
    if (idx >= 0) demoStore.splice(idx, 1);
    return;
  }

  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export { isSupabaseConfigured };

// ---------------------------------------------------------------------------
// Aggregations (power the report pages)
// ---------------------------------------------------------------------------

export type Totals = {
  bookings: number;
  revenue: number;
  profit: number;
  issued: number;
  pending: number;
  debt: number;
};

export function computeTotals(bookings: Booking[]): Totals {
  return bookings.reduce<Totals>(
    (acc, b) => {
      acc.bookings += 1;
      acc.revenue += b.total_paid;
      acc.profit += b.profit;
      acc.issued += b.issued ? 1 : 0;
      acc.pending += b.payment_status === "Pending" ? 1 : 0;
      acc.debt += b.debt;
      return acc;
    },
    { bookings: 0, revenue: 0, profit: 0, issued: 0, pending: 0, debt: 0 }
  );
}

export type GroupRow = {
  key: string;
  bookings: number;
  revenue: number;
  profit: number;
  pending: number;
  issued: number;
};

function emptyRow(key: string): GroupRow {
  return { key, bookings: 0, revenue: 0, profit: 0, pending: 0, issued: 0 };
}

function addToRow(row: GroupRow, b: Booking): void {
  row.bookings += 1;
  row.revenue += b.total_paid;
  row.profit += b.profit;
  row.pending += b.payment_status === "Pending" ? 1 : 0;
  row.issued += b.issued ? 1 : 0;
}

/** Group bookings by an arbitrary key selector. */
export function groupBy(
  bookings: Booking[],
  selector: (b: Booking) => string
): GroupRow[] {
  const map = new Map<string, GroupRow>();
  for (const b of bookings) {
    const key = selector(b) || "—";
    const row = map.get(key) ?? emptyRow(key);
    addToRow(row, b);
    map.set(key, row);
  }
  return [...map.values()].sort((a, b) => b.revenue - a.revenue);
}

/**
 * Group by a key, but guarantee a row for every key in `keys` (even with zero
 * activity) so reports mirror the fixed lists in the Excel workbook.
 * Sorted alphabetically for stable ordering.
 */
export function groupByKeys(
  bookings: Booking[],
  selector: (b: Booking) => string,
  keys: readonly string[]
): GroupRow[] {
  const map = new Map<string, GroupRow>();
  for (const k of keys) map.set(k, emptyRow(k));
  for (const b of bookings) {
    const key = selector(b) || "—";
    const row = map.get(key) ?? emptyRow(key);
    addToRow(row, b);
    map.set(key, row);
  }
  return [...map.values()].sort((a, b) => a.key.localeCompare(b.key));
}

/** One row per calendar month (Jan–Dec), including empty months. */
export function monthlySummary(bookings: Booking[]): GroupRow[] {
  const rows = MONTH_NAMES.map((name) => emptyRow(name));
  for (const b of bookings) {
    if (b.month >= 1 && b.month <= 12) addToRow(rows[b.month - 1], b);
  }
  return rows;
}
