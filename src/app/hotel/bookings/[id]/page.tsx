import { notFound } from "next/navigation";
import { getHotelBooking } from "@/lib/hotels";
import { updateHotelBookingAction } from "@/lib/actions";
import { PageHeader } from "@/components/ui";
import HotelForm from "@/components/HotelForm";

export const dynamic = "force-dynamic";

export default async function EditHotelBookingPage(
  props: PageProps<"/hotel/bookings/[id]">
) {
  const { id } = await props.params;
  const booking = await getHotelBooking(id);
  if (!booking) notFound();

  const action = updateHotelBookingAction.bind(null, booking.id);

  return (
    <>
      <PageHeader
        title={`Edit ${booking.booking_code}`}
        subtitle={`${booking.lead_guest} · ${booking.hotel_name}`}
      />
      <div className="p-8">
        <HotelForm
          action={action}
          booking={booking}
          submitLabel="Save Changes"
        />
      </div>
    </>
  );
}
