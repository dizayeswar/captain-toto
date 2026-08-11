"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SERVICE_TYPES,
  CURRENCIES,
  SUPPLIER_INVOICE_STATUSES,
  SUPPLIER_PAYMENT_STATUSES,
} from "@/lib/lists";
import { formatCurrency } from "@/lib/format";
import {
  filterSupplierLinkOptions,
  type SupplierLinkOption,
} from "@/lib/supplierLinks";
import type { SupplierInvoice, SupplierInvoiceLine } from "@/lib/types";
import { Card, Button } from "./ui";
import AmountInput from "./AmountInput";

export type { SupplierLinkOption };

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  invoice?: SupplierInvoice;
  suppliers: string[];
  linkOptions?: SupplierLinkOption[];
  submitLabel?: string;
};

const labelCls = "mb-1 block text-xs font-medium text-slate-600";
const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

function blankLine(): SupplierInvoiceLine {
  return {
    service_type: "Ticket",
    booking_ref: "",
    description: "",
    amount: 0,
    client_name: "",
    pnr: "",
    route: "",
    issue_date: "",
    notes: "",
  };
}

function optionToLine(opt: SupplierLinkOption): SupplierInvoiceLine {
  return {
    service_type: opt.service_type,
    booking_ref: opt.ref,
    description: opt.description,
    amount: opt.amount,
    client_name: opt.client_name,
    pnr: opt.pnr,
    route: opt.route,
    issue_date: opt.issue_date,
    notes: "",
  };
}

