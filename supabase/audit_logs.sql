-- Captain Toto — Audit log
-- Run in Supabase SQL Editor AFTER profiles.sql (and ideally rls_role_aware.sql).
-- Safe to re-run.

create table if not exists public.audit_logs (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  actor_id      uuid references auth.users(id) on delete set null,
  actor_name    text not null default '',
  action        text not null
                  check (action in ('create', 'update', 'delete', 'restore', 'purge', 'disable', 'enable', 'role_change', 'other')),
  entity_type   text not null default '',
  entity_id     text not null default '',
  summary       text not null default ''
);

create index if not exists audit_logs_created_at_idx
  on public.audit_logs (created_at desc);

create index if not exists audit_logs_entity_idx
  on public.audit_logs (entity_type, entity_id);

alter table public.audit_logs enable row level security;

-- Anyone authenticated may insert their own audit rows (app writes after actions)
drop policy if exists "audit_logs insert authenticated" on public.audit_logs;
create policy "audit_logs insert authenticated"
  on public.audit_logs for insert
  to authenticated
  with check (auth.uid() is not null);

-- Only CEO / Admin may read
drop policy if exists "audit_logs select managers" on public.audit_logs;
create policy "audit_logs select managers"
  on public.audit_logs for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('ceo', 'admin')
    )
  );

-- No update/delete for normal clients (append-only)
drop policy if exists "audit_logs no update" on public.audit_logs;
drop policy if exists "audit_logs no delete" on public.audit_logs;
