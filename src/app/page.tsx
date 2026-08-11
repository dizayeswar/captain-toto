import Link from "next/link";
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
import { PageHeader, StatCard, Card, Button } from "@/components/ui";

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
    getExpenses(),
    getFinanceDeposits(),
  ]);

  const ticket = computeTotals(bookings);
  const hotel = summarizeHotels(hotels);
  const visa = summarizeVisas(visas);
  const payment = summarizePayments(payments);
  const supplier = summarizeSupplierFinance(supplierInvoices);
  const expense = summarizeExpenses(expenses);
  const balance = computeFinanceBalance(deposits, expenses);
  const owed = computeOwedToOthers(expenses);

  const companyProfit =
    ticket.profit + hotel.totalProfit; /* visa has no profit in summary */

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Summary of bookings, invoices, hotel, visa, suppliers, and finance"
        action={<Button href="/bookings/new">+ New Booking</Button>}
      />

      <div className="space-y-10 p-8">
        {/* Top snapshot */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">
            At a glance
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard
              label="Ticket bookings"
              value={String(ticket.bookings)}
              hint={`${ticket.pending} pending`}
            />
            <StatCard
              label="Ticket profit"
              value={formatCurrency(ticket.profit)}
              tone={ticket.profit >= 0 ? "green" : "red"}
            />
            <StatCard
              label="Hotel profit"
              value={formatCurrency(hotel.totalProfit)}
              tone={hotel.totalProfit >= 0 ? "green" : "red"}
            />
            <StatCard
              label="Visa sales"
              value={formatCurrency(visa.totalSales)}
            />
            <StatCard
              label="Cash balance IQD"
              value={`${formatNumber(balance.balanceIqd)} IQD`}
              tone={balance.balanceIqd < 0 ? "red" : "green"}
            />
            <StatCard
              label="Owed to staff"
              value={`${formatNumber(owed.totalIqd)} IQD`}
              tone={owed.totalIqd > 0 ? "amber" : "default"}
              hint={
                owed.totalUsd > 0 ? formatCurrency(owed.totalUsd) : undefined
              }
            />
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

        {/* Booking / tickets */}
        <section>
          <SectionHeader title="Booking" href="/bookings" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Bookings" value={String(ticket.bookings)} />
            <StatCard label="Revenue" value={formatCurrency(ticket.revenue)} />
            <StatCard
              label="Profit"
              value={formatCurrency(ticket.profit)}
              tone="green"
            />
            <StatCard
              label="Pending"
              value={String(ticket.pending)}
              tone={ticket.pending > 0 ? "amber" : "default"}
            />
          </div>
        </section>

        {/* Ticket invoices + payment invoices */}
        <section>
          <SectionHeader title="Ticket Invoice" href="/invoices" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="Invoices" value={String(invoices.length)} />
            <Card className="flex items-center justify-between p-5 sm:col-span-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Quick links
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Create or review ticket invoices and airline policies.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button href="/invoices/new" variant="secondary">
                  New invoice
                </Button>
                <Button href="/invoices/policies" variant="secondary">
                  Policies
                </Button>
              </div>
            </Card>
          </div>
        </section>

        <section>
          <SectionHeader title="Payment Invoice" href="/payments" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Receipts" value={String(payment.count)} />
            <StatCard
              label="Total received"
              value={formatCurrency(payment.totalReceived)}
              tone="green"
            />
            <StatCard
              label="This month"
              value={formatCurrency(payment.thisMonthTotal)}
              hint={`${payment.thisMonthCount} receipts`}
            />
            <Card className="flex items-center p-5">
              <Link
                href="/payments/summary"
                className="text-sm font-medium text-brand hover:underline"
              >
                Payments summary →
              </Link>
            </Card>
          </div>
        </section>

        {/* Hotel */}
        <section>
          <SectionHeader title="Hotel" href="/hotel" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <StatCard label="Bookings" value={String(hotel.total)} />
            <StatCard label="Confirmed" value={String(hotel.confirmed)} />
            <StatCard
              label="Sale"
              value={formatCurrency(hotel.totalSale)}
            />
            <StatCard
              label="Profit"
              value={formatCurrency(hotel.totalProfit)}
              tone={hotel.totalProfit < 0 ? "red" : "green"}
            />
            <StatCard
              label="Outstanding"
              value={formatCurrency(hotel.outstanding)}
              tone={hotel.outstanding > 0 ? "amber" : "default"}
            />
          </div>
        </section>

        {/* Visa */}
        <section>
          <SectionHeader title="Visa" href="/visa" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <StatCard label="Cases" value={String(visa.total)} />
            <StatCard label="Approved" value={String(visa.approved)} />
            <StatCard
              label="Appointments (30d)"
              value={String(visa.appointments)}
              tone={visa.appointments > 0 ? "amber" : "default"}
            />
            <StatCard
              label="Sales"
              value={formatCurrency(visa.totalSales)}
            />
            <StatCard
              label="Outstanding"
              value={formatCurrency(visa.outstanding)}
              tone={visa.outstanding > 0 ? "amber" : "default"}
            />
          </div>
        </section>

        {/* Supplier finance */}
        <section>
          <SectionHeader title="Supplier Finance" href="/suppliers/dashboard" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Open invoices"
              value={String(supplier.openInvoices)}
            />
            <StatCard
              label="Outstanding"
              value={formatCurrency(supplier.outstanding)}
              tone={supplier.outstanding > 0 ? "amber" : "default"}
            />
            <StatCard
              label="Paid to suppliers"
              value={formatCurrency(supplier.paidToSuppliers)}
            />
            <StatCard
              label="Refunded"
              value={formatCurrency(supplier.refunded)}
            />
          </div>
        </section>

        {/* Finance / expenses */}
        <section>
          <SectionHeader title="Finance" href="/finance" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard
              label="Balance IQD"
              value={`${formatNumber(balance.balanceIqd)} IQD`}
              tone={balance.balanceIqd < 0 ? "red" : "green"}
            />
            <StatCard
              label="Balance USD"
              value={formatCurrency(balance.balanceUsd)}
              tone={balance.balanceUsd < 0 ? "red" : "green"}
            />
            <StatCard
              label="Expenses"
              value={String(expense.count)}
              hint={`${formatCurrency(expense.totalUsd)} · ${formatNumber(expense.totalIqd)} IQD`}
            />
            <StatCard
              label="Owed IQD"
              value={`${formatNumber(owed.totalIqd)} IQD`}
              tone={owed.totalIqd > 0 ? "amber" : "default"}
            />
            <StatCard
              label="Owed USD"
              value={formatCurrency(owed.totalUsd)}
              tone={owed.totalUsd > 0 ? "amber" : "default"}
            />
            <Card className="flex items-center p-5">
              <Link
                href="/finance/summary"
                className="text-sm font-medium text-brand hover:underline"
              >
                Expense summary →
              </Link>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
