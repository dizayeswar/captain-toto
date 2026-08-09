"use client";

import { useRouter } from "next/navigation";
import {
  CURRENCIES,
  EXPENSE_CATEGORIES,
  EXPENSE_PAYMENT_METHODS,
  EXPENSE_PAID_BY,
} from "@/lib/lists";
import type { Expense } from "@/lib/types";
import { Card, Button } from "./ui";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  expense?: Expense;
  submitLabel?: string;
};

const labelCls = "mb-1 block text-xs font-medium text-slate-600";
const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function ExpenseForm({
  action,
  expense,
  submitLabel = "Save Expense",
}: Props) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action}>
      <Card className="p-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelCls}>Date *</label>
            <input
              type="date"
              name="expense_date"
              required
              defaultValue={expense?.expense_date ?? today}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Category</label>
            <select
              name="category"
              defaultValue={expense?.category ?? EXPENSE_CATEGORIES[0]}
              className={inputCls}
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Currency</label>
            <select
              name="currency"
              defaultValue={expense?.currency ?? "USD"}
              className={inputCls}
            >
              {CURRENCIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className={labelCls}>Description *</label>
            <input
              type="text"
              name="description"
              required
              dir="auto"
              defaultValue={expense?.description ?? ""}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Amount *</label>
            <input
              type="number"
              name="amount"
              min={0}
              step="0.01"
              required
              defaultValue={expense?.amount ?? 0}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Payment Method</label>
            <select
              name="payment_method"
              defaultValue={
                expense?.payment_method ?? EXPENSE_PAYMENT_METHODS[0]
              }
              className={inputCls}
            >
              {EXPENSE_PAYMENT_METHODS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Paid By</label>
            <select
              name="paid_by"
              defaultValue={expense?.paid_by ?? EXPENSE_PAID_BY[0]}
              className={inputCls}
            >
              {EXPENSE_PAID_BY.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Receipt Ref</label>
            <input
              type="text"
              name="receipt_ref"
              defaultValue={expense?.receipt_ref ?? ""}
              className={inputCls}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelCls}>Notes</label>
            <input
              type="text"
              name="notes"
              dir="auto"
              defaultValue={expense?.notes ?? ""}
              className={inputCls}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button type="submit" variant="primary">
            {submitLabel}
          </Button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </Card>
    </form>
  );
}
