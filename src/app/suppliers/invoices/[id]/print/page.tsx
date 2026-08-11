import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getSupplierInvoice } from "@/lib/supplierFinance";
import { formatCurrency, formatDate } from "@/lib/format";
import { COMPANY } from "@/lib/company";
import PrintButton from "@/components/PrintButton";

export const dynamic = "force-dynamic";

/** Matches the TOTO TRAVEL INVOICE PDF layout (A4 service invoice). */
export default async function SupplierInvoicePrintPage(
  props: PageProps<"/suppliers/invoices/[id]/print">
) {
  const { id } = await props.params;
  const inv = await getSupplierInvoice(id);
  if (!inv) notFound();

  const totalDue = inv.outstanding_usd;

  return (
    <div className="p-8">
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 12mm; }
        }
      `}</style>

      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/suppliers/invoices"
          className="text-sm font-medium text-brand hover:underline"
        >
          ← Back to invoices
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/suppliers/invoices/${inv.id}`}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Edit
          </Link>
          <PrintButton />
        </div>
      </div>

      <div className="print-area print-a4 mx-auto max-w-[210mm] rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Header — company left, date/no right (like the PDF) */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-300 pb-4">
          <div className="flex items-start gap-3">
            <Image
              src={COMPANY.logo}
              alt={COMPANY.name}
              width={56}
              height={56}
              priority
              className="h-14 w-14"
            />
            <div>
              <p className="text-xl font-extrabold tracking-wide text-brand">
                {COMPANY.name}
              </p>
              <p className="text-sm font-medium text-accent">{COMPANY.tagline}</p>
              <p className="mt-1 text-xs text-slate-500">
                {COMPANY.phone} · {COMPANY.email}
                <br />
                {COMPANY.address}
              </p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p>
              <span className="text-slate-500">Date : </span>
              <span className="font-semibold">
                {formatDate(inv.invoice_date)}
              </span>
            </p>
            <p className="mt-1">
              <span className="text-slate-500">No : </span>
              <span className="font-semibold">
                {inv.supplier_invoice_no || inv.invoice_id}
              </span>
            </p>
          </div>
        </div>

        {/* Bill To */}
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Bill To :
          </p>
          <p className="mt-1 text-base font-bold text-slate-900" dir="auto">
            {inv.supplier || "—"}
          </p>
          {inv.notes && (
            <p className="mt-0.5 text-sm text-slate-600" dir="auto">
              {inv.notes}
            </p>
          )}
        </div>

        {/* Detail table — columns from the PDF */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-y-2 border-slate-800 bg-slate-50 text-left">
                <th className="px-1.5 py-2 font-bold">#</th>
                <th className="px-1.5 py-2 font-bold">Type / ID</th>
                <th className="px-1.5 py-2 font-bold">Issue Date</th>
                <th className="px-1.5 py-2 font-bold">Name</th>
                <th className="px-1.5 py-2 font-bold">Ticket / Details</th>
                <th className="px-1.5 py-2 font-bold">PNR</th>
                <th className="px-1.5 py-2 font-bold">Route</th>
                <th className="px-1.5 py-2 text-right font-bold">Amount</th>
                <th className="px-1.5 py-2 text-right font-bold">Paid</th>
                <th className="px-1.5 py-2 text-right font-bold">Refund</th>
                <th className="px-1.5 py-2 text-right font-bold">Balance</th>
              </tr>
            </thead>
            <tbody>
              {inv.lines.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-1.5 py-6 text-center text-slate-400"
                  >
                    No line items
                  </td>
                </tr>
              ) : (
                inv.lines.map((l, i) => {
                  const balance = (Number(l.amount) || 0) * -1; // due to supplier
                  return (
                    <tr
                      key={l.id ?? i}
                      className="border-b border-slate-200 align-top"
                    >
                      <td className="px-1.5 py-2">{i + 1}</td>
                      <td className="px-1.5 py-2">
                        <span className="font-semibold uppercase">
                          {serviceLabel(l.service_type)}
                        </span>
                        {l.booking_ref && (
                          <span className="block text-slate-600">
                            {l.booking_ref}
                          </span>
                        )}
                      </td>
                      <td className="px-1.5 py-2 whitespace-nowrap">
                        {l.issue_date ? formatDate(l.issue_date) : "—"}
                      </td>
                      <td className="px-1.5 py-2" dir="auto">
                        {l.client_name || "—"}
                      </td>
                      <td className="px-1.5 py-2" dir="auto">
                        {l.description || "—"}
                      </td>
                      <td className="px-1.5 py-2 font-medium">
                        {l.pnr || "—"}
                      </td>
                      <td className="px-1.5 py-2">{l.route || "—"}</td>
                      <td className="px-1.5 py-2 text-right tabular-nums font-medium">
                        {formatCurrency(l.amount)}
                      </td>
                      <td className="px-1.5 py-2 text-right tabular-nums">
                        {i === 0 && inv.lines.length === 1
                          ? formatCurrency(inv.paid_usd)
                          : "—"}
                      </td>
                      <td className="px-1.5 py-2 text-right tabular-nums">
                        {i === 0 && inv.lines.length === 1
                          ? formatCurrency(inv.refund_usd)
                          : "—"}
                      </td>
                      <td className="px-1.5 py-2 text-right tabular-nums">
                        {formatCurrency(balance)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Totals footer — matches PDF */}
        <div className="mt-8 flex justify-end">
          <div className="w-72 space-y-2 text-sm">
            <TotalRow
              label="Total :"
              value={formatCurrency(inv.invoice_amount)}
            />
            <TotalRow
              label="Refund :"
              value={formatCurrency(inv.refund_usd)}
            />
            <TotalRow
              label="Paid :"
              value={
                inv.paid_usd ? formatCurrency(inv.paid_usd) : "$ -"
              }
            />
            <div className="border-t-2 border-slate-800 pt-2">
              <TotalRow
                label="TOTAL DUE :"
                value={formatCurrency(totalDue)}
                strong
              />
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-[10px] text-slate-400">
          Ticket amounts are ticket cost only (service fee not included). ·{" "}
          {COMPANY.website}
        </p>
      </div>
    </div>
  );
}

function serviceLabel(type: string): string {
  const t = (type || "").toLowerCase();
  if (t === "ticket") return "TICKET";
  if (t === "hotel") return "HOTEL";
  if (t === "visa") return "SERVICES";
  return (type || "OTHER").toUpperCase();
}

function TotalRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <span
        className={
          strong ? "text-base font-bold text-slate-900" : "text-slate-600"
        }
      >
        {label}
      </span>
      <span
        className={`tabular-nums ${
          strong ? "text-base font-bold text-slate-900" : "font-semibold"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
