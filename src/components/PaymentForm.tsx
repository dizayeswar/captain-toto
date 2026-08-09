"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PAYER_TYPES, STAFF } from "@/lib/lists";
import { formatCurrency } from "@/lib/format";
import type { PaymentInvoice } from "@/lib/types";
import { Card, Button } from "./ui";

export type PaymentBookingOption = {
  booking_id: string;
  client_name: string;
  total_paid: number;
  route: string;
  airline: string;
};

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  receipt?: PaymentInvoice;
  bookings: PaymentBookingOption[];
  submitLabel?: string;
  initialBookingId?: string;
};

const labelCls = "mb-1 block text-xs font-medium text-slate-600";
const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function PaymentForm({
  action,
  receipt,
  bookings,
  submitLabel = "Save Payment Invoice",
  initialBookingId,
}: Props) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  // When arriving from a booking (no existing receipt), pre-fill from it.
  const prefill =
    !receipt && initialBookingId
      ? bookings.find((b) => b.booking_id === initialBookingId)
      : undefined;

  const [bookingId, setBookingId] = useState(
    receipt?.booking_id ?? prefill?.booking_id ?? ""
  );
  const [receivedFrom, setReceivedFrom] = useState(
    receipt?.received_from ?? prefill?.client_name ?? ""
  );
  const [amount, setAmount] = useState<number>(
    receipt?.amount ?? prefill?.total_paid ?? 0
  );
  const [forText, setForText] = useState(
    receipt?.for_text ??
      (prefill ? `Flight ticket ${prefill.route} (${prefill.airline})` : "")
  );

  function onBookingChange(value: string) {
    setBookingId(value);
    const b = bookings.find((x) => x.booking_id === value);
    if (b) {
      if (!receivedFrom.trim() && b.client_name) setReceivedFrom(b.client_name);
      if (!amount && b.total_paid) setAmount(b.total_paid);
      if (!forText.trim() && b.route) {
        setForText(`Flight ticket ${b.route} (${b.airline})`);
      }
    }
  }

  return (
    <form action={action}>
      <input type="hidden" name="booking_id" value={bookingId} />
      <input type="hidden" name="received_from" value={receivedFrom} />
      <input type="hidden" name="amount" value={amount} />
      <input type="hidden" name="for_text" value={forText} />

      <Card className="p-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
            <label className={labelCls}>Company / Individual</label>
            <select
              name="payer_type"
              defaultValue={receipt?.payer_type ?? PAYER_TYPES[0]}
              className={inputCls}
            >
              {PAYER_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Linked Booking (optional)</label>
            <select
              value={bookingId}
              onChange={(e) => onBookingChange(e.target.value)}
              className={inputCls}
            >
              <option value="">— none —</option>
              {bookings.map((b) => (
                <option key={b.booking_id} value={b.booking_id}>
                  {b.booking_id} — {b.client_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Received From *</label>
            <input
              type="text"
              dir="auto"
              required
              value={receivedFrom}
              onChange={(e) => setReceivedFrom(e.target.value)}
              placeholder="Client name (any language)"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>The Sum Of ($)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Prepared By</label>
            <select
              name="prepared_by"
              defaultValue={receipt?.prepared_by ?? STAFF[0]}
              className={inputCls}
            >
              {STAFF.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className={labelCls}>For (reason / description)</label>
            <input
              type="text"
              dir="auto"
              value={forText}
              onChange={(e) => setForText(e.target.value)}
              placeholder="e.g. Flight ticket EBL - CGK (Emirates)"
              className={inputCls}
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className={labelCls}>Notes</label>
            <input
              type="text"
              name="notes"
              dir="auto"
              defaultValue={receipt?.notes ?? ""}
              className={inputCls}
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Amount received
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {formatCurrency(amount)}
          </p>
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
