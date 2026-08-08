import { getBookings, groupByKeys } from "@/lib/bookings";
import { AIRLINES } from "@/lib/lists";
import { PageHeader } from "@/components/ui";
import GroupReport from "@/components/GroupReport";

export default async function AirlineReportPage() {
  const bookings = await getBookings();
  const rows = groupByKeys(bookings, (b) => b.airline, AIRLINES);

  return (
    <>
      <PageHeader
        title="Airline Analysis"
        subtitle="Bookings, revenue and profit per airline"
      />
      <div className="p-8">
        <GroupReport
          keyHeader="Airline"
          rows={rows}
          columns={["bookings", "revenue", "profit"]}
        />
      </div>
    </>
  );
}
