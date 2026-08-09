import { getSupabase } from "./supabase";
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
    check_in: input.check_in,
    check_out: input.check_out,
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
    profit_usd: totalSale - totalCost,
    net_paid_usd: netPaid,
    balance_usd: totalSale - netPaid,
    payment_status: input.payment_status,
    booking_status: input.booking_status,
    staff: input.staff,
    notes: input.notes,
  };
}

function nextCode(count: number) {
  return `CTH-${String(count + 1).padStart(4, "0")}`;
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
      payment_status: "Paid",
      booking_status: "Confirmed",
      staff: "Osman",
      notes: "",
    },
    "CTH-0001",
    "demo-hotel-1"
  ),
];

export async function getHotelBookings(): Promise<HotelBooking[]> {
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
  return data as HotelBooking[];
}

export async function getHotelBooking(id: string): Promise<HotelBooking | null> {
  const supabase = getSupabase();
  if (!supabase) return demoStore.find((b) => b.id === id) ?? null;
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as HotelBooking;
}

export async function createHotelBooking(
  input: HotelBookingInput
): Promise<HotelBooking> {
  const all = await getHotelBookings();
  const code = nextCode(all.length);
  const supabase = getSupabase();
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
  const supabase = getSupabase();
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
  const supabase = getSupabase();
  if (!supabase) {
    const idx = demoStore.findIndex((b) => b.id === id);
    if (idx >= 0) demoStore.splice(idx, 1);
    return;
  }
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
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
  return {
    total: rows.length,
    confirmed: rows.filter((r) => r.booking_status === "Confirmed").length,
    cancelled: rows.filter((r) => r.booking_status === "Cancelled").length,
    totalSale: rows.reduce((s, r) => s + (r.total_sale_usd || 0), 0),
    totalProfit: rows.reduce((s, r) => s + (r.profit_usd || 0), 0),
    outstanding: rows.reduce((s, r) => s + (r.balance_usd || 0), 0),
  };
}
