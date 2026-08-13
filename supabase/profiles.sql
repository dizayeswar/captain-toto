-- Captain Toto — User profiles + roles (CEO / Admin / Staff)
-- Run in Supabase SQL Editor AFTER enabling Email auth.
-- Safe to re-run.

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null default '',
  role        text not null default 'staff'
                check (role in ('ceo', 'admin', 'staff')),
  created_at  timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);

alter table public.profiles enable row level security;

-- Helper: current user's role (security definer so RLS can use it)
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

-- Auto-create profile when a user is created in Auth Dashboard
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), ''),
    'staff'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS: any logged-in user can read profiles
drop policy if exists "profiles select authenticated" on public.profiles;
create policy "profiles select authenticated"
  on public.profiles for select
  to authenticated
  using (true);

-- CEO / Admin can update any profile (app enforces CEO-only for assigning ceo)
drop policy if exists "profiles update by managers" on public.profiles;
create policy "profiles update by managers"
  on public.profiles for update
  to authenticated
  using (public.current_user_role() in ('ceo', 'admin'))
  with check (public.current_user_role() in ('ceo', 'admin'));

-- Block role changes unless actor is ceo/admin; admin cannot touch CEO role
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

-- Backfill profiles for users created before this trigger existed
insert into public.profiles (id, full_name, role)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1), ''),
  'staff'
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);

-- After creating your first user in Auth → Users, promote yourself:
--   update public.profiles set role = 'ceo' where id = '<your-user-uuid>';
