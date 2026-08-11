-- Captain Toto — Supplier Payment Receipts (A6)
-- Run in Supabase SQL Editor. Safe to re-run.

create table if not exists public.supplier_payment_receipts (
  id            uuid primary key default gen_random_uuid(),
  receipt_no    text not null,
  receipt_date  date not null,
  supplier      text not null default '',
  amount        numeric not null default 0,
  signature     text not null default '',
  notes         text not null default '',
  created_at    timestamptz not null default now()
);

create index if not exists supplier_payment_receipts_date_idx
  on public.supplier_payment_receipts (receipt_date desc);

alter table public.supplier_payment_receipts enable row level security;

drop policy if exists "supplier_payment_receipts full access"
  on public.supplier_payment_receipts;
create policy "supplier_payment_receipts full access"
  on public.supplier_payment_receipts for all
  to anon, authenticated using (true) with check (true);
