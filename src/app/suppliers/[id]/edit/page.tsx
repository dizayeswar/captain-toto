import { notFound } from "next/navigation";
import { getSupplier } from "@/lib/suppliers";
import { updateSupplierAction } from "@/lib/supplierActions";
import { PageHeader } from "@/components/ui";
import SupplierForm from "@/components/SupplierForm";

export const dynamic = "force-dynamic";

export default async function EditSupplierPage(
  props: PageProps<"/suppliers/[id]/edit">
) {
  const { id } = await props.params;
  const supplier = await getSupplier(id);
  if (!supplier) notFound();

  const action = updateSupplierAction.bind(null, supplier.id);

  return (
    <>
      <PageHeader
        title={`Edit ${supplier.name}`}
        subtitle={supplier.supplier_code}
      />
      <div className="p-8">
        <SupplierForm
          action={action}
          supplier={supplier}
          submitLabel="Save Changes"
        />
      </div>
    </>
  );
}
