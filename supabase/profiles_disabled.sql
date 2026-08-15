-- Captain Toto — Disable users (soft lock)
-- Run in Supabase SQL Editor AFTER profiles.sql.
-- Safe to re-run.

alter table public.profiles
  add column if not exists disabled boolean not null default false;

create index if not exists profiles_disabled_idx on public.profiles (disabled);

comment on column public.profiles.disabled is
  'When true, login is blocked. Account kept for history; CEO can re-enable.';
