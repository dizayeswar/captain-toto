import { notFound } from "next/navigation";
import { getSupplierPaymentReceipt } from "@/lib/supplierReceipts";
import { getSuppliers } from "@/lib/suppliers";
import { updateSupplierPaymentReceiptAction } from "@/lib/actions";
import { PageHeader } from "@/components/ui";
import SupplierReceiptForm from "@/components/SupplierReceiptForm";

export const dynamic = "force-dynamic";

export default async function EditSupplierReceiptPage(
  props: PageProps<"/suppliers/receipts/[id]/edit">
) {
  const { id } = await props.params;
  const [receipt, records] = await Promise.all([
    getSupplierPaymentReceipt(id),
    getSuppliers(),
  ]);
  if (!receipt) notFound();

  const names = new Set(
    records.filter((s) => s.active).map((s) => s.name)
  );
  if (receipt.supplier) names.add(receipt.supplier);
  const suppliers = [...names].sort((a, b) => a.localeCompare(b));

  const action = updateSupplierPaymentReceiptAction.bind(null, receipt.id);

  return (
    <>
      <PageHeader
        title={`Edit ${receipt.receipt_no}`}
        subtitle="Update this supplier payment receipt"
      />
      <div className="p-8">
        <SupplierReceiptForm
          action={action}
          receipt={receipt}
          suppliers={suppliers}
          submitLabel="Save Changes"
        />
      </div>
    </>
  );
}
