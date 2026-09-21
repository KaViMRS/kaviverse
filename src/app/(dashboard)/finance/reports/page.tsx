import { getFinanceRepository } from "@/lib/repositories/factory";
import { CashFlowChart } from "@/components/dashboard/cash-flow-chart";
import { formatIDR } from "@/lib/utils/formatters";
import { FileSpreadsheet, TrendingUp, TrendingDown, Scale, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const financeRepo = getFinanceRepository();
  const summary = await financeRepo.getAccountBalances();

  const savingsRate =
    summary.monthlyIncome > 0
      ? Math.round((summary.netCashFlow / summary.monthlyIncome) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
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
            background: "linear-gradient(90deg, transparent, #19C59E, #7C5CFF, transparent)",
          }}
        />

        <div className="flex items-center gap-3.5 relative z-10">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-accent shrink-0"
            style={{
              background: "rgba(25, 197, 158, 0.12)",
              border: "1px solid rgba(255, 197, 158, 0.28)",
              boxShadow: "0 0 20px -4px rgba(25, 197, 158, 0.3)",
            }}
          >
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-text-primary tracking-tight">
                Laporan Keuangan Periodik
              </h1>
              <span
                className="text-[10px] font-extrabold text-accent px-2.5 py-0.5 rounded-full"
                style={{
                  background: "rgba(25, 197, 158, 0.12)",
                  border: "1px solid rgba(25, 197, 158, 0.25)",
                }}
              >
                Analisis Arus Kas
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Analisis performa finansial, tren pemasukan vs. pengeluaran, dan rasio tabungan bersih.
            </p>
          </div>
        </div>

        <div
          className="px-4 py-2 rounded-xl self-start sm:self-auto relative z-10"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.07)",
          }}
        >
          <span className="text-[10px] text-text-muted uppercase tracking-wider block font-bold">
            Savings Rate
          </span>
          <span
            className={`text-sm font-black ${
              savingsRate >= 20 ? "text-accent" : "text-amber-400"
            }`}
          >
            {savingsRate}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <CashFlowChart
            monthlyIncome={summary.monthlyIncome}
            monthlyExpense={summary.monthlyExpense}
          />
        </div>

        {/* Ringkasan Angka Card */}
        <div
          className="lg:col-span-4 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between"
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

          <div className="space-y-4 relative z-10">
            <div>
              <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Scale className="w-4 h-4 text-accent" />
                <span>Ringkasan Keuangan</span>
              </h2>
              <p className="text-[11px] text-text-muted mt-0.5">
                Perhitungan total arus kas periode aktif
              </p>
            </div>

            <div className="space-y-3">
              <div
                className="p-3.5 rounded-xl flex items-center justify-between"
                style={{
                  background: "rgba(25, 197, 158, 0.06)",
                  border: "1px solid rgba(25, 197, 158, 0.15)",
                }}
              >
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span>Total Pemasukan</span>
                </div>
                <span className="font-bold text-accent text-sm">
                  +{formatIDR(summary.monthlyIncome)}
                </span>
              </div>

              <div
                className="p-3.5 rounded-xl flex items-center justify-between"
                style={{
                  background: "rgba(244, 63, 94, 0.06)",
                  border: "1px solid rgba(244, 63, 94, 0.15)",
                }}
              >
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                  <span>Total Pengeluaran</span>
                </div>
                <span className="font-bold text-rose-400 text-sm">
                  -{formatIDR(summary.monthlyExpense)}
                </span>
              </div>

              <div
                className="p-4 rounded-xl flex items-center justify-between"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <span className="text-xs font-bold text-text-primary">
                  Net Cash Flow
                </span>
                <span
                  className={`font-black text-base ${
                    summary.netCashFlow >= 0 ? "text-accent" : "text-rose-400"
                  }`}
                >
                  {formatIDR(summary.netCashFlow)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
