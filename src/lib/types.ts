// Captain Toto — internal booking system types.
// Mirrors the "Bookings" sheet of Captain_ToTo_Booking_System.xlsx.

export type PaymentStatus = "Paid" | "Pending" | "Cancelled";
export type ClientType = "Individual" | "Company" | "VIP";
export type PaymentMethod = "Cash" | "Bank" | "Transfer" | "POS";

export type Booking = {
  id: string;
  booking_id: string; // human-facing code, e.g. CT-0001
  booking_date: string; // ISO date (YYYY-MM-DD)
  client_name: string;
  client_type: string;
  route: string;
  airline: string;
  ticket_cost: number;
  service_fee: number;
  total_paid: number; // ticket_cost + service_fee
  payment_status: string;
  issued: boolean;
  handled_by: string;
  payment_method: string;
  profit: number; // total_paid - ticket_cost
  debt: number;
  supplier_name: string;
  supplier_code: string;
  month: number; // 1-12, derived from booking_date
  year: number; // derived from booking_date
  created_at?: string;
};

// Fields the user actually fills in; the rest are derived on save.
export type BookingInput = {
  booking_date: string;
  client_name: string;
  client_type: string;
  route: string;
  airline: string;
  ticket_cost: number;
  service_fee: number;
  payment_status: string;
  issued: boolean;
  handled_by: string;
  payment_method: string;
  debt: number;
  supplier_name: string;
  supplier_code: string;
};
