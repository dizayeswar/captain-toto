import Link from "next/link";
import { notFound } from "next/navigation";
import { getHotelBooking } from "@/lib/hotels";
import { formatCurrency, formatDate } from "@/lib/format";
import PrintButton from "@/components/PrintButton";
import { DocLetterhead, DocFooter } from "@/components/DocBranding";

export const dynamic = "force-dynamic";

export default async function HotelVoucherPage(
  props: PageProps<"/hotel/bookings/[id]/voucher">
) {
  const { id } = await props.params;
  const b = await getHotelBooking(id);
  if (!b) notFound();

  const location = [b.city, b.destination_country].filter(Boolean).join(", ") || "—";
  const guests = [
    b.adults ? `${b.adults} adult${b.adults === 1 ? "" : "s"}` : null,
    b.children ? `${b.children} child${b.children === 1 ? "" : "ren"}` : null,
    b.infants ? `${b.infants} infant${b.infants === 1 ? "" : "s"}` : null,
  ]
    .filter(Boolean)
    .join(", ") || "—";

  return (
    <div className="p-8">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/hotel/bookings"
          className="text-sm font-medium text-brand hover:underline"
        >
          ← Back to hotel bookings
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/hotel/bookings/${b.id}`}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Edit
          </Link>
          <PrintButton />
        </div>
      </div>

      <div className="print-area mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <DocLetterhead title="Hotel Voucher" />

        <div className="grid gap-6 border-b border-slate-200 py-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Guest
            </p>
            <p className="mt-1 text-base font-medium text-slate-900" dir="auto">
              {b.lead_guest || "—"}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Hotel
            </p>
            <p className="mt-1 text-base font-medium text-slate-900" dir="auto">
              {b.hotel_name || "—"}
            </p>
            <p className="mt-1 text-sm text-slate-600">{location}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <Meta label="Booking Code" value={b.booking_code} />
            <Meta
              label="Confirmation No."
              value={b.hotel_confirmation_no || "—"}
            />
            <Meta
              label="Check-in"
              value={b.check_in ? formatDate(b.check_in) : "—"}
            />
            <Meta
              label="Check-out"
              value={b.check_out ? formatDate(b.check_out) : "—"}
            />
            <Meta label="Nights" value={String(b.nights)} />
            <Meta label="Rooms" value={String(b.rooms)} />
            <Meta label="Room Type" value={b.room_type || "—"} />
            <Meta label="Meal Plan" value={b.meal_plan || "—"} />
            <Meta label="Guests" value={guests} />
            <Meta label="Supplier" value={b.supplier || "—"} />
            <Meta label="Booking Status" value={b.booking_status || "—"} />
            <Meta label="Payment Status" value={b.payment_status || "—"} />
          </div>
        </div>

        <section className="py-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Payment Summary
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <Amount label="Sale" value={formatCurrency(b.total_sale_usd)} />
            <Amount label="Paid" value={formatCurrency(b.net_paid_usd)} />
            <Amount label="Refunded" value={formatCurrency(b.refunded_usd)} />
            <Amount
              label="Cancellation / Ticket Cost"
              value={formatCurrency(b.cancellation_fee_usd)}
            />
            <Amount
              label="Service Fee"
              value={formatCurrency(b.service_fee_usd ?? 0)}
            />
            <Amount
              label="Final Charge"
              value={formatCurrency(b.final_charge_usd)}
            />
            <Amount
              label="Profit"
              value={formatCurrency(b.profit_usd)}
            />
            <Amount
              label="Outstanding"
              value={formatCurrency(b.balance_usd)}
              emphasize
            />
          </div>
        </section>

        {b.notes && (
          <section className="border-t border-slate-200 pt-6">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Notes
            </h3>
            <p className="text-sm text-slate-600" dir="auto">
              {b.notes}
            </p>
          </section>
        )}

        <DocFooter disclaimer="This document confirms hotel accommodation details arranged by Captain ToTo. It is not a payment receipt unless accompanied by a separate payment invoice." />
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="text-slate-800">{value}</p>
    </div>
  );
}

function Amount({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p
        className={`mt-1 text-base font-semibold tabular-nums ${
          emphasize ? "text-amber-700" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
