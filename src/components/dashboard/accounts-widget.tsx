"use client";

import Link from "next/link";
import { AccountBalance } from "@/types/account";
import { formatIDR } from "@/lib/utils/formatters";
import { CreditCard, Landmark, ArrowRight, Smartphone, Banknote, Sparkles } from "lucide-react";

interface AccountsWidgetProps {
  accounts: AccountBalance[];
}

export function AccountsWidget({ accounts }: AccountsWidgetProps) {
  function getAccountBadge(name: string) {
    const lower = name.toLowerCase();
    if (lower.includes("cash") || lower.includes("tunai")) {
      return {
        icon: <Banknote className="w-3.5 h-3.5 text-amber-400" />,
        bg: "rgba(245,158,11,0.10)",
        border: "rgba(245,158,11,0.22)",
        barColor: "linear-gradient(90deg, #F59E0B, #FBBF24)",
        type: "Cash",
      };
    }
    if (
      lower.includes("gopay") || lower.includes("ovo") ||
      lower.includes("dana") || lower.includes("shopeepay") ||
      lower.includes("wallet")
    ) {
      return {
        icon: <Smartphone className="w-3.5 h-3.5 text-brand-teal" />,
        bg: "rgba(25,197,158,0.10)",
        border: "rgba(25,197,158,0.22)",
        barColor: "linear-gradient(90deg, #19C59E, #38BDF8)",
        type: "E-Wallet",
      };
    }
    return {
      icon: <Landmark className="w-3.5 h-3.5 text-brand-blue" />,
      bg: "rgba(59,130,246,0.10)",
      border: "rgba(59,130,246,0.22)",
      barColor: "linear-gradient(90deg, #3B82F6, #7C5CFF)",
      type: "Bank",
    };
  }

  const totalPositiveBalance = accounts.reduce(
    (sum, a) => sum + (a.calculatedBalance > 0 ? a.calculatedBalance : 0),
    0
  );

  return (
    <div
      className="rounded-2xl p-5 flex flex-col h-full relative overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(14, 20, 32, 0.75)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 20px -8px rgba(0,0,0,0.3)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(59,130,246,0.28)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px -12px rgba(0,0,0,0.45), 0 0 25px -8px rgba(59,130,246,0.18)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px -8px rgba(0,0,0,0.3)";
      }}
    >
      {/* Top gradient bar */}
      <div className="absolute top-0 inset-x-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent, #3B82F6, #7C5CFF, transparent)" }}
      />
      <div className="absolute top-0 inset-x-0 h-14 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(59,130,246,0.05), transparent)" }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-brand-blue"
            style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)" }}
          >
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary">Rekening &amp; Dompet</h2>
            <p className="text-[10px] text-text-muted">{accounts.length} sumber dana aktif</p>
          </div>
        </div>

        <Link
          href="/finance/accounts"
          className="flex items-center gap-1 text-[11px] font-semibold text-accent hover:text-white transition-colors px-2 py-1 rounded-lg"
          style={{ background: "rgba(25,197,158,0.08)", border: "1px solid rgba(25,197,158,0.15)" }}
        >
          <span>Detail</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Account list */}
      <div className="space-y-2 flex-1 overflow-y-auto max-h-[300px] pr-1 relative z-10">
        {accounts.map((acc) => {
          const badge = getAccountBadge(acc.name);
          const percentage =
            totalPositiveBalance > 0 && acc.calculatedBalance > 0
              ? Math.min(100, Math.round((acc.calculatedBalance / totalPositiveBalance) * 100))
              : 0;

          return (
            <div
              key={acc.name}
              className="p-3 rounded-xl space-y-2 transition-all duration-200 group/item"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.10)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.025)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: badge.bg, border: `1px solid ${badge.border}` }}
                  >
                    {badge.icon}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-text-primary block truncate group-hover/item:text-accent transition-colors duration-150">
                      {acc.name}
                    </span>
                    <span className="text-[10px] text-text-muted block">
                      {acc.transactionCount} transaksi
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-xs font-black block ${
                      acc.calculatedBalance < 0 ? "text-rose-400" : "text-text-primary"
                    }`}
                  >
                    {formatIDR(acc.calculatedBalance)}
                  </span>
                  {percentage > 0 && (
                    <span className="text-[9px] text-text-muted font-medium">{percentage}% total</span>
                  )}
                </div>
              </div>

              {/* Distribution bar */}
              {percentage > 0 && (
                <div className="w-full h-1 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${percentage}%`, background: badge.barColor }}
                  />
                </div>
              )}
            </div>
          );
        })}

        {accounts.length === 0 && (
          <div className="text-center py-10 text-xs text-text-muted italic">
            <Sparkles className="w-6 h-6 mx-auto mb-2 text-text-muted/40" />
            Belum ada rekening tercatat.
          </div>
        )}
      </div>
    </div>
  );
}
