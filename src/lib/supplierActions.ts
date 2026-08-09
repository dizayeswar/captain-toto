"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupplier, updateSupplier, deleteSupplier } from "./suppliers";
import type { SupplierInput } from "./types";

function parse(formData: FormData): SupplierInput {
  const str = (name: string) => String(formData.get(name) ?? "").trim();
  return {
    name: str("name"),
    supplier_type: str("supplier_type"),
    country: str("country"),
    city: str("city"),
    contact_person: str("contact_person"),
    phone: str("phone"),
    email: str("email"),
    currency: str("currency"),
    payment_terms: str("payment_terms"),
    bank_details: str("bank_details"),
    active: formData.get("active") === "on" || formData.get("active") === "true",
    notes: str("notes"),
  };
}

export async function createSupplierAction(formData: FormData) {
  await createSupplier(parse(formData));
  revalidatePath("/", "layout");
  redirect("/suppliers");
}

export async function updateSupplierAction(id: string, formData: FormData) {
  await updateSupplier(id, parse(formData));
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
