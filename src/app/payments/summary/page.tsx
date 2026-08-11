import { getPaymentInvoices, summarizePayments } from "@/lib/payments";
import type { PaymentGroupRow } from "@/lib/payments";
import { formatCurrency } from "@/lib/format";
import { MONTH_NAMES } from "@/lib/lists";
import { PageHeader, Card, StatCard, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

function monthLabel(key: string): string {
  const [y, m] = key.split("-");
  const idx = Number(m) - 1;
  if (idx >= 0 && idx < 12) return `${MONTH_NAMES[idx]} ${y}`;
  return key;
}

export default async function PaymentsSummaryPage() {
  const receipts = await getPaymentInvoices();
  const s = summarizePayments(receipts);

  return (
    <>
      <PageHeader
        title="Payments Summary"
        subtitle="Totals of payments received (cash receipts)"
      />
      <div className="space-y-8 p-8">
        {receipts.length === 0 ? (
          <EmptyState message="No payment invoices yet." />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                label="Total Received"
                value={formatCurrency(s.totalReceived)}
                hint={`${s.count} receipts`}
                tone="green"
              />
              <StatCard
                label="This Month"
                value={formatCurrency(s.thisMonthTotal)}
                hint={`${s.thisMonthCount} receipts`}
              />
              <StatCard label="Total Receipts" value={String(s.count)} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <GroupTable
                title="By Month"
                rows={s.byMonth}
                keyLabel="Month"
                renderKey={monthLabel}
              />
              <GroupTable
                title="By Staff"
                rows={s.byStaff}
                keyLabel="Prepared By"
              />
            </div>

            <GroupTable
              title="By Client Type"
              rows={s.byPayerType}
              keyLabel="Type"
            />
          </>
        )}
      </div>
    </>
  );
}

function GroupTable({
  title,
  rows,
  keyLabel,
  renderKey,
}: {
  title: string;
  rows: PaymentGroupRow[];
  keyLabel: string;
  renderKey?: (key: string) => string;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3 font-semibold">{keyLabel}</th>
              <th className="px-5 py-3 text-right font-semibold">Receipts</th>
              <th className="px-5 py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.key} className="hover:bg-slate-50">
                <td className="px-5 py-3 text-slate-800" dir="auto">
                  {renderKey ? renderKey(r.key) : r.key}
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-slate-600">
                  {r.count}
                </td>
                <td className="px-5 py-3 text-right font-medium tabular-nums text-slate-900">
                  {formatCurrency(r.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
