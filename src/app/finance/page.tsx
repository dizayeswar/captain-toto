import Link from "next/link";
import { getExpenses, summarizeExpenses } from "@/lib/expenses";
import { deleteExpenseAction } from "@/lib/actions";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { PageHeader, Button, Card, StatCard, EmptyState } from "@/components/ui";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

function formatAmount(amount: number, currency: string): string {
  if (currency === "USD") return formatCurrency(amount);
  return `${formatNumber(amount)} ${currency}`;
}

export default async function FinancePage() {
  const expenses = await getExpenses();
  const s = summarizeExpenses(expenses);

  return (
    <>
      <PageHeader
        title="Finance Control"
        subtitle="Daily office and operating expenses"
        action={
          <div className="flex items-center gap-3">
            <Button href="/finance/summary" variant="secondary">
              Summary
            </Button>
            <Button href="/finance/new">+ New Expense</Button>
          </div>
        }
      />
      <div className="space-y-8 p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total USD"
            value={formatCurrency(s.totalUsd)}
            hint={`${s.count} expenses`}
            tone="green"
          />
          <StatCard
            label="Total IQD"
            value={`${formatNumber(s.totalIqd)} IQD`}
          />
          <StatCard label="Entries" value={String(s.count)} />
        </div>

        {expenses.length === 0 ? (
          <EmptyState message="No expenses yet. Record your first one." />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Category</th>
                    <th className="px-5 py-3 font-semibold">Description</th>
                    <th className="px-5 py-3 font-semibold">Paid By</th>
                    <th className="px-5 py-3 font-semibold">Method</th>
                    <th className="px-5 py-3 text-right font-semibold">Amount</th>
                    <th className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expenses.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                        {formatDate(e.expense_date)}
                      </td>
                      <td className="px-5 py-3 text-slate-800">
                        {e.category || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-600" dir="auto">
                        {e.description || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {e.paid_by || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {e.payment_method || "—"}
                      </td>
                      <td className="px-5 py-3 text-right font-medium tabular-nums text-slate-900">
                        {formatAmount(e.amount, e.currency)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/finance/${e.id}`}
                            className="font-medium text-brand hover:underline"
                          >
                            Edit
                          </Link>
                          <DeleteButton
                            action={deleteExpenseAction}
                            id={e.id}
                            confirmMessage={`Delete expense "${e.description}"?`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
