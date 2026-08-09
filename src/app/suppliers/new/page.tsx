import { createSupplierAction } from "@/lib/supplierActions";
import { PageHeader } from "@/components/ui";
import SupplierForm from "@/components/SupplierForm";

export const dynamic = "force-dynamic";

export default function NewSupplierPage() {
  return (
    <>
      <PageHeader
        title="New Supplier"
        subtitle="Add a supplier to the shared directory"
      />
      <div className="p-8">
        <SupplierForm
          action={createSupplierAction}
          submitLabel="Create Supplier"
        />
      </div>
    </>
  );
}
