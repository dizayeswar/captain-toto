import { notFound } from "next/navigation";
import { getPaymentInvoice } from "@/lib/payments";
import { getBookings } from "@/lib/bookings";
import { updatePaymentInvoiceAction } from "@/lib/actions";
import { PageHeader } from "@/components/ui";
import PaymentForm, { type PaymentBookingOption } from "@/components/PaymentForm";

export const dynamic = "force-dynamic";

export default async function EditPaymentInvoicePage(
  props: PageProps<"/payments/[id]/edit">
) {
  const { id } = await props.params;
  const receipt = await getPaymentInvoice(id);
  if (!receipt) notFound();

  const bookings = await getBookings();
  const options: PaymentBookingOption[] = bookings.map((b) => ({
    booking_id: b.booking_id,
    client_name: b.client_name,
    total_paid: b.total_paid,
    route: b.route,
    airline: b.airline,
  }));

  const action = updatePaymentInvoiceAction.bind(null, receipt.id);

  return (
    <>
      <PageHeader
        title={`Edit ${receipt.receipt_no}`}
        subtitle="Update this payment invoice"
      />
      <div className="p-8">
        <PaymentForm
          action={action}
          receipt={receipt}
          bookings={options}
          submitLabel="Save Changes"
        />
      </div>
    </>
  );
}
