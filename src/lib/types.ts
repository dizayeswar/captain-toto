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
  /** @deprecated Kept for DB compatibility; always 0. Use pnr instead. */
  debt: number;
  pnr: string;
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
  pnr: string;
  supplier_name: string;
  supplier_code: string;
};

// ---------------------------------------------------------------------------
// Ticket Invoice section
// Mirrors Captain_Toto_Ticket_Invoice_Data_Workbook. An invoice has one header,
// many passengers, and many flight segments. No prices (those live in Booking).
// ---------------------------------------------------------------------------

export type InvoicePassenger = {
  id?: string;
  full_name: string;
  passport_no: string;
  nationality: string;
  date_of_birth: string; // ISO date
  ticket_no: string;
  notes: string;
};

export type InvoiceSegment = {
  id?: string;
  seg_no: number;
  airline: string;
  flight_no: string;
  route: string;
  departure: string; // datetime-local string
  arrival: string; // datetime-local string
  travel_class: string;
  baggage: string;
  notes: string;
};

export type Invoice = {
  id: string;
  invoice_no: string; // CT-TI-0001
  invoice_date: string; // ISO date
  booking_id: string; // links to bookings.booking_id
  airline: string;
  pnr: string;
  reservation_status: string;
  client_name: string;
  notes: string;
  passengers: InvoicePassenger[];
  segments: InvoiceSegment[];
  created_at?: string;
};

export type InvoiceInput = {
  invoice_date: string;
  booking_id: string;
  airline: string;
  pnr: string;
  reservation_status: string;
  client_name: string;
  notes: string;
  passengers: InvoicePassenger[];
  segments: InvoiceSegment[];
};

export type AirlinePolicy = {
  airline: string;
  policy_text: string;
};

// ---------------------------------------------------------------------------
// Payment Invoice (Cash Receipt) section
// Mirrors Captain_ToTo_Payment_Invoice. A bilingual cash receipt.
// ---------------------------------------------------------------------------

export type PaymentInvoice = {
  id: string;
  receipt_no: string; // CT-PR-0001
  receipt_date: string; // ISO date
  payer_type: string; // Individual | Company (COMP/INDV)
  booking_id: string; // optional link to a booking
  received_from: string; // client name (bilingual)
  amount: number; // The Sum Of
  for_text: string; // For / reason
  notes: string;
  prepared_by: string;
  created_at?: string;
};

export type PaymentInvoiceInput = {
  receipt_date: string;
  payer_type: string;
  booking_id: string;
  received_from: string;
  amount: number;
  for_text: string;
  notes: string;
  prepared_by: string;
};

// ---------------------------------------------------------------------------
// Shared Suppliers directory (used by Hotel, Visa and Supplier Finance)
// ---------------------------------------------------------------------------

export type SupplierRecord = {
  id: string;
  supplier_code: string; // SUP-0001
  name: string;
  supplier_type: string;
  country: string;
  city: string;
  contact_person: string;
  phone: string;
  email: string;
  currency: string;
  payment_terms: string;
  bank_details: string;
  active: boolean;
  notes: string;
  created_at?: string;
};

export type SupplierInput = Omit<
  SupplierRecord,
  "id" | "supplier_code" | "created_at"
>;

// ---------------------------------------------------------------------------
// Hotel Management
// ---------------------------------------------------------------------------

export type HotelBooking = {
  id: string;
  booking_code: string; // CTH-0001
  created_date: string;
  lead_guest: string;
  phone: string;
  email: string;
  nationality: string;
  destination_country: string;
  city: string;
  hotel_name: string;
  hotel_confirmation_no: string;
  check_in: string | null;
  check_out: string | null;
  nights: number;
  rooms: number;
  adults: number;
  children: number;
  infants: number;
  room_type: string;
  meal_plan: string;
  supplier: string;
  currency: string;
  cost_per_room_night: number;
  sale_per_room_night: number;
  extra_cost: number;
  discount: number;
  total_cost_usd: number;
  total_sale_usd: number;
  profit_usd: number;
  net_paid_usd: number;
  refunded_usd: number;
  cancellation_fee_usd: number;
  /** Agency service fee kept on cancel (added to final charge). */
  service_fee_usd: number;
  /** What we pay the supplier on cancel (ticket / supplier penalty). */
  cancel_cost_usd: number;
  final_charge_usd: number;
  balance_usd: number;
  payment_status: string;
  booking_status: string;
  staff: string;
  notes: string;
  created_at?: string;
};

export type HotelBookingInput = {
  created_date: string;
  lead_guest: string;
  phone: string;
  email: string;
  nationality: string;
  destination_country: string;
  city: string;
  hotel_name: string;
  hotel_confirmation_no: string;
  check_in: string;
  check_out: string;
  nights: number;
  rooms: number;
  adults: number;
  children: number;
  infants: number;
  room_type: string;
  meal_plan: string;
  supplier: string;
  currency: string;
  cost_per_room_night: number;
  sale_per_room_night: number;
  extra_cost: number;
  discount: number;
  net_paid_usd: number;
  refunded_usd: number;
  cancellation_fee_usd: number;
  service_fee_usd: number;
  cancel_cost_usd: number;
  payment_status: string;
  booking_status: string;
  staff: string;
  notes: string;
};

