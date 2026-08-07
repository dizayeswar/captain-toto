-- Captain Toto — Supabase schema
-- Run this in your Supabase project: SQL Editor → New query → paste → Run.

-- =========================================================
-- Tables
-- =========================================================

create table if not exists public.tours (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  destination   text not null,
  country       text not null,
  category      text not null,
  summary       text not null,
  description   text not null,
  price         numeric not null,
  duration_days integer not null,
  rating        numeric not null default 5,
  image         text not null,
  featured      boolean not null default false,
  created_at    timestamptz not null default now()
);

create table if not exists public.bookings (
  id          uuid primary key default gen_random_uuid(),
  tour_slug   text not null,
  tour_title  text not null,
  full_name   text not null,
  email       text not null,
  phone       text not null,
  travelers   integer not null default 1,
  travel_date date not null,
  message     text,
  created_at  timestamptz not null default now()
);

-- =========================================================
-- Row Level Security (RLS)
-- =========================================================
alter table public.tours    enable row level security;
alter table public.bookings enable row level security;

-- Anyone can READ tours (public catalogue).
drop policy if exists "tours are public" on public.tours;
create policy "tours are public"
  on public.tours for select
  to anon, authenticated
  using (true);

-- Anyone can CREATE a booking (submit the form)...
drop policy if exists "anyone can create a booking" on public.bookings;
create policy "anyone can create a booking"
  on public.bookings for insert
  to anon, authenticated
  with check (true);

-- ...but only signed-in admins can READ bookings.
drop policy if exists "only authenticated can read bookings" on public.bookings;
create policy "only authenticated can read bookings"
  on public.bookings for select
  to authenticated
  using (true);
