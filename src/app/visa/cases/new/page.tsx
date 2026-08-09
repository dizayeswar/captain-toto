import { createVisaCaseAction } from "@/lib/actions";
import { PageHeader } from "@/components/ui";
import VisaForm from "@/components/VisaForm";

export const dynamic = "force-dynamic";

export default function NewVisaCasePage() {
  return (
    <>
      <PageHeader
        title="New Visa Case"
        subtitle="Enter the details of a new visa application"
      />
      <div className="p-8">
        <VisaForm action={createVisaCaseAction} submitLabel="Create Case" />
      </div>
    </>
  );
}