// ---------------------------------------------------------------------------
// Visa Management
// ---------------------------------------------------------------------------

export type VisaCase = {
  id: string;
  visa_id: string; // CTV-0001
  created_date: string;
  client_name: string;
  phone: string;
  email: string;
  passport_no: string;
  nationality: string;
  destination_country: string;
  visa_type: string;
  entry_type: string;
  travel_date: string | null;
  application_date: string | null;
  appointment_date: string | null;
  decision_date: string | null;
  case_status: string;
  priority: string;
  staff: string;
  currency: string;
  appointment_fee: number;
  document_fee: number;
  extra_charges: number;
  total_sale_usd: number;
  amount_paid_usd: number;
  balance_usd: number;
  payment_status: string;
  documents_result: string;
  passport_received: string;
  passport_returned: string;
  provider: string;
  provider_reference: string;
  supplier_name: string;
  supplier_code: string;
  notes: string;
  created_at?: string;
};

export type VisaCaseInput = {
  created_date: string;
  client_name: string;
  phone: string;
  email: string;
  passport_no: string;
  nationality: string;
  destination_country: string;
  visa_type: string;
  entry_type: string;
  travel_date: string;
  application_date: string;
  appointment_date: string;
  decision_date: string;
  case_status: string;
  priority: string;
  staff: string;
  currency: string;
  appointment_fee: number;
  document_fee: number;
  extra_charges: number;
  amount_paid_usd: number;
  payment_status: string;
  documents_result: string;
  passport_received: string;
  passport_returned: string;
  provider: string;
  provider_reference: string;
  supplier_name: string;
  supplier_code: string;
  notes: string;
};

// ---------------------------------------------------------------------------
// Supplier Financial — service invoices (detailed line items)
// Separate from Payment Invoice (client cash receipt).
// ---------------------------------------------------------------------------

export type SupplierInvoiceLine = {
  id?: string;
  service_type: string; // Ticket | Hotel | Visa | Other
  booking_ref: string;
  description: string;
  /** Supplier cost only — for tickets this is ticket_cost (no service fee). */
  amount: number;
  client_name: string;
  pnr: string;
  route: string;
  issue_date: string; // ISO date
  notes: string;
};

export type SupplierInvoice = {
  id: string;
  invoice_id: string; // SINV-0001
  invoice_date: string;
  due_date: string | null;
  supplier: string;
  supplier_invoice_no: string;
  booking_ref: string; // summary of first/main ref
  service_type: string; // summary: Ticket / Mixed / etc.
  currency: string;
  invoice_amount: number;
  invoice_usd: number;
  paid_usd: number;
  refund_usd: number;
  net_paid_usd: number;
  outstanding_usd: number;
  invoice_status: string;
  payment_status: string;
  notes: string;
  lines: SupplierInvoiceLine[];
  created_at?: string;
};

export type SupplierInvoiceInput = {
  invoice_date: string;
  due_date: string;
  supplier: string;
  supplier_invoice_no: string;
  currency: string;
  paid_usd: number;
  refund_usd: number;
  invoice_status: string;
  payment_status: string;
  notes: string;
  lines: SupplierInvoiceLine[];
};

// ---------------------------------------------------------------------------
// Supplier Payment Receipt (A6 printable)
// ---------------------------------------------------------------------------

export type SupplierPaymentReceipt = {
  id: string;
  receipt_no: string; // SPR-0001
  receipt_date: string;
  supplier: string;
  amount: number;
  signature: string;
  notes: string;
  /** Linked supplier invoice id when auto-created from Settled payment */
  source_invoice_id: string;
  source_invoice_no: string;
  created_at?: string;
};

export type SupplierPaymentReceiptInput = {
  receipt_date: string;
  supplier: string;
  amount: number;
  signature: string;
  notes: string;
  source_invoice_id?: string;
  source_invoice_no?: string;
};

// ---------------------------------------------------------------------------
// Finance Control (daily expenses)
// ---------------------------------------------------------------------------

export type Expense = {
  id: string;
  expense_date: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  payment_method: string;
  paid_by: string;
  receipt_ref: string;
  notes: string;
  /** When Paid By is not ToTo Balance and true → show under ToTo owes others */
  owe_to_staff: boolean;
  created_at?: string;
};

export type ExpenseInput = {
  expense_date: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  payment_method: string;
  paid_by: string;
  receipt_ref: string;
  notes: string;
  owe_to_staff: boolean;
};

/** Money added into the office / ToTo cash balance. */
export type FinanceDeposit = {
  id: string;
  deposit_date: string;
  brought_by: string;
  amount: number;
  currency: string;
  notes: string;
  created_at?: string;
};

export type FinanceDepositInput = {
  deposit_date: string;
  brought_by: string;
  amount: number;
  currency: string;
  notes: string;
};
