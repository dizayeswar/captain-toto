"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CURRENCIES,
  EXPENSE_CATEGORIES,
  EXPENSE_PAYMENT_METHODS,
  EXPENSE_PAID_BY,
} from "@/lib/lists";
import { TOTO_BALANCE_PAID_BY } from "@/lib/financeConstants";
import type { Expense } from "@/lib/types";
import { Card, Button } from "./ui";
import AmountInput from "./AmountInput";

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
  const [paidBy, setPaidBy] = useState(
    expense?.paid_by ?? EXPENSE_PAID_BY[0]
  );
  const showOweCheckbox = paidBy !== TOTO_BALANCE_PAID_BY;

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
            <AmountInput
              name="amount"
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
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className={inputCls}
            >
              {EXPENSE_PAID_BY.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          {showOweCheckbox && (
            <div className="md:col-span-2 lg:col-span-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <input
                  type="checkbox"
                  name="owe_to_staff"
                  defaultChecked={Boolean(expense?.owe_to_staff)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand/30"
                />
                <span>
                  <span className="block text-sm font-medium text-slate-800">
                    ToTo owes this person
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-600">
                    Check to list this under “ToTo owes others” for
                    reimbursement. Leave unchecked if {paidBy} paid and ToTo
                    does not owe them.
                  </span>
                </span>
              </label>
            </div>
          )}

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
