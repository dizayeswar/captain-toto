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

      <div className="print-area mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
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
            <Meta label="Booking Ref" value={inv.booking_ref || "—"} />
            <Meta label="Service Type" value={inv.service_type || "—"} />
            <Meta label="Currency" value={inv.currency || "USD"} />
            <Meta label="Invoice Status" value={inv.invoice_status || "—"} />
            <Meta label="Payment Status" value={inv.payment_status || "—"} />
          </div>
        </div>

        <section className="py-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Amounts
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <Amount label="Invoice Amount" value={formatCurrency(inv.invoice_amount)} />
            <Amount label="Paid" value={formatCurrency(inv.paid_usd)} />
            <Amount label="Refund" value={formatCurrency(inv.refund_usd)} />
            <Amount
              label="Outstanding"
              value={formatCurrency(inv.outstanding_usd)}
              emphasize
            />
          </div>
        </section>

        {inv.notes && (
          <section className="border-t border-slate-200 pt-6">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Notes
            </h3>
            <p className="text-sm text-slate-600" dir="auto">
              {inv.notes}
            </p>
          </section>
        )}

        <DocFooter disclaimer="This document records a supplier service invoice for Captain ToTo. It is not a client payment receipt." />
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
