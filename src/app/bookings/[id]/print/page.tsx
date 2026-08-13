import Link from "next/link";
import { notFound } from "next/navigation";
import { getBooking } from "@/lib/bookings";
import { formatCurrency, formatDate } from "@/lib/format";
import PrintButton from "@/components/PrintButton";
import { DocLetterhead, DocFooter } from "@/components/DocBranding";

export const dynamic = "force-dynamic";

export default async function BookingPrintPage(
  props: PageProps<"/bookings/[id]/print">
) {
  const { id } = await props.params;
  const b = await getBooking(id);
  if (!b) notFound();

  const supplier =
    [b.supplier_name, b.supplier_code].filter(Boolean).join(" · ") || "—";

  return (
    <div className="p-8">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/bookings"
          className="text-sm font-medium text-brand hover:underline"
        >
          ← Back to ticket bookings
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/bookings/${b.id}`}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Edit
          </Link>
          <PrintButton />
        </div>
      </div>

      <div className="print-area mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <DocLetterhead title="Ticket Booking Summary" />

        <div className="grid gap-6 border-b border-slate-200 py-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Client
            </p>
            <p className="mt-1 text-base font-medium text-slate-900" dir="auto">
              {b.client_name || "—"}
            </p>
            <p className="mt-1 text-sm text-slate-600">{b.client_type || "—"}</p>

            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Route
            </p>
            <p className="mt-1 text-base font-medium text-slate-900">
              {b.route || "—"}
            </p>
            <p className="mt-1 text-sm text-slate-600">{b.airline || "—"}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <Meta label="Ticket ID" value={b.booking_id} />
            <Meta
              label="Booking Date"
              value={b.booking_date ? formatDate(b.booking_date) : "—"}
            />
            <Meta label="PNR" value={b.pnr || "—"} />
            <Meta label="Issued" value={b.issued ? "Yes" : "No"} />
            <Meta label="Payment Status" value={b.payment_status || "—"} />
            <Meta label="Payment Method" value={b.payment_method || "—"} />
            <Meta label="Handled By" value={b.handled_by || "—"} />
            <Meta label="Supplier" value={supplier} />
          </div>
        </div>

        <section className="py-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Amounts
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <Amount label="Ticket Cost" value={formatCurrency(b.ticket_cost)} />
            <Amount label="Service Fee" value={formatCurrency(b.service_fee)} />
            <Amount label="Total Paid" value={formatCurrency(b.total_paid)} />
            <Amount label="Profit" value={formatCurrency(b.profit)} />
            <Amount
              label="Debt / Still Owed"
              value={formatCurrency(b.debt)}
              emphasize={b.debt > 0}
            />
          </div>
        </section>

        <DocFooter disclaimer="This document is an internal ticket booking summary for Captain ToTo. It is not a client ticket invoice or payment receipt unless accompanied by those separate documents." />
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
      <p className="text-slate-800" dir="auto">
        {value}
      </p>
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
