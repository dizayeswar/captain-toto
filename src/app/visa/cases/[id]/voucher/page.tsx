import Link from "next/link";
import { notFound } from "next/navigation";
import { getVisaCase } from "@/lib/visas";
import { formatCurrency, formatDate } from "@/lib/format";
import PrintButton from "@/components/PrintButton";
import { DocLetterhead, DocFooter } from "@/components/DocBranding";

export const dynamic = "force-dynamic";

export default async function VisaVoucherPage(
  props: PageProps<"/visa/cases/[id]/voucher">
) {
  const { id } = await props.params;
  const v = await getVisaCase(id);
  if (!v) notFound();

  const providerLine = [v.provider, v.provider_reference]
    .filter(Boolean)
    .join(" · ") || "—";

  return (
    <div className="p-8">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/visa/cases"
          className="text-sm font-medium text-brand hover:underline"
        >
          ← Back to visa cases
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/visa/cases/${v.id}`}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Edit
          </Link>
          <PrintButton />
        </div>
      </div>

      <div className="print-area mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <DocLetterhead title="Visa Confirmation" />

        <div className="grid gap-6 border-b border-slate-200 py-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Client
            </p>
            <p className="mt-1 text-base font-medium text-slate-900" dir="auto">
              {v.client_name || "—"}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Passport
            </p>
            <p className="mt-1 text-base font-medium text-slate-900">
              {v.passport_no || "—"}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Nationality: {v.nationality || "—"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <Meta label="Visa ID" value={v.visa_id} />
            <Meta label="Status" value={v.case_status || "—"} />
            <Meta label="Destination" value={v.destination_country || "—"} />
            <Meta label="Visa Type" value={v.visa_type || "—"} />
            <Meta label="Entry Type" value={v.entry_type || "—"} />
            <Meta
              label="Travel Date"
              value={v.travel_date ? formatDate(v.travel_date) : "—"}
            />
            <Meta
              label="Application"
              value={
                v.application_date ? formatDate(v.application_date) : "—"
              }
            />
            <Meta
              label="Appointment"
              value={
                v.appointment_date ? formatDate(v.appointment_date) : "—"
              }
            />
            <Meta
              label="Decision"
              value={v.decision_date ? formatDate(v.decision_date) : "—"}
            />
            <Meta label="Provider / Ref" value={providerLine} />
            <Meta label="Payment Status" value={v.payment_status || "—"} />
            <Meta label="Created" value={formatDate(v.created_date)} />
          </div>
        </div>

        <section className="py-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Fees
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <Amount
              label="Appointment Fee"
              value={formatCurrency(v.appointment_fee)}
            />
            <Amount
              label="Document Fee"
              value={formatCurrency(v.document_fee)}
            />
            <Amount
              label="Extra Charges"
              value={formatCurrency(v.extra_charges)}
            />
            <Amount label="Total" value={formatCurrency(v.total_sale_usd)} />
            <Amount label="Paid" value={formatCurrency(v.amount_paid_usd)} />
            <Amount
              label="Balance"
              value={formatCurrency(v.balance_usd)}
              emphasize
            />
          </div>
        </section>

        {v.notes && (
          <section className="border-t border-slate-200 pt-6">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Notes
            </h3>
            <p className="text-sm text-slate-600" dir="auto">
              {v.notes}
            </p>
          </section>
        )}

        <DocFooter disclaimer="This document confirms visa case details handled by Captain ToTo. Final visa approval is subject to the issuing authority." />
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
