-- Captain Toto — Hotel Management schema + seed
-- Run in Supabase SQL Editor after schema.sql. Safe to re-run.

create table if not exists public.hotel_bookings (
  id                      uuid primary key default gen_random_uuid(),
  booking_code            text not null,
  created_date            date not null,
  lead_guest              text not null default '',
  phone                   text not null default '',
  email                   text not null default '',
  nationality             text not null default '',
  destination_country     text not null default '',
  city                    text not null default '',
  hotel_name              text not null default '',
  hotel_confirmation_no   text not null default '',
  check_in                date,
  check_out               date,
  nights                  integer not null default 0,
  rooms                   integer not null default 1,
  adults                  integer not null default 1,
  children                integer not null default 0,
  infants                 integer not null default 0,
  room_type               text not null default 'Double',
  meal_plan               text not null default 'Breakfast',
  supplier                text not null default '',
  currency                text not null default 'USD',
  cost_per_room_night     numeric not null default 0,
  sale_per_room_night     numeric not null default 0,
  extra_cost              numeric not null default 0,
  discount                numeric not null default 0,
  total_cost_usd          numeric not null default 0,
  total_sale_usd          numeric not null default 0,
  profit_usd              numeric not null default 0,
  net_paid_usd            numeric not null default 0,
  balance_usd             numeric not null default 0,
  payment_status          text not null default 'Unpaid',
  booking_status          text not null default 'Pending',
  staff                   text not null default '',
  notes                   text not null default '',
  created_at              timestamptz not null default now()
);

create index if not exists hotel_bookings_date_idx
  on public.hotel_bookings (created_date desc);

alter table public.hotel_bookings enable row level security;

drop policy if exists "hotel_bookings full access" on public.hotel_bookings;
create policy "hotel_bookings full access"
  on public.hotel_bookings for all
  to anon, authenticated using (true) with check (true);

insert into public.hotel_bookings
  (booking_code, created_date, lead_guest, phone, email, nationality,
   destination_country, city, hotel_name, hotel_confirmation_no,
   check_in, check_out, nights, rooms, adults, room_type, meal_plan,
   supplier, currency, cost_per_room_night, sale_per_room_night,
   total_cost_usd, total_sale_usd, profit_usd, net_paid_usd, balance_usd,
   payment_status, booking_status, staff)
select
  'CTH-0001', '2026-07-15', 'MOHAMMED MOHAMMED', '7504526258',
  'cinesherwani@gmail.com', 'IRAQ', 'UNITED KINGDOM', 'MANCHESTER',
  'BRITANNIA HOTEL MANCHESTER', '643U07JOBD',
  '2026-07-15', '2026-07-16', 1, 1, 1, 'Single', 'Breakfast',
  'SkySinai', 'USD', 70, 70, 70, 70, 0, 70, 0,
  'Paid', 'Confirmed', 'Osman'
where not exists (select 1 from public.hotel_bookings where booking_code = 'CTH-0001');
