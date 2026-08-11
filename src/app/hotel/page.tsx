import Link from "next/link";
import { getHotelBookings, summarizeHotels } from "@/lib/hotels";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  PageHeader,
  StatCard,
  Card,
  Button,
  StatusBadge,
} from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function HotelDashboardPage() {
  const bookings = await getHotelBookings();
  const summary = summarizeHotels(bookings);
  const recent = bookings.slice(0, 8);

  return (
    <>
      <PageHeader
        title="Hotel Management"
        subtitle="Overview of hotel bookings and performance"
        action={<Button href="/hotel/bookings/new">+ New Booking</Button>}
      />

      <div className="p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard label="Total Bookings" value={String(summary.total)} />
          <StatCard label="Confirmed" value={String(summary.confirmed)} />
          <StatCard
            label="Cancelled"
            value={String(summary.cancelled)}
            tone={summary.cancelled > 0 ? "red" : "default"}
          />
          <StatCard
            label="Total Sale"
            value={formatCurrency(summary.totalSale)}
          />
          <StatCard
            label="Profit"
            value={formatCurrency(summary.totalProfit)}
            tone={
              summary.totalProfit < 0
                ? "red"
                : summary.totalProfit > 0
                  ? "green"
                  : "default"
            }
          />
          <StatCard
            label="Outstanding"
            value={formatCurrency(summary.outstanding)}
            tone={summary.outstanding > 0 ? "amber" : "default"}
          />
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Bookings
            </h2>
            <Link
              href="/hotel/bookings"
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
                    <th className="px-5 py-3 font-semibold">Code</th>
                    <th className="px-5 py-3 font-semibold">Guest</th>
                    <th className="px-5 py-3 font-semibold">Hotel</th>
                    <th className="px-5 py-3 font-semibold">Check-in</th>
                    <th className="px-5 py-3 text-right font-semibold">Sale</th>
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
                        No hotel bookings yet.{" "}
                        <Link
                          href="/hotel/bookings/new"
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
                          <Link
                            href={`/hotel/bookings/${b.id}`}
                            className="text-brand hover:underline"
                          >
                            {b.booking_code}
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-slate-800" dir="auto">
                          {b.lead_guest}
                        </td>
                        <td className="px-5 py-3 text-slate-600">
                          {b.hotel_name}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                          {formatDate(b.check_in)}
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums text-slate-800">
                          {formatCurrency(
                            b.booking_status === "Cancelled" ||
                              b.booking_status === "No Show"
                              ? b.final_charge_usd
                              : b.total_sale_usd
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={b.booking_status} />
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
