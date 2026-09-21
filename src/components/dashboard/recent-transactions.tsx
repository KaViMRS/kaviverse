"use client";

import Link from "next/link";
import { Transaction } from "@/types/transaction";
import { formatIDR, formatDateIndonesian } from "@/lib/utils/formatters";
import { ArrowRight, Receipt, CheckCircle2, Clock } from "lucide-react";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(14, 20, 32, 0.75)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 20px -8px rgba(0,0,0,0.3)",
      }}
    >
      {/* Top gradient bar */}
      <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #19C59E, #38BDF8, transparent)" }} />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-accent" style={{ background: "rgba(25,197,158,0.12)", border: "1px solid rgba(25,197,158,0.25)" }}>
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary">
              Transaksi Terkini
            </h2>
            <p className="text-[11px] text-text-muted">
              Sinkron otomatis dari bot Telegram &amp; Google Sheets
            </p>
          </div>
        </div>

        <Link
          href="/finance/transactions"
          className="flex items-center gap-1 text-[11px] font-semibold text-accent hover:text-white transition-colors px-2 py-1 rounded-lg"
          style={{ background: "rgba(25,197,158,0.08)", border: "1px solid rgba(25,197,158,0.15)" }}
        >
          <span>Buka Semua</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="text-[10.5px] font-semibold text-text-muted uppercase tracking-wider" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <th className="pb-3 px-2 font-medium">Tanggal</th>
              <th className="pb-3 px-2 font-medium">Aktivitas</th>
              <th className="pb-3 px-2 font-medium">Kategori</th>
              <th className="pb-3 px-2 font-medium">Rekening</th>
              <th className="pb-3 px-2 font-medium text-right">Jumlah</th>
              <th className="pb-3 px-2 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 7).map((tx) => {
              const isIncome = tx.type === "Pemasukan";
              return (
                <tr key={tx.id} className="transition-colors group" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "rgba(255,255,255,0.025)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
                >
                  <td className="py-3 px-2 text-text-secondary whitespace-nowrap">
                    <span className="font-semibold text-text-primary">
                      {formatDateIndonesian(tx.date)}
                    </span>
                    <span className="block text-[10px] text-text-muted">{tx.time}</span>
                  </td>

                  <td className="py-3 px-2">
                    <span className="font-semibold text-text-primary block truncate max-w-[170px] sm:max-w-xs group-hover:text-accent transition-colors">
                      {tx.activity}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      Oleh: {tx.sender}
                    </span>
                  </td>

                  <td className="py-3 px-2 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-surface-muted border border-border/70 text-text-secondary">
                      {tx.category}
                    </span>
                  </td>

                  <td className="py-3 px-2 whitespace-nowrap text-text-secondary font-medium">
                    {tx.account}
                  </td>

                  <td className="py-3 px-2 text-right whitespace-nowrap">
                    <span
                      className={`font-black text-xs ${
                        isIncome ? "text-brand-teal" : "text-rose-400"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatIDR(tx.amount)}
                    </span>
                  </td>

                  <td className="py-3 px-2 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.status === "Sudah Dibayar"
                          ? "bg-brand-teal/10 text-brand-teal border border-brand-teal/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {tx.status === "Sudah Dibayar" ? (
                        <CheckCircle2 className="w-2.5 h-2.5" />
                      ) : (
                        <Clock className="w-2.5 h-2.5" />
                      )}
                      <span>{tx.status}</span>
                    </span>
                  </td>
                </tr>
              );
            })}

            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-text-muted italic">
                  Belum ada transaksi tercatat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
