import { getHotelBookings, HOTEL_LIST_SELECT } from "@/lib/hotels";
import { hotelsToExcel } from "@/lib/excelRows";
import { PageHeader, Button, EmptyState } from "@/components/ui";
import ExportExcelButton from "@/components/ExportExcelButton";
import HotelBookingsTable from "@/components/HotelBookingsTable";

export const dynamic = "force-dynamic";

export default async function HotelBookingsPage() {
  const bookings = await getHotelBookings(HOTEL_LIST_SELECT);

  return (
    <>
      <PageHeader
        title="Hotel Bookings"
        subtitle="All hotel reservations"
        action={
          <div className="flex items-center gap-3">
            <ExportExcelButton
              filename="hotel-bookings"
              sheetName="Hotels"
              rows={hotelsToExcel(bookings)}
            />
            <Button href="/hotel/bookings/new">+ New Booking</Button>
          </div>
        }
      />
      <div className="p-8">
        {bookings.length === 0 ? (
          <EmptyState message="No hotel bookings yet. Create your first one." />
        ) : (
          <HotelBookingsTable bookings={bookings} />
        )}
      </div>
    </>
  );
}
