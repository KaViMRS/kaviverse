import { getFinanceRepository } from "@/lib/repositories/factory";
import { BillsManager } from "@/components/finance/bills-manager";
import { formatIDR } from "@/lib/utils/formatters";
import { CalendarClock, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BillsPage() {
  const financeRepo = getFinanceRepository();
  const bills = await financeRepo.getBills();

  const totalMonthly = bills.reduce((sum, b) => sum + b.amount, 0);

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
            background: "linear-gradient(90deg, transparent, #F59E0B, #19C59E, transparent)",
          }}
        />

        <div className="flex items-center gap-3.5 relative z-10">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-amber-400 shrink-0"
            style={{
              background: "rgba(245, 158, 11, 0.12)",
              border: "1px solid rgba(245, 158, 11, 0.28)",
              boxShadow: "0 0 20px -4px rgba(245, 158, 11, 0.3)",
            }}
          >
            <CalendarClock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-text-primary tracking-tight">
                Tagihan &amp; Pengeluaran Rutin
              </h1>
              <span
                className="text-[10px] font-extrabold text-amber-400 px-2.5 py-0.5 rounded-full"
                style={{
                  background: "rgba(245, 158, 11, 0.12)",
                  border: "1px solid rgba(245, 158, 11, 0.25)",
                }}
              >
                {bills.length} Tagihan
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Jadwal pembayaran berulang yang tersinkronisasi langsung dengan tab Tagihan di Google Sheets.
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
            Total Estimasi / Bulan
          </span>
          <span className="text-sm font-black text-amber-400">
            {formatIDR(totalMonthly)}
          </span>
        </div>
      </div>

      <BillsManager initialBills={bills} />
    </div>
  );
}
