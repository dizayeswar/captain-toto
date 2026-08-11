"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createBooking, updateBooking, deleteBooking, getBookings } from "./bookings";
import {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  upsertPolicy,
} from "./invoices";
import {
  createPaymentInvoice,
  updatePaymentInvoice,
  deletePaymentInvoice,
} from "./payments";
import {
  createHotelBooking,
  updateHotelBooking,
  deleteHotelBooking,
} from "./hotels";
import {
  createVisaCase,
  updateVisaCase,
  deleteVisaCase,
} from "./visas";
import {
  createSupplierInvoice,
  updateSupplierInvoice,
  deleteSupplierInvoice,
} from "./supplierFinance";
import { createSupplier, deleteSupplier } from "./suppliers";
import {
  createSupplierPaymentReceipt,
  updateSupplierPaymentReceipt,
  deleteSupplierPaymentReceipt,
  ensureReceiptForSettledInvoice,
} from "./supplierReceipts";
import {
  createExpense,
  updateExpense,
  deleteExpense,
} from "./expenses";
import {
  createFinanceDeposit,
  deleteFinanceDeposit,
} from "./financeBalance";
import type {
  BookingInput,
  InvoiceInput,
  InvoicePassenger,
  InvoiceSegment,
  PaymentInvoiceInput,
  HotelBookingInput,
  VisaCaseInput,
  SupplierInvoiceInput,
  SupplierInvoiceLine,
  SupplierInput,
  SupplierPaymentReceiptInput,
  ExpenseInput,
  FinanceDepositInput,
} from "./types";

function parseForm(formData: FormData): BookingInput {
  const num = (name: string) => Number(formData.get(name)) || 0;
  const str = (name: string) => String(formData.get(name) ?? "").trim();

  return {
    booking_date: str("booking_date"),
    client_name: str("client_name"),
    client_type: str("client_type"),
    route: str("route"),
    airline: str("airline"),
    ticket_cost: num("ticket_cost"),
    service_fee: num("service_fee"),
    payment_status: str("payment_status"),
    issued: formData.get("issued") === "on" || formData.get("issued") === "true",
    handled_by: str("handled_by"),
    payment_method: str("payment_method"),
    pnr: str("pnr"),
    supplier_name: str("supplier_name"),
    supplier_code: str("supplier_code"),
  };
}

export async function createBookingAction(formData: FormData) {
  const input = parseForm(formData);
  await createBooking(input);
  revalidatePath("/", "layout");
  redirect("/bookings");
}

export async function updateBookingAction(id: string, formData: FormData) {
  const input = parseForm(formData);
  await updateBooking(id, input);
  revalidatePath("/", "layout");
  redirect("/bookings");
}

export async function deleteBookingAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteBooking(id);
    revalidatePath("/", "layout");
  }
}

// ---------------------------------------------------------------------------
// Ticket Invoice actions
// ---------------------------------------------------------------------------

function parseInvoiceForm(formData: FormData): InvoiceInput {
  const str = (name: string) => String(formData.get(name) ?? "").trim();

  let passengers: InvoicePassenger[] = [];
  let segments: InvoiceSegment[] = [];
  try {
    passengers = JSON.parse(String(formData.get("passengers") ?? "[]"));
  } catch {
    passengers = [];
  }
  try {
    segments = JSON.parse(String(formData.get("segments") ?? "[]"));
  } catch {
    segments = [];
  }

  return {
    invoice_date: str("invoice_date"),
    booking_id: str("booking_id"),
    airline: str("airline"),
    pnr: str("pnr"),
    reservation_status: str("reservation_status"),
    client_name: str("client_name"),
    notes: str("notes"),
    passengers,
    segments,
  };
}

export async function createInvoiceAction(formData: FormData) {
  const input = parseInvoiceForm(formData);
  const invoice = await createInvoice(input);

  // Always create a matching Payment Invoice (cash receipt), paid or not.
  let amount = 0;
  let forText = `Ticket invoice ${invoice.invoice_no}`;
  if (invoice.booking_id) {
    const bookings = await getBookings();
    const linked = bookings.find((b) => b.booking_id === invoice.booking_id);
    if (linked) {
      amount = linked.total_paid || 0;
      forText = `Flight ticket ${linked.route || ""} (${linked.airline || ""}) — ${invoice.invoice_no}`.trim();
    }
  }
  await createPaymentInvoice({
    receipt_date: invoice.invoice_date,
    payer_type: "Individual",
    booking_id: invoice.booking_id || "",
    received_from: invoice.client_name || "",
    amount,
    for_text: forText,
    notes: invoice.notes || "",
    prepared_by: "Osman",
  });

  revalidatePath("/", "layout");
  redirect(`/invoices/${invoice.id}`);
}

