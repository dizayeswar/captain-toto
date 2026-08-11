import { getSupabase } from "./supabase";
import { MONTH_NAMES } from "./lists";
import { addToRecycleBin } from "./recycleBin";
import type { Expense, ExpenseInput } from "./types";

const TABLE = "expenses";

const demoStore: Expense[] = [
  {
    id: "demo-exp-1",
    expense_date: "2026-08-01",
    category: "Supplies",
    description: "Water",
    amount: 15000,
    currency: "IQD",
    payment_method: "Cash",
    paid_by: "ToTo Balance",
    receipt_ref: "",
    notes: "",
    owe_to_staff: false,
  },
];

export async function getExpenses(): Promise<Expense[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return [...demoStore].sort((a, b) =>
      b.expense_date.localeCompare(a.expense_date)
    );
  }
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("expense_date", { ascending: false });
  if (error || !data) return [];
  return (data as Expense[]).map((e) => ({
    ...e,
    owe_to_staff: Boolean(e.owe_to_staff),
  }));
}

export async function getExpense(id: string): Promise<Expense | null> {
  const supabase = getSupabase();
  if (!supabase) return demoStore.find((e) => e.id === id) ?? null;
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as Expense;
}

export async function createExpense(input: ExpenseInput): Promise<Expense> {
  const supabase = getSupabase();
  if (!supabase) {
    const row: Expense = { id: `demo-exp-${Date.now()}`, ...input };
    demoStore.push(row);
    return row;
  }
  const { data, error } = await supabase
    .from(TABLE)
    .insert(input)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as Expense;
}

export async function updateExpense(
  id: string,
  input: ExpenseInput
): Promise<Expense> {
  const supabase = getSupabase();
  if (!supabase) {
    const idx = demoStore.findIndex((e) => e.id === id);
    if (idx < 0) throw new Error("Expense not found");
    demoStore[idx] = { ...demoStore[idx], ...input, id };
    return demoStore[idx];
  }
  const { data, error } = await supabase
    .from(TABLE)
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as Expense;
}

export async function deleteExpense(id: string): Promise<void> {
  const row = await getExpense(id);
  if (!row) return;
  await addToRecycleBin({
    entity_type: "expense",
    entity_id: id,
    label: `${row.description || "Expense"} · ${row.amount} ${row.currency}`,
    payload: row,
  });

  const supabase = getSupabase();
  if (!supabase) {
    const idx = demoStore.findIndex((e) => e.id === id);
    if (idx >= 0) demoStore.splice(idx, 1);
    return;
  }
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function restoreExpense(row: Expense): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    if (!demoStore.some((e) => e.id === row.id)) demoStore.push(row);
    return;
  }
  const { error } = await supabase.from(TABLE).insert(row);
  if (error) throw new Error(error.message);
}

export type ExpenseGroup = {
  key: string;
  count: number;
  usd: number;
  iqd: number;
};

export type ExpenseSummary = {
  totalUsd: number;
  totalIqd: number;
  count: number;
  byMonth: ExpenseGroup[];
  byCategory: ExpenseGroup[];
};

export function summarizeExpenses(rows: Expense[]): ExpenseSummary {
  const byMonthMap = new Map<string, ExpenseGroup>();
  const byCatMap = new Map<string, ExpenseGroup>();
  let totalUsd = 0;
  let totalIqd = 0;

  for (const e of rows) {
    const amount = Number(e.amount) || 0;
    if (e.currency === "IQD") totalIqd += amount;
    else totalUsd += amount;

    const d = new Date(e.expense_date);
    const monthKey = Number.isNaN(d.getTime())
      ? "—"
      : `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    const m = byMonthMap.get(monthKey) ?? {
      key: monthKey,
      count: 0,
      usd: 0,
      iqd: 0,
    };
    m.count += 1;
    if (e.currency === "IQD") m.iqd += amount;
    else m.usd += amount;
    byMonthMap.set(monthKey, m);

    const cat = e.category || "—";
    const c = byCatMap.get(cat) ?? { key: cat, count: 0, usd: 0, iqd: 0 };
    c.count += 1;
    if (e.currency === "IQD") c.iqd += amount;
    else c.usd += amount;
    byCatMap.set(cat, c);
  }

  return {
    totalUsd,
    totalIqd,
    count: rows.length,
    byMonth: [...byMonthMap.values()],
    byCategory: [...byCatMap.values()].sort((a, b) =>
      a.key.localeCompare(b.key)
    ),
  };
}
