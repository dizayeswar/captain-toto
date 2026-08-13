-- Captain Toto — Restrict RLS to authenticated users only
-- Run AFTER profiles.sql. Safe to re-run.
-- Anon key can no longer read/write data without a logged-in session.

-- ========== bookings ==========
alter table if exists public.bookings enable row level security;
drop policy if exists "bookings full access (internal)" on public.bookings;
drop policy if exists "bookings full access" on public.bookings;
drop policy if exists "bookings authenticated access" on public.bookings;
create policy "bookings authenticated access"
  on public.bookings for all to authenticated
  using (true) with check (true);

-- ========== invoices ==========
alter table if exists public.invoices enable row level security;
drop policy if exists "invoices full access" on public.invoices;
drop policy if exists "invoices authenticated access" on public.invoices;
create policy "invoices authenticated access"
  on public.invoices for all to authenticated
  using (true) with check (true);

alter table if exists public.invoice_passengers enable row level security;
drop policy if exists "passengers full access" on public.invoice_passengers;
drop policy if exists "invoice_passengers full access" on public.invoice_passengers;
drop policy if exists "invoice_passengers authenticated access" on public.invoice_passengers;
create policy "invoice_passengers authenticated access"
  on public.invoice_passengers for all to authenticated
  using (true) with check (true);

alter table if exists public.invoice_segments enable row level security;
drop policy if exists "segments full access" on public.invoice_segments;
drop policy if exists "invoice_segments full access" on public.invoice_segments;
drop policy if exists "invoice_segments authenticated access" on public.invoice_segments;
create policy "invoice_segments authenticated access"
  on public.invoice_segments for all to authenticated
  using (true) with check (true);

alter table if exists public.airline_policies enable row level security;
drop policy if exists "policies full access" on public.airline_policies;
drop policy if exists "airline_policies full access" on public.airline_policies;
drop policy if exists "airline_policies authenticated access" on public.airline_policies;
create policy "airline_policies authenticated access"
  on public.airline_policies for all to authenticated
  using (true) with check (true);

-- ========== payments ==========
alter table if exists public.payment_invoices enable row level security;
drop policy if exists "payment_invoices full access" on public.payment_invoices;
drop policy if exists "payment_invoices authenticated access" on public.payment_invoices;
create policy "payment_invoices authenticated access"
  on public.payment_invoices for all to authenticated
  using (true) with check (true);

-- ========== hotel ==========
alter table if exists public.hotel_bookings enable row level security;
drop policy if exists "hotel_bookings full access" on public.hotel_bookings;
drop policy if exists "hotel_bookings authenticated access" on public.hotel_bookings;
create policy "hotel_bookings authenticated access"
  on public.hotel_bookings for all to authenticated
  using (true) with check (true);

-- ========== visa ==========
alter table if exists public.visa_cases enable row level security;
drop policy if exists "visa_cases full access" on public.visa_cases;
drop policy if exists "visa_cases authenticated access" on public.visa_cases;
create policy "visa_cases authenticated access"
  on public.visa_cases for all to authenticated
  using (true) with check (true);

-- ========== suppliers ==========
alter table if exists public.suppliers enable row level security;
drop policy if exists "suppliers full access" on public.suppliers;
drop policy if exists "suppliers authenticated access" on public.suppliers;
create policy "suppliers authenticated access"
  on public.suppliers for all to authenticated
  using (true) with check (true);

alter table if exists public.supplier_invoices enable row level security;
drop policy if exists "supplier_invoices full access" on public.supplier_invoices;
drop policy if exists "supplier_invoices authenticated access" on public.supplier_invoices;
create policy "supplier_invoices authenticated access"
  on public.supplier_invoices for all to authenticated
  using (true) with check (true);

alter table if exists public.supplier_invoice_lines enable row level security;
drop policy if exists "supplier_invoice_lines full access" on public.supplier_invoice_lines;
drop policy if exists "supplier_invoice_lines authenticated access" on public.supplier_invoice_lines;
create policy "supplier_invoice_lines authenticated access"
  on public.supplier_invoice_lines for all to authenticated
  using (true) with check (true);

alter table if exists public.supplier_payment_receipts enable row level security;
drop policy if exists "supplier_payment_receipts full access" on public.supplier_payment_receipts;
drop policy if exists "supplier_payment_receipts authenticated access" on public.supplier_payment_receipts;
create policy "supplier_payment_receipts authenticated access"
  on public.supplier_payment_receipts for all to authenticated
  using (true) with check (true);

-- ========== finance ==========
-- Managers (CEO / Admin) only — see also rls_role_aware.sql
alter table if exists public.expenses enable row level security;
drop policy if exists "expenses full access" on public.expenses;
drop policy if exists "expenses authenticated access" on public.expenses;
drop policy if exists "expenses managers only" on public.expenses;
create policy "expenses managers only"
  on public.expenses for all
  to authenticated
  using (public.current_user_role() in ('ceo', 'admin'))
  with check (public.current_user_role() in ('ceo', 'admin'));

alter table if exists public.finance_deposits enable row level security;
drop policy if exists "finance_deposits full access" on public.finance_deposits;
drop policy if exists "finance_deposits authenticated access" on public.finance_deposits;
drop policy if exists "finance_deposits managers only" on public.finance_deposits;
create policy "finance_deposits managers only"
  on public.finance_deposits for all
  to authenticated
  using (public.current_user_role() in ('ceo', 'admin'))
  with check (public.current_user_role() in ('ceo', 'admin'));

-- ========== recycle bin ==========
-- Prefer running rls_role_aware.sql for full role split.
-- Fallback: authenticated can use recycle bin (app still gates forever-delete).
alter table if exists public.recycle_bin enable row level security;
drop policy if exists "recycle_bin full access" on public.recycle_bin;
drop policy if exists "recycle_bin authenticated access" on public.recycle_bin;
create policy "recycle_bin authenticated access"
  on public.recycle_bin for all
  to authenticated
  using (true) with check (true);
