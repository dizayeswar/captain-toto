import Link from "next/link";
import { getSupplierInvoices } from "@/lib/supplierFinance";
import { supplierInvoicesToExcel } from "@/lib/excelRows";
import { deleteSupplierInvoiceAction } from "@/lib/actions";
import { formatCurrency, formatDate } from "@/lib/format";
import { PageHeader, Button, Card, EmptyState } from "@/components/ui";
import DeleteButton from "@/components/DeleteButton";
import ExportExcelButton from "@/components/ExportExcelButton";

export const dynamic = "force-dynamic";

export default async function SupplierInvoicesPage() {
  const invoices = await getSupplierInvoices();

  return (
    <>
      <PageHeader
        title="Supplier Invoices"
        subtitle="Service invoices from suppliers (ticket, hotel, visa, etc.)"
        action={
          <div className="flex items-center gap-3">
            <ExportExcelButton
              filename="supplier-invoices"
              sheetName="Supplier Invoices"
              rows={supplierInvoicesToExcel(invoices)}
            />
            <Button href="/suppliers/invoices/new">+ New Supplier Invoice</Button>
          </div>
        }
      />
      <div className="p-8">
        {invoices.length === 0 ? (
          <EmptyState message="No supplier invoices yet. Create your first one." />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3 font-semibold">Invoice ID</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Supplier</th>
                    <th className="px-5 py-3 font-semibold">Service</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Payment</th>
                    <th className="px-5 py-3 text-right font-semibold">Amount</th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Outstanding
                    </th>
                    <th className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-slate-800">
                        {inv.invoice_id}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                        {formatDate(inv.invoice_date)}
                      </td>
                      <td className="px-5 py-3 text-slate-800" dir="auto">
                        {inv.supplier || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {inv.service_type || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {inv.invoice_status || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {inv.payment_status || "—"}
                      </td>
                      <td className="px-5 py-3 text-right font-medium tabular-nums text-slate-900">
                        {formatCurrency(inv.invoice_amount)}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-amber-600">
                        {formatCurrency(inv.outstanding_usd)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/suppliers/invoices/${inv.id}/print`}
                            className="font-medium text-brand hover:underline"
                          >
                            Print
                          </Link>
                          <Link
                            href={`/suppliers/invoices/${inv.id}`}
                            className="font-medium text-brand hover:underline"
                          >
                            Edit
                          </Link>
                          <DeleteButton
                            action={deleteSupplierInvoiceAction}
                            id={inv.id}
                            confirmMessage={`Delete supplier invoice ${inv.invoice_id}?`}
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
