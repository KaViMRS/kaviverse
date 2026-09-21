"use client";

import * as React from "react";
import { Plus, Wallet, Sparkles } from "lucide-react";
import { TransactionFormModal } from "@/components/finance/transaction-form-modal";
import { useRouter } from "next/navigation";

export function FinanceOverviewClient() {
  const router = useRouter();
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  return (
    <>
      <div
        className="rounded-2xl p-5 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          background: "rgba(14, 20, 32, 0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 4px 20px -8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div
          className="absolute top-0 inset-x-0 h-[2px]"
          style={{
            background: "linear-gradient(90deg, transparent, #19C59E, #3B82F6, transparent)",
          }}
        />

        <div className="flex items-center gap-3.5 relative z-10">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-accent shrink-0"
            style={{
              background: "rgba(25, 197, 158, 0.12)",
              border: "1px solid rgba(25, 197, 158, 0.28)",
              boxShadow: "0 0 20px -4px rgba(25, 197, 158, 0.3)",
            }}
          >
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-text-primary tracking-tight">
                Ringkasan Keuangan
              </h1>
              <span
                className="text-[10px] font-extrabold text-accent px-2.5 py-0.5 rounded-full"
                style={{
                  background: "rgba(25, 197, 158, 0.12)",
                  border: "1px solid rgba(25, 197, 158, 0.25)",
                }}
              >
                KaviFinance
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Pantau cash flow, rekening, dan mutasi saldo yang tersinkron otomatis via Telegram &amp; Sheets.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-bold transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer self-start sm:self-auto relative z-10"
          style={{
            background: "linear-gradient(135deg, #19C59E 0%, #108e71 100%)",
            boxShadow: "0 4px 18px -4px rgba(25, 197, 158, 0.45)",
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Catat Transaksi</span>
        </button>
      </div>

      <TransactionFormModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => router.refresh()}
      />
    </>
  );
}
