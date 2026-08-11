import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPaymentInvoice } from "@/lib/payments";
import { formatCurrency, formatDate } from "@/lib/format";
import { COMPANY } from "@/lib/company";
import PrintButton from "@/components/PrintButton";

export const dynamic = "force-dynamic";

export default async function PaymentInvoiceViewPage(
  props: PageProps<"/payments/[id]">
) {
  const { id } = await props.params;
  const receipt = await getPaymentInvoice(id);
  if (!receipt) notFound();

  return (
    <div className="p-8">
      {/* A6 page size only for this payment receipt print */}
      <style>{`
        @media print {
          @page { size: A6 portrait; margin: 6mm; }
          .print-a6 {
            max-width: none !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>

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

      {/* On screen: preview sized like A6 (105×148mm) */}
      <div className="print-area print-a6 mx-auto w-[105mm] max-w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 border-b-2 border-brand pb-2">
          <Image
            src={COMPANY.logo}
            alt={COMPANY.name}
            width={40}
            height={40}
            priority
            className="h-10 w-10 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold tracking-wide text-brand">
              {COMPANY.name}
            </p>
            <p className="truncate text-[10px] text-slate-500">
              {COMPANY.phone}
            </p>
          </div>
          <p className="text-[11px] font-bold uppercase text-slate-800">
            Receipt
          </p>
        </div>

        <div className="my-2 flex items-center justify-between rounded bg-brand px-2 py-1.5 text-white">
          <span className="text-[11px] font-bold uppercase">Cash Receipt</span>
          <span dir="rtl" className="text-[11px] font-bold">
            پسوڵەی پارە
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
          <div>
            <span className="text-slate-400">No.</span>{" "}
            <span className="font-semibold">{receipt.receipt_no}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400">Date</span>{" "}
            <span className="font-semibold">
              {formatDate(receipt.receipt_date)}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-slate-400">Type</span>{" "}
            <span className="font-semibold">{receipt.payer_type}</span>
          </div>
        </div>

        <div className="mt-2 space-y-1.5 border-y border-slate-200 py-2 text-[11px]">
          <CompactRow
            en="From"
            ku="وەرگیرا لە"
            value={receipt.received_from}
          />
          <CompactRow
            en="Sum"
            ku="بڕی پارە"
            value={formatCurrency(receipt.amount)}
            strong
          />
          <CompactRow en="For" ku="لە جیاتی" value={receipt.for_text} />
        </div>

        {receipt.notes && (
          <p className="mt-1.5 text-[10px] text-slate-600" dir="auto">
            <span className="font-semibold">Notes: </span>
            {receipt.notes}
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3 text-[10px]">
          <div>
            <div className="h-6 border-b border-slate-400" />
            <p className="mt-0.5 text-slate-500">
              Prepared: {receipt.prepared_by || "—"}
            </p>
          </div>
          <div>
            <div className="h-6 border-b border-slate-400" />
            <p className="mt-0.5 text-slate-500">Client signature</p>
          </div>
        </div>

        <p className="mt-3 text-center text-[9px] text-accent">
          {COMPANY.slogan}
        </p>
        <p className="text-center text-[8px] leading-tight text-slate-400">
          Payment received by Captain ToTo. Not a flight ticket.
        </p>
      </div>
    </div>
  );
}

function CompactRow({
  en,
  ku,
  value,
  strong,
}: {
  en: string;
  ku: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="w-10 shrink-0 font-semibold text-slate-500">{en}</span>
      <span
        className={`min-w-0 flex-1 ${strong ? "text-sm font-bold text-slate-900" : "font-medium text-slate-800"}`}
        dir="auto"
      >
        {value || "—"}
      </span>
      <span dir="rtl" className="shrink-0 text-[10px] text-slate-500">
        {ku}
      </span>
    </div>
  );
}
