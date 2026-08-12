import Link from "next/link";
import { getCurrentProfile, canAccessFinance } from "@/lib/auth";
import { getBookings, computeTotals } from "@/lib/bookings";
import { getHotelBookings, summarizeHotels } from "@/lib/hotels";
import { getVisaCases, summarizeVisas } from "@/lib/visas";
import { getInvoices } from "@/lib/invoices";
import { getPaymentInvoices, summarizePayments } from "@/lib/payments";
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
import { formatCurrency, formatNumber } from "@/lib/format";
import { PageHeader, StatCard, Button } from "@/components/ui";

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
    invoices,
    payments,
    supplierInvoices,
    expenses,
    deposits,
  ] = await Promise.all([
    getBookings(),
    getHotelBookings(),
    getVisaCases(),
    getInvoices(),
    getPaymentInvoices(),
    getSupplierInvoices(),
    showFinance ? getExpenses() : Promise.resolve([]),
    showFinance ? getFinanceDeposits() : Promise.resolve([]),
  ]);

  const ticket = computeTotals(bookings);
  const hotel = summarizeHotels(hotels);
  const visa = summarizeVisas(visas);
  const payment = summarizePayments(payments);
  const supplier = summarizeSupplierFinance(supplierInvoices);
  const expense = summarizeExpenses(expenses);
  const balance = computeFinanceBalance(deposits, expenses);
  const owed = computeOwedToOthers(expenses);

  const companyProfit = ticket.profit + hotel.totalProfit;

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Summary of ticket bookings, invoices, hotel, visa, suppliers, and finance"
        action={<Button href="/bookings/new">+ New Ticket booking</Button>}
      />

      <div className="space-y-10 p-8">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">
            At a glance
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard
              href="/bookings"
              label="Ticket bookings"
              value={String(ticket.bookings)}
              hint={`${ticket.pending} pending`}
            />
            <StatCard
              href="/bookings"
              label="Ticket profit"
              value={formatCurrency(ticket.profit)}
              tone={ticket.profit >= 0 ? "green" : "red"}
            />
            <StatCard
              href="/hotel"
              label="Hotel profit"
              value={formatCurrency(hotel.totalProfit)}
              tone={hotel.totalProfit >= 0 ? "green" : "red"}
            />
            <StatCard
              href="/visa"
              label="Visa sales"
              value={formatCurrency(visa.totalSales)}
            />
            {showFinance && (
              <>
                <StatCard
                  href="/finance"
                  label="Cash balance IQD"
                  value={`${formatNumber(balance.balanceIqd)} IQD`}
                  tone={balance.balanceIqd < 0 ? "red" : "green"}
                />
                <StatCard
                  href="/finance"
                  label="Owed to staff"
                  value={`${formatNumber(owed.totalIqd)} IQD`}
                  tone={owed.totalIqd > 0 ? "amber" : "default"}
                  hint={
                    owed.totalUsd > 0 ? formatCurrency(owed.totalUsd) : undefined
                  }
                />
              </>
            )}
          </div>
          {(companyProfit !== 0 || ticket.revenue > 0) && (
            <p className="mt-3 text-xs text-slate-500">
              Combined ticket + hotel profit:{" "}
              <span className="font-medium text-slate-700">
                {formatCurrency(companyProfit)}
              </span>
            </p>
          )}
        </section>

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
          <SectionHeader title="Ticket Invoice" href="/invoices" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              href="/invoices"
              label="Invoices"
              value={String(invoices.length)}
            />
            <StatCard
              href="/invoices/new"
              label="New invoice"
              value="+"
              hint="Create ticket invoice"
            />
            <StatCard
              href="/invoices/policies"
              label="Policies"
              value="→"
              hint="Airline policies"
            />
            <StatCard
              href="/invoices"
              label="All invoices"
              value="Open"
              hint="View invoice list"
            />
          </div>
        </section>

        <section>
          <SectionHeader title="Payment Invoice" href="/payments" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              href="/payments"
              label="Receipts"
              value={String(payment.count)}
            />
            <StatCard
              href="/payments"
              label="Total received"
              value={formatCurrency(payment.totalReceived)}
              tone="green"
            />
            <StatCard
              href="/payments/summary"
              label="This month"
              value={formatCurrency(payment.thisMonthTotal)}
              hint={`${payment.thisMonthCount} receipts`}
            />
            <StatCard
              href="/payments/summary"
              label="Payments summary"
              value="→"
              hint="Full breakdown"
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
