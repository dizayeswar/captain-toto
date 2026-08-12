import { getSupabase } from "./supabase";
import { addToRecycleBin } from "./recycleBin";
import type { Expense, FinanceDeposit, FinanceDepositInput } from "./types";

const TABLE = "finance_deposits";

const demoStore: FinanceDeposit[] = [];

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

export async function getFinanceDeposits(): Promise<FinanceDeposit[]> {
  const supabase = await getSupabase();
  if (!supabase) {
    return [...demoStore].sort((a, b) =>
      b.deposit_date.localeCompare(a.deposit_date)
    );
  }
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("deposit_date", { ascending: false });
  if (error || !data) return [];
  return data as FinanceDeposit[];
}

export async function createFinanceDeposit(
  input: FinanceDepositInput
): Promise<FinanceDeposit> {
  const row = {
    deposit_date: input.deposit_date,
    brought_by: input.brought_by.trim(),
    amount: Number(input.amount) || 0,
    currency: input.currency || "IQD",
    notes: input.notes.trim(),
  };
  const supabase = await getSupabase();
  if (!supabase) {
    const rec: FinanceDeposit = { id: `demo-dep-${Date.now()}`, ...row };
    demoStore.push(rec);
    return rec;
  }
  const { data, error } = await supabase
    .from(TABLE)
    .insert(row)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as FinanceDeposit;
}

export async function getFinanceDeposit(
  id: string
): Promise<FinanceDeposit | null> {
  const supabase = await getSupabase();
  if (!supabase) return demoStore.find((d) => d.id === id) ?? null;
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as FinanceDeposit;
}

export async function deleteFinanceDeposit(id: string): Promise<void> {
  const row = await getFinanceDeposit(id);
  if (!row) return;
  await addToRecycleBin({
    entity_type: "finance_deposit",
    entity_id: id,
    label: `Deposit · ${row.brought_by || "—"} · ${row.amount} ${row.currency}`,
    payload: row,
  });

  const supabase = await getSupabase();
  if (!supabase) {
    const idx = demoStore.findIndex((d) => d.id === id);
    if (idx >= 0) demoStore.splice(idx, 1);
    return;
  }
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function restoreFinanceDeposit(row: FinanceDeposit): Promise<void> {
  const supabase = await getSupabase();
  if (!supabase) {
    if (!demoStore.some((d) => d.id === row.id)) demoStore.push(row);
    return;
  }
  const { error } = await supabase.from(TABLE).insert(row);
  if (error) throw new Error(error.message);
}

export type FinanceBalance = {
  depositedUsd: number;
  depositedIqd: number;
  /** Spent from ToTo Balance only */
  spentUsd: number;
  spentIqd: number;
  balanceUsd: number;
  balanceIqd: number;
};

export type OwedToPerson = {
  person: string;
  usd: number;
  iqd: number;
  count: number;
};

export type OwedToOthers = {
  totalUsd: number;
  totalIqd: number;
  count: number;
  byPerson: OwedToPerson[];
  expenses: Expense[];
};

export type BalanceActivity = {
  id: string;
  kind: "deposit" | "expense";
  date: string;
  title: string;
  detail: string;
  amount: number;
  currency: string;
  signedAmount: number;
};

export function computeFinanceBalance(
  deposits: FinanceDeposit[],
  expenses: Expense[]
): FinanceBalance {
  let depositedUsd = 0;
  let depositedIqd = 0;
  let spentUsd = 0;
  let spentIqd = 0;

  for (const d of deposits) {
    const a = Number(d.amount) || 0;
    if (d.currency === "IQD") depositedIqd += a;
    else depositedUsd += a;
  }

  // Only expenses paid from ToTo Balance reduce cash
  for (const e of expenses) {
    if (!isPaidFromTotoBalance(e.paid_by)) continue;
    const a = Number(e.amount) || 0;
    if (e.currency === "IQD") spentIqd += a;
    else spentUsd += a;
  }

  return {
    depositedUsd,
    depositedIqd,
    spentUsd,
    spentIqd,
    balanceUsd: depositedUsd - spentUsd,
    balanceIqd: depositedIqd - spentIqd,
  };
}

/** Expenses paid by staff/others with owe_to_staff checked — ToTo must reimburse. */
export function computeOwedToOthers(expenses: Expense[]): OwedToOthers {
  const staffPaid = expenses.filter(
    (e) => !isPaidFromTotoBalance(e.paid_by) && Boolean(e.owe_to_staff)
  );
  const byPersonMap = new Map<string, OwedToPerson>();
  let totalUsd = 0;
  let totalIqd = 0;

  for (const e of staffPaid) {
    const a = Number(e.amount) || 0;
    const person = (e.paid_by || "—").trim() || "—";
    if (e.currency === "IQD") totalIqd += a;
    else totalUsd += a;

    const row = byPersonMap.get(person) ?? {
      person,
      usd: 0,
      iqd: 0,
      count: 0,
    };
    row.count += 1;
    if (e.currency === "IQD") row.iqd += a;
    else row.usd += a;
    byPersonMap.set(person, row);
  }

  return {
    totalUsd,
    totalIqd,
    count: staffPaid.length,
    byPerson: [...byPersonMap.values()].sort((a, b) =>
      a.person.localeCompare(b.person)
    ),
    expenses: [...staffPaid].sort((a, b) =>
      b.expense_date.localeCompare(a.expense_date)
    ),
  };
}

/**
 * Balance timeline: deposits (anyone) + expenses paid from ToTo Balance only.
 * Staff-paid expenses are tracked under "owed to others", not here.
 */
export function buildBalanceActivity(
  deposits: FinanceDeposit[],
  expenses: Expense[]
): BalanceActivity[] {
  const items: BalanceActivity[] = [];

  for (const d of deposits) {
    const amount = Number(d.amount) || 0;
    items.push({
      id: `dep-${d.id}`,
      kind: "deposit",
      date: d.deposit_date,
      title: `Balance in · ${d.brought_by || "—"}`,
      detail: d.notes || "Cash deposited into balance",
      amount,
      currency: d.currency || "IQD",
      signedAmount: amount,
    });
  }

  for (const e of expenses) {
    if (!isPaidFromTotoBalance(e.paid_by)) continue;
    const amount = Number(e.amount) || 0;
    items.push({
      id: `exp-${e.id}`,
      kind: "expense",
      date: e.expense_date,
      title: `${e.category || "Expense"} · ${e.description || "—"}`,
      detail: `Paid by ${e.paid_by || "—"} · ${e.payment_method || "—"}`,
      amount,
      currency: e.currency || "USD",
      signedAmount: -amount,
    });
  }

  return items.sort((a, b) => {
    const byDate = b.date.localeCompare(a.date);
    if (byDate !== 0) return byDate;
    return b.id.localeCompare(a.id);
  });
}
