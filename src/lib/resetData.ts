import { getSupabase, isSupabaseConfigured } from "./supabase";
import { requireRole } from "./auth";
import { createServerSupabaseClient } from "./supabase/server";
import { addToRecycleBin, type RecycleEntityType } from "./recycleBin";
import { getBookings } from "./bookings";
import { getInvoices, getInvoice } from "./invoices";
import { getPaymentInvoices } from "./payments";
import { getHotelBookings } from "./hotels";
import { getVisaCases } from "./visas";
import { getSuppliers } from "./suppliers";
import {
  getSupplierInvoices,
  getSupplierInvoice,
} from "./supplierFinance";
import { getSupplierPaymentReceipts } from "./supplierReceipts";
import { getExpenses } from "./expenses";
import { getFinanceDeposits } from "./financeBalance";

/** Live tables cleared after snapshotting into recycle bin. */
const CLEAR_TABLES_BY_ID = [
  "invoice_passengers",
  "invoice_segments",
  "supplier_invoice_lines",
  "invoices",
  "payment_invoices",
  "hotel_bookings",
  "visa_cases",
  "supplier_payment_receipts",
  "supplier_invoices",
  "suppliers",
  "expenses",
  "finance_deposits",
  "bookings",
] as const;

export type ResetDataResult =
  | { ok: true; moved: number }
  | { ok: false; error: string };

async function moveMany(
  items: {
    entity_type: RecycleEntityType;
    entity_id: string;
    label: string;
    payload: unknown;
  }[]
): Promise<number> {
  let count = 0;
  for (const item of items) {
    await addToRecycleBin(item);
    count += 1;
  }
  return count;
}

/**
 * Move all business data into Recycle Bin, then clear live tables.
 * Requires CEO account password. Keeps login accounts / profiles.
 */
export async function resetAllData(password: string): Promise<ResetDataResult> {
  const profile = await requireRole(["ceo"]);

  if (!password.trim()) {
    return { ok: false, error: "Enter your account password." };
  }

  if (!isSupabaseConfigured) {
    return {
      ok: false,
      error: "Reset Data only works when Supabase is connected.",
    };
  }

  const email = profile.email?.trim();
  if (!email) {
    return { ok: false, error: "Could not verify your account email." };
  }

  const authClient = await createServerSupabaseClient();
  const { error: authError } = await authClient.auth.signInWithPassword({
    email,
    password,
  });
  if (authError) {
    return { ok: false, error: "Incorrect password." };
  }

  const supabase = await getSupabase();
  if (!supabase) {
    return { ok: false, error: "Supabase is not available." };
  }

  let moved = 0;

  try {
    const bookings = await getBookings();
    moved += await moveMany(
      bookings.map((row) => ({
        entity_type: "booking" as const,
        entity_id: row.id,
        label: `${row.booking_id} · ${row.client_name || "—"} · ${row.route || "—"}`,
        payload: row,
      }))
    );

    const invoiceHeads = await getInvoices();
    for (const head of invoiceHeads) {
      const row = (await getInvoice(head.id)) ?? head;
      await addToRecycleBin({
        entity_type: "invoice",
        entity_id: row.id,
        label: `${row.invoice_no} · ${row.client_name || "—"} · ${row.airline || "—"}`,
        payload: row,
      });
      moved += 1;
    }

    const payments = await getPaymentInvoices();
    moved += await moveMany(
      payments.map((row) => ({
        entity_type: "payment_invoice" as const,
        entity_id: row.id,
        label: `${row.receipt_no} · ${row.received_from || "—"} · ${row.amount}`,
        payload: row,
      }))
    );

    const hotels = await getHotelBookings();
    moved += await moveMany(
      hotels.map((row) => ({
        entity_type: "hotel_booking" as const,
        entity_id: row.id,
        label: `${row.booking_code} · ${row.lead_guest || "—"} · ${row.hotel_name || "—"}`,
        payload: row,
      }))
    );

    const visas = await getVisaCases();
    moved += await moveMany(
      visas.map((row) => ({
        entity_type: "visa_case" as const,
        entity_id: row.id,
        label: `${row.visa_id} · ${row.client_name || "—"} · ${row.destination_country || "—"}`,
        payload: row,
      }))
    );

    const suppliers = await getSuppliers();
    moved += await moveMany(
      suppliers.map((row) => ({
        entity_type: "supplier" as const,
        entity_id: row.id,
        label: `${row.supplier_code} · ${row.name || "—"}`,
        payload: row,
      }))
    );

    const supplierHeads = await getSupplierInvoices();
    for (const head of supplierHeads) {
      const row = (await getSupplierInvoice(head.id)) ?? head;
      await addToRecycleBin({
        entity_type: "supplier_invoice",
        entity_id: row.id,
        label: `${row.invoice_id} · ${row.supplier || "—"} · ${row.invoice_usd}`,
        payload: row,
      });
      moved += 1;
    }

    const receipts = await getSupplierPaymentReceipts();
    moved += await moveMany(
      receipts.map((row) => ({
        entity_type: "supplier_receipt" as const,
        entity_id: row.id,
        label: `${row.receipt_no} · ${row.supplier || "—"} · ${row.amount}`,
        payload: row,
      }))
    );

    const expenses = await getExpenses();
    moved += await moveMany(
      expenses.map((row) => ({
        entity_type: "expense" as const,
        entity_id: row.id,
        label: `${row.description || "Expense"} · ${row.amount} ${row.currency}`,
        payload: row,
      }))
    );

    const deposits = await getFinanceDeposits();
    moved += await moveMany(
      deposits.map((row) => ({
        entity_type: "finance_deposit" as const,
        entity_id: row.id,
        label: `Deposit · ${row.brought_by || "—"} · ${row.amount} ${row.currency}`,
        payload: row,
      }))
    );
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to move data to Recycle Bin.",
    };
  }

  // Clear live tables (recycle_bin is kept so items can be restored)
  for (const table of CLEAR_TABLES_BY_ID) {
    const { error } = await supabase
      .from(table)
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) {
      if (/does not exist|Could not find the table/i.test(error.message)) {
        continue;
      }
      return {
        ok: false,
        error: `Failed clearing ${table}: ${error.message}`,
      };
    }
  }

  {
    const { error } = await supabase
      .from("airline_policies")
      .delete()
      .neq("airline", "");
    if (
      error &&
      !/does not exist|Could not find the table/i.test(error.message)
    ) {
      return {
        ok: false,
        error: `Failed clearing airline_policies: ${error.message}`,
      };
    }
  }

  return { ok: true, moved };
}
