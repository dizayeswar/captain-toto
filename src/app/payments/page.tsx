import { getPaymentInvoices } from "@/lib/payments";
import { paymentsToExcel } from "@/lib/excelRows";
import { PageHeader, Button, EmptyState } from "@/components/ui";
import ExportExcelButton from "@/components/ExportExcelButton";
import PaymentsTable from "@/components/PaymentsTable";

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
          <PaymentsTable receipts={receipts} />
        )}
      </div>
    </>
  );
}
