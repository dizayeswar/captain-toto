/** Client-safe finance constants (no Supabase imports). */

/** Expenses with this Paid By value deduct from cash balance. */
export const TOTO_BALANCE_PAID_BY = "ToTo Balance";

export const BALANCE_BROUGHT_BY = [
  "Osman",
  "Sherwani",
  "Ali",
  "Staff1",
  "Other",
] as const;

export function isPaidFromTotoBalance(paidBy: string): boolean {
  return (paidBy || "").trim() === TOTO_BALANCE_PAID_BY;
}