export async function updateInvoiceAction(id: string, formData: FormData) {
  const input = parseInvoiceForm(formData);
  await updateInvoice(id, input);
  revalidatePath("/", "layout");
  redirect(`/invoices/${id}`);
}

export async function deleteInvoiceAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteInvoice(id);
    revalidatePath("/", "layout");
  }
}

export async function updatePolicyAction(formData: FormData) {
  const airline = String(formData.get("airline") ?? "").trim();
  const policyText = String(formData.get("policy_text") ?? "").trim();
  if (airline) {
    await upsertPolicy(airline, policyText);
    revalidatePath("/", "layout");
  }
}

// ---------------------------------------------------------------------------
// Payment Invoice (cash receipt) actions
// ---------------------------------------------------------------------------

function parsePaymentForm(formData: FormData): PaymentInvoiceInput {
  const str = (name: string) => String(formData.get(name) ?? "").trim();
  return {
    receipt_date: str("receipt_date"),
    payer_type: str("payer_type"),
    booking_id: str("booking_id"),
    received_from: str("received_from"),
    amount: Number(formData.get("amount")) || 0,
    for_text: str("for_text"),
    notes: str("notes"),
    prepared_by: str("prepared_by"),
  };
}

export async function createPaymentInvoiceAction(formData: FormData) {
  const input = parsePaymentForm(formData);
  const receipt = await createPaymentInvoice(input);
  revalidatePath("/", "layout");
  redirect(`/payments/${receipt.id}`);
}

export async function updatePaymentInvoiceAction(
  id: string,
  formData: FormData
) {
  const input = parsePaymentForm(formData);
  await updatePaymentInvoice(id, input);
  revalidatePath("/", "layout");
  redirect(`/payments/${id}`);
}

export async function deletePaymentInvoiceAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (id) {
    await deletePaymentInvoice(id);
    revalidatePath("/", "layout");
  }
}

// ---------------------------------------------------------------------------
// Hotel Management actions
// ---------------------------------------------------------------------------

function parseHotelForm(formData: FormData): HotelBookingInput {
  const str = (name: string) => String(formData.get(name) ?? "").trim();
  const num = (name: string) => Number(formData.get(name)) || 0;
  return {
    created_date: str("created_date"),
    lead_guest: str("lead_guest"),
    phone: str("phone"),
    email: str("email"),
    nationality: str("nationality"),
    destination_country: str("destination_country"),
    city: str("city"),
    hotel_name: str("hotel_name"),
    hotel_confirmation_no: str("hotel_confirmation_no"),
    check_in: str("check_in"),
    check_out: str("check_out"),
    nights: num("nights"),
    rooms: num("rooms"),
    adults: num("adults"),
    children: num("children"),
    infants: num("infants"),
    room_type: str("room_type"),
    meal_plan: str("meal_plan"),
    supplier: str("supplier"),
    currency: str("currency"),
    cost_per_room_night: num("cost_per_room_night"),
    sale_per_room_night: num("sale_per_room_night"),
    extra_cost: num("extra_cost"),
    discount: num("discount"),
    net_paid_usd: num("net_paid_usd"),
    refunded_usd: num("refunded_usd"),
    cancellation_fee_usd: num("cancellation_fee_usd"),
    service_fee_usd: num("service_fee_usd"),
    cancel_cost_usd: num("cancel_cost_usd"),
    payment_status: str("payment_status"),
    booking_status: str("booking_status"),
    staff: str("staff"),
    notes: str("notes"),
  };
}

export async function createHotelBookingAction(formData: FormData) {
  await createHotelBooking(parseHotelForm(formData));
  revalidatePath("/", "layout");
  redirect("/hotel");
}

export async function updateHotelBookingAction(id: string, formData: FormData) {
  await updateHotelBooking(id, parseHotelForm(formData));
  revalidatePath("/", "layout");
  redirect("/hotel");
}

