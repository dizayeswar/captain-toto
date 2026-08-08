-- Captain Toto — Ticket Invoice section schema + seed
-- Run this in Supabase (SQL Editor → New query → paste → Run) AFTER schema.sql.
-- Safe to re-run.

-- =========================================================
-- Tables
-- =========================================================

create table if not exists public.invoices (
  id                 uuid primary key default gen_random_uuid(),
  invoice_no         text not null,
  invoice_date       date not null,
  booking_id         text not null default '',
  airline            text not null default '',
  pnr                text not null default '',
  reservation_status text not null default 'Issued',
  client_name        text not null default '',
  notes              text not null default '',
  created_at         timestamptz not null default now()
);

create table if not exists public.invoice_passengers (
  id            uuid primary key default gen_random_uuid(),
  invoice_id    uuid not null references public.invoices(id) on delete cascade,
  full_name     text not null default '',
  passport_no   text not null default '',
  nationality   text not null default '',
  date_of_birth date,
  ticket_no     text not null default '',
  notes         text not null default '',
  sort_order    integer not null default 0
);

create table if not exists public.invoice_segments (
  id           uuid primary key default gen_random_uuid(),
  invoice_id   uuid not null references public.invoices(id) on delete cascade,
  seg_no       integer not null default 1,
  airline      text not null default '',
  flight_no    text not null default '',
  route        text not null default '',
  departure    text not null default '',
  arrival      text not null default '',
  travel_class text not null default 'Economy',
  baggage      text not null default '',
  notes        text not null default '',
  sort_order   integer not null default 0
);

create table if not exists public.airline_policies (
  airline     text primary key,
  policy_text text not null default ''
);

create index if not exists invoices_date_idx on public.invoices (invoice_date desc);
create index if not exists passengers_invoice_idx on public.invoice_passengers (invoice_id);
create index if not exists segments_invoice_idx on public.invoice_segments (invoice_id);

-- =========================================================
-- Row Level Security (open, internal tool — tighten with auth later)
-- =========================================================
alter table public.invoices           enable row level security;
alter table public.invoice_passengers enable row level security;
alter table public.invoice_segments   enable row level security;
alter table public.airline_policies   enable row level security;

drop policy if exists "invoices full access" on public.invoices;
create policy "invoices full access" on public.invoices for all
  to anon, authenticated using (true) with check (true);

drop policy if exists "passengers full access" on public.invoice_passengers;
create policy "passengers full access" on public.invoice_passengers for all
  to anon, authenticated using (true) with check (true);

drop policy if exists "segments full access" on public.invoice_segments;
create policy "segments full access" on public.invoice_segments for all
  to anon, authenticated using (true) with check (true);

drop policy if exists "policies full access" on public.airline_policies;
create policy "policies full access" on public.airline_policies for all
  to anon, authenticated using (true) with check (true);

