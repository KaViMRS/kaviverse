"use client";

import { formatIDR } from "@/lib/utils/formatters";
import { AlertCircle, CheckCircle2, AlertTriangle, Target, Sparkles } from "lucide-react";

interface BudgetWidgetProps {
  budgetLimit: number;
  budgetUsed: number;
  budgetRemaining: number;
  budgetPercentage: number;
}

export function BudgetWidget({
  budgetLimit,
  budgetUsed,
  budgetRemaining,
  budgetPercentage,
}: BudgetWidgetProps) {
  const isExceeded = budgetPercentage >= 100;
  const isWarning = budgetPercentage >= 80 && !isExceeded;

  let statusBadge = (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-brand-teal bg-brand-teal/15 px-2.5 py-1 rounded-full border border-brand-teal/30 uppercase tracking-wider">
      <CheckCircle2 className="w-3 h-3" />
      <span>Aman</span>
    </span>
  );

  let barGradient = "from-brand-teal to-cyan-400";
  let glowColor = "bg-brand-teal/10";
  if (isWarning) {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-400 bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-500/30 uppercase tracking-wider">
        <AlertTriangle className="w-3 h-3" />
        <span>80%+ Limit</span>
      </span>
    );
    barGradient = "from-amber-400 to-orange-500";
    glowColor = "bg-amber-500/10";
  } else if (isExceeded) {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-rose-400 bg-rose-500/15 px-2.5 py-1 rounded-full border border-rose-500/30 uppercase tracking-wider">
        <AlertCircle className="w-3 h-3" />
        <span>Overlimit</span>
      </span>
    );
    barGradient = "from-rose-500 to-red-600";
    glowColor = "bg-rose-500/10";
  }

  return (
    <div
      className="rounded-2xl p-5 flex flex-col h-full relative overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(14, 20, 32, 0.75)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 20px -8px rgba(0,0,0,0.3)",
      }}
    >
      {/* Top gradient bar */}
      <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #19C59E, #3B82F6, transparent)" }} />
      <div
        className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-all"
        style={{ background: isExceeded ? "rgba(244,63,94,0.12)" : isWarning ? "rgba(245,158,11,0.12)" : "rgba(25,197,158,0.10)" }}
      />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-accent" style={{ background: "rgba(25,197,158,0.12)", border: "1px solid rgba(25,197,158,0.25)" }}>
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary">
              Budget Bulanan
            </h2>
            <p className="text-[11px] text-text-muted">
              Limit: {formatIDR(budgetLimit)}
            </p>
          </div>
        </div>
        {statusBadge}
      </div>

      <div className="space-y-3 mt-1 flex-1 flex flex-col justify-center">
        {/* Metric display */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs text-text-muted block">Terpakai</span>
            <span className="text-lg font-black text-text-primary">
              {formatIDR(budgetUsed)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-text-muted block">Sisa Anggaran</span>
            <span
              className={`text-sm font-black ${
                isExceeded ? "text-rose-400" : "text-brand-teal"
              }`}
            >
              {formatIDR(budgetRemaining)}
            </span>
          </div>
        </div>

        {/* Progress Bar Track with glowing fill */}
        <div className="space-y-1">
          <div className="w-full h-3 rounded-full overflow-hidden p-0.5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div
              className={`h-full bg-gradient-to-r ${barGradient} rounded-full transition-all duration-700`}
              style={{ width: `${Math.min(100, Math.max(0, budgetPercentage))}%`, boxShadow: isExceeded ? "0 0 8px rgba(244,63,94,0.5)" : isWarning ? "0 0 8px rgba(245,158,11,0.5)" : "0 0 8px rgba(25,197,158,0.5)" }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-semibold text-text-muted px-0.5">
            <span>0%</span>
            <span className="font-bold text-text-primary">
              {Math.round(budgetPercentage)}% Terpakai
            </span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Advisory footnote */}
      <div className="mt-4 pt-3 text-[11px] text-text-muted leading-relaxed" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {isExceeded
          ? "🚨 Pengeluaran bulan ini telah melampaui limit anggaran yang ditentukan."
          : isWarning
          ? "⚠️ Pengeluaran mendekati batas limit. Disarankan menunda belanja non-pokok."
          : "✅ Pengeluaran berada dalam batas kendali anggaran yang sehat."}
      </div>
    </div>
  );
}
