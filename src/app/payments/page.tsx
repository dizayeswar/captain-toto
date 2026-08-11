import Link from "next/link";
import { getPaymentInvoices } from "@/lib/payments";
import { paymentsToExcel } from "@/lib/excelRows";
import { deletePaymentInvoiceAction } from "@/lib/actions";
import { formatCurrency, formatDate } from "@/lib/format";
import { PageHeader, Button, Card, EmptyState } from "@/components/ui";
import DeleteButton from "@/components/DeleteButton";
import ExportExcelButton from "@/components/ExportExcelButton";

export const dynamic = "force-dynamic";

export default async function PaymentInvoicesPage() {
  const receipts = await getPaymentInvoices();

  return (
    <>
      <PageHeader
        title="Payment Invoices"
        subtitle="Cash receipts confirming payments received"
        action={
          <div className="flex items-center gap-3">
            <ExportExcelButton
              filename="payment-invoices"
              sheetName="Payments"
              rows={paymentsToExcel(receipts)}
            />
            <Button href="/payments/new">+ New Payment Invoice</Button>
          </div>
        }
      />
      <div className="p-8">
        {receipts.length === 0 ? (
          <EmptyState message="No payment invoices yet. Create your first one." />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3 font-semibold">Receipt No.</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Received From</th>
                    <th className="px-5 py-3 font-semibold">For</th>
                    <th className="px-5 py-3 font-semibold">Booking</th>
                    <th className="px-5 py-3 text-right font-semibold">Amount</th>
                    <th className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {receipts.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-slate-800">
                        {r.receipt_no}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                        {formatDate(r.receipt_date)}
                      </td>
                      <td className="px-5 py-3 text-slate-800" dir="auto">
                        {r.received_from || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-600" dir="auto">
                        {r.for_text || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {r.booking_id || "—"}
                      </td>
                      <td className="px-5 py-3 text-right font-medium tabular-nums text-slate-900">
                        {formatCurrency(r.amount)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/payments/${r.id}`}
                            className="font-medium text-brand hover:underline"
                          >
                            View / Print
                          </Link>
                          <Link
                            href={`/payments/${r.id}/edit`}
                            className="font-medium text-slate-600 hover:underline"
                          >
                            Edit
                          </Link>
                          <DeleteButton
                            action={deletePaymentInvoiceAction}
                            id={r.id}
                            confirmMessage={`Delete payment invoice ${r.receipt_no}?`}
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
