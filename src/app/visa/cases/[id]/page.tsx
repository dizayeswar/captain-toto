import { notFound } from "next/navigation";
import { getVisaCase } from "@/lib/visas";
import { getSupplierOptions } from "@/lib/suppliers";
import { updateVisaCaseAction } from "@/lib/actions";
import { PageHeader } from "@/components/ui";
import VisaForm from "@/components/VisaForm";

export const dynamic = "force-dynamic";

export default async function EditVisaCasePage(
  props: PageProps<"/visa/cases/[id]">
) {
  const { id } = await props.params;
  const [visa, suppliers] = await Promise.all([
    getVisaCase(id),
    getSupplierOptions(),
  ]);
  if (!visa) notFound();

  const action = updateVisaCaseAction.bind(null, visa.id);
  const options =
    visa.supplier_name &&
    !suppliers.some((s) => s.name === visa.supplier_name)
      ? [
          ...suppliers,
          {
            code: visa.supplier_code || "—",
            name: visa.supplier_name,
          },
        ]
      : suppliers;

  return (
    <>
      <PageHeader
        title={`Edit ${visa.visa_id}`}
        subtitle={visa.client_name}
      />
      <div className="p-8">
        <VisaForm
          action={action}
          visa={visa}
          suppliers={options}
          submitLabel="Save Changes"
        />
      </div>
    </>
  );
}
