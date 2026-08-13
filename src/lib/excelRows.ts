import { mapExcelRows } from "./excelMap";
import type {
  Booking,
  Expense,
  FinanceDeposit,
  HotelBooking,
  Invoice,
  PaymentInvoice,
  SupplierInvoice,
  SupplierPaymentReceipt,
  SupplierRecord,
  VisaCase,
} from "./types";
import type { GroupRow } from "./bookings";
import type { ExpenseGroup } from "./expenses";
import type { PaymentGroupRow } from "./payments";

export function bookingsToExcel(rows: Booking[]) {
  return mapExcelRows(rows, [
    { label: "Booking ID", value: (r) => r.booking_id },
    { label: "Date", value: (r) => r.booking_date },
    { label: "Client", value: (r) => r.client_name },
    { label: "Client Type", value: (r) => r.client_type },
    { label: "Route", value: (r) => r.route },
    { label: "Airline", value: (r) => r.airline },
    { label: "Ticket Cost", value: (r) => r.ticket_cost },
    { label: "Service Fee", value: (r) => r.service_fee },
    { label: "Total Paid", value: (r) => r.total_paid },
    { label: "Profit", value: (r) => r.profit },
    { label: "Payment Status", value: (r) => r.payment_status },
    { label: "Issued", value: (r) => (r.issued ? "Yes" : "No") },
    { label: "Handled By", value: (r) => r.handled_by },
    { label: "Payment Method", value: (r) => r.payment_method },
    { label: "PNR", value: (r) => r.pnr },
    { label: "Supplier", value: (r) => r.supplier_name },
    { label: "Supplier Code", value: (r) => r.supplier_code },
  ]);
}

export function invoicesToExcel(rows: Invoice[]) {
  return mapExcelRows(rows, [
    { label: "Invoice No", value: (r) => r.invoice_no },
    { label: "Date", value: (r) => r.invoice_date },
    { label: "Booking", value: (r) => r.booking_id },
    { label: "Client", value: (r) => r.client_name },
    { label: "Airline", value: (r) => r.airline },
    { label: "PNR", value: (r) => r.pnr },
    { label: "Status", value: (r) => r.reservation_status },
    { label: "Passengers", value: (r) => r.passengers?.length ?? 0 },
    { label: "Segments", value: (r) => r.segments?.length ?? 0 },
    { label: "Notes", value: (r) => r.notes },
  ]);
}

export function paymentsToExcel(rows: PaymentInvoice[]) {
  return mapExcelRows(rows, [
    { label: "Receipt No", value: (r) => r.receipt_no },
    { label: "Date", value: (r) => r.receipt_date },
    { label: "Received From", value: (r) => r.received_from },
    { label: "Payer Type", value: (r) => r.payer_type },
    { label: "For", value: (r) => r.for_text },
    { label: "Booking", value: (r) => r.booking_id },
    { label: "Amount", value: (r) => r.amount },
    { label: "Prepared By", value: (r) => r.prepared_by },
  ]);
}

export function hotelsToExcel(rows: HotelBooking[]) {
  return mapExcelRows(rows, [
    { label: "Code", value: (r) => r.booking_code },
    { label: "Date", value: (r) => r.created_date },
    { label: "Guest", value: (r) => r.lead_guest },
    { label: "Hotel", value: (r) => r.hotel_name },
    { label: "City", value: (r) => r.city },
    { label: "Check-in", value: (r) => r.check_in },
    { label: "Check-out", value: (r) => r.check_out },
    { label: "Nights", value: (r) => r.nights },
    { label: "Rooms", value: (r) => r.rooms },
    { label: "Status", value: (r) => r.booking_status },
    { label: "Payment Status", value: (r) => r.payment_status },
    { label: "Total Cost", value: (r) => r.total_cost_usd },
    { label: "Total Sale", value: (r) => r.total_sale_usd },
    { label: "Profit", value: (r) => r.profit_usd },
    { label: "Net Paid", value: (r) => r.net_paid_usd },
    { label: "Balance", value: (r) => r.balance_usd },
    { label: "Supplier", value: (r) => r.supplier },
    { label: "Staff", value: (r) => r.staff },
  ]);
}

export function visasToExcel(rows: VisaCase[]) {
  return mapExcelRows(rows, [
    { label: "Visa ID", value: (r) => r.visa_id },
    { label: "Date", value: (r) => r.created_date },
    { label: "Client", value: (r) => r.client_name },
    { label: "Destination", value: (r) => r.destination_country },
    { label: "Visa Type", value: (r) => r.visa_type },
    { label: "Status", value: (r) => r.case_status },
    { label: "Payment Status", value: (r) => r.payment_status },
    { label: "Total Sale", value: (r) => r.total_sale_usd },
    { label: "Amount Paid", value: (r) => r.amount_paid_usd },
    { label: "Balance", value: (r) => r.balance_usd },
    { label: "Supplier", value: (r) => r.supplier_name },
    { label: "Staff", value: (r) => r.staff },
  ]);
}

