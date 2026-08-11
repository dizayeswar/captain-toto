"use client";

import { BALANCE_BROUGHT_BY } from "@/lib/financeBalance";
import { CURRENCIES } from "@/lib/lists";
import { Button, Card } from "./ui";

const labelCls = "mb-1 block text-xs font-medium text-slate-600";
const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
};

export default function FinanceDepositForm({ action }: Props) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Card className="p-6">
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-slate-500">
        Add to balance
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        Record cash brought in (who / date / amount). Expenses deduct from this
        balance automatically.
      </p>
      <form action={action} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className={labelCls}>Date *</label>
          <input
            type="date"
            name="deposit_date"
            required
            defaultValue={today}
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
            defaultValue={BALANCE_BROUGHT_BY[0]}
            placeholder="Name"
            className={inputCls}
          />
          <datalist id="brought-by-list">
            {BALANCE_BROUGHT_BY.map((n) => (
              <option key={n} value={n} />
            ))}
          </datalist>
        </div>
        <div>
          <label className={labelCls}>Amount *</label>
          <input
            type="number"
            name="amount"
            required
            min={0}
            step="0.01"
            defaultValue={0}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Currency</label>
          <select name="currency" defaultValue="IQD" className={inputCls}>
            {CURRENCIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button type="submit" variant="primary" className="w-full">
            Add balance
          </Button>
        </div>
        <div className="sm:col-span-2 lg:col-span-5">
          <label className={labelCls}>Notes</label>
          <input
            type="text"
            name="notes"
            dir="auto"
            placeholder="Optional note"
            className={inputCls}
          />
        </div>
      </form>
    </Card>
  );
}
