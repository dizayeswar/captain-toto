"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CLIENT_TYPES,
  PAYMENT_STATUSES,
  PAYMENT_METHODS,
  STAFF,
  AIRLINES,
  ROUTES,
} from "@/lib/lists";
import { formatCurrency } from "@/lib/format";
import type { Booking } from "@/lib/types";
import { Card, Button } from "./ui";

export type SupplierOption = { code: string; name: string };

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  booking?: Booking;
  suppliers?: SupplierOption[];
  submitLabel?: string;
};

const labelCls = "mb-1 block text-xs font-medium text-slate-600";
const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function BookingForm({
  action,
  booking,
  suppliers = [],
  submitLabel = "Save Booking",
}: Props) {
  const router = useRouter();
  const [ticket, setTicket] = useState(booking?.ticket_cost ?? 0);
  const [fee, setFee] = useState(booking?.service_fee ?? 0);
  const defaultSupplier =
    booking?.supplier_name || suppliers[0]?.name || "";
  const [supplierName, setSupplierName] = useState(defaultSupplier);

  const supplierCode =
    suppliers.find((s) => s.name === supplierName)?.code ??
    booking?.supplier_code ??
    "";
  const total = (Number(ticket) || 0) + (Number(fee) || 0);
  const profit = total - (Number(ticket) || 0);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action}>
      <Card className="p-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelCls}>Date *</label>
            <input
              type="date"
              name="booking_date"
              required
              defaultValue={booking?.booking_date ?? today}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Client Name *</label>
            <input
              type="text"
              name="client_name"
              required
              defaultValue={booking?.client_name ?? ""}
              placeholder="Full name"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Client Type</label>
            <select
              name="client_type"
              defaultValue={booking?.client_type ?? CLIENT_TYPES[0]}
              className={inputCls}
            >
              {CLIENT_TYPES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Route</label>
            <input
              type="text"
              name="route"
              list="route-options"
              defaultValue={booking?.route ?? ""}
              placeholder="e.g. EBL - CGK"
              className={inputCls}
            />
            <datalist id="route-options">
              {ROUTES.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </div>

          <div>
            <label className={labelCls}>Airline</label>
            <input
              type="text"
              name="airline"
              list="airline-options"
              defaultValue={booking?.airline ?? ""}
              placeholder="Type or pick an airline"
              className={inputCls}
            />
            <datalist id="airline-options">
              {AIRLINES.map((a) => (
                <option key={a} value={a} />
              ))}
            </datalist>
          </div>

          <div>
            <label className={labelCls}>Handled By</label>
            <select
              name="handled_by"
              defaultValue={booking?.handled_by ?? STAFF[0]}
              className={inputCls}
            >
              {STAFF.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Ticket Cost ($)</label>
            <input
              type="number"
              name="ticket_cost"
              min={0}
              step="0.01"
              value={ticket}
              onChange={(e) => setTicket(Number(e.target.value))}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Service Fee ($)</label>
            <input
              type="number"
              name="service_fee"
              min={0}
              step="0.01"
              value={fee}
              onChange={(e) => setFee(Number(e.target.value))}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>PNR</label>
            <input
              type="text"
              name="pnr"
              defaultValue={booking?.pnr ?? ""}
              placeholder="e.g. ABC123"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Payment Status</label>
            <select
              name="payment_status"
              defaultValue={booking?.payment_status ?? PAYMENT_STATUSES[1]}
              className={inputCls}
            >
              {PAYMENT_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Payment Method</label>
            <select
              name="payment_method"
              defaultValue={booking?.payment_method ?? PAYMENT_METHODS[0]}
              className={inputCls}
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Supplier</label>
            <select
              name="supplier_name"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className={inputCls}
            >
              {suppliers.length === 0 ? (
                <option value="">No suppliers — add in Suppliers Directory</option>
              ) : (
                suppliers.map((s) => (
                  <option key={s.code} value={s.name}>
                    {s.name}
                  </option>
                ))
              )}
            </select>
            <input type="hidden" name="supplier_code" value={supplierCode} />
            <p className="mt-1 text-xs text-slate-400">Code: {supplierCode || "—"}</p>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              id="issued"
              type="checkbox"
              name="issued"
              defaultChecked={booking?.issued ?? false}
              className="h-4 w-4 rounded border-slate-300 accent-brand"
            />
            <label htmlFor="issued" className="text-sm text-slate-700">
              Ticket issued
            </label>
          </div>
        </div>

        {/* Live computed summary */}
        <div className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Total Paid (auto)
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatCurrency(total)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Profit (auto)
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {formatCurrency(profit)}
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
