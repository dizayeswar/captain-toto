import { getBookings, groupBy } from "@/lib/bookings";
import { groupRowsToExcel } from "@/lib/excelRows";
import { PageHeader } from "@/components/ui";
import GroupReport from "@/components/GroupReport";
import ExportExcelButton from "@/components/ExportExcelButton";

export const dynamic = "force-dynamic";

export default async function ClientReportPage() {
  const bookings = await getBookings();
  const rows = groupBy(bookings, (b) => b.client_name);

  return (
    <>
      <PageHeader
        title="Client Analysis"
        subtitle="Performance broken down by client"
        action={
          <ExportExcelButton
            filename="client-analysis"
            sheetName="Clients"
            rows={groupRowsToExcel(rows, "Client")}
          />
        }
      />
      <div className="p-8">
        <GroupReport keyHeader="Client" rows={rows} />
      </div>
    </>
  );
}
