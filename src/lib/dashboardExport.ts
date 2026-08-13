"use server";

import { getBookings } from "./bookings";
import { getHotelBookings } from "./hotels";
import { getVisaCases } from "./visas";
import { getSupplierInvoices } from "./supplierFinance";
import { getExpenses } from "./expenses";
import { getFinanceDeposits } from "./financeBalance";
import { getCurrentProfile, canAccessFinance } from "./auth";
import {
  bookingsToExcel,
  hotelsToExcel,
  visasToExcel,
  supplierInvoicesToExcel,
  expensesToExcel,
  depositsToExcel,
} from "./excelRows";
import type { ExcelCell } from "./excelTypes";

export type ExcelSheet = {
  name: string;
  rows: Record<string, ExcelCell>[];
};

/** Load full dashboard export sheets on demand (keeps overview page light). */
export async function loadDashboardExportSheets(): Promise<ExcelSheet[]> {
  const profile = await getCurrentProfile();
  const showFinance = profile ? canAccessFinance(profile.role) : false;

  const [bookings, hotels, visas, supplierInvoices, expenses, deposits] =
    await Promise.all([
      getBookings(),
      getHotelBookings(),
      getVisaCases(),
      getSupplierInvoices(),
      showFinance ? getExpenses() : Promise.resolve([]),
      showFinance ? getFinanceDeposits() : Promise.resolve([]),
    ]);

  return [
    { name: "Ticket bookings", rows: bookingsToExcel(bookings) },
    { name: "Hotels", rows: hotelsToExcel(hotels) },
    { name: "Visas", rows: visasToExcel(visas) },
    {
      name: "Supplier invoices",
      rows: supplierInvoicesToExcel(supplierInvoices),
    },
    ...(showFinance
      ? [
          { name: "Expenses", rows: expensesToExcel(expenses) },
          { name: "Deposits", rows: depositsToExcel(deposits) },
        ]
      : []),
  ];
}