export async function deleteHotelBookingAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteHotelBooking(id);
    revalidatePath("/", "layout");
  }
}

// ---------------------------------------------------------------------------
// Visa Management actions
// ---------------------------------------------------------------------------

function parseVisaForm(formData: FormData): VisaCaseInput {
  const str = (name: string) => String(formData.get(name) ?? "").trim();
  const num = (name: string) => Number(formData.get(name)) || 0;
  return {
    created_date: str("created_date"),
    client_name: str("client_name"),
    phone: str("phone"),
    email: str("email"),
    passport_no: str("passport_no"),
    nationality: str("nationality"),
    destination_country: str("destination_country"),
    visa_type: str("visa_type"),
    entry_type: str("entry_type"),
    travel_date: str("travel_date"),
    application_date: str("application_date"),
    appointment_date: str("appointment_date"),
    decision_date: str("decision_date"),
    case_status: str("case_status"),
    priority: str("priority"),
    staff: str("staff"),
    currency: str("currency"),
    appointment_fee: num("appointment_fee"),
    document_fee: num("document_fee"),
    extra_charges: num("extra_charges"),
    amount_paid_usd: num("amount_paid_usd"),
    payment_status: str("payment_status"),
    documents_result: str("documents_result"),
    passport_received: str("passport_received"),
    passport_returned: str("passport_returned"),
    provider: str("provider"),
    provider_reference: str("provider_reference"),
    supplier_name: str("supplier_name"),
    supplier_code: str("supplier_code"),
    notes: str("notes"),
  };
}

export async function createVisaCaseAction(formData: FormData) {
  await createVisaCase(parseVisaForm(formData));
  revalidatePath("/", "layout");
  redirect("/visa");
}

export async function updateVisaCaseAction(id: string, formData: FormData) {
  await updateVisaCase(id, parseVisaForm(formData));
  revalidatePath("/", "layout");
  redirect("/visa");
}

export async function deleteVisaCaseAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteVisaCase(id);
    revalidatePath("/", "layout");
  }
}

// ---------------------------------------------------------------------------
// Supplier Financial actions
// ---------------------------------------------------------------------------

function parseSupplierInvoiceForm(formData: FormData): SupplierInvoiceInput {
  const str = (name: string) => String(formData.get(name) ?? "").trim();
  const num = (name: string) => Number(formData.get(name)) || 0;
  let lines: SupplierInvoiceLine[] = [];
  try {
    lines = JSON.parse(String(formData.get("lines") ?? "[]"));
  } catch {
    lines = [];
  }
  return {
    invoice_date: str("invoice_date"),
    due_date: str("due_date"),
    supplier: str("supplier"),
    supplier_invoice_no: str("supplier_invoice_no"),
    currency: str("currency"),
    paid_usd: num("paid_usd"),
    refund_usd: num("refund_usd"),
    invoice_status: str("invoice_status"),
    payment_status: str("payment_status"),
    notes: str("notes"),
    lines,
  };
}

export async function createSupplierInvoiceAction(formData: FormData) {
  const invoice = await createSupplierInvoice(parseSupplierInvoiceForm(formData));
  const receipt = await ensureReceiptForSettledInvoice(invoice);
  revalidatePath("/", "layout");
  if (receipt) redirect(`/suppliers/receipts/${receipt.id}`);
  redirect("/suppliers/invoices");
}

export async function updateSupplierInvoiceAction(
  id: string,
  formData: FormData
) {
  const invoice = await updateSupplierInvoice(
    id,
    parseSupplierInvoiceForm(formData)
  );
  const receipt = await ensureReceiptForSettledInvoice(invoice);
  revalidatePath("/", "layout");
  if (receipt) redirect(`/suppliers/receipts/${receipt.id}`);
  redirect("/suppliers/invoices");
}

export async function deleteSupplierInvoiceAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteSupplierInvoice(id);
    revalidatePath("/", "layout");
  }
}

