"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  INVOICE_AIRLINES,
  RESERVATION_STATUSES,
  TRAVEL_CLASSES,
  BAGGAGE_OPTIONS,
} from "@/lib/lists";
import type {
  Invoice,
  InvoicePassenger,
  InvoiceSegment,
} from "@/lib/types";
import { Card, Button } from "./ui";

export type BookingOption = {
  booking_id: string;
  client_name: string;
  airline: string;
  route: string;
  total_paid: number;
};

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  invoice?: Invoice;
  bookings: BookingOption[];
  submitLabel?: string;
};

const labelCls = "mb-1 block text-xs font-medium text-slate-600";
const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

function blankPassenger(): InvoicePassenger {
  return {
    full_name: "",
    passport_no: "",
    nationality: "",
    date_of_birth: "",
    ticket_no: "",
    notes: "",
  };
}

function blankSegment(airline: string): InvoiceSegment {
  return {
    seg_no: 0,
    airline,
    flight_no: "",
    route: "",
    departure: "",
    arrival: "",
    travel_class: "Economy",
    baggage: "30 KG",
    notes: "",
  };
}

export default function InvoiceForm({
  action,
  invoice,
  bookings,
  submitLabel = "Save Invoice",
}: Props) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  const [bookingId, setBookingId] = useState(invoice?.booking_id ?? "");
  const [airline, setAirline] = useState(invoice?.airline ?? INVOICE_AIRLINES[0]);
  const [clientName, setClientName] = useState(invoice?.client_name ?? "");
  const [passengers, setPassengers] = useState<InvoicePassenger[]>(
    invoice?.passengers?.length ? invoice.passengers : [blankPassenger()]
  );
  const [segments, setSegments] = useState<InvoiceSegment[]>(
    invoice?.segments?.length
      ? invoice.segments
      : [blankSegment(invoice?.airline ?? INVOICE_AIRLINES[0])]
  );

  function onBookingChange(value: string) {
    setBookingId(value);
    const b = bookings.find((x) => x.booking_id === value);
    if (!b) return;

    // Always pull client + airline from the booking when selected.
    if (b.client_name) setClientName(b.client_name);
    if (b.airline) setAirline(b.airline);

    // Prefill first passenger name if still blank.
    setPassengers((prev) => {
      const next = [...prev];
      if (next[0] && !next[0].full_name.trim() && b.client_name) {
        next[0] = { ...next[0], full_name: b.client_name };
      }
      return next;
    });

    // Prefill first segment route + airline if still blank.
    setSegments((prev) => {
      const next = [...prev];
      if (next[0]) {
        next[0] = {
          ...next[0],
          airline: next[0].airline || b.airline || airline,
          route: next[0].route || b.route || "",
        };
      }
      return next;
    });
  }

  function updatePassenger(i: number, patch: Partial<InvoicePassenger>) {
    setPassengers((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p))
    );
  }
  function updateSegment(i: number, patch: Partial<InvoiceSegment>) {
    setSegments((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s))
    );
  }

  return (
    <form action={action}>
      {/* Serialized child rows */}
      <input type="hidden" name="passengers" value={JSON.stringify(passengers)} />
      <input type="hidden" name="segments" value={JSON.stringify(segments)} />
      <input type="hidden" name="booking_id" value={bookingId} />
      <input type="hidden" name="airline" value={airline} />
      <input type="hidden" name="client_name" value={clientName} />

      {/* Invoice header */}
      <Card className="p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Invoice Details
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
            <label className={labelCls}>Booking ID</label>
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
            <label className={labelCls}>Airline</label>
            <input
              type="text"
              list="invoice-airline-options"
              value={airline}
              onChange={(e) => setAirline(e.target.value)}
              placeholder="Type or pick an airline"
              className={inputCls}
            />
            <datalist id="invoice-airline-options">
              {INVOICE_AIRLINES.map((a) => (
                <option key={a} value={a} />
              ))}
            </datalist>
          </div>

          <div>
            <label className={labelCls}>PNR / Reservation Code</label>
            <input
              type="text"
              name="pnr"
              defaultValue={invoice?.pnr ?? ""}
              placeholder="e.g. FFBUR6"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Reservation Status</label>
            <select
              name="reservation_status"
              defaultValue={invoice?.reservation_status ?? "Issued"}
              className={inputCls}
            >
              {RESERVATION_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Prepared For / Client Name</label>
            <input
              type="text"
              dir="auto"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Client name (any language)"
              className={inputCls}
            />
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
      </Card>

      {/* Passengers */}
      <Card className="mt-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Passengers
          </h2>
          <button
            type="button"
            onClick={() => setPassengers((p) => [...p, blankPassenger()])}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            + Add passenger
          </button>
        </div>

        <div className="space-y-4">
          {passengers.map((p, i) => (
            <div
              key={i}
              className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-2 lg:grid-cols-3"
            >
              <div className="lg:col-span-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  Passenger {i + 1}
                </span>
                {passengers.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setPassengers((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div>
                <label className={labelCls}>Full Name</label>
                <input
                  dir="auto"
                  value={p.full_name}
                  onChange={(e) => updatePassenger(i, { full_name: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Passport No.</label>
                <input
                  value={p.passport_no}
                  onChange={(e) =>
                    updatePassenger(i, { passport_no: e.target.value })
                  }
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Nationality</label>
                <input
                  value={p.nationality}
                  onChange={(e) =>
                    updatePassenger(i, { nationality: e.target.value })
                  }
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Date of Birth</label>
                <input
                  type="date"
                  value={p.date_of_birth}
                  onChange={(e) =>
                    updatePassenger(i, { date_of_birth: e.target.value })
                  }
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Ticket No.</label>
                <input
                  value={p.ticket_no}
                  onChange={(e) =>
                    updatePassenger(i, { ticket_no: e.target.value })
                  }
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Notes</label>
                <input
                  value={p.notes}
                  onChange={(e) => updatePassenger(i, { notes: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Flight segments */}
      <Card className="mt-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Flight Segments
          </h2>
          <button
            type="button"
            onClick={() => setSegments((s) => [...s, blankSegment(airline)])}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            + Add segment
          </button>
        </div>

        <div className="space-y-4">
          {segments.map((s, i) => (
            <div
              key={i}
              className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-2 lg:grid-cols-3"
            >
              <div className="lg:col-span-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  Segment {i + 1}
                </span>
                {segments.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setSegments((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div>
                <label className={labelCls}>Airline</label>
                <input
                  type="text"
                  list="segment-airline-options"
                  value={s.airline}
                  onChange={(e) => updateSegment(i, { airline: e.target.value })}
                  placeholder="Type or pick"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Flight No.</label>
                <input
                  value={s.flight_no}
                  onChange={(e) => updateSegment(i, { flight_no: e.target.value })}
                  placeholder="e.g. EK - 2071"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Route</label>
                <input
                  value={s.route}
                  onChange={(e) => updateSegment(i, { route: e.target.value })}
                  placeholder="e.g. EBL - DXB"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Departure</label>
                <input
                  type="datetime-local"
                  value={s.departure}
                  onChange={(e) => updateSegment(i, { departure: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Arrival</label>
                <input
                  type="datetime-local"
                  value={s.arrival}
                  onChange={(e) => updateSegment(i, { arrival: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Class</label>
                <select
                  value={s.travel_class}
                  onChange={(e) =>
                    updateSegment(i, { travel_class: e.target.value })
                  }
                  className={inputCls}
                >
                  {TRAVEL_CLASSES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Baggage</label>
                <select
                  value={s.baggage}
                  onChange={(e) => updateSegment(i, { baggage: e.target.value })}
                  className={inputCls}
                >
                  {BAGGAGE_OPTIONS.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="lg:col-span-2">
                <label className={labelCls}>Notes</label>
                <input
                  value={s.notes}
                  onChange={(e) => updateSegment(i, { notes: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <datalist id="segment-airline-options">
        {INVOICE_AIRLINES.map((a) => (
          <option key={a} value={a} />
        ))}
      </datalist>

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
    </form>
  );
}
