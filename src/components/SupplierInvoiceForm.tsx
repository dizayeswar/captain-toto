"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SERVICE_TYPES,
  CURRENCIES,
  SUPPLIER_INVOICE_STATUSES,
  SUPPLIER_PAYMENT_STATUSES,
} from "@/lib/lists";
import { formatCurrency } from "@/lib/format";
import type { SupplierInvoice } from "@/lib/types";
import { Card, Button } from "./ui";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  invoice?: SupplierInvoice;
  suppliers: string[];
  submitLabel?: string;
};

const labelCls = "mb-1 block text-xs font-medium text-slate-600";
const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function SupplierInvoiceForm({
  action,
  invoice,
  suppliers,
  submitLabel = "Save Supplier Invoice",
}: Props) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  const [invoiceAmount, setInvoiceAmount] = useState<number>(
    invoice?.invoice_amount ?? 0
  );
  const [paidUsd, setPaidUsd] = useState<number>(invoice?.paid_usd ?? 0);
  const [refundUsd, setRefundUsd] = useState<number>(invoice?.refund_usd ?? 0);

  const netPaid = paidUsd - refundUsd;
  const outstanding = invoiceAmount - netPaid;

  return (
    <form action={action}>
      <Card className="p-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelCls}>Invoice Date *</label>
            <input
              type="date"
              name="invoice_date"
              required
              defaultValue={invoice?.invoice_date ?? today}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Due Date</label>
            <input
              type="date"
              name="due_date"
              defaultValue={invoice?.due_date ?? ""}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Supplier *</label>
            <select
              name="supplier"
              required
              defaultValue={invoice?.supplier ?? suppliers[0] ?? ""}
              className={inputCls}
            >
              {suppliers.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Supplier Invoice No.</label>
            <input
              type="text"
              name="supplier_invoice_no"
              defaultValue={invoice?.supplier_invoice_no ?? ""}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Booking Ref</label>
            <input
              type="text"
              name="booking_ref"
              defaultValue={invoice?.booking_ref ?? ""}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Service Type</label>
            <select
              name="service_type"
              defaultValue={invoice?.service_type ?? SERVICE_TYPES[0]}
              className={inputCls}
            >
              {SERVICE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Currency</label>
            <select
              name="currency"
              defaultValue={invoice?.currency ?? "USD"}
              className={inputCls}
            >
              {CURRENCIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Invoice Amount *</label>
            <input
              type="number"
              name="invoice_amount"
              min={0}
              step="0.01"
              required
              value={invoiceAmount}
              onChange={(e) => setInvoiceAmount(Number(e.target.value))}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Paid (USD)</label>
            <input
              type="number"
              name="paid_usd"
              min={0}
              step="0.01"
              value={paidUsd}
              onChange={(e) => setPaidUsd(Number(e.target.value))}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Refund (USD)</label>
            <input
              type="number"
              name="refund_usd"
              min={0}
              step="0.01"
              value={refundUsd}
              onChange={(e) => setRefundUsd(Number(e.target.value))}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Invoice Status</label>
            <select
              name="invoice_status"
              defaultValue={invoice?.invoice_status ?? SUPPLIER_INVOICE_STATUSES[0]}
              className={inputCls}
            >
              {SUPPLIER_INVOICE_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Payment Status</label>
            <select
              name="payment_status"
              defaultValue={
                invoice?.payment_status ?? SUPPLIER_PAYMENT_STATUSES[2]
              }
              className={inputCls}
            >
              {SUPPLIER_PAYMENT_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className={labelCls}>Notes</label>
            <input
              type="text"
              name="notes"
              dir="auto"
              defaultValue={invoice?.notes ?? ""}
              className={inputCls}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Invoice amount
            </p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatCurrency(invoiceAmount)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Net paid
            </p>
            <p className="mt-1 text-xl font-bold text-emerald-600">
              {formatCurrency(netPaid)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Outstanding
            </p>
            <p
              className={`mt-1 text-xl font-bold ${
                outstanding > 0 ? "text-amber-600" : "text-slate-900"
              }`}
            >
              {formatCurrency(outstanding)}
            </p>
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
