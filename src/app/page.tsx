import Link from "next/link";
import { getBookings, computeTotals } from "@/lib/bookings";
import { formatCurrency, formatDate } from "@/lib/format";
import { PageHeader, StatCard, Card, Button, StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const bookings = await getBookings();
  const totals = computeTotals(bookings);
  const recent = bookings.slice(0, 5);

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of all bookings and performance"
        action={<Button href="/bookings/new">+ New Booking</Button>}
      />

      <div className="p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard label="Total Bookings" value={String(totals.bookings)} />
          <StatCard label="Revenue" value={formatCurrency(totals.revenue)} />
          <StatCard
            label="Profit"
            value={formatCurrency(totals.profit)}
            tone="green"
          />
          <StatCard label="Issued Tickets" value={String(totals.issued)} />
          <StatCard
            label="Pending"
            value={String(totals.pending)}
            tone="amber"
          />
          <StatCard
            label="Outstanding Debt"
            value={formatCurrency(totals.debt)}
            tone={totals.debt > 0 ? "red" : "default"}
          />
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Bookings
            </h2>
            <Link
              href="/bookings"
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
                    <th className="px-5 py-3 font-semibold">Booking</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Client</th>
                    <th className="px-5 py-3 font-semibold">Route</th>
                    <th className="px-5 py-3 text-right font-semibold">Total</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recent.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-10 text-center text-slate-500"
                      >
                        No bookings yet.{" "}
                        <Link
                          href="/bookings/new"
                          className="font-medium text-brand hover:underline"
                        >
                          Add the first one
                        </Link>
                        .
                      </td>
                    </tr>
                  ) : (
                    recent.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-slate-800">
                          {b.booking_id}
                        </td>
                        <td className="px-5 py-3 text-slate-600">
                          {formatDate(b.booking_date)}
                        </td>
                        <td className="px-5 py-3 text-slate-800">
                          {b.client_name}
                        </td>
                        <td className="px-5 py-3 text-slate-600">{b.route}</td>
                        <td className="px-5 py-3 text-right tabular-nums text-slate-800">
                          {formatCurrency(b.total_paid)}
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={b.payment_status} />
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
