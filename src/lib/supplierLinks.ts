import { getBookings } from "./bookings";
import { getHotelBookings } from "./hotels";
import { getVisaCases } from "./visas";
import type { SupplierLinkOption } from "./supplierLinkOptions";

export type { SupplierLinkOption } from "./supplierLinkOptions";
export { filterSupplierLinkOptions } from "./supplierLinkOptions";

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
      supplier: b.supplier_name || "",
      label: `${b.booking_id} · Ticket · ${b.client_name} · $${b.ticket_cost}`,
      amount: b.ticket_cost, // NO service fee
      description: `TICKET — ${b.route} (${b.airline})`,
      client_name: b.client_name,
      pnr: b.pnr || "",
      route: b.route,
      issue_date: b.booking_date,
    });
  }

  for (const h of hotels) {
    const dates =
      h.check_in && h.check_out
        ? `Dept. ${h.check_in} / Return ${h.check_out}`
        : "";
    // Prefer check-in for hotel date filtering; fall back to created date.
    const issueDate = h.check_in || h.created_date || "";
    options.push({
      ref: h.booking_code,
      service_type: "Hotel",
      supplier: h.supplier || "",
      label: `${h.booking_code} · Hotel · ${h.lead_guest} · $${h.total_cost_usd}`,
      amount: h.total_cost_usd,
      description: `HOTEL — ${h.hotel_name}${dates ? ` · ${dates}` : ""}`,
      client_name: h.lead_guest,
      pnr: h.hotel_confirmation_no || "",
      route: [h.city, h.destination_country].filter(Boolean).join(" / "),
      issue_date: issueDate,
    });
  }

  for (const v of visas) {
    options.push({
      ref: v.visa_id,
      service_type: "Visa",
      supplier: v.supplier_name || "",
      label: `${v.visa_id} · Visa · ${v.client_name} · $${v.total_sale_usd}`,
      amount: v.total_sale_usd,
      description: `SERVICES — ${v.visa_type} / ${v.destination_country}`,
      client_name: v.client_name,
      pnr: v.provider_reference || "",
      route: v.destination_country,
      issue_date: v.created_date,
    });
  }

  return options;
}
