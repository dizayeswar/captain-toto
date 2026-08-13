"use client";

import Link from "next/link";
import type { VisaCase } from "@/lib/types";
import { deleteVisaCaseAction } from "@/lib/actions";
import { formatCurrency, formatDate } from "@/lib/format";
import { VISA_CASE_STATUSES } from "@/lib/lists";
import { Card, StatusBadge } from "./ui";
import DeleteButton from "./DeleteButton";
import FilterableList from "./FilterableList";

export default function VisaCasesTable({ cases }: { cases: VisaCase[] }) {
  return (
    <FilterableList
      items={cases}
      searchPlaceholder="Search by client, destination, visa ID…"
      searchText={(v) =>
        `${v.visa_id} ${v.client_name} ${v.destination_country} ${v.visa_type} ${v.payment_status}`
      }
      statusOptions={VISA_CASE_STATUSES.map((s) => ({ value: s, label: s }))}
      statusValue={(v) => v.case_status}
      emptyMessage="No visa cases match your search."
    >
      {(rows) => (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3 font-semibold">Visa ID</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">Destination</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Total</th>
                  <th className="px-5 py-3 text-right font-semibold">Balance</th>
                  <th className="px-5 py-3 font-semibold">Payment</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-800">
                      {v.visa_id}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                      {formatDate(v.created_date)}
                    </td>
                    <td className="px-5 py-3 text-slate-800">{v.client_name}</td>
                    <td className="px-5 py-3 text-slate-600">
                      {v.destination_country || "—"}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {v.visa_type || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={v.case_status} />
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-slate-800">
                      {formatCurrency(v.total_sale_usd)}
                    </td>
                    <td
                      className={`px-5 py-3 text-right tabular-nums ${
                        v.balance_usd > 0
                          ? "font-medium text-red-600"
                          : "text-slate-800"
                      }`}
                    >
                      {formatCurrency(v.balance_usd)}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={v.payment_status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/visa/cases/${v.id}/voucher`}
                          className="font-medium text-brand hover:underline"
                        >
                          Voucher
                        </Link>
                        <Link
                          href={`/visa/cases/${v.id}`}
                          className="font-medium text-brand hover:underline"
                        >
                          Edit
                        </Link>
                        <DeleteButton
                          action={deleteVisaCaseAction}
                          id={v.id}
                          confirmMessage={`Move visa case ${v.visa_id} to Recycle Bin?`}
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
