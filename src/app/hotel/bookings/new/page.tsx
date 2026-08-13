import { createHotelBookingAction } from "@/lib/actions";
import { getSupplierOptions } from "@/lib/suppliers";
import { getStaffNames } from "@/lib/staffNames";
import { PageHeader } from "@/components/ui";
import HotelForm from "@/components/HotelForm";

export const dynamic = "force-dynamic";

export default async function NewHotelBookingPage() {
  const [suppliers, staffNames] = await Promise.all([
    getSupplierOptions(),
    getStaffNames(),
  ]);

  return (
    <>
      <PageHeader
        title="New Hotel Booking"
        subtitle="Enter the details of a new hotel reservation"
      />
      <div className="p-8">
        <HotelForm
          action={createHotelBookingAction}
          suppliers={suppliers}
          staffNames={staffNames}
          submitLabel="Create Booking"
        />
      </div>
    </>
  );
}
