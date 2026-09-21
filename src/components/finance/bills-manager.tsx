"use client";

import * as React from "react";
import {
  Plus,
  Trash2,
  Calendar,
  ReceiptText,
  Loader2,
  X,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { Bill } from "@/types/bill";
import { formatIDR } from "@/lib/utils/formatters";
import { createBillAction, deleteBillAction } from "@/app/(dashboard)/finance/actions";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useRouter } from "next/navigation";

interface BillsManagerProps {
  initialBills: Bill[];
}

export function BillsManager({ initialBills }: BillsManagerProps) {
  const router = useRouter();

  // Add Bill Modal
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [addName, setAddName] = React.useState("");
  const [addAmount, setAddAmount] = React.useState("");
  const [addDueDay, setAddDueDay] = React.useState("1");
  const [addLoading, setAddLoading] = React.useState(false);
  const [addError, setAddError] = React.useState<string | null>(null);

  // Delete Confirmation
  const [deleteTarget, setDeleteTarget] = React.useState<Bill | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  function resetAddForm() {
    setAddName("");
    setAddAmount("");
    setAddDueDay("1");
    setAddError(null);
  }

  async function handleAddBill(e: React.FormEvent) {
    e.preventDefault();
    setAddError(null);

    const numericAmount = Number(addAmount.replace(/[^0-9]/g, ""));
    if (!addName.trim()) {
      setAddError("Nama tagihan wajib diisi.");
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      setAddError("Nominal tagihan harus lebih dari 0.");
      return;
    }
    const dayNum = parseInt(addDueDay, 10);
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
      setAddError("Tanggal jatuh tempo harus antara 1–31.");
      return;
    }

    try {
      setAddLoading(true);
      const res = await createBillAction({
        name: addName.trim(),
        amount: numericAmount,
        dueDay: dayNum,
      });

      if (!res.success) {
        setAddError(res.error || "Gagal menambahkan tagihan.");
        return;
      }

      resetAddForm();
      setIsAddOpen(false);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setAddError(msg);
    } finally {
      setAddLoading(false);
    }
  }

  async function handleDeleteBill() {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      const res = await deleteBillAction(deleteTarget.id);
      if (!res.success) {
        alert(res.error || "Gagal menghapus tagihan.");
        return;
      }
      setDeleteTarget(null);
      router.refresh();
    } catch (err) {
      console.error("Error deleting bill:", err);
    } finally {
      setDeleteLoading(false);
    }
  }

  const totalMonthly = initialBills.reduce((acc, b) => acc + b.amount, 0);
  const overdueCount = initialBills.filter((b) => b.status === "Overdue").length;

  return (
    <div className="space-y-5">
      {/* Summary Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-xs text-text-muted">
            Total Tagihan:{" "}
            <span className="font-bold text-text-primary">{formatIDR(totalMonthly)}</span>
          </div>
          {overdueCount > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-rose-400 font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{overdueCount} Jatuh Tempo</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md active:scale-[0.98] cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #19C59E 0%, #108e71 100%)",
            boxShadow: "0 4px 18px -4px rgba(25, 197, 158, 0.45)",
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tagihan</span>
        </button>
      </div>

      {/* Bills Grid */}
      {initialBills.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center max-w-md mx-auto space-y-3"
          style={{
            background: "rgba(14, 20, 32, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <ReceiptText className="w-10 h-10 mx-auto mb-2 text-text-muted/40" />
          <p className="text-sm font-bold text-text-primary">Belum ada tagihan rutin.</p>
          <p className="text-xs text-text-muted">
            Klik &quot;Tambah Tagihan&quot; untuk mencatat jadwal pembayaran bulanan Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {initialBills.map((b) => {
            const isOverdue = b.status === "Overdue";
            const isPaid = b.status === "Paid";

            return (
              <div
                key={b.id}
                className="p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 group"
                style={{
                  background: "rgba(14, 20, 32, 0.75)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 4px 20px -8px rgba(0, 0, 0, 0.3)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = isOverdue
                    ? "rgba(244, 63, 94, 0.4)"
                    : "rgba(245, 158, 11, 0.35)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 16px 36px -10px rgba(0,0,0,0.5)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(255, 255, 255, 0.08)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 4px 20px -8px rgba(0, 0, 0, 0.3)";
                }}
              >
                {/* Top glowing line */}
                <div
                  className="absolute top-0 inset-x-0 h-[2px] opacity-70 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: isOverdue
                      ? "linear-gradient(90deg, transparent, #F43F5E, transparent)"
                      : "linear-gradient(90deg, transparent, #F59E0B, transparent)",
                  }}
                />

                <div className="space-y-3 relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: isOverdue
                            ? "rgba(244, 63, 94, 0.12)"
                            : "rgba(245, 158, 11, 0.12)",
                          border: isOverdue
                            ? "1px solid rgba(244, 63, 94, 0.25)"
                            : "1px solid rgba(245, 158, 11, 0.25)",
                        }}
                      >
                        <ReceiptText
                          className={`w-4 h-4 ${
                            isOverdue ? "text-rose-400" : "text-amber-400"
                          }`}
                        />
                      </div>
                      <span className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors truncate max-w-[130px]">
                        {b.name}
                      </span>
                    </div>

                    <span
                      className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border"
                      style={{
                        background: isOverdue
                          ? "rgba(244, 63, 94, 0.12)"
                          : isPaid
                          ? "rgba(25, 197, 158, 0.12)"
                          : "rgba(59, 130, 246, 0.12)",
                        color: isOverdue
                          ? "#FB7185"
                          : isPaid
                          ? "#19C59E"
                          : "#60A5FA",
                        borderColor: isOverdue
                          ? "rgba(244, 63, 94, 0.25)"
                          : isPaid
                          ? "rgba(25, 197, 158, 0.25)"
                          : "rgba(59, 130, 246, 0.25)",
                      }}
                    >
                      {b.status || "Aktif"}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="text-xl font-black text-text-primary tracking-tight">
                    {formatIDR(b.amount)}
                  </div>

                  {/* Due Day & Delete */}
                  <div
                    className="pt-2 flex items-center justify-between text-[11px] text-text-muted"
                    style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-text-muted/70" />
                      <span>Tgl {b.dueDay} setiap bulan</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(b)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                      title="Hapus tagihan ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Bill Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0"
            style={{
              background: "rgba(4, 7, 12, 0.8)",
              backdropFilter: "blur(12px)",
            }}
            onClick={() => !addLoading && setIsAddOpen(false)}
          />

          <div
            className="relative w-full max-w-md rounded-2xl shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200"
            style={{
              background: "rgba(13, 18, 28, 0.95)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between pb-4"
              style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.07)" }}
            >
              <div className="flex items-center gap-2.5">
                <ReceiptText className="w-5 h-5 text-accent" />
                <h3 className="text-sm font-bold text-text-primary">
                  Tambah Tagihan Rutin
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                disabled={addLoading}
                className="p-1 text-text-muted hover:text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBill} className="mt-5 space-y-4">
              {addError && (
                <div
                  className="p-3 rounded-xl text-rose-400 text-xs flex items-center gap-2"
                  style={{
                    background: "rgba(244, 63, 94, 0.1)",
                    border: "1px solid rgba(244, 63, 94, 0.2)",
                  }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{addError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary">
                  Nama Tagihan
                </label>
                <input
                  type="text"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="Contoh: WiFi Indihome, Listrik PLN"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl text-text-primary placeholder:text-text-muted/70 transition-all outline-none"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary">
                    Nominal (Rp)
                  </label>
                  <input
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="350000"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl text-text-primary placeholder:text-text-muted/70 transition-all outline-none"
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary">
                    Tanggal Jatuh Tempo
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={addDueDay}
                    onChange={(e) => setAddDueDay(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl text-text-primary transition-all outline-none"
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  />
                </div>
              </div>

              <div
                className="pt-4 flex items-center justify-end gap-2.5"
                style={{ borderTop: "1px solid rgba(255, 255, 255, 0.07)" }}
              >
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  disabled={addLoading}
                  className="px-4 py-2 text-xs font-semibold text-text-secondary hover:text-white rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-5 py-2 text-xs font-bold text-white rounded-xl transition-all shadow-md flex items-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #19C59E 0%, #108e71 100%)",
                  }}
                >
                  {addLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    "Simpan Tagihan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Hapus Tagihan Rutin?"
        description={`Apakah Anda yakin ingin menghapus tagihan "${deleteTarget?.name}"? Tindakan ini akan menghapus baris dari Google Sheets.`}
        confirmText="Hapus Tagihan"
        onConfirm={handleDeleteBill}
        onClose={() => setDeleteTarget(null)}
        isDestructive={true}
        loading={deleteLoading}
      />
    </div>
  );
}
