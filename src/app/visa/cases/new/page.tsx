import { createVisaCaseAction } from "@/lib/actions";
import { getSupplierOptions } from "@/lib/suppliers";
import { PageHeader } from "@/components/ui";
import VisaForm from "@/components/VisaForm";

export const dynamic = "force-dynamic";

export default async function NewVisaCasePage() {
  const suppliers = await getSupplierOptions();

  return (
    <>
      <PageHeader
        title="New Visa Case"
        subtitle="Enter the details of a new visa application"
      />
      <div className="p-8">
        <VisaForm
          action={createVisaCaseAction}
          suppliers={suppliers}
          submitLabel="Create Case"
        />
      </div>
    </>
  );
}
