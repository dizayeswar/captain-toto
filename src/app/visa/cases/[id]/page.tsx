import { notFound } from "next/navigation";
import { getVisaCase } from "@/lib/visas";
import { updateVisaCaseAction } from "@/lib/actions";
import { PageHeader } from "@/components/ui";
import VisaForm from "@/components/VisaForm";

export const dynamic = "force-dynamic";

export default async function EditVisaCasePage(
  props: PageProps<"/visa/cases/[id]">
) {
  const { id } = await props.params;
  const visa = await getVisaCase(id);
  if (!visa) notFound();

  const action = updateVisaCaseAction.bind(null, visa.id);

  return (
    <>
      <PageHeader
        title={`Edit ${visa.visa_id}`}
        subtitle={visa.client_name}
      />
      <div className="p-8">
        <VisaForm action={action} visa={visa} submitLabel="Save Changes" />
      </div>
    </>
  );
}
