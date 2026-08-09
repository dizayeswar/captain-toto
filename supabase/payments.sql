-- Captain Toto — Payment Invoice (cash receipt) schema + seed
-- Run this in Supabase (SQL Editor → New query → paste → Run) AFTER schema.sql.
-- Safe to re-run.

create table if not exists public.payment_invoices (
  id            uuid primary key default gen_random_uuid(),
  receipt_no    text not null,
  receipt_date  date not null,
  payer_type    text not null default 'Individual',
  booking_id    text not null default '',
  received_from text not null default '',
  amount        numeric not null default 0,
  for_text      text not null default '',
  notes         text not null default '',
  prepared_by   text not null default '',
  created_at    timestamptz not null default now()
);

create index if not exists payment_invoices_date_idx
  on public.payment_invoices (receipt_date desc);

alter table public.payment_invoices enable row level security;

drop policy if exists "payment_invoices full access" on public.payment_invoices;
create policy "payment_invoices full access"
  on public.payment_invoices for all
  to anon, authenticated using (true) with check (true);

-- Sample receipt (only if none exist).
insert into public.payment_invoices
  (receipt_no, receipt_date, payer_type, booking_id, received_from, amount, for_text, prepared_by)
select 'CT-PR-0001', '2026-05-15', 'Individual', 'CT-0001', 'Cicih Kasto', 865,
       'Flight ticket EBL - CGK (Emirates)', 'Osman'
where not exists (select 1 from public.payment_invoices);
