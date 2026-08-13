"use client";

import { CURRENCIES } from "@/lib/lists";
import type { FinanceDeposit } from "@/lib/types";
import { Button, Card } from "./ui";
import AmountInput from "./AmountInput";

const labelCls = "mb-1 block text-xs font-medium text-slate-600";
const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  deposit?: FinanceDeposit;
  broughtByOptions?: string[];
  submitLabel?: string;
  title?: string;
  description?: string;
};

export default function FinanceDepositForm({
  action,
  deposit,
  broughtByOptions = ["Osman", "Sherwani", "Ali", "Other"],
  submitLabel,
  title,
  description,
}: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const isEdit = Boolean(deposit);

  return (
    <Card className="p-6">
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-slate-500">
        {title ?? (isEdit ? "Edit deposit" : "Add to balance")}
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        {description ??
          (isEdit
            ? "Update this cash deposit. Only expenses paid by ToTo Balance deduct from cash."
            : "Record cash brought in by anyone (who / date / amount). Only expenses with Paid by = ToTo Balance deduct from this cash.")}
      </p>
      <form
        action={action}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <div>
          <label className={labelCls}>Date *</label>
          <input
            type="date"
            name="deposit_date"
            required
            defaultValue={deposit?.deposit_date ?? today}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Brought by *</label>
          <input
            type="text"
            name="brought_by"
            required
            list="brought-by-list"
            defaultValue={deposit?.brought_by ?? broughtByOptions[0]}
            placeholder="Name"
            className={inputCls}
          />
          <datalist id="brought-by-list">
            {broughtByOptions.map((n) => (
              <option key={n} value={n} />
            ))}
          </datalist>
        </div>
        <div>
          <label className={labelCls}>Amount *</label>
          <AmountInput
            name="amount"
            required
            defaultValue={deposit?.amount ?? 0}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Currency</label>
          <select
            name="currency"
            defaultValue={deposit?.currency ?? "IQD"}
            className={inputCls}
          >
            {CURRENCIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button type="submit" variant="primary">
            {submitLabel ?? (isEdit ? "Save changes" : "Add balance")}
          </Button>
        </div>
        <div className="sm:col-span-2 lg:col-span-5">
          <label className={labelCls}>Notes</label>
          <input
            type="text"
            name="notes"
            dir="auto"
            defaultValue={deposit?.notes ?? ""}
            placeholder="Optional note"
            className={inputCls}
          />
        </div>
      </form>
    </Card>
  );
}
