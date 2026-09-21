"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Scale,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Activity,
} from "lucide-react";
import { TransactionFormModal } from "@/components/finance/transaction-form-modal";
import { UploadModal } from "@/components/drive/upload-modal";

interface DashboardHeroProps {
  accounts: string[];
}

export function DashboardHero({ accounts }: DashboardHeroProps) {
  const router = useRouter();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = React.useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = React.useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [date, setDate] = React.useState("");

  const handleSyncSuccess = () => {
    router.refresh();
  };

  React.useEffect(() => {
    setDate(
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  const quickActions = [
    {
      label: "Catat Pengeluaran",
      icon: ArrowDownRight,
      onClick: () => setIsExpenseModalOpen(true),
      colorClass: "text-rose-400",
      style: {
        background: "rgba(244, 63, 94, 0.08)",
        border: "1px solid rgba(244, 63, 94, 0.22)",
      },
      hoverStyle: {
        background: "rgba(244, 63, 94, 0.15)",
        border: "1px solid rgba(244, 63, 94, 0.35)",
      },
    },
    {
      label: "Catat Pemasukan",
      icon: ArrowUpRight,
      onClick: () => setIsIncomeModalOpen(true),
      colorClass: "text-emerald-400",
      style: {
        background: "rgba(16, 185, 129, 0.08)",
        border: "1px solid rgba(16, 185, 129, 0.22)",
      },
      hoverStyle: {
        background: "rgba(16, 185, 129, 0.15)",
        border: "1px solid rgba(16, 185, 129, 0.35)",
      },
    },
  ];

  return (
    <>
      {/* ── Hero Banner ── */}
      <div
        className="relative overflow-hidden rounded-2xl p-5 sm:p-6 animate-fade-in"
        style={{
          background:
            "linear-gradient(135deg, rgba(14,20,32,0.92) 0%, rgba(10,15,25,0.88) 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow:
            "0 20px 50px -15px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Ambient orbs inside banner */}
        <div
          className="absolute -top-12 -right-12 w-56 h-56 rounded-full blur-[80px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(25,197,158,0.2) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-16 left-1/3 w-48 h-48 rounded-full blur-[70px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,92,255,0.18) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent, rgba(25,197,158,0.5), transparent)" }}
        />

        {/* ── Content Row ── */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          {/* Brand / Identity */}
          <div className="flex items-center gap-4">
            {/* Logo with pulse ring */}
            <div className="relative shrink-0 animate-float-y">
              <div
                className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl overflow-hidden"
                style={{
                  border: "1px solid rgba(25,197,158,0.3)",
                  boxShadow: "0 0 30px -8px rgba(25,197,158,0.5), 0 8px 20px -8px rgba(0,0,0,0.5)",
                }}
              >
                <Image
                  src="/logo.jpg"
                  alt="KaviVerse"
                  width={72}
                  height={72}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              {/* Floating status dot */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: "#080C12", border: "2px solid rgba(25,197,158,0.4)" }}
              >
                <span className="w-2 h-2 rounded-full bg-accent">
                  <span className="absolute w-2 h-2 rounded-full bg-accent animate-ping-slow" />
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-accent"
                style={{
                  background: "rgba(25,197,158,0.10)",
                  border: "1px solid rgba(25,197,158,0.25)",
                }}
              >
                <Sparkles className="w-2.5 h-2.5" />
                Private Control Center
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-text-primary leading-none">
                Kavi<span className="gradient-text-animated">Verse</span>
              </h1>
              <p className="text-[11px] text-text-muted font-medium">
                {date || "Memuat tanggal..."}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <QuickActionButton
                  key={action.label}
                  label={action.label}
                  icon={<Icon className={`w-3.5 h-3.5 ${action.colorClass}`} />}
                  onClick={action.onClick}
                  baseStyle={action.style}
                  hoverStyle={action.hoverStyle}
                  colorClass={action.colorClass}
                />
              );
            })}

            {/* Upload */}
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white active:scale-95 transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #19C59E 0%, #3B82F6 100%)",
                boxShadow: "0 4px 16px -4px rgba(25,197,158,0.45), 0 0 0 1px rgba(25,197,158,0.25)",
              }}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Upload Berkas
            </button>

            {/* Reconcile */}
            <Link
              href="/finance/accounts"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary active:scale-95 transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Scale className="w-3.5 h-3.5 text-brand-purple" />
              <span className="hidden sm:inline">Rekonsiliasi</span>
            </Link>
          </div>
        </div>

        {/* ── Status Strip ── */}
        <div
          className="relative z-10 mt-4 pt-4 flex items-center gap-4 sm:gap-6 flex-wrap"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {[
            { dot: "bg-accent", label: "Bot Aktif", value: "Terhubung", color: "text-accent" },
            { dot: "bg-brand-blue", label: "Sheets Sync", value: "Real-time", color: "text-brand-blue" },
            { dot: "bg-brand-purple", label: "Drive", value: "Online", color: "text-brand-purple" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot} shrink-0`}
                style={{ boxShadow: `0 0 6px currentColor` }}
              />
              <span className="text-[10px] text-text-muted font-medium">{s.label}:</span>
              <span className={`text-[10px] font-bold ${s.color}`}>{s.value}</span>
            </div>
          ))}

          <div className="ml-auto">
            <div
              className="flex items-center gap-1.5 text-[10px] font-semibold text-accent"
              style={{
                background: "rgba(25,197,158,0.08)",
                border: "1px solid rgba(25,197,158,0.18)",
                padding: "2px 8px",
                borderRadius: "9999px",
              }}
            >
              <Activity className="w-2.5 h-2.5" />
              Semua sistem normal
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TransactionFormModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSuccess={handleSyncSuccess}
        initialType="Pengeluaran"
        availableAccounts={accounts}
      />
      <TransactionFormModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        onSuccess={handleSyncSuccess}
        initialType="Pemasukan"
        availableAccounts={accounts}
      />
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleSyncSuccess}
      />
    </>
  );
}

/* ── Helper: Quick Action Button with hover effect ── */
function QuickActionButton({
  label,
  icon,
  onClick,
  baseStyle,
  hoverStyle,
  colorClass,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  baseStyle: React.CSSProperties;
  hoverStyle: React.CSSProperties;
  colorClass: string;
}) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold active:scale-95 transition-all duration-200 ${colorClass}`}
      style={hovered ? hoverStyle : baseStyle}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
