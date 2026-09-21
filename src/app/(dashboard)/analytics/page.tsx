import { getFinanceRepository, getFileRepository } from "@/lib/repositories/factory";
import { CashFlowChart } from "@/components/dashboard/cash-flow-chart";
import { formatIDR } from "@/lib/utils/formatters";
import { BarChart3, HardDrive, Wallet, PiggyBank, Sparkles, PieChart, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const financeRepo = getFinanceRepository();
  const fileRepo = getFileRepository();

  const [summary, files] = await Promise.all([
    financeRepo.getAccountBalances(),
    fileRepo.getFiles({ limit: 500 }),
  ]);

  // Compute file categories
  const fileCounts = {
    PHOTO: 0,
    VIDEO: 0,
    AUDIO: 0,
    DOCUMENT: 0,
  };
  files.data.forEach((f) => {
    if (f.mediaType in fileCounts) {
      fileCounts[f.mediaType as keyof typeof fileCounts]++;
    }
  });

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
            background: "linear-gradient(90deg, transparent, #19C59E, #3B82F6, #7C5CFF, transparent)",
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
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-text-primary tracking-tight">
                Sistem Analitik Terpadu KaviVerse
              </h1>
              <span
                className="text-[10px] font-extrabold text-accent px-2.5 py-0.5 rounded-full"
                style={{
                  background: "rgba(25, 197, 158, 0.12)",
                  border: "1px solid rgba(25, 197, 158, 0.25)",
                }}
              >
                Telemetry
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Korelasi tren arus kas keuangan dan volume data pengarsipan cloud Telegram.
            </p>
          </div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Saldo Likuid",
            val: formatIDR(summary.totalBalance),
            sub: `${summary.accounts.length} rekening aktif`,
            color: "#19C59E",
            icon: Wallet,
            bg: "rgba(25, 197, 158, 0.1)",
          },
          {
            label: "Total Berkas Cloud",
            val: `${files.total} Berkas`,
            sub: "Tersinkron di Telegram",
            color: "#3B82F6",
            icon: HardDrive,
            bg: "rgba(59, 130, 246, 0.1)",
          },
          {
            label: "Budget Limit",
            val: `${Math.round(summary.budgetPercentage)}%`,
            sub: `${formatIDR(summary.budgetRemaining)} tersisa`,
            color: summary.budgetPercentage > 85 ? "#F43F5E" : "#F59E0B",
            icon: PiggyBank,
            bg: "rgba(245, 158, 11, 0.1)",
          },
          {
            label: "Arus Kas Bersih",
            val: formatIDR(summary.netCashFlow),
            sub: summary.netCashFlow >= 0 ? "Surplus Keuangan" : "Defisit",
            color: summary.netCashFlow >= 0 ? "#19C59E" : "#F43F5E",
            icon: Activity,
            bg: "rgba(124, 92, 255, 0.1)",
          },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="p-4 rounded-2xl relative overflow-hidden"
              style={{
                background: "rgba(14, 20, 32, 0.75)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 4px 20px -8px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-text-muted">{m.label}</span>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: m.bg, color: m.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div
                className="text-lg font-black tracking-tight"
                style={{ color: m.color }}
              >
                {m.val}
              </div>
              <span className="text-[10px] text-text-muted mt-1 block font-medium">
                {m.sub}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <CashFlowChart
            monthlyIncome={summary.monthlyIncome}
            monthlyExpense={summary.monthlyExpense}
          />
        </div>

        {/* Media Distribution Breakdown */}
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
              background: "linear-gradient(90deg, transparent, #3B82F6, #7C5CFF, transparent)",
            }}
          />

          <div className="space-y-4 relative z-10">
            <div>
              <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <PieChart className="w-4 h-4 text-brand-blue" />
                <span>Distribusi Berkas Drive</span>
              </h2>
              <p className="text-[11px] text-text-muted mt-0.5">
                Volume penyimpanan menurut jenis format
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { label: "Foto & Gambar", count: fileCounts.PHOTO, color: "#38BDF8" },
                { label: "Video & Rekaman", count: fileCounts.VIDEO, color: "#F43F5E" },
                { label: "Audio & Suara", count: fileCounts.AUDIO, color: "#F59E0B" },
                { label: "Dokumen & Arsip", count: fileCounts.DOCUMENT, color: "#818CF8" },
              ].map((item) => {
                const pct =
                  files.total > 0
                    ? Math.round((item.count / files.total) * 100)
                    : 0;

                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted font-medium">{item.label}</span>
                      <span className="font-bold text-text-primary">
                        {item.count} ({pct}%)
                      </span>
                    </div>
                    <div
                      className="w-full h-1.5 rounded-full overflow-hidden"
                      style={{ background: "rgba(255, 255, 255, 0.05)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
