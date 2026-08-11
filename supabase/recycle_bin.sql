-- Captain Toto — Recycle Bin
-- Run in Supabase SQL Editor. Safe to re-run.
-- Deleted rows are snapshotted here so they can be restored.

create table if not exists public.recycle_bin (
  id           uuid primary key default gen_random_uuid(),
  entity_type  text not null,
  entity_id    text not null,
  label        text not null default '',
  payload      jsonb not null,
  deleted_at   timestamptz not null default now()
);

create index if not exists recycle_bin_deleted_at_idx
  on public.recycle_bin (deleted_at desc);

create index if not exists recycle_bin_entity_type_idx
  on public.recycle_bin (entity_type);

alter table public.recycle_bin enable row level security;

drop policy if exists "recycle_bin full access" on public.recycle_bin;
create policy "recycle_bin full access"
  on public.recycle_bin for all
  to anon, authenticated using (true) with check (true);
