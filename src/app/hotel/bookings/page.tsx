import Link from "next/link";
import { getHotelBookings } from "@/lib/hotels";
import { hotelsToExcel } from "@/lib/excelRows";
import { deleteHotelBookingAction } from "@/lib/actions";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  PageHeader,
  Button,
  Card,
  EmptyState,
  StatusBadge,
} from "@/components/ui";
import DeleteButton from "@/components/DeleteButton";
import ExportExcelButton from "@/components/ExportExcelButton";

export const dynamic = "force-dynamic";

export default async function HotelBookingsPage() {
  const bookings = await getHotelBookings();

  return (
    <>
      <PageHeader
        title="Hotel Bookings"
        subtitle="All hotel reservations"
        action={
          <div className="flex items-center gap-3">
            <ExportExcelButton
              filename="hotel-bookings"
              sheetName="Hotels"
              rows={hotelsToExcel(bookings)}
            />
            <Button href="/hotel/bookings/new">+ New Booking</Button>
          </div>
        }
      />
      <div className="p-8">
        {bookings.length === 0 ? (
          <EmptyState message="No hotel bookings yet. Create your first one." />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3 font-semibold">Code</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Guest</th>
                    <th className="px-5 py-3 font-semibold">Hotel</th>
                    <th className="px-5 py-3 font-semibold">Check-in</th>
                    <th className="px-5 py-3 font-semibold">Nights</th>
                    <th className="px-5 py-3 text-right font-semibold">Sale</th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Profit
                    </th>
                    <th className="px-5 py-3 font-semibold">Payment</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-slate-800">
                        {b.booking_code}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                        {formatDate(b.created_date)}
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
                      <td className="px-5 py-3 text-slate-600">{b.nights}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-slate-900">
                        {formatCurrency(b.total_sale_usd)}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-emerald-600">
                        {formatCurrency(b.profit_usd)}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={b.payment_status} />
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={b.booking_status} />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/hotel/bookings/${b.id}/voucher`}
                            className="font-medium text-brand hover:underline"
                          >
                            Voucher
                          </Link>
                          <Link
                            href={`/hotel/bookings/${b.id}`}
                            className="font-medium text-brand hover:underline"
                          >
                            Edit
                          </Link>
                          <DeleteButton
                            action={deleteHotelBookingAction}
                            id={b.id}
                            confirmMessage={`Move hotel booking ${b.booking_code} to Recycle Bin?`}
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
