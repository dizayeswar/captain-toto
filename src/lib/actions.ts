"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createBooking, updateBooking, deleteBooking } from "./bookings";
import type { BookingInput } from "./types";

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
