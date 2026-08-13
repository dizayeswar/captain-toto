import { getVisaCases, VISA_LIST_SELECT } from "@/lib/visas";
import { visasToExcel } from "@/lib/excelRows";
import { PageHeader, Button, EmptyState } from "@/components/ui";
import ExportExcelButton from "@/components/ExportExcelButton";
import VisaCasesTable from "@/components/VisaCasesTable";

export const dynamic = "force-dynamic";

export default async function VisaCasesPage() {
  const cases = await getVisaCases(VISA_LIST_SELECT);

  return (
    <>
      <PageHeader
        title="Visa Cases"
        subtitle="All visa applications tracked in the system"
        action={
          <div className="flex items-center gap-3">
            <ExportExcelButton
              filename="visa-cases"
              sheetName="Visas"
              rows={visasToExcel(cases)}
            />
            <Button href="/visa/cases/new">+ New Case</Button>
          </div>
        }
      />
      <div className="p-8">
        {cases.length === 0 ? (
          <EmptyState message="No visa cases yet. Create your first one." />
        ) : (
          <VisaCasesTable cases={cases} />
        )}
      </div>
    </>
  );
}