export async function createSupplierAction(formData: FormData) {
  const str = (name: string) => String(formData.get(name) ?? "").trim();
  const input: SupplierInput = {
    name: str("name"),
    supplier_type: str("supplier_type"),
    country: str("country"),
    city: str("city"),
    contact_person: str("contact_person"),
    phone: str("phone"),
    email: str("email"),
    currency: str("currency") || "USD",
    payment_terms: str("payment_terms"),
    bank_details: str("bank_details"),
    active: formData.get("active") !== "off",
    notes: str("notes"),
  };
  await createSupplier(input);
  revalidatePath("/", "layout");
  redirect("/suppliers");
}

export async function deleteSupplierAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteSupplier(id);
    revalidatePath("/", "layout");
  }
}

// ---------------------------------------------------------------------------
// Supplier Payment Receipt actions
// ---------------------------------------------------------------------------

function parseSupplierReceiptForm(
  formData: FormData
): SupplierPaymentReceiptInput {
  const str = (name: string) => String(formData.get(name) ?? "").trim();
  const num = (name: string) => Number(formData.get(name)) || 0;
  return {
    receipt_date: str("receipt_date"),
    supplier: str("supplier"),
    amount: num("amount"),
    signature: str("signature"),
    notes: str("notes"),
  };
}

export async function createSupplierPaymentReceiptAction(formData: FormData) {
  const receipt = await createSupplierPaymentReceipt(
    parseSupplierReceiptForm(formData)
  );
  revalidatePath("/", "layout");
  redirect(`/suppliers/receipts/${receipt.id}`);
}

export async function updateSupplierPaymentReceiptAction(
  id: string,
  formData: FormData
) {
  await updateSupplierPaymentReceipt(id, parseSupplierReceiptForm(formData));
  revalidatePath("/", "layout");
  redirect(`/suppliers/receipts/${id}`);
}

export async function deleteSupplierPaymentReceiptAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteSupplierPaymentReceipt(id);
    revalidatePath("/", "layout");
  }
}

// ---------------------------------------------------------------------------
// Finance Control (expenses) actions
// ---------------------------------------------------------------------------

function parseExpenseForm(formData: FormData): ExpenseInput {
  const str = (name: string) => String(formData.get(name) ?? "").trim();
  const paidBy = str("paid_by");
  const isToto = paidBy === "ToTo Balance";
  return {
    expense_date: str("expense_date"),
    category: str("category"),
    description: str("description"),
    amount: Number(formData.get("amount")) || 0,
    currency: str("currency"),
    payment_method: str("payment_method"),
    paid_by: paidBy,
    receipt_ref: str("receipt_ref"),
    notes: str("notes"),
    // Only meaningful when someone other than ToTo Balance paid
    owe_to_staff: !isToto && formData.get("owe_to_staff") === "on",
  };
}

export async function createExpenseAction(formData: FormData) {
  await createExpense(parseExpenseForm(formData));
  revalidatePath("/", "layout");
  redirect("/finance");
}

export async function updateExpenseAction(id: string, formData: FormData) {
  await updateExpense(id, parseExpenseForm(formData));
  revalidatePath("/", "layout");
  redirect("/finance");
}

export async function deleteExpenseAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteExpense(id);
    revalidatePath("/", "layout");
  }
}

// ---------------------------------------------------------------------------
// Finance balance deposits (money in)
// ---------------------------------------------------------------------------

function parseDepositForm(formData: FormData): FinanceDepositInput {
  const str = (name: string) => String(formData.get(name) ?? "").trim();
  return {
    deposit_date: str("deposit_date"),
    brought_by: str("brought_by"),
    amount: Number(formData.get("amount")) || 0,
    currency: str("currency") || "IQD",
    notes: str("notes"),
  };
}

export async function createFinanceDepositAction(formData: FormData) {
  await createFinanceDeposit(parseDepositForm(formData));
  revalidatePath("/", "layout");
  redirect("/finance");
}

export async function deleteFinanceDepositAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteFinanceDeposit(id);
    revalidatePath("/", "layout");
  }
}

// ---------------------------------------------------------------------------
// Recycle bin
// ---------------------------------------------------------------------------

export async function restoreRecycleBinItemAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (id) {
    const { restoreRecycleBinItem } = await import("./recycleBin");
    await restoreRecycleBinItem(id);
    revalidatePath("/", "layout");
  }
}

export async function purgeRecycleBinItemAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (id) {
    const { purgeRecycleBinItem } = await import("./recycleBin");
    await purgeRecycleBinItem(id);
    revalidatePath("/", "layout");
  }
}
