import { notFound } from "next/navigation";
import { getBooking } from "@/lib/bookings";
import { getSupplierOptions } from "@/lib/suppliers";
import { getStaffNames } from "@/lib/staffNames";
import { updateBookingAction } from "@/lib/actions";
import { PageHeader, Button } from "@/components/ui";
import BookingForm from "@/components/BookingForm";

export const dynamic = "force-dynamic";

export default async function EditBookingPage(props: PageProps<"/bookings/[id]">) {
  const { id } = await props.params;
  const [booking, suppliers, staffNames] = await Promise.all([
    getBooking(id),
    getSupplierOptions(),
    getStaffNames(),
  ]);
  if (!booking) notFound();

  const action = updateBookingAction.bind(null, booking.id);
  const options = ensureSupplierOption(suppliers, booking.supplier_name, booking.supplier_code);

  return (
    <>
      <PageHeader
        title={`Edit ${booking.booking_id}`}
        subtitle="Update the details of this ticket booking"
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Button href={`/bookings/${booking.id}/print`} variant="secondary">
              Print
            </Button>
            <Button
              href={`/payments/new?booking=${encodeURIComponent(
                booking.booking_id
              )}`}
              variant="secondary"
            >
              + Payment Invoice
            </Button>
          </div>
        }
      />
      <div className="p-8">
        <BookingForm
          action={action}
          booking={booking}
          suppliers={options}
          staffNames={staffNames}
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
