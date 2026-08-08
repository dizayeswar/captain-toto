import { getBookings, groupBy } from "@/lib/bookings";
import { PageHeader } from "@/components/ui";
import GroupReport from "@/components/GroupReport";

export const dynamic = "force-dynamic";

export default async function ClientReportPage() {
  const bookings = await getBookings();
  const rows = groupBy(bookings, (b) => b.client_name);

  return (
    <>
      <PageHeader
        title="Client Analysis"
        subtitle="Performance broken down by client"
      />
      <div className="p-8">
        <GroupReport keyHeader="Client" rows={rows} />
      </div>
    </>
  );
}
