import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupplierInvoice } from "@/lib/supplierFinance";
import { formatCurrency, formatDate } from "@/lib/format";
import PrintButton from "@/components/PrintButton";
import { DocLetterhead, DocFooter } from "@/components/DocBranding";

export const dynamic = "force-dynamic";

export default async function SupplierInvoicePrintPage(
  props: PageProps<"/suppliers/invoices/[id]/print">
) {
  const { id } = await props.params;
  const inv = await getSupplierInvoice(id);
  if (!inv) notFound();

  return (
    <div className="p-8">
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

      <div className="print-area print-a4 mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <DocLetterhead title="Supplier Service Invoice" />

        <div className="grid gap-6 border-b border-slate-200 py-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Supplier
            </p>
            <p className="mt-1 text-base font-medium text-slate-900" dir="auto">
              {inv.supplier || "—"}
            </p>
            {inv.supplier_invoice_no && (
              <p className="mt-1 text-sm text-slate-600">
                Supplier Invoice No.: {inv.supplier_invoice_no}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <Meta label="Invoice ID" value={inv.invoice_id} />
            <Meta label="Invoice Date" value={formatDate(inv.invoice_date)} />
            <Meta
              label="Due Date"
              value={inv.due_date ? formatDate(inv.due_date) : "—"}
            />
            <Meta label="Service" value={inv.service_type || "—"} />
            <Meta label="Invoice Status" value={inv.invoice_status || "—"} />
            <Meta label="Payment Status" value={inv.payment_status || "—"} />
          </div>
        </div>

        <section className="py-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Service details
          </h3>
          {inv.lines.length === 0 ? (
            <p className="text-sm text-slate-500">No line items.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="py-2 pr-3 font-semibold">Service</th>
                  <th className="py-2 pr-3 font-semibold">Ref</th>
                  <th className="py-2 pr-3 font-semibold">Description</th>
                  <th className="py-2 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inv.lines.map((l, i) => (
                  <tr key={l.id ?? i}>
                    <td className="py-2.5 pr-3 text-slate-700">{l.service_type}</td>
                    <td className="py-2.5 pr-3 font-medium text-slate-800">
                      {l.booking_ref || "—"}
                    </td>
                    <td className="py-2.5 pr-3 text-slate-700" dir="auto">
                      {l.description || "—"}
                    </td>
                    <td className="py-2.5 text-right tabular-nums font-medium text-slate-900">
                      {formatCurrency(l.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-300">
                  <td colSpan={3} className="pt-3 text-right text-sm font-semibold">
                    Total (supplier cost)
                  </td>
                  <td className="pt-3 text-right text-base font-bold tabular-nums">
                    {formatCurrency(inv.invoice_amount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
          <p className="mt-2 text-xs text-slate-400">
            Ticket amounts are ticket cost only — service fees are not included.
          </p>
        </section>

        <section className="border-t border-slate-200 py-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Settlement
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <Amount label="Paid" value={formatCurrency(inv.paid_usd)} />
            <Amount label="Refund" value={formatCurrency(inv.refund_usd)} />
            <Amount label="Net paid" value={formatCurrency(inv.net_paid_usd)} />
            <Amount
              label="Outstanding"
              value={formatCurrency(inv.outstanding_usd)}
              emphasize
            />
          </div>
        </section>

        {inv.notes && (
          <p className="text-sm text-slate-600" dir="auto">
            <span className="font-semibold">Notes: </span>
            {inv.notes}
          </p>
        )}

        <DocFooter disclaimer="This document records a supplier service invoice for Captain ToTo. Ticket lines exclude agency service fees. It is not a client payment receipt." />
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
      <p className="mt-0.5 font-medium text-slate-800">{value}</p>
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
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={`mt-0.5 font-semibold tabular-nums ${
          emphasize ? "text-amber-700" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
