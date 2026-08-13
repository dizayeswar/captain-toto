"use client";

import Link from "next/link";
import type { SupplierPaymentReceipt } from "@/lib/types";
import { deleteSupplierPaymentReceiptAction } from "@/lib/actions";
import { formatCurrency, formatDate } from "@/lib/format";
import { Card } from "./ui";
import DeleteButton from "./DeleteButton";
import FilterableList from "./FilterableList";

export default function SupplierReceiptsTable({
  receipts,
}: {
  receipts: SupplierPaymentReceipt[];
}) {
  return (
    <FilterableList
      items={receipts}
      searchPlaceholder="Search by supplier, receipt, invoice…"
      searchText={(r) =>
        `${r.receipt_no} ${r.supplier} ${r.signature} ${r.source_invoice_no ?? ""}`
      }
      itemDate={(r) => r.receipt_date}
      emptyMessage="No supplier payment receipts match your search."
    >
      {(rows) => (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3 font-semibold">ID</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Supplier</th>
                  <th className="px-5 py-3 text-right font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Signature</th>
                  <th className="px-5 py-3 font-semibold">Invoice</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-800">
                      {r.receipt_no}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                      {formatDate(r.receipt_date)}
                    </td>
                    <td className="px-5 py-3 text-slate-800" dir="auto">
                      {r.supplier || "—"}
                    </td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums text-slate-900">
                      {formatCurrency(r.amount)}
                    </td>
                    <td className="px-5 py-3 text-slate-700" dir="auto">
                      {r.signature || "—"}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {r.source_invoice_no || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/suppliers/receipts/${r.id}`}
                          className="font-medium text-brand hover:underline"
                        >
                          Print
                        </Link>
                        <Link
                          href={`/suppliers/receipts/${r.id}/edit`}
                          className="font-medium text-slate-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <DeleteButton
                          action={deleteSupplierPaymentReceiptAction}
                          id={r.id}
                          confirmMessage={`Move receipt ${r.receipt_no} to Recycle Bin?`}
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
