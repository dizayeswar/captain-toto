import {
  getSupplierInvoices,
  SUPPLIER_INVOICE_LIST_SELECT,
} from "@/lib/supplierFinance";
import { supplierInvoicesToExcel } from "@/lib/excelRows";
import { PageHeader, Button, EmptyState } from "@/components/ui";
import ExportExcelButton from "@/components/ExportExcelButton";
import SupplierInvoicesTable from "@/components/SupplierInvoicesTable";

export const dynamic = "force-dynamic";

export default async function SupplierInvoicesPage() {
  const invoices = await getSupplierInvoices(SUPPLIER_INVOICE_LIST_SELECT);

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
          <SupplierInvoicesTable invoices={invoices} />
        )}
      </div>
    </>
  );
}
