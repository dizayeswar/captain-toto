-- Supplier invoice line items (detailed services). Safe to re-run.

create table if not exists public.supplier_invoice_lines (
  id           uuid primary key default gen_random_uuid(),
  invoice_id   uuid not null references public.supplier_invoices(id) on delete cascade,
  service_type text not null default 'Other',
  booking_ref  text not null default '',
  description  text not null default '',
  amount       numeric not null default 0,
  notes        text not null default '',
  sort_order   integer not null default 0
);

create index if not exists supplier_invoice_lines_invoice_idx
  on public.supplier_invoice_lines (invoice_id);

alter table public.supplier_invoice_lines enable row level security;

drop policy if exists "supplier_invoice_lines full access" on public.supplier_invoice_lines;
create policy "supplier_invoice_lines full access"
  on public.supplier_invoice_lines for all
  to anon, authenticated using (true) with check (true);
