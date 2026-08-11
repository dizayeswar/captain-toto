import { getBookings } from "./bookings";
import { getHotelBookings } from "./hotels";
import { getVisaCases } from "./visas";

export type SupplierLinkOption = {
  ref: string;
  service_type: string;
  label: string;
  amount: number;
  description: string;
};

/** Build link options for supplier invoice line items (cost only). */
export async function getSupplierLinkOptions(): Promise<SupplierLinkOption[]> {
  const [tickets, hotels, visas] = await Promise.all([
    getBookings(),
    getHotelBookings(),
    getVisaCases(),
  ]);

  const options: SupplierLinkOption[] = [];

  for (const b of tickets) {
    options.push({
      ref: b.booking_id,
      service_type: "Ticket",
      label: `${b.booking_id} · Ticket · ${b.client_name} · $${b.ticket_cost}`,
      amount: b.ticket_cost, // NO service fee
      description: `Flight ticket ${b.route} (${b.airline}) — ${b.client_name}`,
    });
  }

  for (const h of hotels) {
    options.push({
      ref: h.booking_code,
      service_type: "Hotel",
      label: `${h.booking_code} · Hotel · ${h.lead_guest} · $${h.total_cost_usd}`,
      amount: h.total_cost_usd,
      description: `Hotel ${h.hotel_name} — ${h.city} / ${h.destination_country}`,
    });
  }

  for (const v of visas) {
    options.push({
      ref: v.visa_id,
      service_type: "Visa",
      label: `${v.visa_id} · Visa · ${v.client_name} · $${v.total_sale_usd}`,
      amount: v.total_sale_usd,
      description: `${v.visa_type} visa — ${v.destination_country} (${v.client_name})`,
    });
  }

  return options;
}
