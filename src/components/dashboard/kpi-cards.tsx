"use client";

import * as React from "react";
import { formatIDR } from "@/lib/utils/formatters";
import {
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  Scale,
  TrendingUp,
  Sparkles,
  TrendingDown,
} from "lucide-react";

interface KpiCardsProps {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  netCashFlow: number;
}

/* Animated number that counts up from 0 */
function AnimatedNumber({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [displayed, setDisplayed] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (value === 0) { setDisplayed(0); return; }
    const duration = 900;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = step >= steps ? value : Math.round(current + increment);
      setDisplayed(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  if (!mounted) return <span className="opacity-0">0</span>;
  return <span>{prefix}{formatIDR(displayed)}</span>;
}

interface CardConfig {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  prefix?: string;
  sub: string;
  subIcon: React.ComponentType<{ className?: string }>;
  subColor: string;
  topGradient: string;
  glowColor: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  valueColor: string;
  hoverBorder: string;
}

export function KpiCards({
  totalBalance,
  monthlyIncome,
  monthlyExpense,
  netCashFlow,
}: KpiCardsProps) {
  const isPositiveCashflow = netCashFlow >= 0;

  const cards: CardConfig[] = [
    {
      title: "Total Saldo Tersedia",
      icon: Wallet,
      value: totalBalance,
      prefix: "",
      sub: "Akumulasi seluruh rekening",
      subIcon: Sparkles,
      subColor: "text-accent",
      topGradient: "linear-gradient(90deg, #19C59E, #38BDF8, #3B82F6)",
      glowColor: "rgba(25, 197, 158, 0.25)",
      iconBg: "rgba(25,197,158,0.12)",
      iconBorder: "rgba(25,197,158,0.25)",
      iconColor: "text-accent",
      valueColor: "text-text-primary",
      hoverBorder: "rgba(25,197,158,0.35)",
    },
    {
      title: "Pemasukan Bulan Ini",
      icon: ArrowUpRight,
      value: monthlyIncome,
      prefix: "+",
      sub: "Total dana masuk tercatat",
      subIcon: TrendingUp,
      subColor: "text-emerald-400",
      topGradient: "linear-gradient(90deg, #10B981, #34D399, #6EE7B7)",
      glowColor: "rgba(16, 185, 129, 0.25)",
      iconBg: "rgba(16,185,129,0.12)",
      iconBorder: "rgba(16,185,129,0.25)",
      iconColor: "text-emerald-400",
      valueColor: "text-emerald-400",
      hoverBorder: "rgba(16,185,129,0.35)",
    },
    {
      title: "Pengeluaran Bulan Ini",
      icon: ArrowDownRight,
      value: monthlyExpense,
      prefix: "-",
      sub: "Total biaya keluar tercatat",
      subIcon: TrendingDown,
      subColor: "text-rose-400",
      topGradient: "linear-gradient(90deg, #F43F5E, #FB7185, #F97316)",
      glowColor: "rgba(244, 63, 94, 0.22)",
      iconBg: "rgba(244,63,94,0.12)",
      iconBorder: "rgba(244,63,94,0.25)",
      iconColor: "text-rose-400",
      valueColor: "text-rose-400",
      hoverBorder: "rgba(244,63,94,0.35)",
    },
    {
      title: "Net Cash Flow",
      icon: Scale,
      value: Math.abs(netCashFlow),
      prefix: isPositiveCashflow ? "+" : "-",
      sub: isPositiveCashflow ? "Surplus kas bulan ini" : "Defisit pengeluaran",
      subIcon: isPositiveCashflow ? Sparkles : TrendingDown,
      subColor: isPositiveCashflow ? "text-brand-purple" : "text-rose-400",
      topGradient: isPositiveCashflow
        ? "linear-gradient(90deg, #19C59E, #3B82F6, #7C5CFF)"
        : "linear-gradient(90deg, #F43F5E, #FB923C)",
      glowColor: isPositiveCashflow ? "rgba(124, 92, 255, 0.22)" : "rgba(244, 63, 94, 0.22)",
      iconBg: isPositiveCashflow ? "rgba(124,92,255,0.12)" : "rgba(244,63,94,0.12)",
      iconBorder: isPositiveCashflow ? "rgba(124,92,255,0.25)" : "rgba(244,63,94,0.25)",
      iconColor: isPositiveCashflow ? "text-brand-purple" : "text-rose-400",
      valueColor: isPositiveCashflow ? "text-brand-teal" : "text-rose-400",
      hoverBorder: isPositiveCashflow ? "rgba(124,92,255,0.35)" : "rgba(244,63,94,0.35)",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const SubIcon = card.subIcon;

        return (
          <KpiCard key={card.title} card={card} delay={i * 80}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-text-muted leading-tight pr-2">
                {card.title}
              </span>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                style={{
                  background: card.iconBg,
                  border: `1px solid ${card.iconBorder}`,
                }}
              >
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className={`text-2xl font-black tracking-tight ${card.valueColor}`}>
                <AnimatedNumber value={card.value} prefix={card.prefix} />
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <SubIcon className={`w-3 h-3 ${card.subColor} shrink-0`} />
                <span className="text-text-muted font-medium">{card.sub}</span>
              </div>
            </div>
          </KpiCard>
        );
      })}
    </div>
  );
}

/* Individual card with hover state management */
function KpiCard({
  card,
  delay,
  children,
}: {
  card: CardConfig;
  delay: number;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      className="relative group overflow-hidden rounded-2xl p-5 cursor-default transition-all duration-300 animate-fade-in-up"
      style={{
        background: "rgba(14, 20, 32, 0.75)",
        border: `1px solid ${hovered ? card.hoverBorder : "rgba(255,255,255,0.07)"}`,
        boxShadow: hovered
          ? `0 20px 40px -12px rgba(0,0,0,0.5), 0 0 30px -8px ${card.glowColor}`
          : "0 4px 20px -8px rgba(0,0,0,0.3)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        animationDelay: `${delay}ms`,
        animationFillMode: "both",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top gradient bar */}
      <div
        className="absolute top-0 inset-x-0 h-[3px] opacity-80 transition-opacity duration-300"
        style={{
          background: card.topGradient,
          opacity: hovered ? 1 : 0.7,
        }}
      />
      {/* Top glow spread */}
      <div
        className="absolute top-0 inset-x-0 h-16 pointer-events-none transition-opacity duration-300"
        style={{
          background: `linear-gradient(to bottom, ${card.glowColor.replace(")", ", 0.08)")}, transparent)`,
          opacity: hovered ? 1 : 0.5,
        }}
      />
      {/* Bottom ambient glow */}
      <div
        className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-2xl pointer-events-none transition-all duration-300"
        style={{
          background: card.glowColor,
          opacity: hovered ? 1 : 0.5,
        }}
      />

      {/* Card content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
