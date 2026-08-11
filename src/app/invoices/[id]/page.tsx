import Link from "next/link";
import { notFound } from "next/navigation";
import { getInvoice, getPolicyForAirline } from "@/lib/invoices";
import { formatDate, formatDateTime } from "@/lib/format";
import PrintButton from "@/components/PrintButton";
import TicketPrintShell from "@/components/TicketPrintShell";
import { DocLetterhead, DocFooter } from "@/components/DocBranding";

export const dynamic = "force-dynamic";

export default async function InvoiceViewPage(
  props: PageProps<"/invoices/[id]">
) {
  const { id } = await props.params;
  const invoice = await getInvoice(id);
  if (!invoice) notFound();

  const policy = await getPolicyForAirline(invoice.airline);

  return (
    <div className="p-8 print:m-0 print:p-0">
      {/* Toolbar (hidden when printing) */}
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/invoices"
          className="text-sm font-medium text-brand hover:underline"
        >
          ← Back to invoices
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/invoices/${invoice.id}/edit`}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Edit
          </Link>
          <PrintButton />
        </div>
      </div>

      <TicketPrintShell
        footer={
          <DocFooter
            compact
            disclaimer="This document confirms ticket and travel information only. Payment receipts are issued separately."
          />
        }
      >
        <DocLetterhead title="Ticket Invoice" compact />

        {/* Meta */}
        <div className="grid gap-4 border-b border-slate-200 py-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Prepared For
            </p>
            <p
              className="mt-0.5 text-base font-medium text-slate-900"
              dir="auto"
            >
              {invoice.client_name || "—"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            <Meta label="Invoice No." value={invoice.invoice_no} />
            <Meta
              label="Invoice Date"
              value={formatDate(invoice.invoice_date)}
            />
            <Meta label="Booking ID" value={invoice.booking_id || "—"} />
            <Meta label="Airline" value={invoice.airline || "—"} />
            <Meta label="PNR / Code" value={invoice.pnr || "—"} />
            <Meta label="Status" value={invoice.reservation_status} />
          </div>
        </div>

        {/* Passengers */}
        <section className="py-4">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Passengers
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="py-1.5 pr-3 font-semibold">Name</th>
                <th className="py-1.5 pr-3 font-semibold">Passport</th>
                <th className="py-1.5 pr-3 font-semibold">Nationality</th>
                <th className="py-1.5 pr-3 font-semibold">Date of Birth</th>
                <th className="py-1.5 font-semibold">Ticket No.</th>
              </tr>
            </thead>
            <tbody>
              {invoice.passengers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-2 text-slate-400">
                    No passengers listed.
                  </td>
                </tr>
              ) : (
                invoice.passengers.map((p, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td
                      className="py-1.5 pr-3 font-medium text-slate-800"
                      dir="auto"
                    >
                      {p.full_name}
                    </td>
                    <td className="py-1.5 pr-3 text-slate-700">
                      {p.passport_no}
                    </td>
                    <td className="py-1.5 pr-3 text-slate-700">
                      {p.nationality}
                    </td>
                    <td className="py-1.5 pr-3 text-slate-700">
                      {p.date_of_birth ? formatDate(p.date_of_birth) : "—"}
                    </td>
                    <td className="py-1.5 text-slate-700">{p.ticket_no}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* Flight segments */}
        <section className="py-4">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Flight Itinerary
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="py-1.5 pr-3 font-semibold">#</th>
                <th className="py-1.5 pr-3 font-semibold">Flight</th>
                <th className="py-1.5 pr-3 font-semibold">Route</th>
                <th className="py-1.5 pr-3 font-semibold">Departure</th>
                <th className="py-1.5 pr-3 font-semibold">Arrival</th>
                <th className="py-1.5 pr-3 font-semibold">Class</th>
                <th className="py-1.5 font-semibold">Baggage</th>
              </tr>
            </thead>
            <tbody>
              {invoice.segments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-2 text-slate-400">
                    No flight segments listed.
                  </td>
                </tr>
              ) : (
                invoice.segments.map((s, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-1.5 pr-3 text-slate-700">{i + 1}</td>
                    <td className="py-1.5 pr-3 text-slate-700">
                      {s.airline} {s.flight_no}
                    </td>
                    <td className="py-1.5 pr-3 font-medium text-slate-800">
                      {s.route}
                    </td>
                    <td className="py-1.5 pr-3 text-slate-700">
                      {formatDateTime(s.departure)}
                    </td>
                    <td className="py-1.5 pr-3 text-slate-700">
                      {formatDateTime(s.arrival)}
                    </td>
                    <td className="py-1.5 pr-3 text-slate-700">
                      {s.travel_class}
                    </td>
                    <td className="py-1.5 text-slate-700">{s.baggage}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* Policy */}
        <section className="border-t border-slate-200 pt-4">
          <h3 className="mb-1.5 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Fare & Airline Conditions
          </h3>
          <p className="text-xs leading-relaxed text-slate-600">{policy}</p>
          {invoice.notes && (
            <p className="mt-2 text-xs text-slate-600" dir="auto">
              <span className="font-semibold">Notes: </span>
              {invoice.notes}
            </p>
          )}
        </section>
      </TicketPrintShell>
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
