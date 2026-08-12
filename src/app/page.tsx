import Link from "next/link";
import { getCurrentProfile, canAccessFinance } from "@/lib/auth";
import { getBookings, computeTotals } from "@/lib/bookings";
import { getHotelBookings, summarizeHotels } from "@/lib/hotels";
import { getVisaCases, summarizeVisas } from "@/lib/visas";
import {
  getSupplierInvoices,
  summarizeSupplierFinance,
} from "@/lib/supplierFinance";
import { getExpenses, summarizeExpenses } from "@/lib/expenses";
import {
  getFinanceDeposits,
  computeFinanceBalance,
  computeOwedToOthers,
} from "@/lib/financeBalance";
import {
  bookingsToExcel,
  hotelsToExcel,
  visasToExcel,
  supplierInvoicesToExcel,
  expensesToExcel,
  depositsToExcel,
} from "@/lib/excelRows";
import { formatCurrency, formatNumber } from "@/lib/format";
import { PageHeader, StatCard } from "@/components/ui";
import ExportExcelButton from "@/components/ExportExcelButton";

export const dynamic = "force-dynamic";

function SectionHeader({
  title,
  href,
  linkLabel = "Open →",
}: {
  title: string;
  href: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <Link
        href={href}
        className="text-sm font-medium text-brand hover:underline"
      >
        {linkLabel}
      </Link>
    </div>
  );
}

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  const showFinance = profile ? canAccessFinance(profile.role) : false;

  const [
    bookings,
    hotels,
    visas,
    supplierInvoices,
    expenses,
    deposits,
  ] = await Promise.all([
    getBookings(),
    getHotelBookings(),
    getVisaCases(),
    getSupplierInvoices(),
    showFinance ? getExpenses() : Promise.resolve([]),
    showFinance ? getFinanceDeposits() : Promise.resolve([]),
  ]);

  const ticket = computeTotals(bookings);
  const hotel = summarizeHotels(hotels);
  const visa = summarizeVisas(visas);
  const supplier = summarizeSupplierFinance(supplierInvoices);
  const expense = summarizeExpenses(expenses);
  const balance = computeFinanceBalance(deposits, expenses);
  const owed = computeOwedToOthers(expenses);

  const exportSheets = [
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

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Summary of ticket bookings, hotel, visa, suppliers, and finance"
        action={
          <ExportExcelButton
            filename="dashboard-overview"
            label="Export to Excel"
            sheets={exportSheets}
          />
        }
      />

      <div className="space-y-10 p-8">
        <section>
          <SectionHeader title="Ticket" href="/bookings" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              href="/bookings"
              label="Ticket bookings"
              value={String(ticket.bookings)}
            />
            <StatCard
              href="/bookings"
              label="Revenue"
              value={formatCurrency(ticket.revenue)}
            />
            <StatCard
              href="/bookings"
              label="Profit"
              value={formatCurrency(ticket.profit)}
              tone="green"
            />
            <StatCard
              href="/bookings"
              label="Pending"
              value={String(ticket.pending)}
              tone={ticket.pending > 0 ? "amber" : "default"}
            />
          </div>
        </section>

        <section>
          <SectionHeader title="Hotel" href="/hotel" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <StatCard
              href="/hotel/bookings"
              label="Bookings"
              value={String(hotel.total)}
            />
            <StatCard
              href="/hotel/bookings"
              label="Confirmed"
              value={String(hotel.confirmed)}
            />
            <StatCard
              href="/hotel"
              label="Sale"
              value={formatCurrency(hotel.totalSale)}
            />
            <StatCard
              href="/hotel"
              label="Profit"
              value={formatCurrency(hotel.totalProfit)}
              tone={hotel.totalProfit < 0 ? "red" : "green"}
            />
            <StatCard
              href="/hotel/bookings"
              label="Outstanding"
              value={formatCurrency(hotel.outstanding)}
              tone={hotel.outstanding > 0 ? "amber" : "default"}
            />
          </div>
        </section>

        <section>
          <SectionHeader title="Visa" href="/visa" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <StatCard
              href="/visa/cases"
              label="Cases"
              value={String(visa.total)}
            />
            <StatCard
              href="/visa/cases"
              label="Approved"
              value={String(visa.approved)}
            />
            <StatCard
              href="/visa"
              label="Appointments (30d)"
              value={String(visa.appointments)}
              tone={visa.appointments > 0 ? "amber" : "default"}
            />
            <StatCard
              href="/visa"
              label="Sales"
              value={formatCurrency(visa.totalSales)}
            />
            <StatCard
              href="/visa/cases"
              label="Outstanding"
              value={formatCurrency(visa.outstanding)}
              tone={visa.outstanding > 0 ? "amber" : "default"}
            />
          </div>
        </section>

        <section>
          <SectionHeader title="Supplier Finance" href="/suppliers/dashboard" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              href="/suppliers/invoices"
              label="Open invoices"
              value={String(supplier.openInvoices)}
            />
            <StatCard
              href="/suppliers/dashboard"
              label="Outstanding"
              value={formatCurrency(supplier.outstanding)}
              tone={supplier.outstanding > 0 ? "amber" : "default"}
            />
            <StatCard
              href="/suppliers/receipts"
              label="Paid to suppliers"
              value={formatCurrency(supplier.paidToSuppliers)}
            />
            <StatCard
              href="/suppliers/invoices"
              label="Refunded"
              value={formatCurrency(supplier.refunded)}
            />
          </div>
        </section>

        {showFinance && (
          <section>
            <SectionHeader title="Finance" href="/finance" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <StatCard
                href="/finance"
                label="Balance IQD"
                value={`${formatNumber(balance.balanceIqd)} IQD`}
                tone={balance.balanceIqd < 0 ? "red" : "green"}
              />
              <StatCard
                href="/finance"
                label="Balance USD"
                value={formatCurrency(balance.balanceUsd)}
                tone={balance.balanceUsd < 0 ? "red" : "green"}
              />
              <StatCard
                href="/finance"
                label="Expenses"
                value={String(expense.count)}
                hint={`${formatCurrency(expense.totalUsd)} · ${formatNumber(expense.totalIqd)} IQD`}
              />
              <StatCard
                href="/finance"
                label="Owed IQD"
                value={`${formatNumber(owed.totalIqd)} IQD`}
                tone={owed.totalIqd > 0 ? "amber" : "default"}
              />
              <StatCard
                href="/finance"
                label="Owed USD"
                value={formatCurrency(owed.totalUsd)}
                tone={owed.totalUsd > 0 ? "amber" : "default"}
              />
              <StatCard
                href="/finance/summary"
                label="Expense summary"
                value="→"
                hint="By month & category"
              />
            </div>
          </section>
        )}
      </div>
    </>
  );
}
