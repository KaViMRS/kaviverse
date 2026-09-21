import { z } from "zod";

export const createTransactionSchema = z.object({
  activity: z.string().min(1, "Aktifitas / deskripsi transaksi wajib diisi"),
  type: z.enum(["Pemasukan", "Pengeluaran"]),
  category: z.string().min(1, "Kategori wajib dipilih"),
  amount: z.coerce.number().positive("Nominal harus berupa angka positif lebih dari 0"),
  account: z.string().min(1, "Rekening / dompet wajib dipilih"),
  status: z.enum(["Sudah Dibayar", "Belum Dibayar"]).default("Sudah Dibayar"),
  date: z.string().optional(),
  time: z.string().optional(),
});

export const updateTransactionSchema = z.object({
  activity: z.string().min(1, "Aktifitas / deskripsi transaksi wajib diisi").optional(),
  type: z.enum(["Pemasukan", "Pengeluaran"]).optional(),
  category: z.string().min(1, "Kategori wajib dipilih").optional(),
  amount: z.coerce.number().positive("Nominal harus berupa angka positif").optional(),
  account: z.string().min(1, "Rekening / dompet wajib dipilih").optional(),
  status: z.enum(["Sudah Dibayar", "Belum Dibayar"]).optional(),
});

export const reconcileSchema = z.object({
  accountName: z.string().min(1, "Nama rekening wajib dipilih"),
  actualBalance: z.coerce.number().min(0, "Saldo fisik tidak boleh negatif"),
});

export const createBillSchema = z.object({
  name: z.string().min(1, "Nama tagihan wajib diisi"),
  amount: z.coerce.number().positive("Nominal tagihan harus berupa angka positif"),
  dueDay: z.coerce.number().int().min(1, "Tanggal jatuh tempo minimal 1").max(31, "Tanggal jatuh tempo maksimal 31"),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type ReconcileInput = z.infer<typeof reconcileSchema>;
export type CreateBillInput = z.infer<typeof createBillSchema>;
