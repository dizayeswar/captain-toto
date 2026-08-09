-- Captain Toto — Finance Control (expenses) schema + seed
-- Run in Supabase SQL Editor after schema.sql. Safe to re-run.

create table if not exists public.expenses (
  id              uuid primary key default gen_random_uuid(),
  expense_date    date not null,
  category        text not null default 'Other',
  description     text not null default '',
  amount          numeric not null default 0,
  currency        text not null default 'USD',
  payment_method  text not null default 'Cash',
  paid_by         text not null default '',
  receipt_ref     text not null default '',
  notes           text not null default '',
  created_at      timestamptz not null default now()
);

create index if not exists expenses_date_idx
  on public.expenses (expense_date desc);

alter table public.expenses enable row level security;

drop policy if exists "expenses full access" on public.expenses;
create policy "expenses full access"
  on public.expenses for all
  to anon, authenticated using (true) with check (true);

insert into public.expenses
  (expense_date, category, description, amount, currency, payment_method, paid_by)
select '2026-08-01', 'Supplies', 'Water', 15000, 'IQD', 'Cash', 'ToTo Balance'
where not exists (
  select 1 from public.expenses
  where expense_date = '2026-08-01' and description = 'Water' and amount = 15000
);
