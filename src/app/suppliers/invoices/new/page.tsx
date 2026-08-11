import { createSupplierInvoiceAction } from "@/lib/actions";
import { getSuppliers } from "@/lib/supplierFinance";
import { getSupplierLinkOptions } from "@/lib/supplierLinks";
import { PageHeader } from "@/components/ui";
import SupplierInvoiceForm from "@/components/SupplierInvoiceForm";

export const dynamic = "force-dynamic";

export default async function NewSupplierInvoicePage() {
  const [records, linkOptions] = await Promise.all([
    getSuppliers(),
    getSupplierLinkOptions(),
  ]);
  const suppliers = records
    .filter((s) => s.active)
    .map((s) => s.name)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  return (
    <>
      <PageHeader
        title="New Supplier Service Invoice"
        subtitle="Detailed line items — ticket cost only (no service fee), hotel, visa, other"
      />
      <div className="p-8">
        <SupplierInvoiceForm
          action={createSupplierInvoiceAction}
          suppliers={suppliers}
          linkOptions={linkOptions}
          submitLabel="Create Supplier Invoice"
        />
      </div>
    </>
  );
}
