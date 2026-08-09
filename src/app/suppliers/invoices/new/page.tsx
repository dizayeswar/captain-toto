import {
  createSupplierInvoiceAction,
} from "@/lib/actions";
import { getSuppliers } from "@/lib/supplierFinance";
import { SUPPLIERS } from "@/lib/lists";
import { PageHeader } from "@/components/ui";
import SupplierInvoiceForm from "@/components/SupplierInvoiceForm";

export const dynamic = "force-dynamic";

export default async function NewSupplierInvoicePage() {
  const records = await getSuppliers();
  const names = new Set<string>([
    ...SUPPLIERS.map((s) => s.name),
    ...records.map((s) => s.name),
  ]);
  const suppliers = [...names].filter(Boolean).sort((a, b) =>
    a.localeCompare(b)
  );

  return (
    <>
      <PageHeader
        title="New Supplier Invoice"
        subtitle="Record an invoice received from a supplier"
      />
      <div className="p-8">
        <SupplierInvoiceForm
          action={createSupplierInvoiceAction}
          suppliers={suppliers}
          submitLabel="Create Supplier Invoice"
        />
      </div>
    </>
  );
}
