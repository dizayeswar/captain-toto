import { getExpenses, summarizeExpenses } from "@/lib/expenses";
import type { ExpenseGroup } from "@/lib/expenses";
import { formatCurrency, formatNumber } from "@/lib/format";
import { PageHeader, Card, StatCard, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function FinanceSummaryPage() {
  const expenses = await getExpenses();
  const s = summarizeExpenses(expenses);

  return (
    <>
      <PageHeader
        title="Expense Summary"
        subtitle="Totals by month and category"
      />
      <div className="space-y-8 p-8">
        {expenses.length === 0 ? (
          <EmptyState message="No expenses yet." />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                label="Total USD"
                value={formatCurrency(s.totalUsd)}
                tone="green"
              />
              <StatCard
                label="Total IQD"
                value={`${formatNumber(s.totalIqd)} IQD`}
              />
              <StatCard label="Entries" value={String(s.count)} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <GroupTable title="By Month" rows={s.byMonth} keyLabel="Month" />
              <GroupTable
                title="By Category"
                rows={s.byCategory}
                keyLabel="Category"
              />
            </div>
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
}: {
  title: string;
  rows: ExpenseGroup[];
  keyLabel: string;
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
              <th className="px-5 py-3 text-right font-semibold">Count</th>
              <th className="px-5 py-3 text-right font-semibold">USD</th>
              <th className="px-5 py-3 text-right font-semibold">IQD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.key} className="hover:bg-slate-50">
                <td className="px-5 py-3 text-slate-800" dir="auto">
                  {r.key}
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-slate-600">
                  {r.count}
                </td>
                <td className="px-5 py-3 text-right font-medium tabular-nums text-slate-900">
                  {formatCurrency(r.usd)}
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-slate-900">
                  {formatNumber(r.iqd)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
