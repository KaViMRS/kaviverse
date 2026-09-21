"use server";

import { revalidatePath } from "next/cache";
import { getFinanceRepository } from "@/lib/repositories/factory";
import { requireAdmin } from "@/lib/auth/admin";
import {
  createTransactionSchema,
  updateTransactionSchema,
  reconcileSchema,
  createBillSchema,
  CreateTransactionInput,
  UpdateTransactionInput,
  ReconcileInput,
  CreateBillInput,
} from "@/lib/validators/finance";

function revalidateAllFinancePaths() {
  revalidatePath("/dashboard");
  revalidatePath("/finance");
  revalidatePath("/finance/transactions");
  revalidatePath("/finance/accounts");
  revalidatePath("/finance/bills");
  revalidatePath("/finance/reports");
  revalidatePath("/activity");
}

export async function createTransactionAction(input: CreateTransactionInput) {
  try {
    await requireAdmin();
    const validated = createTransactionSchema.parse(input);
    const financeRepo = getFinanceRepository();

    const transaction = await financeRepo.createTransaction({
      activity: validated.activity,
      type: validated.type,
      category: validated.category,
      amount: validated.amount,
      account: validated.account,
      status: validated.status,
      date: validated.date,
      time: validated.time,
      source: "web",
    });

    revalidateAllFinancePaths();
    return { success: true, transaction };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menambahkan transaksi.";
    return { success: false, error: message };
  }
}

export async function updateTransactionAction(id: string, input: UpdateTransactionInput) {
  try {
    await requireAdmin();
    const validated = updateTransactionSchema.parse(input);
    const financeRepo = getFinanceRepository();

    const transaction = await financeRepo.updateTransaction(id, validated);

    revalidateAllFinancePaths();
    return { success: true, transaction };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal memperbarui transaksi.";
    return { success: false, error: message };
  }
}

export async function deleteTransactionAction(id: string) {
  try {
    await requireAdmin();
    const financeRepo = getFinanceRepository();
    const success = await financeRepo.deleteTransaction(id);

    if (!success) {
      return { success: false, error: "Transaksi tidak ditemukan atau gagal dihapus." };
    }

    revalidateAllFinancePaths();
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menghapus transaksi.";
    return { success: false, error: message };
  }
}

export async function reconcileAccountAction(input: ReconcileInput) {
  try {
    await requireAdmin();
    const validated = reconcileSchema.parse(input);
    const financeRepo = getFinanceRepository();

    const transaction = await financeRepo.reconcileAccount(
      validated.accountName,
      validated.actualBalance
    );

    revalidateAllFinancePaths();
    return { success: true, transaction };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal melakukan rekonsiliasi saldo.";
    return { success: false, error: message };
  }
}

export async function createBillAction(input: CreateBillInput) {
  try {
    await requireAdmin();
    const validated = createBillSchema.parse(input);
    const financeRepo = getFinanceRepository();

    const bill = await financeRepo.createBill({
      name: validated.name,
      amount: validated.amount,
      dueDay: validated.dueDay,
    });

    revalidatePath("/finance/bills");
    return { success: true, bill };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menambahkan tagihan.";
    return { success: false, error: message };
  }
}

export async function deleteBillAction(id: string) {
  try {
    await requireAdmin();
    const financeRepo = getFinanceRepository();
    const success = await financeRepo.deleteBill(id);

    if (!success) {
      return { success: false, error: "Tagihan tidak ditemukan atau gagal dihapus." };
    }

    revalidatePath("/finance/bills");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menghapus tagihan.";
    return { success: false, error: message };
  }
}

export async function exportTransactionsCsvAction(): Promise<string> {
  await requireAdmin();
  const financeRepo = getFinanceRepository();
  const { data: transactions } = await financeRepo.getTransactions({ limit: 10000 });

  // Add UTF-8 BOM for Microsoft Excel compatibility
  let csv = "\ufeff";
  csv += "Tanggal;Waktu;Pengirim;Aktifitas;Jenis;Kategori;Jumlah;Rekening;Status\n";

  transactions.forEach((t) => {
    const row = [
      `"${t.date}"`,
      `"${t.time}"`,
      `"${(t.sender || "").replace(/"/g, '""')}"`,
      `"${(t.activity || "").replace(/"/g, '""')}"`,
      `"${t.type}"`,
      `"${t.category}"`,
      t.amount,
      `"${t.account}"`,
      `"${t.status}"`,
    ];
    csv += row.join(";") + "\n";
  });

  return csv;
}
