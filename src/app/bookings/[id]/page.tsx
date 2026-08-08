import { notFound } from "next/navigation";
import { getBooking } from "@/lib/bookings";
import { updateBookingAction } from "@/lib/actions";
import { PageHeader } from "@/components/ui";
import BookingForm from "@/components/BookingForm";

export default async function EditBookingPage(props: PageProps<"/bookings/[id]">) {
  const { id } = await props.params;
  const booking = await getBooking(id);
  if (!booking) notFound();

  const action = updateBookingAction.bind(null, booking.id);

  return (
    <>
      <PageHeader
        title={`Edit ${booking.booking_id}`}
        subtitle="Update the details of this booking"
      />
      <div className="p-8">
        <BookingForm
          action={action}
          booking={booking}
          submitLabel="Save Changes"
        />
      </div>
    </>
  );
}