export default function SupplierInvoiceForm({
  action,
  invoice,
  suppliers,
  linkOptions = [],
  submitLabel = "Save Supplier Invoice",
}: Props) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  const [lines, setLines] = useState<SupplierInvoiceLine[]>(
    invoice?.lines?.length ? invoice.lines : [blankLine()]
  );
  const [paidUsd, setPaidUsd] = useState<number>(invoice?.paid_usd ?? 0);
  const [refundUsd, setRefundUsd] = useState<number>(invoice?.refund_usd ?? 0);
  const [linkPick, setLinkPick] = useState("");
  const [supplier, setSupplier] = useState(
    invoice?.supplier ?? suppliers[0] ?? ""
  );
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [fillMessage, setFillMessage] = useState("");

  const invoiceAmount = lines.reduce((s, l) => s + (Number(l.amount) || 0), 0);
  const netPaid = paidUsd - refundUsd;
  const outstanding = invoiceAmount - netPaid;

  const filteredLinks = useMemo(() => {
    if (!supplier) return linkOptions;
    const s = supplier.trim().toLowerCase();
    return linkOptions.filter((o) => o.supplier.trim().toLowerCase() === s);
  }, [linkOptions, supplier]);

  function updateLine(i: number, patch: Partial<SupplierInvoiceLine>) {
    setLines((prev) =>
      prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l))
    );
  }

  function addFromLink(ref: string) {
    if (!ref) return;
    const opt = linkOptions.find((o) => o.ref === ref);
    if (!opt) return;
    setLines((prev) => {
      if (prev.some((l) => l.booking_ref === opt.ref)) return prev;
      return [
        ...prev.filter(
          (l) =>
            l.booking_ref ||
            l.description ||
            l.amount ||
            l.client_name ||
            l.route
        ),
        optionToLine(opt),
      ];
    });
    setLinkPick("");
    setFillMessage("");
  }

  function fillFromSupplierAndDates() {
    if (!supplier) {
      setFillMessage("Select a supplier first.");
      return;
    }
    if (!dateFrom || !dateTo) {
      setFillMessage("Set both Date from and Date to.");
      return;
    }
    if (dateFrom > dateTo) {
      setFillMessage("Date from must be on or before Date to.");
      return;
    }

    const matched = filterSupplierLinkOptions(
      linkOptions,
      supplier,
      dateFrom,
      dateTo
    );

    if (matched.length === 0) {
      setLines([blankLine()]);
      setFillMessage(
        `No ticket / hotel / visa found for ${supplier} between ${dateFrom} and ${dateTo}.`
      );
      return;
    }

    setLines(matched.map(optionToLine));
    const tickets = matched.filter((m) => m.service_type === "Ticket").length;
    const hotels = matched.filter((m) => m.service_type === "Hotel").length;
    const visas = matched.filter((m) => m.service_type === "Visa").length;
    setFillMessage(
      `Filled ${matched.length} line(s): ${tickets} ticket, ${hotels} hotel, ${visas} visa.`
    );
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="lines" value={JSON.stringify(lines)} />

      <Card className="p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Invoice header
        </h2>
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
              value={supplier}
              onChange={(e) => {
                setSupplier(e.target.value);
                setFillMessage("");
              }}
              className={inputCls}
            >
              {suppliers.length === 0 ? (
                <option value="">No suppliers</option>
              ) : (
                suppliers.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))
              )}
            </select>
          </div>
          <div>
            <label className={labelCls}>Date from</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setFillMessage("");
              }}
              className={inputCls}
            />
            <p className="mt-1 text-xs text-slate-400">
              Booking / check-in / case date start
            </p>
          </div>
          <div>
            <label className={labelCls}>Date to</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setFillMessage("");
              }}
              className={inputCls}
            />
            <p className="mt-1 text-xs text-slate-400">Inclusive end date</p>
          </div>
          <div className="flex flex-col justify-end gap-2">
            <button
              type="button"
              onClick={fillFromSupplierAndDates}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Auto-fill line items
            </button>
            <p className="text-[11px] leading-snug text-slate-500">
              Loads all tickets, hotels &amp; visas for this supplier in the
              date range.
            </p>
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
        {fillMessage ? (
          <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
            {fillMessage}
          </p>
        ) : null}
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Service line items
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Ticket lines use ticket cost only (service fee is not included).
            </p>
          </div>
          {filteredLinks.length > 0 && (
            <div className="flex items-end gap-2">
              <div>
                <label className={labelCls}>Add one booking / case</label>
                <select
                  value={linkPick}
                  onChange={(e) => addFromLink(e.target.value)}
                  className={`${inputCls} min-w-[240px]`}
                >
                  <option value="">— pick to add —</option>
                  {filteredLinks.map((o) => (
                    <option key={`${o.service_type}-${o.ref}`} value={o.ref}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {lines.map((line, i) => (
            <div
              key={i}
              className="space-y-3 rounded-xl border border-slate-200 p-4"
            >
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className={labelCls}>Service</label>
                  <select
                    value={line.service_type}
                    onChange={(e) =>
                      updateLine(i, { service_type: e.target.value })
                    }
                    className={inputCls}
                  >
                    {SERVICE_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>ID / Ref</label>
                  <input
                    value={line.booking_ref}
                    onChange={(e) =>
                      updateLine(i, { booking_ref: e.target.value })
                    }
                    placeholder="CT-0001 / CTH-… / CTV-…"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Issue Date</label>
                  <input
                    type="date"
                    value={line.issue_date || ""}
                    onChange={(e) =>
                      updateLine(i, { issue_date: e.target.value })
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Amount (cost) $</label>
                  <AmountInput
                    value={line.amount}
                    onChange={(amount) => updateLine(i, { amount })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Name</label>
                  <input
                    value={line.client_name}
                    onChange={(e) =>
                      updateLine(i, { client_name: e.target.value })
                    }
                    dir="auto"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>PNR / Confirmation</label>
                  <input
                    value={line.pnr}
                    onChange={(e) => updateLine(i, { pnr: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Route / Destination</label>
                  <input
                    value={line.route}
                    onChange={(e) => updateLine(i, { route: e.target.value })}
                    placeholder="EBL - CGK or city"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Description / Notes</label>
                  <input
                    value={line.description}
                    onChange={(e) =>
                      updateLine(i, { description: e.target.value })
                    }
                    dir="auto"
                    className={inputCls}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setLines((prev) =>
                    prev.length === 1
                      ? [blankLine()]
                      : prev.filter((_, idx) => idx !== i)
                  )
                }
                className="text-sm font-medium text-red-600 hover:underline"
              >
                Remove line
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setLines((prev) => [...prev, blankLine()])}
          className="mt-4 text-sm font-semibold text-brand hover:underline"
        >
          + Add line
        </button>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Payment to supplier
        </h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelCls}>Paid (USD)</label>
            <AmountInput
              name="paid_usd"
              value={paidUsd}
              onChange={setPaidUsd}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Refund from supplier (USD)</label>
            <AmountInput
              name="refund_usd"
              value={refundUsd}
              onChange={setRefundUsd}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Invoice Status</label>
            <select
              name="invoice_status"
              defaultValue={
                invoice?.invoice_status ?? SUPPLIER_INVOICE_STATUSES[0]
              }
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
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Invoice total (lines)
            </p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatCurrency(invoiceAmount)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Net paid to supplier
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
