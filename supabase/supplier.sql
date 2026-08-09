-- Captain Toto — Supplier Financial schema + seed
-- Run in Supabase SQL Editor after schema.sql. Safe to re-run.

create table if not exists public.suppliers (
  id              uuid primary key default gen_random_uuid(),
  supplier_code   text not null,
  name            text not null default '',
  supplier_type   text not null default 'Travel Agency',
  country         text not null default '',
  city            text not null default '',
  contact_person  text not null default '',
  phone           text not null default '',
  email           text not null default '',
  currency        text not null default 'USD',
  payment_terms   text not null default '',
  bank_details    text not null default '',
  active          boolean not null default true,
  notes           text not null default '',
  created_at      timestamptz not null default now()
);

create table if not exists public.supplier_invoices (
  id                   uuid primary key default gen_random_uuid(),
  invoice_id           text not null,
  invoice_date         date not null,
  due_date             date,
  supplier             text not null default '',
  supplier_invoice_no  text not null default '',
  booking_ref          text not null default '',
  service_type         text not null default 'Other',
  currency             text not null default 'USD',
  invoice_amount       numeric not null default 0,
  invoice_usd          numeric not null default 0,
  paid_usd             numeric not null default 0,
  refund_usd           numeric not null default 0,
  net_paid_usd         numeric not null default 0,
  outstanding_usd      numeric not null default 0,
  invoice_status       text not null default 'Open',
  payment_status       text not null default 'Unpaid',
  notes                text not null default '',
  created_at           timestamptz not null default now()
);

create index if not exists supplier_invoices_date_idx
  on public.supplier_invoices (invoice_date desc);

alter table public.suppliers enable row level security;
alter table public.supplier_invoices enable row level security;

drop policy if exists "suppliers full access" on public.suppliers;
create policy "suppliers full access"
  on public.suppliers for all
  to anon, authenticated using (true) with check (true);

drop policy if exists "supplier_invoices full access" on public.supplier_invoices;
create policy "supplier_invoices full access"
  on public.supplier_invoices for all
  to anon, authenticated using (true) with check (true);

insert into public.suppliers
  (supplier_code, name, supplier_type, country, city, phone, email, currency, active)
select 'SUP-0001', 'Captain ToTo', 'Travel Agency', 'IRAQ', 'ERBIL',
       '7509369000', 'captaintototravel@gmail.com', 'USD', true
where not exists (select 1 from public.suppliers where supplier_code = 'SUP-0001');

insert into public.suppliers
  (supplier_code, name, supplier_type, country, city, phone, currency, active)
select 'SUP-0002', 'Morocco Travel', 'Travel Agency', 'IRAQ', 'ERBIL',
       '7505071100', 'USD', true
where not exists (select 1 from public.suppliers where supplier_code = 'SUP-0002');

insert into public.supplier_invoices
  (invoice_id, invoice_date, supplier, service_type, currency,
   invoice_amount, invoice_usd, paid_usd, refund_usd, net_paid_usd,
   outstanding_usd, invoice_status, payment_status)
select
  'SINV-0001', '2026-07-14', 'Morocco Travel', 'Hotel', 'USD',
  9308, 9308, 9308, 0, 9308, 0, 'Open', 'Settled'
where not exists (select 1 from public.supplier_invoices where invoice_id = 'SINV-0001');
