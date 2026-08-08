import Link from "next/link";
import { notFound } from "next/navigation";
import { getInvoice, getPolicyForAirline } from "@/lib/invoices";
import { formatDate, formatDateTime } from "@/lib/format";
import PrintButton from "@/components/PrintButton";

export const dynamic = "force-dynamic";

export default async function InvoiceViewPage(
  props: PageProps<"/invoices/[id]">
) {
  const { id } = await props.params;
  const invoice = await getInvoice(id);
  if (!invoice) notFound();

  const policy = await getPolicyForAirline(invoice.airline);

  return (
    <div className="p-8">
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

      {/* Printable document */}
      <div className="print-area mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-xl font-bold text-white">
              CT
            </span>
            <div>
              <p className="text-lg font-bold text-slate-900">Captain ToTo</p>
              <p className="text-sm text-slate-500">Travel & Ticketing</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold uppercase tracking-wide text-slate-900">
              Ticket Invoice
            </p>
            <p className="mt-1 text-sm text-slate-600">{invoice.invoice_no}</p>
            <p className="text-sm text-slate-500">
              {formatDate(invoice.invoice_date)}
            </p>
          </div>
        </div>

        {/* Meta */}
        <div className="grid gap-6 border-b border-slate-200 py-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Prepared For
            </p>
            <p className="mt-1 text-base font-medium text-slate-900" dir="auto">
              {invoice.client_name || "—"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <Meta label="Booking ID" value={invoice.booking_id || "—"} />
            <Meta label="Airline" value={invoice.airline || "—"} />
            <Meta label="PNR / Code" value={invoice.pnr || "—"} />
            <Meta label="Status" value={invoice.reservation_status} />
          </div>
        </div>

        {/* Passengers */}
        <section className="py-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Passengers
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="py-2 pr-3 font-semibold">Name</th>
                <th className="py-2 pr-3 font-semibold">Passport</th>
                <th className="py-2 pr-3 font-semibold">Nationality</th>
                <th className="py-2 pr-3 font-semibold">Date of Birth</th>
                <th className="py-2 font-semibold">Ticket No.</th>
              </tr>
            </thead>
            <tbody>
              {invoice.passengers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-3 text-slate-400">
                    No passengers listed.
                  </td>
                </tr>
              ) : (
                invoice.passengers.map((p, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-2 pr-3 font-medium text-slate-800" dir="auto">
                      {p.full_name}
                    </td>
                    <td className="py-2 pr-3 text-slate-700">{p.passport_no}</td>
                    <td className="py-2 pr-3 text-slate-700">{p.nationality}</td>
                    <td className="py-2 pr-3 text-slate-700">
                      {p.date_of_birth ? formatDate(p.date_of_birth) : "—"}
                    </td>
                    <td className="py-2 text-slate-700">{p.ticket_no}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* Flight segments */}
        <section className="py-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Flight Itinerary
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="py-2 pr-3 font-semibold">#</th>
                <th className="py-2 pr-3 font-semibold">Flight</th>
                <th className="py-2 pr-3 font-semibold">Route</th>
                <th className="py-2 pr-3 font-semibold">Departure</th>
                <th className="py-2 pr-3 font-semibold">Arrival</th>
                <th className="py-2 pr-3 font-semibold">Class</th>
                <th className="py-2 font-semibold">Baggage</th>
              </tr>
            </thead>
            <tbody>
              {invoice.segments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-3 text-slate-400">
                    No flight segments listed.
                  </td>
                </tr>
              ) : (
                invoice.segments.map((s, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-2 pr-3 text-slate-700">{i + 1}</td>
                    <td className="py-2 pr-3 text-slate-700">
                      {s.airline} {s.flight_no}
                    </td>
                    <td className="py-2 pr-3 font-medium text-slate-800">
                      {s.route}
                    </td>
                    <td className="py-2 pr-3 text-slate-700">
                      {formatDateTime(s.departure)}
                    </td>
                    <td className="py-2 pr-3 text-slate-700">
                      {formatDateTime(s.arrival)}
                    </td>
                    <td className="py-2 pr-3 text-slate-700">{s.travel_class}</td>
                    <td className="py-2 text-slate-700">{s.baggage}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* Policy */}
        <section className="border-t border-slate-200 pt-6">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Fare & Airline Conditions
          </h3>
          <p className="text-xs leading-relaxed text-slate-600">{policy}</p>
          {invoice.notes && (
            <p className="mt-4 text-xs text-slate-600" dir="auto">
              <span className="font-semibold">Notes: </span>
              {invoice.notes}
            </p>
          )}
        </section>
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
