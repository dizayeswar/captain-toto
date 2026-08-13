import { getSupabase } from "./supabase";
import { addToRecycleBin } from "./recycleBin";
import type { HotelBooking, HotelBookingInput } from "./types";

const TABLE = "hotel_bookings";

function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0;
  const days = Math.round((b.getTime() - a.getTime()) / 86400000);
  return days > 0 ? days : 0;
}

export function buildHotelBooking(
  input: HotelBookingInput,
  bookingCode: string,
  id: string
): HotelBooking {
  const nights =
    Number(input.nights) || nightsBetween(input.check_in, input.check_out);
  const rooms = Number(input.rooms) || 1;
  const cost = Number(input.cost_per_room_night) || 0;
  const sale = Number(input.sale_per_room_night) || 0;
  const extra = Number(input.extra_cost) || 0;
  const discount = Number(input.discount) || 0;
  const totalCost = rooms * nights * cost + extra - discount;
  const totalSale = rooms * nights * sale;
  const netPaid = Number(input.net_paid_usd) || 0;
  const refunded = Number(input.refunded_usd) || 0;
  const cancelFee = Number(input.cancellation_fee_usd) || 0;
  const serviceFee = Number(input.service_fee_usd) || 0;
  const cancelled =
    input.booking_status === "Cancelled" || input.booking_status === "No Show";
  // Penalty and supplier ticket/cancel cost are the same amount (one form field).
  const cancelCost = cancelled
    ? cancelFee
    : Number(input.cancel_cost_usd) || 0;
  // Cancelled: client owes penalty + service fee (not the full stay sale).
  // Active: client owes the full sale.
  const finalCharge = cancelled ? cancelFee + serviceFee : totalSale;
  // Cancelled profit = service fee when penalty === ticket cost.
  const profitCost = cancelled ? cancelCost : totalCost;
  const netEffect = netPaid - refunded;
  // Positive = client still owes; negative = refund still due to client.
  const balance = finalCharge - netEffect;

  let paymentStatus = input.payment_status;
  if (refunded > 0 && Math.abs(balance) < 0.01) {
    paymentStatus = refunded >= netPaid ? "Refunded" : paymentStatus;
  }

  return {
    id,
    booking_code: bookingCode,
    created_date: input.created_date,
    lead_guest: input.lead_guest.trim(),
    phone: input.phone,
    email: input.email,
    nationality: input.nationality,
    destination_country: input.destination_country,
    city: input.city,
    hotel_name: input.hotel_name,
    hotel_confirmation_no: input.hotel_confirmation_no,
    check_in: input.check_in || null,
    check_out: input.check_out || null,
    nights,
    rooms,
    adults: Number(input.adults) || 0,
    children: Number(input.children) || 0,
    infants: Number(input.infants) || 0,
    room_type: input.room_type,
    meal_plan: input.meal_plan,
    supplier: input.supplier,
    currency: input.currency || "USD",
    cost_per_room_night: cost,
    sale_per_room_night: sale,
    extra_cost: extra,
    discount,
    total_cost_usd: totalCost,
    total_sale_usd: totalSale,
    profit_usd: finalCharge - profitCost,
    net_paid_usd: netPaid,
    refunded_usd: refunded,
    cancellation_fee_usd: cancelFee,
    service_fee_usd: serviceFee,
    cancel_cost_usd: cancelCost,
    final_charge_usd: finalCharge,
    balance_usd: balance,
    payment_status: paymentStatus,
    booking_status: input.booking_status,
    staff: input.staff,
    notes: input.notes,
  };
}

function nextCode(count: number) {
  return `CTH-${String(count + 1).padStart(4, "0")}`;
}

/**
 * Recompute final charge / profit / balance from source fields.
 * Keeps dashboard correct even if the row was saved before cancel-cost logic.
 */
export function refreshHotelFinancials(row: HotelBooking): HotelBooking {
  const cancelled =
    row.booking_status === "Cancelled" || row.booking_status === "No Show";
  const cancelFee = Number(row.cancellation_fee_usd) || 0;
  const serviceFee = Number(row.service_fee_usd) || 0;
  // Same as penalty when cancelled (merged UI field).
  const cancelCost = cancelled
    ? cancelFee
    : Number(row.cancel_cost_usd) || 0;
  const totalCost = Number(row.total_cost_usd) || 0;
  const totalSale = Number(row.total_sale_usd) || 0;
  const netPaid = Number(row.net_paid_usd) || 0;
  const refunded = Number(row.refunded_usd) || 0;

  const finalCharge = cancelled ? cancelFee + serviceFee : totalSale;
  const profitCost = cancelled ? cancelCost : totalCost;
  const netEffect = netPaid - refunded;

  return {
    ...row,
    service_fee_usd: serviceFee,
    cancel_cost_usd: cancelCost,
    final_charge_usd: finalCharge,
    profit_usd: finalCharge - profitCost,
    balance_usd: finalCharge - netEffect,
  };
}

function mapHotelRows(rows: HotelBooking[]): HotelBooking[] {
  return rows.map(refreshHotelFinancials);
}

