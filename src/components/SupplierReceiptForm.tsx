"use client";

import { useRouter } from "next/navigation";
import type { SupplierPaymentReceipt } from "@/lib/types";
import { Card, Button } from "./ui";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  receipt?: SupplierPaymentReceipt;
  suppliers: string[];
  submitLabel?: string;
};

const labelCls = "mb-1 block text-xs font-medium text-slate-600";
const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function SupplierReceiptForm({
  action,
  receipt,
  suppliers,
  submitLabel = "Save Receipt",
}: Props) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="mx-auto max-w-xl space-y-6">
      <Card className="p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Supplier payment receipt
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls}>Receipt ID</label>
            <input
              type="text"
              value={receipt?.receipt_no ?? "Auto (SPR-####)"}
              disabled
              className={`${inputCls} bg-slate-50 text-slate-500`}
            />
          </div>
          <div>
            <label className={labelCls}>Date *</label>
            <input
              type="date"
              name="receipt_date"
              required
              defaultValue={receipt?.receipt_date ?? today}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Amount ($) *</label>
            <input
              type="number"
              name="amount"
              required
              min={0}
              step="0.01"
              defaultValue={receipt?.amount ?? 0}
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Supplier</label>
            <select
              name="supplier"
              defaultValue={receipt?.supplier ?? suppliers[0] ?? ""}
              className={inputCls}
            >
              {suppliers.length === 0 ? (
                <option value="">—</option>
              ) : (
                suppliers.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Signature</label>
            <input
              type="text"
              name="signature"
              defaultValue={receipt?.signature ?? ""}
              placeholder="Name of person signing (optional)"
              dir="auto"
              className={inputCls}
            />
            <p className="mt-1 text-xs text-slate-400">
              Shown on the printed A6 receipt above the signature line.
            </p>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Notes</label>
            <input
              type="text"
              name="notes"
              defaultValue={receipt?.notes ?? ""}
              dir="auto"
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
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </Card>
    </form>
  );
}
