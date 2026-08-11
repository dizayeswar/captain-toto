import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getSupplierPaymentReceipt } from "@/lib/supplierReceipts";
import { formatCurrency, formatDate } from "@/lib/format";
import { COMPANY } from "@/lib/company";
import PrintButton from "@/components/PrintButton";

export const dynamic = "force-dynamic";

export default async function SupplierReceiptPrintPage(
  props: PageProps<"/suppliers/receipts/[id]">
) {
  const { id } = await props.params;
  const receipt = await getSupplierPaymentReceipt(id);
  if (!receipt) notFound();

  return (
    <div className="p-8 print:p-0">
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
          href="/suppliers/receipts"
          className="text-sm font-medium text-brand hover:underline"
        >
          ← Back to payment receipts
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/suppliers/receipts/${receipt.id}/edit`}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Edit
          </Link>
          <PrintButton />
        </div>
      </div>

      {/* A6 preview: 105×148mm */}
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
          <p className="text-[10px] font-bold uppercase leading-tight text-slate-800">
            Payment
            <br />
            Receipt
          </p>
        </div>

        <div className="my-2 rounded bg-brand px-2 py-1.5 text-center text-[11px] font-bold uppercase text-white">
          Supplier Payment
        </div>

        <div className="space-y-2 text-[11px]">
          <Row label="ID" value={receipt.receipt_no} />
          <Row label="Date" value={formatDate(receipt.receipt_date)} />
          <Row label="Supplier" value={receipt.supplier || "—"} />
          <Row label="Amount" value={formatCurrency(receipt.amount)} strong />
        </div>

        {receipt.notes ? (
          <p className="mt-2 border-t border-slate-100 pt-2 text-[10px] text-slate-600" dir="auto">
            <span className="font-semibold">Notes: </span>
            {receipt.notes}
          </p>
        ) : null}

        <div className="mt-6">
          <div className="h-10 border-b border-slate-400" />
          <p className="mt-1 text-[10px] text-slate-500">
            Signature:{" "}
            <span className="font-semibold text-slate-800" dir="auto">
              {receipt.signature || "—"}
            </span>
          </p>
          {receipt.source_invoice_no ? (
            <p className="mt-0.5 text-[9px] text-slate-400">
              From invoice {receipt.source_invoice_no}
            </p>
          ) : null}
        </div>

        <p className="mt-4 text-center text-[9px] text-accent">
          {COMPANY.slogan}
        </p>
        <p className="text-center text-[8px] leading-tight text-slate-400">
          Payment to supplier — Captain ToTo records.
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-slate-100 pb-1">
      <span className="text-slate-400">{label}</span>
      <span
        className={
          strong
            ? "text-sm font-bold text-slate-900"
            : "font-semibold text-slate-800"
        }
        dir="auto"
      >
        {value}
      </span>
    </div>
  );
}
