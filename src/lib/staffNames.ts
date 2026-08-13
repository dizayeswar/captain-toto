import { listProfiles } from "./auth";
import { STAFF as FALLBACK_STAFF } from "./lists";
import { TOTO_BALANCE_PAID_BY } from "./financeConstants";

/** Real user display names for staff dropdowns (falls back to legacy lists). */
export async function getStaffNames(): Promise<string[]> {
  const profiles = await listProfiles();
  const names = profiles
    .map((p) => p.full_name?.trim() || p.email?.split("@")[0] || "")
    .filter(Boolean);
  const unique = [...new Set(names)].sort((a, b) => a.localeCompare(b));
  if (unique.length > 0) return unique;
  return [...FALLBACK_STAFF];
}

/** Paid-by options: ToTo Balance + staff names. */
export async function getExpensePaidByOptions(): Promise<string[]> {
  const staff = await getStaffNames();
  return [TOTO_BALANCE_PAID_BY, ...staff.filter((n) => n !== TOTO_BALANCE_PAID_BY)];
}

/** Brought-by options for deposits. */
export async function getBroughtByOptions(): Promise<string[]> {
  const staff = await getStaffNames();
  return [...staff, "Other"].filter(
    (n, i, arr) => arr.indexOf(n) === i
  );
}
