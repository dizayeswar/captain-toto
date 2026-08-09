-- Captain Toto — Visa Management schema + seed
-- Run in Supabase SQL Editor after schema.sql. Safe to re-run.

create table if not exists public.visa_cases (
  id                  uuid primary key default gen_random_uuid(),
  visa_id             text not null,
  created_date        date not null,
  client_name         text not null default '',
  phone               text not null default '',
  email               text not null default '',
  passport_no         text not null default '',
  nationality         text not null default '',
  destination_country text not null default '',
  visa_type           text not null default 'Tourist',
  entry_type          text not null default 'Single Entry',
  travel_date         date,
  application_date    date,
  appointment_date    date,
  decision_date       date,
  case_status         text not null default 'New Inquiry',
  priority            text not null default 'Normal',
  staff               text not null default '',
  currency            text not null default 'USD',
  appointment_fee     numeric not null default 0,
  document_fee        numeric not null default 0,
  extra_charges       numeric not null default 0,
  total_sale_usd      numeric not null default 0,
  amount_paid_usd     numeric not null default 0,
  balance_usd         numeric not null default 0,
  payment_status      text not null default 'Unpaid',
  documents_result    text not null default 'Not Reviewed',
  passport_received   text not null default 'No',
  passport_returned   text not null default 'No',
  provider            text not null default '',
  provider_reference  text not null default '',
  supplier_name       text not null default '',
  supplier_code       text not null default '',
  notes               text not null default '',
  created_at          timestamptz not null default now()
);

create index if not exists visa_cases_date_idx
  on public.visa_cases (created_date desc);

alter table public.visa_cases enable row level security;

drop policy if exists "visa_cases full access" on public.visa_cases;
create policy "visa_cases full access"
  on public.visa_cases for all
  to anon, authenticated using (true) with check (true);

insert into public.visa_cases
  (visa_id, created_date, client_name, phone, email, passport_no, nationality,
   destination_country, visa_type, entry_type, travel_date, appointment_date,
   case_status, priority, staff, currency, appointment_fee, document_fee,
   extra_charges, total_sale_usd, amount_paid_usd, balance_usd, payment_status,
   documents_result, passport_received, passport_returned, provider,
   provider_reference, supplier_name, supplier_code)
select
  'CTV-0001', '2026-07-02', 'Mohammed Maghdid Mohammed', '7504526258',
  'cinesherwani@gmail.com', 'A18099330', 'IRAQ', 'UNITED KINGDOM',
  'Tourist', 'Multiple Entry', '2026-07-02', '2026-07-03',
  'Appointment Booked', 'VIP', 'Admin', 'USD', 189, 175, 36, 400, 0, 400,
  'Unpaid', 'Documents Ready', 'Yes', 'Yes', 'VFS GLOBAL', 'GWF088684376',
  'Captain ToTo', 'SUP-0001'
where not exists (select 1 from public.visa_cases where visa_id = 'CTV-0001');
