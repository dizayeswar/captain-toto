import { getBookings } from "@/lib/bookings";
import { getStaffNames } from "@/lib/staffNames";
import { createPaymentInvoiceAction } from "@/lib/actions";
import { PageHeader } from "@/components/ui";
import PaymentForm, { type PaymentBookingOption } from "@/components/PaymentForm";

export const dynamic = "force-dynamic";

export default async function NewPaymentInvoicePage(
  props: PageProps<"/payments/new">
) {
  const { booking } = await props.searchParams;
  const initialBookingId = Array.isArray(booking) ? booking[0] : booking;

  const [bookings, staffNames] = await Promise.all([
    getBookings(),
    getStaffNames(),
  ]);
  const options: PaymentBookingOption[] = bookings.map((b) => ({
    booking_id: b.booking_id,
    client_name: b.client_name,
    total_paid: b.total_paid,
    route: b.route,
    airline: b.airline,
  }));

  return (
    <>
      <PageHeader
        title="New Payment Invoice"
        subtitle="Create a cash receipt for a payment received"
      />
      <div className="p-8">
        <PaymentForm
          action={createPaymentInvoiceAction}
          bookings={options}
          staffNames={staffNames}
          submitLabel="Create Payment Invoice"
          initialBookingId={initialBookingId}
        />
      </div>
    </>
  );
}
