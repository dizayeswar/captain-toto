// Dropdown option lists — mirrors the "Lists" sheet of the Excel workbook.
// Edit these to change the choices offered in the booking form.

export const CLIENT_TYPES = ["Individual", "Company", "VIP"] as const;

export const PAYMENT_STATUSES = ["Paid", "Pending", "Cancelled"] as const;

export const PAYMENT_METHODS = ["Cash", "Bank", "Transfer", "POS"] as const;

export const STAFF = ["Sherwani", "Osman", "Ali", "Staff1"] as const;

export const AIRLINES = [
  "Ajet",
  "Air Arabia",
  "EgyptAir",
  "Emirates",
  "Fly Erbil",
  "Pegasus",
  "Royal Jordanian",
  "Turkish Airlines",
] as const;

export const ROUTES = [
  "DIY - IST",
  "EBL - CGK",
  "GZT - SAW",
  "IST - EBL",
  "IST - GZT",
  "ISU - TUN - ISU",
  "LON - NKT - LON",
  "TUN - ISU",
] as const;

export type Supplier = { name: string; code: string };

/** @deprecated Prefer getSupplierOptions() from @/lib/suppliers — directory is the source of truth. */
export const SUPPLIERS: Supplier[] = [
  { name: "Captain ToTo", code: "SUP-0001" },
  { name: "Morocco Travel", code: "SUP-0002" },
  { name: "SkySinai", code: "SUP-0003" },
  { name: "Hala Travel", code: "SUP-0004" },
];

// --- Ticket Invoice section lists (from the Setup / Airline_Policies sheets) ---

export const INVOICE_AIRLINES = [
  "Turkish Airlines",
  "Emirates",
  "flydubai",
  "Air Arabia",
  "EgyptAir",
  "Iraqi Airways",
  "Pegasus",
  "AJet",
  "Qatar Airways",
  "Royal Jordanian",
  "FLY ERBIL",
] as const;

export const RESERVATION_STATUSES = [
  "Confirmed",
  "Pending",
  "Cancelled",
  "Issued",
  "On Hold",
  "Refunded",
] as const;

export const TRAVEL_CLASSES = [
  "Economy",
  "Premium Economy",
  "Business",
  "First",
] as const;

export const BAGGAGE_OPTIONS = [
  "30 KG",
  "20 KG",
  "2 PC",
  "Not Included",
] as const;

// --- Payment Invoice (cash receipt) lists ---

export const PAYER_TYPES = ["Individual", "Company"] as const;

// --- Shared lists for Hotel / Visa / Supplier Finance / Finance sections ---

export const CURRENCIES = ["USD", "IQD", "EUR", "GBP", "TRY", "AED"] as const;

export const SUPPLIER_TYPES = [
  "Airline",
  "Hotel",
  "Wholesaler",
  "DMC",
  "Visa Provider",
  "Transport",
  "Travel Agency",
  "Other",
] as const;

export const SERVICE_TYPES = [
  "Ticket",
  "Hotel",
  "Visa",
  "Transport",
  "Insurance",
  "Tour Package",
  "Other",
] as const;

export const YES_NO = ["Yes", "No"] as const;

// --- Hotel ---

export const HOTEL_BOOKING_STATUSES = [
  "Pending",
  "Confirmed",
  "On Hold",
  "Checked In",
  "Completed",
  "Cancelled",
  "No Show",
] as const;

export const HOTEL_PAYMENT_STATUSES = [
  "Paid",
  "Partially Paid",
  "Unpaid",
  "Refunded",
  "No Amount",
] as const;

export const ROOM_TYPES = [
  "Single",
  "Double",
  "Twin",
  "Triple",
  "Family",
  "Suite",
  "Apartment",
  "Villa",
  "Other",
] as const;

export const MEAL_PLANS = [
  "Room Only",
  "Breakfast",
  "Half Board",
  "Full Board",
  "All Inclusive",
  "Other",
] as const;

// --- Visa ---

export const VISA_CASE_STATUSES = [
  "New Inquiry",
  "Awaiting Documents",
  "Documents Ready",
  "Appointment Booked",
  "Submitted",
  "Under Process",
  "Additional Documents Required",
  "Approved",
  "Rejected",
  "Cancelled",
  "Completed",
] as const;

export const VISA_TYPES = [
  "Tourist",
  "Business",
  "Family Visit",
  "Student",
  "Work",
  "Medical",
  "Transit",
  "Residency",
  "Other",
] as const;

export const ENTRY_TYPES = [
  "Single Entry",
  "Double Entry",
  "Multiple Entry",
  "Not Applicable",
] as const;

export const VISA_PRIORITIES = ["Normal", "Urgent", "VIP"] as const;

export const DOCUMENT_RESULTS = [
  "Documents Ready",
  "Awaiting Required Documents",
  "Not Reviewed",
] as const;

export const VISA_PAYMENT_STATUSES = [
  "Paid",
  "Partially Paid",
  "Unpaid",
  "No Amount",
] as const;

export const VISA_STAFF = ["Admin", "Visa Agent 1", "Osman", "Sherwani"] as const;

// --- Supplier Finance ---

export const SUPPLIER_INVOICE_STATUSES = [
  "Open",
  "Cancelled",
  "Disputed",
] as const;

export const SUPPLIER_PAYMENT_STATUSES = [
  "Settled",
  "Partially Paid",
  "Unpaid",
  "Overdue",
  "Cancelled",
] as const;

// --- Finance Control (expenses) ---

export const EXPENSE_CATEGORIES = [
  "Office",
  "Salary",
  "Marketing",
  "Transport",
  "Software",
  "Commission Paid",
  "Supplies",
  "Hardware",
  "Bills",
  "Other",
] as const;

export const EXPENSE_PAYMENT_METHODS = [
  "Cash",
  "Bank",
  "Transfer",
  "Card",
] as const;

export const EXPENSE_PAID_BY = [
  "ToTo Balance",
  "Sherwani",
  "Osman",
  "Ali",
] as const;

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;
