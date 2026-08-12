"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { deleteBookingAction } from "@/lib/actions";
import { formatCurrency, formatDate } from "@/lib/format";
import { PAYMENT_STATUSES } from "@/lib/lists";
import type { Booking } from "@/lib/types";
import { Card, StatusBadge, EmptyState } from "./ui";

export default function BookingsTable({ bookings }: { bookings: Booking[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchesQuery =
        query.trim() === "" ||
        `${b.booking_id} ${b.client_name} ${b.route} ${b.airline} ${b.handled_by}`
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesStatus = status === "All" || b.payment_status === status;
      return matchesQuery && matchesStatus;
    });
  }, [bookings, query, status]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by client, booking ID, route, airline…"
          className="min-w-64 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        >
          <option value="All">All statuses</option>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No ticket bookings match your search." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3 font-semibold">Ticket</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Client</th>
                  <th className="px-4 py-3 font-semibold">Route</th>
                  <th className="px-4 py-3 font-semibold">Airline</th>
                  <th className="px-4 py-3 text-right font-semibold">Ticket</th>
                  <th className="px-4 py-3 text-right font-semibold">Fee</th>
                  <th className="px-4 py-3 text-right font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Issued</th>
                  <th className="px-4 py-3 font-semibold">Staff</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {b.booking_id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {formatDate(b.booking_date)}
                    </td>
                    <td className="px-4 py-3 text-slate-800">{b.client_name}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {b.route}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {b.airline}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                      {formatCurrency(b.ticket_cost)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                      {formatCurrency(b.service_fee)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums text-slate-900">
                      {formatCurrency(b.total_paid)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.payment_status} />
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {b.issued ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{b.handled_by}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/bookings/${b.id}`}
                          className="font-medium text-brand hover:underline"
                        >
                          Edit
                        </Link>
                        <form
                          action={deleteBookingAction}
                          onSubmit={(e) => {
                            if (
                              !confirm(
                                `Move ticket booking ${b.booking_id} to Recycle Bin?`
                              )
                            ) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="id" value={b.id} />
                          <button
                            type="submit"
                            className="font-medium text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <p className="mt-3 text-xs text-slate-500">
        {filtered.length} of {bookings.length}{" "}
        {bookings.length === 1 ? "booking" : "bookings"}
      </p>
    </div>
  );
}
