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

export const SUPPLIERS: Supplier[] = [
  { name: "Captain ToTo", code: "SUP-0001" },
  { name: "Morocco Travel", code: "SUP-0002" },
  { name: "SkySinai", code: "SUP-0003" },
  { name: "Hala Travel", code: "SUP-0004" },
];

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
