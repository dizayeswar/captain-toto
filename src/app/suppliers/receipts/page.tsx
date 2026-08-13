import { getSupplierPaymentReceipts } from "@/lib/supplierReceipts";
import { supplierReceiptsToExcel } from "@/lib/excelRows";
import { PageHeader, Button, EmptyState } from "@/components/ui";
import ExportExcelButton from "@/components/ExportExcelButton";
import SupplierReceiptsTable from "@/components/SupplierReceiptsTable";

export const dynamic = "force-dynamic";

export default async function SupplierReceiptsPage() {
  const receipts = await getSupplierPaymentReceipts();

  return (
    <>
      <PageHeader
        title="Payment Receipts"
        subtitle="A6 receipts for payments made to suppliers"
        action={
          <div className="flex items-center gap-3">
            <ExportExcelButton
              filename="supplier-payment-receipts"
              sheetName="Receipts"
              rows={supplierReceiptsToExcel(receipts)}
            />
            <Button href="/suppliers/receipts/new">+ New Payment Receipt</Button>
          </div>
        }
      />
      <div className="p-8">
        {receipts.length === 0 ? (
          <EmptyState message="No supplier payment receipts yet. Create your first one." />
        ) : (
          <SupplierReceiptsTable receipts={receipts} />
        )}
      </div>
    </>
  );
}
