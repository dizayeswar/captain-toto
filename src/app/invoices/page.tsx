import { getInvoices } from "@/lib/invoices";
import { invoicesToExcel } from "@/lib/excelRows";
import { PageHeader, Button, EmptyState } from "@/components/ui";
import ExportExcelButton from "@/components/ExportExcelButton";
import InvoicesTable from "@/components/InvoicesTable";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return (
    <>
      <PageHeader
        title="Ticket Invoices"
        subtitle="Prepare and print ticket invoices for clients"
        action={
          <div className="flex items-center gap-3">
            <ExportExcelButton
              filename="ticket-invoices"
              sheetName="Invoices"
              rows={invoicesToExcel(invoices)}
            />
            <Button href="/invoices/new">+ New Invoice</Button>
          </div>
        }
      />
      <div className="p-8">
        {invoices.length === 0 ? (
          <EmptyState message="No invoices yet. Create your first one." />
        ) : (
          <InvoicesTable invoices={invoices} />
        )}
      </div>
    </>
  );
}
