"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createBooking, updateBooking, deleteBooking } from "./bookings";
import {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  upsertPolicy,
} from "./invoices";
import type {
  BookingInput,
  InvoiceInput,
  InvoicePassenger,
  InvoiceSegment,
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
    debt: num("debt"),
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
