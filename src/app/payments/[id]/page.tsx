import Link from "next/link";
import { notFound } from "next/navigation";
import { getPaymentInvoice } from "@/lib/payments";
import { formatCurrency, formatDate } from "@/lib/format";
import PrintButton from "@/components/PrintButton";
import { DocLetterhead, DocFooter } from "@/components/DocBranding";

export const dynamic = "force-dynamic";

export default async function PaymentInvoiceViewPage(
  props: PageProps<"/payments/[id]">
) {
  const { id } = await props.params;
  const receipt = await getPaymentInvoice(id);
  if (!receipt) notFound();

  return (
    <div className="p-8">
      {/* Toolbar (hidden when printing) */}
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/payments"
          className="text-sm font-medium text-brand hover:underline"
        >
          ← Back to payment invoices
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/payments/${receipt.id}/edit`}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Edit
          </Link>
          <PrintButton />
        </div>
      </div>

      {/* Printable receipt */}
      <div className="print-area mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <DocLetterhead title="Payment Invoice" />

        {/* Cash receipt title (bilingual) */}
        <div className="my-6 flex items-center justify-between rounded-lg bg-brand px-5 py-3 text-white">
          <span className="text-lg font-bold uppercase tracking-wide">
            Cash Receipt
          </span>
          <span dir="rtl" className="text-lg font-bold">
            پسوڵەی وەرگرتنەوەی پارە
          </span>
        </div>

        {/* Top meta */}
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <Field label="Receipt No." value={receipt.receipt_no} />
          <Field label="Date" value={formatDate(receipt.receipt_date)} />
          <Field label="Company / Individual" value={receipt.payer_type} />
        </div>

        {/* Bilingual rows */}
        <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
          <BiRow
            en="Received From"
            ku="وەرگیرا لە بەرێز"
            value={receipt.received_from}
          />
          <BiRow
            en="The Sum Of"
            ku="بڕی پارە"
            value={formatCurrency(receipt.amount)}
          />
          <BiRow en="For" ku="لە جیاتی" value={receipt.for_text} />
        </div>

        {receipt.notes && (
          <p className="mt-4 text-sm text-slate-600" dir="auto">
            <span className="font-semibold">Notes: </span>
            {receipt.notes}
          </p>
        )}

        {/* Signatures */}
        <div className="mt-12 grid grid-cols-2 gap-10">
          <SignatureLine
            label="Received / Prepared by"
            value={receipt.prepared_by}
          />
          <SignatureLine label="Client Signature" value="" />
        </div>

        <DocFooter disclaimer="This document confirms that payment was received by Captain ToTo. It is not a flight ticket unless attached to a valid ticket invoice." />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 font-medium text-slate-800">{value}</p>
    </div>
  );
}

function BiRow({ en, ku, value }: { en: string; ku: string; value: string }) {
  return (
    <div className="flex items-center gap-4 py-3">
      <span className="w-40 shrink-0 text-sm font-semibold text-slate-600">
        {en}
      </span>
      <span
        className="flex-1 text-base font-medium text-slate-900"
        dir="auto"
      >
        {value || "—"}
      </span>
      <span
        dir="rtl"
        className="w-32 shrink-0 text-right text-sm font-semibold text-slate-600"
      >
        {ku}
      </span>
    </div>
  );
}

function SignatureLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="flex h-10 items-end">
        <span className="text-sm font-medium text-slate-800" dir="auto">
          {value}
        </span>
      </div>
      <div className="border-t border-slate-400 pt-1 text-xs text-slate-500">
        {label}
      </div>
    </div>
  );
}
