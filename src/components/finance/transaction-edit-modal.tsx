"use client";

import * as React from "react";
import { X, Loader2, Edit3, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Transaction } from "@/types/transaction";
import { updateTransactionAction } from "@/app/(dashboard)/finance/actions";
import { formatIDR } from "@/lib/utils/formatters";

interface TransactionEditModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  availableAccounts?: string[];
}

const DEFAULT_ACCOUNTS = [
  "SeaBank",
  "BRI",
  "BNI",
  "BCA",
  "Mandiri",
  "DANA",
  "GoPay",
  "ShopeePay",
  "Krom",
  "Cash / Tunai",
];

const DEFAULT_CATEGORIES = [
  "Kebutuhan Pokok",
  "Jajan / Makan",
  "Transportasi",
  "Langganan / Utilitas",
  "Hiburan",
  "Pendidikan",
  "Kesehatan",
  "Pemasukan / Gaji",
  "Transfer Saldo",
  "Lain-lain",
];

export function TransactionEditModal({
  transaction,
  isOpen,
  onClose,
  onSuccess,
  availableAccounts = DEFAULT_ACCOUNTS,
}: TransactionEditModalProps) {
  const [type, setType] = React.useState<"Pengeluaran" | "Pemasukan">("Pengeluaran");
  const [amount, setAmount] = React.useState<string>("");
  const [activity, setActivity] = React.useState<string>("");
  const [account, setAccount] = React.useState<string>("Cash / Tunai");
  const [category, setCategory] = React.useState<string>("Jajan / Makan");
  const [status, setStatus] = React.useState<"Sudah Dibayar" | "Belum Dibayar">("Sudah Dibayar");

  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Sync state when transaction changes
  React.useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount ? Number(transaction.amount).toLocaleString("id-ID") : "");
      setActivity(transaction.activity || "");
      setAccount(transaction.account || "Cash / Tunai");
      setCategory(transaction.category || "Lain-lain");
      setStatus(transaction.status || "Sudah Dibayar");
      setErrorMsg(null);
    }
  }, [transaction]);

  // Handle ESC key
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!transaction) return;
    setErrorMsg(null);

    const numericAmount = Number(amount.replace(/[^0-9]/g, ""));
    if (!numericAmount || numericAmount <= 0) {
      setErrorMsg("Nominal harus berupa angka valid lebih dari 0.");
      return;
    }

    if (!activity.trim()) {
      setErrorMsg("Deskripsi transaksi / aktifitas wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      const res = await updateTransactionAction(transaction.id, {
        activity: activity.trim(),
        type,
        category: category.trim(),
        amount: numericAmount,
        account: account.trim(),
        status,
      });

      if (!res.success) {
        setErrorMsg(res.error || "Gagal memperbarui transaksi.");
        return;
      }

      onClose();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen || !transaction) return null;

  const numericPreview = Number(amount.replace(/[^0-9]/g, "")) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in-50 duration-200">
      <div
        className="w-full max-w-lg bg-surface border border-border rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-surface-muted/30">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-accent" />
            <div>
              <h2 className="text-sm font-bold text-text-primary">Edit Transaksi</h2>
              <p className="text-[11px] text-text-muted">
                ID: {transaction.id} ({transaction.date})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors disabled:opacity-50"
            aria-label="Tutup modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs rounded-lg bg-danger/10 border border-danger/20 text-danger animate-in fade-in-50">
              {errorMsg}
            </div>
          )}

          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5">
              Jenis Transaksi
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-surface-muted rounded-lg border border-border">
              <button
                type="button"
                onClick={() => setType("Pengeluaran")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                  type === "Pengeluaran"
                    ? "bg-danger text-white shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>Pengeluaran</span>
              </button>

              <button
                type="button"
                onClick={() => setType("Pemasukan")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                  type === "Pemasukan"
                    ? "bg-success text-white shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Pemasukan</span>
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5">
              Nominal (IDR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                required
                value={amount}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setAmount(val ? Number(val).toLocaleString("id-ID") : "");
                }}
                className="w-full pl-10 pr-3 py-2 text-sm font-semibold rounded-lg bg-surface border border-border text-text-primary focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
            {numericPreview > 0 && (
              <p className="text-[11px] text-text-muted mt-1">
                Terbaca: <span className="font-semibold text-text-primary">{formatIDR(numericPreview)}</span>
              </p>
            )}
          </div>

          {/* Activity / Description */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5">
              Deskripsi Transaksi / Aktifitas
            </label>
            <input
              type="text"
              required
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-border text-text-primary focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Account & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                Rekening / Dompet
              </label>
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-border text-text-primary focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent cursor-pointer"
              >
                {Array.from(new Set([...availableAccounts, ...DEFAULT_ACCOUNTS])).map((acc) => (
                  <option key={acc} value={acc}>
                    {acc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-border text-text-primary focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent cursor-pointer"
              >
                {DEFAULT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5">
              Status Pembayaran
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "Sudah Dibayar" | "Belum Dibayar")}
              className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-border text-text-primary focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent cursor-pointer"
            >
              <option value="Sudah Dibayar">Sudah Dibayar</option>
              <option value="Belum Dibayar">Belum Dibayar</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3.5 py-2 text-xs font-medium rounded-lg border border-border bg-surface hover:bg-surface-muted text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? "Menyimpan Perubahan..." : "Simpan Perubahan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