export function suppliersToExcel(rows: SupplierRecord[]) {
  return mapExcelRows(rows, [
    { label: "Code", value: (r) => r.supplier_code },
    { label: "Name", value: (r) => r.name },
    { label: "Type", value: (r) => r.supplier_type },
    { label: "Country", value: (r) => r.country },
    { label: "City", value: (r) => r.city },
    { label: "Contact", value: (r) => r.contact_person },
    { label: "Phone", value: (r) => r.phone },
    { label: "Email", value: (r) => r.email },
    { label: "Currency", value: (r) => r.currency },
    { label: "Active", value: (r) => (r.active ? "Yes" : "No") },
    { label: "Notes", value: (r) => r.notes },
  ]);
}

export function supplierInvoicesToExcel(rows: SupplierInvoice[]) {
  return mapExcelRows(rows, [
    { label: "Invoice ID", value: (r) => r.invoice_id },
    { label: "Date", value: (r) => r.invoice_date },
    { label: "Supplier", value: (r) => r.supplier },
    { label: "Service", value: (r) => r.service_type },
    { label: "Status", value: (r) => r.invoice_status },
    { label: "Payment", value: (r) => r.payment_status },
    { label: "Amount USD", value: (r) => r.invoice_usd },
    { label: "Paid", value: (r) => r.paid_usd },
    { label: "Refund", value: (r) => r.refund_usd },
    { label: "Outstanding", value: (r) => r.outstanding_usd },
    { label: "Lines", value: (r) => r.lines?.length ?? 0 },
  ]);
}

export function supplierReceiptsToExcel(rows: SupplierPaymentReceipt[]) {
  return mapExcelRows(rows, [
    { label: "Receipt No", value: (r) => r.receipt_no },
    { label: "Date", value: (r) => r.receipt_date },
    { label: "Supplier", value: (r) => r.supplier },
    { label: "Amount", value: (r) => r.amount },
    { label: "Signature", value: (r) => r.signature },
    { label: "Source Invoice", value: (r) => r.source_invoice_no },
    { label: "Notes", value: (r) => r.notes },
  ]);
}

export function expensesToExcel(rows: Expense[]) {
  return mapExcelRows(rows, [
    { label: "Date", value: (r) => r.expense_date },
    { label: "Category", value: (r) => r.category },
    { label: "Description", value: (r) => r.description },
    { label: "Amount", value: (r) => r.amount },
    { label: "Currency", value: (r) => r.currency },
    { label: "Payment Method", value: (r) => r.payment_method },
    { label: "Paid By", value: (r) => r.paid_by },
    { label: "Owe to Staff", value: (r) => (r.owe_to_staff ? "Yes" : "No") },
    { label: "Receipt Ref", value: (r) => r.receipt_ref },
    { label: "Notes", value: (r) => r.notes },
  ]);
}

export function depositsToExcel(rows: FinanceDeposit[]) {
  return mapExcelRows(rows, [
    { label: "Date", value: (r) => r.deposit_date },
    { label: "Brought By", value: (r) => r.brought_by },
    { label: "Amount", value: (r) => r.amount },
    { label: "Currency", value: (r) => r.currency },
    { label: "Notes", value: (r) => r.notes },
  ]);
}

export function groupRowsToExcel(rows: GroupRow[], keyLabel: string) {
  return mapExcelRows(rows, [
    { label: keyLabel, value: (r) => r.key },
    { label: "Bookings", value: (r) => r.bookings },
    { label: "Revenue", value: (r) => r.revenue },
    { label: "Profit", value: (r) => r.profit },
    { label: "Pending", value: (r) => r.pending },
    { label: "Issued", value: (r) => r.issued },
  ]);
}

export function expenseGroupsToExcel(rows: ExpenseGroup[], keyLabel: string) {
  return mapExcelRows(rows, [
    { label: keyLabel, value: (r) => r.key },
    { label: "Count", value: (r) => r.count },
    { label: "USD", value: (r) => r.usd },
    { label: "IQD", value: (r) => r.iqd },
  ]);
}

export function paymentGroupsToExcel(rows: PaymentGroupRow[], keyLabel: string) {
  return mapExcelRows(rows, [
    { label: keyLabel, value: (r) => r.key },
    { label: "Count", value: (r) => r.count },
    { label: "Total", value: (r) => r.total },
  ]);
}
