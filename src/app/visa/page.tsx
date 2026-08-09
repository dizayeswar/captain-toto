import Link from "next/link";
import { getVisaCases, summarizeVisas } from "@/lib/visas";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  PageHeader,
  StatCard,
  Card,
  Button,
  StatusBadge,
} from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function VisaDashboardPage() {
  const cases = await getVisaCases();
  const summary = summarizeVisas(cases);
  const recent = cases.slice(0, 8);

  return (
    <>
      <PageHeader
        title="Visa Management"
        subtitle="Overview of visa cases, appointments and balances"
        action={<Button href="/visa/cases/new">+ New Case</Button>}
      />

      <div className="p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard label="Total Cases" value={String(summary.total)} />
          <StatCard
            label="Approved"
            value={String(summary.approved)}
            tone="green"
          />
          <StatCard
            label="Appointments (30d)"
            value={String(summary.appointments)}
            tone="amber"
          />
          <StatCard
            label="Total Sales"
            value={formatCurrency(summary.totalSales)}
          />
          <StatCard
            label="Outstanding"
            value={formatCurrency(summary.outstanding)}
            tone={summary.outstanding > 0 ? "red" : "default"}
          />
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Cases
            </h2>
            <Link
              href="/visa/cases"
              className="text-sm font-medium text-brand hover:underline"
            >
              View all →
            </Link>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3 font-semibold">Visa ID</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Client</th>
                    <th className="px-5 py-3 font-semibold">Destination</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 text-right font-semibold">Total</th>
                    <th className="px-5 py-3 font-semibold">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recent.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-10 text-center text-slate-500"
                      >
                        No visa cases yet.{" "}
                        <Link
                          href="/visa/cases/new"
                          className="font-medium text-brand hover:underline"
                        >
                          Add the first one
                        </Link>
                        .
                      </td>
                    </tr>
                  ) : (
                    recent.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-slate-800">
                          <Link
                            href={`/visa/cases/${v.id}`}
                            className="text-brand hover:underline"
                          >
                            {v.visa_id}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                          {formatDate(v.created_date)}
                        </td>
                        <td className="px-5 py-3 text-slate-800">
                          {v.client_name}
                        </td>
                        <td className="px-5 py-3 text-slate-600">
                          {v.destination_country || "—"}
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={v.case_status} />
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums text-slate-800">
                          {formatCurrency(v.total_sale_usd)}
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={v.payment_status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
