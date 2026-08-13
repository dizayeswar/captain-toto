"use client";

import Link from "next/link";
import type { HotelBooking } from "@/lib/types";
import { deleteHotelBookingAction } from "@/lib/actions";
import { formatCurrency, formatDate } from "@/lib/format";
import { HOTEL_BOOKING_STATUSES } from "@/lib/lists";
import { Card, StatusBadge } from "./ui";
import DeleteButton from "./DeleteButton";
import FilterableList from "./FilterableList";

export default function HotelBookingsTable({
  bookings,
}: {
  bookings: HotelBooking[];
}) {
  return (
    <FilterableList
      items={bookings}
      searchPlaceholder="Search by guest, hotel, code…"
      searchText={(b) =>
        `${b.booking_code} ${b.lead_guest} ${b.hotel_name} ${b.payment_status}`
      }
      statusOptions={HOTEL_BOOKING_STATUSES.map((s) => ({
        value: s,
        label: s,
      }))}
      statusValue={(b) => b.booking_status}
      emptyMessage="No hotel bookings match your search."
    >
      {(rows) => (
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
                  <th className="px-5 py-3 text-right font-semibold">Profit</th>
                  <th className="px-5 py-3 font-semibold">Payment</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((b) => (
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
                    <td className="px-5 py-3 text-slate-600">{b.hotel_name}</td>
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
    </FilterableList>
  );
}
