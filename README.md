# Captain ToTo — Booking System ✈

An internal back-office web app for the Captain ToTo travel agency. Staff
**enter booking records** and the system automatically produces dashboards and
analysis reports. Modeled on the `Captain_ToTo_Booking_System.xlsx` workbook.

Built with **Next.js 16 + Tailwind CSS + Supabase**.

---

## What's inside

| Section | Route | What it does |
| ------- | ----- | ------------ |
| Dashboard | `/` | KPIs (bookings, revenue, profit, issued, pending, debt) + recent bookings |
| Bookings | `/bookings` | Searchable/filterable table of every booking |
| New / Edit | `/bookings/new`, `/bookings/[id]` | Data-entry form with dropdowns and live totals |
| Monthly Summary | `/reports/monthly` | Per-month bookings, revenue, profit |
| Payment Report | `/reports/payments` | Payment status + live money totals |
| Client Analysis | `/reports/clients` | Grouped by client |
| Staff Performance | `/reports/staff` | Grouped by staff member |
| Airline Analysis | `/reports/airlines` | Grouped by airline |
| Route Analysis | `/reports/routes` | Grouped by route |

Each booking auto-calculates **Total Paid** (`ticket + fee`), **Profit**, and
its **Month/Year** from the date. Booking IDs (`CT-0001`, …) are generated
automatically.

---

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000

The app runs immediately in **demo mode** (data kept in memory, resets on
restart) so you can try it without any setup.

---

## Connecting Supabase (to save data permanently)

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run `supabase/schema.sql`, then `supabase/seed.sql`.
3. Copy `.env.example` to `.env.local` and fill in your project URL + anon key
   (Supabase → Project Settings → API).
4. Restart `npm run dev`. The demo banner disappears and data now persists.

> Note: RLS is currently open (no login yet). Tighten the policies in
> `schema.sql` when authentication is added.

---

## Adding more sections

The Bookings section is the first of several. Each new Excel workbook can become
another section by adding: a type + list in `src/lib/`, a data-access module, a
sidebar entry in `src/components/Sidebar.tsx`, and pages under `src/app/`.

---

## Project structure

```
src/
  app/
    page.tsx                 Dashboard
    bookings/                List, new, edit
    reports/                 monthly, payments, clients, staff, airlines, routes
  components/                Sidebar, BookingForm, BookingsTable, GroupReport, ui
  lib/
    types.ts                 Booking types
    lists.ts                 Dropdown options (from the Lists sheet)
    bookings.ts              Data access + aggregations
    actions.ts               Server Actions (create/update/delete)
    supabase.ts, format.ts   Client + helpers
supabase/
  schema.sql, seed.sql
```
