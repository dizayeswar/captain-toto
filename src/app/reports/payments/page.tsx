import { getBookings, computeTotals, BOOKING_REPORT_SELECT } from "@/lib/bookings";
import { bookingsToExcel } from "@/lib/excelRows";
import { formatCurrency } from "@/lib/format";
import { PageHeader, Card, StatCard, StatusBadge, EmptyState } from "@/components/ui";
import ExportExcelButton from "@/components/ExportExcelButton";

export const dynamic = "force-dynamic";

export default async function PaymentReportPage() {
  const bookings = await getBookings(BOOKING_REPORT_SELECT);
  const totals = computeTotals(bookings);
  const ticketTotal = bookings.reduce((s, b) => s + b.ticket_cost, 0);
  const feeTotal = bookings.reduce((s, b) => s + b.service_fee, 0);

  return (
    <>
      <PageHeader
        title="Payment Report"
        subtitle="Payment status and live totals across all bookings"
        action={
          <ExportExcelButton
            filename="payment-report"
            sheetName="Payments"
            rows={bookingsToExcel(bookings)}
          />
        }
      />
      <div className="p-8">
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Total Ticket Cost" value={formatCurrency(ticketTotal)} />
          <StatCard label="Total Service Fee" value={formatCurrency(feeTotal)} />
          <StatCard label="Total Paid" value={formatCurrency(totals.revenue)} />
        </div>

        {bookings.length === 0 ? (
          <EmptyState message="No bookings yet." />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3 font-semibold">Booking ID</th>
                    <th className="px-5 py-3 font-semibold">Client</th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Ticket Cost
                    </th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Service Fee
                    </th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Total Paid
                    </th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-slate-800">
                        {b.booking_id}
                      </td>
                      <td className="px-5 py-3 text-slate-700">
                        {b.client_name}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-slate-700">
                        {formatCurrency(b.ticket_cost)}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-slate-700">
                        {formatCurrency(b.service_fee)}
                      </td>
                      <td className="px-5 py-3 text-right font-medium tabular-nums text-slate-900">
                        {formatCurrency(b.total_paid)}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={b.payment_status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold text-slate-900">
                    <td className="px-5 py-3" colSpan={2}>
                      Total
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {formatCurrency(ticketTotal)}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {formatCurrency(feeTotal)}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {formatCurrency(totals.revenue)}
                    </td>
                    <td className="px-5 py-3" />
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
