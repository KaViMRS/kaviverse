"use client";

import * as React from "react";
import { Scale, Wallet, Smartphone, Landmark, Banknote, Sparkles } from "lucide-react";
import { AccountBalance } from "@/types/account";
import { formatIDR } from "@/lib/utils/formatters";
import { ReconcileModal } from "@/components/finance/reconcile-modal";
import { useRouter } from "next/navigation";

interface AccountsPageClientProps {
  accounts: AccountBalance[];
  totalBalance?: number;
}

export function AccountsPageClient({
  accounts,
  totalBalance = 0,
}: AccountsPageClientProps) {
  const router = useRouter();
  const [isReconcileOpen, setIsReconcileOpen] = React.useState(false);

  function getAccountStyle(name: string) {
    const lower = name.toLowerCase();
    if (lower.includes("cash") || lower.includes("tunai")) {
      return {
        icon: <Banknote className="w-5 h-5 text-amber-400" />,
        badgeText: "Cash / Tunai",
        badgeColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
        topGradient: "linear-gradient(90deg, transparent, #F59E0B, transparent)",
        glowColor: "rgba(245, 158, 11, 0.25)",
      };
    }
    if (
      lower.includes("gopay") ||
      lower.includes("ovo") ||
      lower.includes("dana") ||
      lower.includes("shopeepay") ||
      lower.includes("wallet")
    ) {
      return {
        icon: <Smartphone className="w-5 h-5 text-accent" />,
        badgeText: "E-Wallet",
        badgeColor: "text-accent bg-accent/10 border-accent/20",
        topGradient: "linear-gradient(90deg, transparent, #19C59E, transparent)",
        glowColor: "rgba(25, 197, 158, 0.25)",
      };
    }
    return {
      icon: <Landmark className="w-5 h-5 text-brand-blue" />,
      badgeText: "Bank Account",
      badgeColor: "text-brand-blue bg-brand-blue/10 border-brand-blue/20",
      topGradient: "linear-gradient(90deg, transparent, #3B82F6, transparent)",
      glowColor: "rgba(59, 130, 246, 0.25)",
    };
  }

  const positiveTotal = accounts.reduce(
    (sum, a) => sum + (a.calculatedBalance > 0 ? a.calculatedBalance : 0),
    0
  );

  return (
    <div className="space-y-5">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-text-muted">
          Klik rekonsiliasi jika terjadi perbedaan saldo fisik rekening.
        </div>
        <button
          type="button"
          onClick={() => setIsReconcileOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md active:scale-[0.98] cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #19C59E 0%, #108e71 100%)",
            boxShadow: "0 4px 18px -4px rgba(25, 197, 158, 0.45)",
          }}
        >
          <Scale className="w-4 h-4" />
          <span>Rekonsiliasi Saldo</span>
        </button>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => {
          const style = getAccountStyle(acc.name);
          const ratio =
            positiveTotal > 0 && acc.calculatedBalance > 0
              ? Math.min(100, Math.round((acc.calculatedBalance / positiveTotal) * 100))
              : 0;

          return (
            <div
              key={acc.name}
              className="p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 group"
              style={{
                background: "rgba(14, 20, 32, 0.75)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 4px 20px -8px rgba(0, 0, 0, 0.3)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = style.glowColor;
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 36px -10px rgba(0,0,0,0.5), 0 0 25px -8px ${style.glowColor}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(255, 255, 255, 0.08)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 4px 20px -8px rgba(0, 0, 0, 0.3)";
              }}
            >
              {/* Top gradient line */}
              <div
                className="absolute top-0 inset-x-0 h-[2px] opacity-70 group-hover:opacity-100 transition-opacity"
                style={{ background: style.topGradient }}
              />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      {style.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
                        {acc.name}
                      </h3>
                      <span
                        className={`text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${style.badgeColor}`}
                      >
                        {style.badgeText}
                      </span>
                    </div>
                  </div>

                  <span
                    className="text-[10px] font-bold text-text-muted px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.07)",
                    }}
                  >
                    {acc.transactionCount} Transaksi
                  </span>
                </div>

                <div>
                  <span className="text-[10.5px] text-text-muted font-medium block">
                    Saldo Aktif
                  </span>
                  <div
                    className={`text-2xl font-black tracking-tight ${
                      acc.calculatedBalance < 0 ? "text-rose-400" : "text-text-primary"
                    }`}
                  >
                    {formatIDR(acc.calculatedBalance)}
                  </div>
                </div>

                {/* Ratio Progress Bar */}
                {ratio > 0 && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[10px] text-text-muted font-medium">
                      <span>Porsi Likuiditas</span>
                      <span className="font-bold text-accent">{ratio}%</span>
                    </div>
                    <div
                      className="w-full h-1.5 rounded-full overflow-hidden"
                      style={{ background: "rgba(255, 255, 255, 0.06)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${ratio}%`,
                          background: "linear-gradient(90deg, #19C59E, #3B82F6)",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reconcile Modal */}
      <ReconcileModal
        isOpen={isReconcileOpen}
        onClose={() => setIsReconcileOpen(false)}
        onSuccess={() => router.refresh()}
        accounts={accounts}
      />
    </div>
  );
}
