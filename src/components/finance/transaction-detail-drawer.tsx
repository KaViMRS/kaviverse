"use client";

import * as React from "react";
import {
  X,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  Wallet,
  Tag,
  User,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import { Transaction } from "@/types/transaction";
import { formatIDR } from "@/lib/utils/formatters";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { deleteTransactionAction } from "@/app/(dashboard)/finance/actions";

interface TransactionDetailDrawerProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (tx: Transaction) => void;
  onDeleted?: () => void;
}

export function TransactionDetailDrawer({
  transaction,
  isOpen,
  onClose,
  onEdit,
  onDeleted,
}: TransactionDetailDrawerProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  // Close on ESC
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !deleting && !showDeleteConfirm) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, deleting, showDeleteConfirm, onClose]);

  if (!isOpen || !transaction) return null;

  async function handleDelete() {
    if (!transaction) return;
    try {
      setDeleting(true);
      const res = await deleteTransactionAction(transaction.id);
      if (!res.success) {
        alert(res.error || "Gagal menghapus transaksi.");
        return;
      }
      setShowDeleteConfirm(false);
      onClose();
      if (onDeleted) onDeleted();
    } catch (err) {
      console.error("Error deleting transaction:", err);
      alert("Terjadi kesalahan saat menghapus transaksi.");
    } finally {
      setDeleting(false);
    }
  }

  const isIncome = transaction.type === "Pemasukan";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-xs transition-opacity animate-in fade-in-50 duration-200"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-surface border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-surface-muted/30">
          <div className="flex items-center gap-2">
            <h2 id="drawer-title" className="text-sm font-bold text-text-primary">
              Detail Transaksi
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors"
            aria-label="Tutup drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Amount and Type Badge */}
          <div className="p-5 rounded-xl bg-surface-muted/50 border border-border text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span
                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  isIncome
                    ? "bg-success/10 text-success border-success/20"
                    : "bg-danger/10 text-danger border-danger/20"
                }`}
              >
                {transaction.type}
              </span>
              <span
                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  transaction.status === "Sudah Dibayar"
                    ? "bg-info/10 text-info border-info/20"
                    : "bg-warning/10 text-warning border-warning/20"
                }`}
              >
                {transaction.status}
              </span>
            </div>

            <div
              className={`text-2xl font-bold tracking-tight ${
                isIncome ? "text-success" : "text-text-primary"
              }`}
            >
              {isIncome ? "+" : "-"} {formatIDR(transaction.amount)}
            </div>

            <p className="text-xs text-text-secondary font-medium leading-relaxed px-2">
              {transaction.activity}
            </p>
          </div>

          {/* Key Attributes List */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Informasi Transaksi
            </h3>

            <div className="divide-y divide-border/60 border border-border rounded-xl bg-surface overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <Tag className="w-3.5 h-3.5 text-text-muted" />
                  <span>Kategori</span>
                </div>
                <span className="text-xs font-semibold text-text-primary">
                  {transaction.category}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <Wallet className="w-3.5 h-3.5 text-text-muted" />
                  <span>Rekening / Akun</span>
                </div>
                <span className="text-xs font-semibold text-text-primary">
                  {transaction.account}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <Calendar className="w-3.5 h-3.5 text-text-muted" />
                  <span>Tanggal</span>
                </div>
                <span className="text-xs font-semibold text-text-primary">
                  {transaction.date || "-"}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <Clock className="w-3.5 h-3.5 text-text-muted" />
                  <span>Waktu</span>
                </div>
                <span className="text-xs font-semibold text-text-primary">
                  {transaction.time || "-"}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <User className="w-3.5 h-3.5 text-text-muted" />
                  <span>Pengirim / Sumber</span>
                </div>
                <span className="text-xs font-semibold text-text-primary">
                  {transaction.sender || "User"}
                </span>
              </div>

              {transaction.rawRowIndex && (
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-text-muted" />
                    <span>Baris Google Sheet</span>
                  </div>
                  <span className="text-xs font-mono text-text-muted">
                    Input!A{transaction.rawRowIndex}:I{transaction.rawRowIndex}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border/80 bg-surface-muted/30 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg text-danger hover:bg-danger/10 border border-danger/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium rounded-lg border border-border bg-surface hover:bg-surface-muted text-text-secondary hover:text-text-primary transition-colors"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                onEdit(transaction);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-colors shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Transaksi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Hapus Transaksi Ini?"
        description={`Apakah Anda yakin ingin menghapus catatan transaksi "${transaction.activity}" sebesar ${formatIDR(
          transaction.amount
        )}? Baris transaksi di Google Sheets akan dibersihkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isDestructive={true}
        loading={deleting}
      />
    </>
  );
}
