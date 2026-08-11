import { notFound } from "next/navigation";
import { getHotelBooking } from "@/lib/hotels";
import { getSupplierOptions } from "@/lib/suppliers";
import { updateHotelBookingAction } from "@/lib/actions";
import { PageHeader } from "@/components/ui";
import HotelForm from "@/components/HotelForm";

export const dynamic = "force-dynamic";

export default async function EditHotelBookingPage(
  props: PageProps<"/hotel/bookings/[id]">
) {
  const { id } = await props.params;
  const [booking, suppliers] = await Promise.all([
    getHotelBooking(id),
    getSupplierOptions(),
  ]);
  if (!booking) notFound();

  const action = updateHotelBookingAction.bind(null, booking.id);
  const options =
    booking.supplier && !suppliers.some((s) => s.name === booking.supplier)
      ? [...suppliers, { code: "—", name: booking.supplier }]
      : suppliers;

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
          suppliers={options}
          submitLabel="Save Changes"
        />
      </div>
    </>
  );
}
