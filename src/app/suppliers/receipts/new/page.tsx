import { createSupplierPaymentReceiptAction } from "@/lib/actions";
import { getSuppliers } from "@/lib/suppliers";
import { PageHeader } from "@/components/ui";
import SupplierReceiptForm from "@/components/SupplierReceiptForm";

export const dynamic = "force-dynamic";

export default async function NewSupplierReceiptPage() {
  const records = await getSuppliers();
  const suppliers = records
    .filter((s) => s.active)
    .map((s) => s.name)
    .sort((a, b) => a.localeCompare(b));

  return (
    <>
      <PageHeader
        title="New Payment Receipt"
        subtitle="Create an A6 receipt for a payment to a supplier"
      />
      <div className="p-8">
        <SupplierReceiptForm
          action={createSupplierPaymentReceiptAction}
          suppliers={suppliers}
          submitLabel="Create Receipt"
        />
      </div>
    </>
  );
}
