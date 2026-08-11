-- Finance cash balance deposits (money in). Expenses deduct from this balance.
-- Safe to re-run.

create table if not exists public.finance_deposits (
  id            uuid primary key default gen_random_uuid(),
  deposit_date  date not null,
  brought_by    text not null default '',
  amount        numeric not null default 0,
  currency      text not null default 'IQD',
  notes         text not null default '',
  created_at    timestamptz not null default now()
);

create index if not exists finance_deposits_date_idx
  on public.finance_deposits (deposit_date desc);

alter table public.finance_deposits enable row level security;

drop policy if exists "finance_deposits full access" on public.finance_deposits;
create policy "finance_deposits full access"
  on public.finance_deposits for all
  to anon, authenticated using (true) with check (true);
