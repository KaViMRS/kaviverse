import { getFinanceRepository } from "@/lib/repositories/factory";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { AccountsWidget } from "@/components/dashboard/accounts-widget";
import { FinanceOverviewClient } from "./finance-overview-client";
import { formatIDR } from "@/lib/utils/formatters";
import Link from "next/link";
import { ArrowRight, Receipt, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FinanceOverviewPage() {
  const financeRepo = getFinanceRepository();
  const [balanceSummary, transactionsResult] = await Promise.all([
    financeRepo.getAccountBalances(),
    financeRepo.getTransactions({ limit: 15 }),
  ]);

  return (
    <div className="space-y-6">
      <FinanceOverviewClient />

      <KpiCards
        totalBalance={balanceSummary.totalBalance}
        monthlyIncome={balanceSummary.monthlyIncome}
        monthlyExpense={balanceSummary.monthlyExpense}
        netCashFlow={balanceSummary.netCashFlow}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Transactions List */}
        <div className="lg:col-span-8">
          <div
            className="rounded-2xl p-5 relative overflow-hidden flex flex-col h-full transition-all duration-300"
            style={{
              background: "rgba(14, 20, 32, 0.75)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.07)",
              boxShadow: "0 4px 20px -8px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Top gradient accent line */}
            <div
              className="absolute top-0 inset-x-0 h-[2px]"
              style={{
                background: "linear-gradient(90deg, transparent, #19C59E, #3B82F6, transparent)",
              }}
            />

            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-accent"
                  style={{
                    background: "rgba(25, 197, 158, 0.12)",
                    border: "1px solid rgba(25, 197, 158, 0.25)",
                  }}
                >
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-text-primary tracking-tight">
                    Transaksi Terakhir
                  </h2>
                  <p className="text-[10px] text-text-muted">
                    15 mutasi terbaru dari seluruh sumber dana
                  </p>
                </div>
              </div>

              <Link
                href="/finance/transactions"
                className="flex items-center gap-1 text-[11px] font-semibold text-accent hover:text-white transition-colors px-2.5 py-1 rounded-lg"
                style={{
                  background: "rgba(25, 197, 158, 0.08)",
                  border: "1px solid rgba(25, 197, 158, 0.18)",
                }}
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="overflow-x-auto relative z-10 flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr
                    className="text-[10.5px] font-bold text-text-muted uppercase tracking-wider"
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                  >
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Aktifitas &amp; Deskripsi</th>
                    <th className="py-2.5 px-3">Kategori</th>
                    <th className="py-2.5 px-3 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-xs">
                  {transactionsResult.data.map((tx) => {
                    const isIncome = tx.type === "Pemasukan";
                    return (
                      <tr
                        key={tx.id}
                        className="hover:bg-white/[0.03] transition-colors group"
                      >
                        <td className="py-3 px-3 whitespace-nowrap text-text-muted text-[11px]">
                          {tx.date}
                        </td>
                        <td className="py-3 px-3 font-semibold text-text-primary max-w-xs truncate group-hover:text-accent transition-colors">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                isIncome ? "bg-accent shadow-xs" : "bg-rose-400 shadow-xs"
                              }`}
                              style={{
                                boxShadow: isIncome
                                  ? "0 0 6px rgba(25, 197, 158, 0.6)"
                                  : "0 0 6px rgba(244, 63, 94, 0.6)",
                              }}
                            />
                            <span className="truncate">{tx.activity}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-text-secondary"
                            style={{
                              background: "rgba(255, 255, 255, 0.04)",
                              border: "1px solid rgba(255, 255, 255, 0.07)",
                            }}
                          >
                            {tx.category}
                          </span>
                        </td>
                        <td
                          className={`py-3 px-3 whitespace-nowrap text-right font-black text-xs ${
                            isIncome ? "text-accent" : "text-text-primary"
                          }`}
                        >
                          {isIncome ? "+" : "-"} {formatIDR(tx.amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Accounts Widget */}
        <div className="lg:col-span-4">
          <AccountsWidget accounts={balanceSummary.accounts} />
        </div>
      </div>
    </div>
  );
}
