"use client";

import Link from "next/link";
import type { Invoice } from "@/lib/types";
import { deleteInvoiceAction } from "@/lib/actions";
import { formatDate } from "@/lib/format";
import { RESERVATION_STATUSES } from "@/lib/lists";
import { Card, StatusBadge } from "./ui";
import DeleteButton from "./DeleteButton";
import FilterableList from "./FilterableList";

export default function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
  return (
    <FilterableList
      items={invoices}
      searchPlaceholder="Search by invoice, client, airline, PNR…"
      searchText={(inv) =>
        `${inv.invoice_no} ${inv.booking_id} ${inv.client_name} ${inv.airline} ${inv.pnr}`
      }
      statusOptions={RESERVATION_STATUSES.map((s) => ({
        value: s,
        label: s,
      }))}
      statusValue={(inv) => inv.reservation_status}
      emptyMessage="No invoices match your search."
    >
      {(rows) => (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3 font-semibold">Invoice No.</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Ticket</th>
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">Airline</th>
                  <th className="px-5 py-3 font-semibold">PNR</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-800">
                      {inv.invoice_no}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                      {formatDate(inv.invoice_date)}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {inv.booking_id || "—"}
                    </td>
                    <td className="px-5 py-3 text-slate-800" dir="auto">
                      {inv.client_name || "—"}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{inv.airline}</td>
                    <td className="px-5 py-3 text-slate-600">
                      {inv.pnr || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={inv.reservation_status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/invoices/${inv.id}`}
                          className="font-medium text-brand hover:underline"
                        >
                          View / Print
                        </Link>
                        <Link
                          href={`/invoices/${inv.id}/edit`}
                          className="font-medium text-slate-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <DeleteButton
                          action={deleteInvoiceAction}
                          id={inv.id}
                          confirmMessage={`Move invoice ${inv.invoice_no} to Recycle Bin?`}
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
