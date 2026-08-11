import { notFound } from "next/navigation";
import { getBooking } from "@/lib/bookings";
import { getSupplierOptions } from "@/lib/suppliers";
import { updateBookingAction } from "@/lib/actions";
import { PageHeader, Button } from "@/components/ui";
import BookingForm from "@/components/BookingForm";

export const dynamic = "force-dynamic";

export default async function EditBookingPage(props: PageProps<"/bookings/[id]">) {
  const { id } = await props.params;
  const [booking, suppliers] = await Promise.all([
    getBooking(id),
    getSupplierOptions(),
  ]);
  if (!booking) notFound();

  const action = updateBookingAction.bind(null, booking.id);
  const options = ensureSupplierOption(suppliers, booking.supplier_name, booking.supplier_code);

  return (
    <>
      <PageHeader
        title={`Edit ${booking.booking_id}`}
        subtitle="Update the details of this booking"
        action={
          <Button
            href={`/payments/new?booking=${encodeURIComponent(
              booking.booking_id
            )}`}
            variant="secondary"
          >
            + Payment Invoice
          </Button>
        }
      />
      <div className="p-8">
        <BookingForm
          action={action}
          booking={booking}
          suppliers={options}
          submitLabel="Save Changes"
        />
      </div>
    </>
  );
}

function ensureSupplierOption(
  list: { code: string; name: string }[],
  name: string,
  code: string
) {
  if (!name) return list;
  if (list.some((s) => s.name === name)) return list;
  return [...list, { code: code || "—", name }];
}
