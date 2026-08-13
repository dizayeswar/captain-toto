import { getSupabase } from "./supabase";
import type {
  Booking,
  Expense,
  FinanceDeposit,
  HotelBooking,
  Invoice,
  PaymentInvoice,
  SupplierInvoice,
  SupplierPaymentReceipt,
  SupplierRecord,
  VisaCase,
} from "./types";

export type RecycleEntityType =
  | "booking"
  | "invoice"
  | "payment_invoice"
  | "hotel_booking"
  | "visa_case"
  | "supplier"
  | "supplier_invoice"
  | "supplier_receipt"
  | "expense"
  | "finance_deposit";

export type RecycleBinItem = {
  id: string;
  entity_type: RecycleEntityType;
  entity_id: string;
  label: string;
  payload: unknown;
  deleted_at: string;
};

export const RECYCLE_ENTITY_LABELS: Record<RecycleEntityType, string> = {
  booking: "Ticket booking",
  invoice: "Ticket Invoice",
  payment_invoice: "Payment Invoice",
  hotel_booking: "Hotel Booking",
  visa_case: "Visa Case",
  supplier: "Supplier",
  supplier_invoice: "Supplier Invoice",
  supplier_receipt: "Supplier Receipt",
  expense: "Expense",
  finance_deposit: "Balance Deposit",
};

const TABLE = "recycle_bin";

const demoStore: RecycleBinItem[] = [];

export async function addToRecycleBin(input: {
  entity_type: RecycleEntityType;
  entity_id: string;
  label: string;
  payload: unknown;
}): Promise<void> {
  const row = {
    entity_type: input.entity_type,
    entity_id: input.entity_id,
    label: input.label || RECYCLE_ENTITY_LABELS[input.entity_type],
    payload: input.payload,
  };

  const supabase = await getSupabase();
  if (!supabase) {
    demoStore.unshift({
      id: `demo-rb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      ...row,
      deleted_at: new Date().toISOString(),
    });
    return;
  }

  const { error } = await supabase.from(TABLE).insert(row);
  if (error) throw new Error(error.message);
}

export async function listRecycleBin(): Promise<RecycleBinItem[]> {
  const supabase = await getSupabase();
  if (!supabase) {
    return [...demoStore].sort((a, b) =>
      b.deleted_at.localeCompare(a.deleted_at)
    );
  }
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("deleted_at", { ascending: false });
  if (error || !data) return [];
  return data as RecycleBinItem[];
}

export async function getRecycleBinItem(
  id: string
): Promise<RecycleBinItem | null> {
  const supabase = await getSupabase();
  if (!supabase) return demoStore.find((r) => r.id === id) ?? null;
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as RecycleBinItem;
}

export async function purgeRecycleBinItem(id: string): Promise<void> {
  const supabase = await getSupabase();
  if (!supabase) {
    const idx = demoStore.findIndex((r) => r.id === id);
    if (idx >= 0) demoStore.splice(idx, 1);
    return;
  }
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function restoreRecycleBinItem(id: string): Promise<void> {
  const item = await getRecycleBinItem(id);
  if (!item) throw new Error("Recycle bin item not found");

  switch (item.entity_type) {
    case "booking":
      await (await import("./bookings")).restoreBooking(item.payload as Booking);
      break;
    case "invoice":
      await (await import("./invoices")).restoreInvoice(item.payload as Invoice);
      break;
    case "payment_invoice":
      await (
        await import("./payments")
      ).restorePaymentInvoice(item.payload as PaymentInvoice);
      break;
    case "hotel_booking":
      await (
        await import("./hotels")
      ).restoreHotelBooking(item.payload as HotelBooking);
      break;
    case "visa_case":
      await (await import("./visas")).restoreVisaCase(item.payload as VisaCase);
      break;
    case "supplier":
      await (
        await import("./suppliers")
      ).restoreSupplier(item.payload as SupplierRecord);
      break;
    case "supplier_invoice":
      await (
        await import("./supplierFinance")
      ).restoreSupplierInvoice(item.payload as SupplierInvoice);
      break;
    case "supplier_receipt":
      await (
        await import("./supplierReceipts")
      ).restoreSupplierPaymentReceipt(item.payload as SupplierPaymentReceipt);
      break;
    case "expense":
    case "finance_deposit": {
      const { requireRole } = await import("./auth");
      await requireRole(["ceo", "admin"]);
      if (item.entity_type === "expense") {
        await (await import("./expenses")).restoreExpense(item.payload as Expense);
      } else {
        await (
          await import("./financeBalance")
        ).restoreFinanceDeposit(item.payload as FinanceDeposit);
      }
      break;
    }
    default:
      throw new Error(`Unknown entity type: ${item.entity_type}`);
  }

  await purgeRecycleBinItem(id);
}
