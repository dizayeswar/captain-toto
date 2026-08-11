-- Link supplier payment receipts to settled supplier invoices.
-- Safe to re-run.

alter table public.supplier_payment_receipts
  add column if not exists source_invoice_id text not null default '';

alter table public.supplier_payment_receipts
  add column if not exists source_invoice_no text not null default '';

create index if not exists supplier_payment_receipts_source_inv_idx
  on public.supplier_payment_receipts (source_invoice_id);
