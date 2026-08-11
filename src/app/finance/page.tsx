import Link from "next/link";
import { getExpenses, summarizeExpenses } from "@/lib/expenses";
import {
  getFinanceDeposits,
  computeFinanceBalance,
  buildBalanceActivity,
} from "@/lib/financeBalance";
import {
  deleteExpenseAction,
  createFinanceDepositAction,
  deleteFinanceDepositAction,
} from "@/lib/actions";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { PageHeader, Button, Card, StatCard, EmptyState } from "@/components/ui";
import DeleteButton from "@/components/DeleteButton";
import FinanceDepositForm from "@/components/FinanceDepositForm";

export const dynamic = "force-dynamic";

function formatAmount(amount: number, currency: string): string {
  if (currency === "USD") return formatCurrency(amount);
  return `${formatNumber(amount)} ${currency}`;
}

export default async function FinancePage() {
  const [expenses, deposits] = await Promise.all([
    getExpenses(),
    getFinanceDeposits(),
  ]);
  const s = summarizeExpenses(expenses);
  const bal = computeFinanceBalance(deposits, expenses);
  const activity = buildBalanceActivity(deposits, expenses);

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
        {/* Cash balance */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Cash balance
            </h2>
            <p className="text-sm text-slate-500">
              Deposits add money. Every expense deducts from the same balance.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Balance IQD"
              value={`${formatNumber(bal.balanceIqd)} IQD`}
              hint={`In ${formatNumber(bal.depositedIqd)} − Out ${formatNumber(bal.spentIqd)}`}
              tone={bal.balanceIqd < 0 ? "red" : "green"}
            />
            <StatCard
              label="Balance USD"
              value={formatCurrency(bal.balanceUsd)}
              hint={`In ${formatCurrency(bal.depositedUsd)} − Out ${formatCurrency(bal.spentUsd)}`}
              tone={bal.balanceUsd < 0 ? "red" : "green"}
            />
            <StatCard
              label="Deposits"
              value={String(deposits.length)}
              hint="Money brought in"
            />
            <StatCard
              label="Expenses"
              value={String(s.count)}
              hint={`${formatCurrency(s.totalUsd)} · ${formatNumber(s.totalIqd)} IQD`}
            />
          </div>

          <FinanceDepositForm action={createFinanceDepositAction} />

          {activity.length > 0 && (
            <Card className="overflow-hidden">
              <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Balance activity
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
                      <th className="px-5 py-3 font-semibold">Date</th>
                      <th className="px-5 py-3 font-semibold">Type</th>
                      <th className="px-5 py-3 font-semibold">Details</th>
                      <th className="px-5 py-3 text-right font-semibold">
                        Amount
                      </th>
                      <th className="px-5 py-3 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activity.map((row) => {
                      const depositId =
                        row.kind === "deposit"
                          ? row.id.replace(/^dep-/, "")
                          : null;
                      return (
                        <tr key={row.id} className="hover:bg-slate-50">
                          <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                            {formatDate(row.date)}
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={
                                row.kind === "deposit"
                                  ? "rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                                  : "rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700"
                              }
                            >
                              {row.kind === "deposit" ? "In" : "Out"}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="font-medium text-slate-800" dir="auto">
                              {row.title}
                            </div>
                            <div className="text-xs text-slate-500" dir="auto">
                              {row.detail}
                            </div>
                          </td>
                          <td
                            className={`px-5 py-3 text-right font-medium tabular-nums ${
                              row.kind === "deposit"
                                ? "text-emerald-700"
                                : "text-rose-700"
                            }`}
                          >
                            {row.kind === "deposit" ? "+" : "−"}
                            {formatAmount(row.amount, row.currency)}
                          </td>
                          <td className="px-5 py-3 text-right">
                            {depositId ? (
                              <DeleteButton
                                action={deleteFinanceDepositAction}
                                id={depositId}
                                confirmMessage="Delete this balance deposit?"
                              />
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </section>

        {/* Expense list */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">All expenses</h2>

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
                      <th className="px-5 py-3 text-right font-semibold">
                        Amount
                      </th>
                      <th className="px-5 py-3 text-right font-semibold">
                        Actions
                      </th>
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
        </section>
      </div>
    </>
  );
}
