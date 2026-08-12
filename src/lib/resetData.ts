import { getSupabase, isSupabaseConfigured } from "./supabase";
import { requireRole } from "./auth";
import { createServerSupabaseClient } from "./supabase/server";

/** Operational tables wiped by Reset Data (users/profiles are kept). */
const RESET_TABLES_BY_ID = [
  // Children first where FKs may not cascade
  "invoice_passengers",
  "invoice_segments",
  "supplier_invoice_lines",
  "recycle_bin",
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

export type ResetDataResult = { ok: true } | { ok: false; error: string };

/**
 * Wipe all business data after verifying the CEO's account password.
 * Does not delete login accounts or profiles.
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

  for (const table of RESET_TABLES_BY_ID) {
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

  // airline_policies PK is `airline`, not `id`
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

  return { ok: true };
}
