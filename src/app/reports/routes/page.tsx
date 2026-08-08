import { getBookings, groupByKeys } from "@/lib/bookings";
import { ROUTES } from "@/lib/lists";
import { PageHeader } from "@/components/ui";
import GroupReport from "@/components/GroupReport";

export const dynamic = "force-dynamic";

export default async function RouteReportPage() {
  const bookings = await getBookings();
  const rows = groupByKeys(bookings, (b) => b.route, ROUTES);

  return (
    <>
      <PageHeader
        title="Route Analysis"
        subtitle="Bookings, revenue and profit per route"
      />
      <div className="p-8">
        <GroupReport
          keyHeader="Route"
          rows={rows}
          columns={["bookings", "revenue", "profit"]}
        />
      </div>
    </>
  );
}