-- =========================================================
-- Seed: airline policy texts (standard text for each airline)
-- =========================================================
insert into public.airline_policies (airline, policy_text)
values
  ('General Airline', 'Ticket changes, cancellations, refunds, baggage, name correction and no-show rules depend on the airline fare conditions. Any change may require airline penalties, fare difference, tax difference and agency service charges. Refunds are subject to airline approval and ticket fare rules. Passenger is responsible for checking passport validity, visa requirements and travel documents before departure. Captain Toto is not responsible for denied boarding caused by missing visa, invalid passport, incorrect passenger information or government restrictions. Passenger must check all names, routes, dates and flight details before ticket issuance.'),
  ('Turkish Airlines', 'Ticket changes, cancellations, refunds, baggage, name correction and no-show rules depend on the airline fare conditions. Any change may require airline penalties, fare difference, tax difference and agency service charges. Refunds are subject to airline approval and ticket fare rules. Passenger is responsible for checking passport validity, visa requirements and travel documents before departure. Captain Toto is not responsible for denied boarding caused by missing visa, invalid passport, incorrect passenger information or government restrictions. Passenger must check all names, routes, dates and flight details before ticket issuance.'),
  ('Emirates', 'Ticket changes, cancellations, refunds, baggage, name correction and no-show rules depend on the airline fare conditions. Any change may require airline penalties, fare difference, tax difference and agency service charges. Refunds are subject to airline approval and ticket fare rules. Passenger is responsible for checking passport validity, visa requirements and travel documents before departure. Captain Toto is not responsible for denied boarding caused by missing visa, invalid passport, incorrect passenger information or government restrictions. Passenger must check all names, routes, dates and flight details before ticket issuance.'),
  ('flydubai', 'Ticket changes, cancellations, refunds, baggage, name correction and no-show rules depend on the airline fare conditions. Any change may require airline penalties, fare difference, tax difference and agency service charges. Refunds are subject to airline approval and ticket fare rules. Passenger is responsible for checking passport validity, visa requirements and travel documents before departure. Captain Toto is not responsible for denied boarding caused by missing visa, invalid passport, incorrect passenger information or government restrictions. Passenger must check all names, routes, dates and flight details before ticket issuance.'),
  ('Air Arabia', 'Ticket changes, cancellations, refunds, baggage, name correction and no-show rules depend on the airline fare conditions. Any change may require airline penalties, fare difference, tax difference and agency service charges. Refunds are subject to airline approval and ticket fare rules. Passenger is responsible for checking passport validity, visa requirements and travel documents before departure. Captain Toto is not responsible for denied boarding caused by missing visa, invalid passport, incorrect passenger information or government restrictions. Passenger must check all names, routes, dates and flight details before ticket issuance.'),
  ('EgyptAir', 'Ticket changes, cancellations, refunds, baggage, name correction and no-show rules depend on the airline fare conditions. Any change may require airline penalties, fare difference, tax difference and agency service charges. Refunds are subject to airline approval and ticket fare rules. Passenger is responsible for checking passport validity, visa requirements and travel documents before departure. Captain Toto is not responsible for denied boarding caused by missing visa, invalid passport, incorrect passenger information or government restrictions. Passenger must check all names, routes, dates and flight details before ticket issuance.'),
  ('Iraqi Airways', 'Ticket changes, cancellations, refunds, baggage, name correction and no-show rules depend on the airline fare conditions. Any change may require airline penalties, fare difference, tax difference and agency service charges. Refunds are subject to airline approval and ticket fare rules. Passenger is responsible for checking passport validity, visa requirements and travel documents before departure. Captain Toto is not responsible for denied boarding caused by missing visa, invalid passport, incorrect passenger information or government restrictions. Passenger must check all names, routes, dates and flight details before ticket issuance.'),
  ('Pegasus', 'Ticket changes, cancellations, refunds, baggage, name correction and no-show rules depend on the airline fare conditions. Any change may require airline penalties, fare difference, tax difference and agency service charges. Refunds are subject to airline approval and ticket fare rules. Passenger is responsible for checking passport validity, visa requirements and travel documents before departure. Captain Toto is not responsible for denied boarding caused by missing visa, invalid passport, incorrect passenger information or government restrictions. Passenger must check all names, routes, dates and flight details before ticket issuance.'),
  ('AJet', 'Ticket changes, cancellations, refunds, baggage, name correction and no-show rules depend on the airline fare conditions. Any change may require airline penalties, fare difference, tax difference and agency service charges. Refunds are subject to airline approval and ticket fare rules. Passenger is responsible for checking passport validity, visa requirements and travel documents before departure. Captain Toto is not responsible for denied boarding caused by missing visa, invalid passport, incorrect passenger information or government restrictions. Passenger must check all names, routes, dates and flight details before ticket issuance.'),
  ('Qatar Airways', 'Ticket changes, cancellations, refunds, baggage, name correction and no-show rules depend on the airline fare conditions. Any change may require airline penalties, fare difference, tax difference and agency service charges. Refunds are subject to airline approval and ticket fare rules. Passenger is responsible for checking passport validity, visa requirements and travel documents before departure. Captain Toto is not responsible for denied boarding caused by missing visa, invalid passport, incorrect passenger information or government restrictions. Passenger must check all names, routes, dates and flight details before ticket issuance.'),
  ('Royal Jordanian', 'Ticket changes, cancellations, refunds, baggage, name correction and no-show rules depend on the airline fare conditions. Any change may require airline penalties, fare difference, tax difference and agency service charges. Refunds are subject to airline approval and ticket fare rules. Passenger is responsible for checking passport validity, visa requirements and travel documents before departure. Captain Toto is not responsible for denied boarding caused by missing visa, invalid passport, incorrect passenger information or government restrictions. Passenger must check all names, routes, dates and flight details before ticket issuance.'),
  ('FLY ERBIL', 'Ticket changes, cancellations, refunds, baggage, name correction and no-show rules depend on the airline fare conditions. Any change may require airline penalties, fare difference, tax difference and agency service charges. Refunds are subject to airline approval and ticket fare rules. Passenger is responsible for checking passport validity, visa requirements and travel documents before departure. Captain Toto is not responsible for denied boarding caused by missing visa, invalid passport, incorrect passenger information or government restrictions. Passenger must check all names, routes, dates and flight details before ticket issuance.')
on conflict (airline) do update set policy_text = excluded.policy_text;

-- =========================================================
-- Seed: one sample invoice (CT-TI-0001) with a passenger and 3 segments
-- =========================================================
do $$
declare
  v_id uuid;
begin
  if not exists (select 1 from public.invoices where invoice_no = 'CT-TI-0001') then
    insert into public.invoices
      (invoice_no, invoice_date, booking_id, airline, pnr, reservation_status, client_name, notes)
    values
      ('CT-TI-0001', '2026-02-05', 'CT-0001', 'Emirates', 'FFBUR6', 'Issued',
       'مام سەعد ( ئیمپایەر ڤیللیج )', '')
    returning id into v_id;

    insert into public.invoice_passengers
      (invoice_id, full_name, passport_no, nationality, date_of_birth, ticket_no, sort_order)
    values
      (v_id, 'CICIH KASTO', 'E1805139', 'INDONESIA', '1980-08-01', '176 2209935891', 0);

    insert into public.invoice_segments
      (invoice_id, seg_no, airline, flight_no, route, departure, arrival, travel_class, baggage, sort_order)
    values
      (v_id, 1, 'Emirates', 'EK - 2071', 'EBL - DXB', '2026-04-05T15:00', '2026-04-05T20:00', 'Economy', '30 KG', 0),
      (v_id, 2, 'Emirates', 'EK - 346',  'DXB - KUL', '2026-05-05T03:10', '2026-05-05T14:25', 'Economy', '30 KG', 1),
      (v_id, 3, 'Emirates', 'EK - 3464', 'KUL - CGK', '2026-05-05T21:55', '2026-05-05T23:10', 'Economy', '30 KG', 2);
  end if;
end $$;
