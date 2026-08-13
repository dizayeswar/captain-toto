-- Captain Toto — Role-aware RLS (Step 1)
-- Run in Supabase SQL Editor AFTER profiles.sql and rls_authenticated.sql.
-- Safe to re-run.
--
-- Rules (match the app):
--   CEO / Admin  = managers: Finance + purge finance recycle items + change roles
--   Staff        = tickets/hotel/visa/suppliers OK; NO expenses/deposits
--   Admin cannot assign or change the CEO role (CEO can)

-- ========== helpers ==========
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

revoke all on function public.current_user_role() from public;
grant execute on function public.current_user_role() to authenticated, anon;

create or replace function public.is_manager()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('ceo', 'admin');
$$;

revoke all on function public.is_manager() from public;
grant execute on function public.is_manager() to authenticated, anon;

-- Stronger role change guard (Admin cannot touch CEO role)
create or replace function public.profiles_role_guard()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor text := public.current_user_role();
begin
  if new.role is not distinct from old.role then
    return new;
  end if;

  if actor is null or actor = 'staff' then
    raise exception 'Not allowed to change role';
  end if;

  if actor = 'admin' and (new.role = 'ceo' or old.role = 'ceo') then
    raise exception 'Only the CEO can assign or change the CEO role';
  end if;

  if actor not in ('ceo', 'admin') then
    raise exception 'Not allowed to change role';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_role_guard_trg on public.profiles;
create trigger profiles_role_guard_trg
  before update on public.profiles
  for each row execute function public.profiles_role_guard();

-- Profiles: managers update only (already typical); keep select for all auth users
drop policy if exists "profiles update by managers" on public.profiles;
create policy "profiles update by managers"
  on public.profiles for update
  to authenticated
  using (public.is_manager())
  with check (public.is_manager());

-- ========== finance: CEO / Admin only ==========
alter table if exists public.expenses enable row level security;
drop policy if exists "expenses full access" on public.expenses;
drop policy if exists "expenses authenticated access" on public.expenses;
drop policy if exists "expenses managers only" on public.expenses;
create policy "expenses managers only"
  on public.expenses for all
  to authenticated
  using (public.is_manager())
  with check (public.is_manager());

alter table if exists public.finance_deposits enable row level security;
drop policy if exists "finance_deposits full access" on public.finance_deposits;
drop policy if exists "finance_deposits authenticated access" on public.finance_deposits;
drop policy if exists "finance_deposits managers only" on public.finance_deposits;
create policy "finance_deposits managers only"
  on public.finance_deposits for all
  to authenticated
  using (public.is_manager())
  with check (public.is_manager());

-- ========== recycle bin ==========
-- Staff: see/restore non-finance items. Managers: everything (incl. forever-delete).
alter table if exists public.recycle_bin enable row level security;
drop policy if exists "recycle_bin full access" on public.recycle_bin;
drop policy if exists "recycle_bin authenticated access" on public.recycle_bin;
drop policy if exists "recycle_bin select" on public.recycle_bin;
drop policy if exists "recycle_bin insert" on public.recycle_bin;
drop policy if exists "recycle_bin update" on public.recycle_bin;
drop policy if exists "recycle_bin delete" on public.recycle_bin;

create policy "recycle_bin select"
  on public.recycle_bin for select
  to authenticated
  using (
    public.is_manager()
    or entity_type not in ('expense', 'finance_deposit')
  );

create policy "recycle_bin insert"
  on public.recycle_bin for insert
  to authenticated
  with check (
    public.is_manager()
    or entity_type not in ('expense', 'finance_deposit')
  );

create policy "recycle_bin update"
  on public.recycle_bin for update
  to authenticated
  using (
    public.is_manager()
    or entity_type not in ('expense', 'finance_deposit')
  )
  with check (
    public.is_manager()
    or entity_type not in ('expense', 'finance_deposit')
  );

create policy "recycle_bin delete"
  on public.recycle_bin for delete
  to authenticated
  using (
    public.is_manager()
    or entity_type not in ('expense', 'finance_deposit')
  );

-- Operational modules stay open to any authenticated user
-- (bookings, invoices, payments, hotel, visa, suppliers) — unchanged.
