"use client";

import * as React from "react";
import { X, Loader2, Scale, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { reconcileAccountAction } from "@/app/(dashboard)/finance/actions";
import { formatIDR } from "@/lib/utils/formatters";
import { AccountBalance } from "@/types/account";

interface ReconcileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  accounts: AccountBalance[];
}

export function ReconcileModal({
  isOpen,
  onClose,
  onSuccess,
  accounts,
}: ReconcileModalProps) {
  const [selectedAccount, setSelectedAccount] = React.useState<string>(
    accounts[0]?.name || ""
  );
  const [actualBalance, setActualBalance] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Sync default account when accounts change
  React.useEffect(() => {
    if (accounts.length > 0 && !accounts.find((a) => a.name === selectedAccount)) {
      setSelectedAccount(accounts[0].name);
    }
  }, [accounts, selectedAccount]);

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

  const currentAccount = accounts.find(
    (a) => a.name.toLowerCase() === selectedAccount.toLowerCase()
  );
  const calculatedBalance = currentAccount?.calculatedBalance || 0;
  const numericActual = Number(actualBalance.replace(/[^0-9]/g, "")) || 0;
  const diff = numericActual - calculatedBalance;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedAccount) {
      setErrorMsg("Pilih rekening terlebih dahulu.");
      return;
    }

    if (numericActual < 0) {
      setErrorMsg("Saldo fisik tidak boleh negatif.");
      return;
    }

    if (diff === 0) {
      setErrorMsg("Saldo sudah sesuai, tidak perlu penyesuaian.");
      return;
    }

    try {
      setLoading(true);
      const res = await reconcileAccountAction({
        accountName: selectedAccount,
        actualBalance: numericActual,
      });

      if (!res.success) {
        setErrorMsg(res.error || "Gagal melakukan rekonsiliasi.");
        return;
      }

      setActualBalance("");
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in-50 duration-200">
      <div
        className="w-full max-w-md bg-surface border border-border rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-surface-muted/30">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-accent" />
            <h2 className="text-sm font-bold text-text-primary">Rekonsiliasi Saldo</h2>
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

          {/* Account Select */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5">
              Pilih Rekening
            </label>
            <select
              value={selectedAccount}
              onChange={(e) => {
                setSelectedAccount(e.target.value);
                setErrorMsg(null);
              }}
              className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-border text-text-primary focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent cursor-pointer"
            >
              {accounts.map((acc) => (
                <option key={acc.name} value={acc.name}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Calculated Balance (read-only) */}
          <div className="p-4 rounded-lg bg-surface-muted/50 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Saldo Terhitung (Sistem)</span>
              <span className="text-sm font-bold text-text-primary">
                {formatIDR(calculatedBalance)}
              </span>
            </div>
            <p className="text-[10px] text-text-muted">
              Dihitung otomatis dari seluruh riwayat transaksi pada rekening ini.
            </p>
          </div>

          {/* Actual Balance Input */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5">
              Saldo Fisik Aktual (IDR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                required
                value={actualBalance}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setActualBalance(val ? Number(val).toLocaleString("id-ID") : "");
                }}
                placeholder="0"
                className="w-full pl-10 pr-3 py-2 text-sm font-semibold rounded-lg bg-surface border border-border text-text-primary focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          {/* Diff Preview */}
          {actualBalance && (
            <div
              className={`p-4 rounded-lg border space-y-1 ${
                diff === 0
                  ? "bg-info/5 border-info/20"
                  : diff > 0
                  ? "bg-success/5 border-success/20"
                  : "bg-danger/5 border-danger/20"
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Selisih (Delta)</span>
                <span
                  className={`text-sm font-bold flex items-center gap-1 ${
                    diff === 0
                      ? "text-info"
                      : diff > 0
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
                  {diff > 0 && <ArrowUpRight className="w-3.5 h-3.5" />}
                  {diff < 0 && <ArrowDownLeft className="w-3.5 h-3.5" />}
                  {diff === 0 ? "Sudah Sesuai" : formatIDR(Math.abs(diff))}
                </span>
              </div>
              {diff !== 0 && (
                <p className="text-[10px] text-text-muted">
                  Sistem akan mencatat transaksi penyesuaian (adjustment) otomatis sebagai{" "}
                  <span className="font-semibold">{diff > 0 ? "Pemasukan" : "Pengeluaran"}</span>{" "}
                  sebesar {formatIDR(Math.abs(diff))} pada rekening {selectedAccount}.
                </p>
              )}
            </div>
          )}

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
              disabled={loading || diff === 0}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? "Memproses..." : "Rekonsiliasi Saldo"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