const demoStore: HotelBooking[] = [
  buildHotelBooking(
    {
      created_date: "2026-07-15",
      lead_guest: "MOHAMMED MOHAMMED",
      phone: "7504526258",
      email: "cinesherwani@gmail.com",
      nationality: "IRAQ",
      destination_country: "UNITED KINGDOM",
      city: "MANCHESTER",
      hotel_name: "BRITANNIA HOTEL MANCHESTER",
      hotel_confirmation_no: "643U07JOBD",
      check_in: "2026-07-15",
      check_out: "2026-07-16",
      nights: 1,
      rooms: 1,
      adults: 1,
      children: 0,
      infants: 0,
      room_type: "Single",
      meal_plan: "Breakfast",
      supplier: "SkySinai",
      currency: "USD",
      cost_per_room_night: 70,
      sale_per_room_night: 70,
      extra_cost: 0,
      discount: 0,
      net_paid_usd: 70,
      refunded_usd: 0,
      cancellation_fee_usd: 0,
      service_fee_usd: 0,
      cancel_cost_usd: 0,
      payment_status: "Paid",
      booking_status: "Confirmed",
      staff: "Osman",
      notes: "",
    },
    "CTH-0001",
    "demo-hotel-1"
  ),
];

export async function getHotelBookings(
  columns: string = "*"
): Promise<HotelBooking[]> {
  const supabase = await getSupabase();
  if (!supabase) {
    return mapHotelRows(
      [...demoStore].sort((a, b) => b.created_date.localeCompare(a.created_date))
    );
  }
  const { data, error } = await supabase
    .from(TABLE)
    .select(columns)
    .order("created_date", { ascending: false });
  if (error || !data) return [];
  return mapHotelRows(data as unknown as HotelBooking[]);
}

/** Columns for dashboard aggregates (refreshHotelFinancials-safe). */
export const HOTEL_SUMMARY_SELECT =
  "booking_status,cancellation_fee_usd,service_fee_usd,cancel_cost_usd,total_cost_usd,total_sale_usd,net_paid_usd,refunded_usd,final_charge_usd,profit_usd,balance_usd";

/** Columns for hotel list table. */
export const HOTEL_LIST_SELECT =
  "id,booking_code,created_date,lead_guest,hotel_name,check_in,nights,payment_status,booking_status,cancellation_fee_usd,service_fee_usd,cancel_cost_usd,total_cost_usd,total_sale_usd,net_paid_usd,refunded_usd,final_charge_usd,profit_usd,balance_usd";

export async function getHotelBooking(id: string): Promise<HotelBooking | null> {
  const supabase = await getSupabase();
  if (!supabase) {
    const row = demoStore.find((b) => b.id === id) ?? null;
    return row ? refreshHotelFinancials(row) : null;
  }
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return refreshHotelFinancials(data as HotelBooking);
}

export async function createHotelBooking(
  input: HotelBookingInput
): Promise<HotelBooking> {
  const all = await getHotelBookings();
  const code = nextCode(all.length);
  const supabase = await getSupabase();
  if (!supabase) {
    const row = buildHotelBooking(input, code, `demo-hotel-${Date.now()}`);
    demoStore.push(row);
    return row;
  }
  const row = buildHotelBooking(input, code, "");
  const { id: _id, created_at: _c, ...payload } = row;
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as HotelBooking;
}

export async function updateHotelBooking(
  id: string,
  input: HotelBookingInput
): Promise<HotelBooking> {
  const supabase = await getSupabase();
  if (!supabase) {
    const idx = demoStore.findIndex((b) => b.id === id);
    if (idx < 0) throw new Error("Hotel booking not found");
    const code = demoStore[idx].booking_code;
    demoStore[idx] = buildHotelBooking(input, code, id);
    return demoStore[idx];
  }
  const existing = await getHotelBooking(id);
  if (!existing) throw new Error("Hotel booking not found");
  const row = buildHotelBooking(input, existing.booking_code, id);
  const { id: _id, created_at: _c, booking_code: _code, ...payload } = row;
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as HotelBooking;
}

export async function deleteHotelBooking(id: string): Promise<void> {
  const row = await getHotelBooking(id);
  if (!row) return;
  await addToRecycleBin({
    entity_type: "hotel_booking",
    entity_id: id,
    label: `${row.booking_code} · ${row.lead_guest || "—"} · ${row.hotel_name || "—"}`,
    payload: row,
  });

  const supabase = await getSupabase();
  if (!supabase) {
    const idx = demoStore.findIndex((b) => b.id === id);
    if (idx >= 0) demoStore.splice(idx, 1);
    return;
  }
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function restoreHotelBooking(row: HotelBooking): Promise<void> {
  const supabase = await getSupabase();
  if (!supabase) {
    if (!demoStore.some((b) => b.id === row.id)) demoStore.push(row);
    return;
  }
  const { error } = await supabase.from(TABLE).insert(row);
  if (error) throw new Error(error.message);
}

export type HotelSummary = {
  total: number;
  confirmed: number;
  cancelled: number;
  totalSale: number;
  totalProfit: number;
  outstanding: number;
};

export function summarizeHotels(rows: HotelBooking[]): HotelSummary {
  const refreshed = mapHotelRows(rows);
  return {
    total: refreshed.length,
    confirmed: refreshed.filter((r) => r.booking_status === "Confirmed").length,
    cancelled: refreshed.filter((r) => r.booking_status === "Cancelled").length,
    // Cancelled bookings count final charge (what client actually owes), not full stay sale.
    totalSale: refreshed.reduce((s, r) => {
      const cancelled =
        r.booking_status === "Cancelled" || r.booking_status === "No Show";
      return s + (cancelled ? r.final_charge_usd || 0 : r.total_sale_usd || 0);
    }, 0),
    totalProfit: refreshed.reduce((s, r) => s + (r.profit_usd || 0), 0),
    outstanding: refreshed.reduce((s, r) => s + (r.balance_usd || 0), 0),
  };
}
