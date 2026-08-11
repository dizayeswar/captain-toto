-- Captain Toto — Booking System schema
-- Run this in your Supabase project: SQL Editor → New query → paste → Run.

create table if not exists public.bookings (
  id             uuid primary key default gen_random_uuid(),
  booking_id     text not null,
  booking_date   date not null,
  client_name    text not null,
  client_type    text not null default 'Individual',
  route          text not null default '',
  airline        text not null default '',
  ticket_cost    numeric not null default 0,
  service_fee    numeric not null default 0,
  total_paid     numeric not null default 0,
  payment_status text not null default 'Pending',
  issued         boolean not null default false,
  handled_by     text not null default '',
  payment_method text not null default 'Cash',
  profit         numeric not null default 0,
  debt           numeric not null default 0,
  pnr            text not null default '',
  supplier_name  text not null default '',
  supplier_code  text not null default '',
  month          integer not null default 0,
  year           integer not null default 0,
  created_at     timestamptz not null default now()
);

create index if not exists bookings_date_idx on public.bookings (booking_date desc);

-- =========================================================
-- Row Level Security (RLS)
-- =========================================================
-- This is an internal back-office tool with no login yet, so we allow the
-- anon key full access. TIGHTEN THIS once you add authentication: restrict
-- each policy to `authenticated` and check roles.

alter table public.bookings enable row level security;

drop policy if exists "bookings full access (internal)" on public.bookings;
create policy "bookings full access (internal)"
  on public.bookings for all
  to anon, authenticated
  using (true)
  with check (true);
