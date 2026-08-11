import { getSupabase } from "./supabase";
import { addToRecycleBin } from "./recycleBin";
import type { SupplierRecord, SupplierInput } from "./types";

const TABLE = "suppliers";

const demoStore: SupplierRecord[] = [
  demo("SUP-0001", "Captain ToTo", "Travel Agency", "IRAQ", "ERBIL"),
  demo("SUP-0002", "Morocco Travel", "Wholesaler", "IRAQ", "ERBIL"),
  demo("SUP-0003", "SkySinai", "Wholesaler", "IRAQ", "ERBIL"),
  demo("SUP-0004", "Hala Travel", "Travel Agency", "IRAQ", "ERBIL"),
];

function demo(
  code: string,
  name: string,
  type: string,
  country: string,
  city: string
): SupplierRecord {
  return {
    id: `demo-${code}`,
    supplier_code: code,
    name,
    supplier_type: type,
    country,
    city,
    contact_person: "",
    phone: "",
    email: "",
    currency: "USD",
    payment_terms: "",
    bank_details: "",
    active: true,
    notes: "",
  };
}

function nextCode(count: number): string {
  return `SUP-${String(count + 1).padStart(4, "0")}`;
}

export async function getSuppliers(): Promise<SupplierRecord[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return [...demoStore].sort((a, b) =>
      a.supplier_code.localeCompare(b.supplier_code)
    );
  }
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("supplier_code", { ascending: true });
  if (error || !data) return [];
  return data as SupplierRecord[];
}

/** Lightweight options for supplier dropdowns across sections. */
export async function getSupplierOptions(): Promise<
  { code: string; name: string }[]
> {
  const suppliers = await getSuppliers();
  return suppliers
    .filter((s) => s.active)
    .map((s) => ({ code: s.supplier_code, name: s.name }));
}

export async function getSupplier(id: string): Promise<SupplierRecord | null> {
  const supabase = getSupabase();
  if (!supabase) return demoStore.find((s) => s.id === id) ?? null;
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as SupplierRecord;
}

export async function createSupplier(
  input: SupplierInput
): Promise<SupplierRecord> {
  const all = await getSuppliers();
  const code = nextCode(all.length);
  const supabase = getSupabase();
  if (!supabase) {
    const rec: SupplierRecord = {
      id: `demo-${Date.now()}`,
      supplier_code: code,
      ...input,
    };
    demoStore.push(rec);
    return rec;
  }
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ supplier_code: code, ...input })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as SupplierRecord;
}

export async function updateSupplier(
  id: string,
  input: SupplierInput
): Promise<SupplierRecord> {
  const supabase = getSupabase();
  if (!supabase) {
    const idx = demoStore.findIndex((s) => s.id === id);
    if (idx >= 0) {
      demoStore[idx] = { ...demoStore[idx], ...input, id };
      return demoStore[idx];
    }
    throw new Error("Supplier not found");
  }
  const { data, error } = await supabase
    .from(TABLE)
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as SupplierRecord;
}

export async function deleteSupplier(id: string): Promise<void> {
  const row = await getSupplier(id);
  if (!row) return;
  await addToRecycleBin({
    entity_type: "supplier",
    entity_id: id,
    label: `${row.supplier_code} · ${row.name || "—"}`,
    payload: row,
  });

  const supabase = getSupabase();
  if (!supabase) {
    const idx = demoStore.findIndex((s) => s.id === id);
    if (idx >= 0) demoStore.splice(idx, 1);
    return;
  }
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function restoreSupplier(row: SupplierRecord): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    if (!demoStore.some((s) => s.id === row.id)) demoStore.push(row);
    return;
  }
  const { error } = await supabase.from(TABLE).insert(row);
  if (error) throw new Error(error.message);
}
