"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/formatters";
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  PiggyBank,
  FileSpreadsheet,
  FolderArchive,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  BarChart3,
  Clock,
  Bot,
  Settings,
  Shield,
  Activity,
  Sparkles,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
  color?: string;
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "OVERVIEW",
    color: "teal",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "KEUANGAN",
    color: "blue",
    items: [
      { title: "Overview Keuangan", href: "/finance", icon: Wallet },
      { title: "Daftar Transaksi", href: "/finance/transactions", icon: Receipt },
      { title: "Saldo & Rekening", href: "/finance/accounts", icon: PiggyBank },
      { title: "Bills & Tagihan", href: "/finance/bills", icon: FileText },
      { title: "Laporan Keuangan", href: "/finance/reports", icon: FileSpreadsheet },
    ],
  },
  {
    title: "SIKAVI DRIVE",
    color: "purple",
    items: [
      { title: "Arsip Drive", href: "/drive", icon: FolderArchive },
      { title: "Galeri Foto", href: "/drive/photos", icon: ImageIcon },
      { title: "Arsip Video", href: "/drive/videos", icon: Video },
      { title: "Audio & Rekaman", href: "/drive/audio", icon: Music },
      { title: "Dokumen & Berkas", href: "/drive/documents", icon: FileText },
    ],
  },
  {
    title: "SISTEM",
    color: "teal",
    items: [
      { title: "Analitik Data", href: "/analytics", icon: BarChart3 },
      { title: "Log Aktivitas", href: "/activity", icon: Clock },
      { title: "Status Bot", href: "/bots", icon: Bot, badge: "Live" },
    ],
  },
  {
    title: "PENGATURAN",
    items: [
      { title: "Pengaturan", href: "/settings", icon: Settings },
    ],
  },
];

const sectionColorMap: Record<string, { dot: string; text: string }> = {
  teal:   { dot: "bg-brand-teal", text: "text-brand-teal" },
  blue:   { dot: "bg-brand-blue", text: "text-brand-blue" },
  purple: { dot: "bg-brand-purple", text: "text-brand-purple" },
};

export function Sidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>(() => ({
    KEUANGAN: pathname.startsWith("/finance"),
    "SIKAVI DRIVE": pathname.startsWith("/drive"),
  }));

  function toggleSection(title: string) {
    setOpenSections((current) => ({ ...current, [title]: !current[title] }));
  }

  return (
    <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-[240px] h-screen z-30 overflow-hidden"
      style={{
        background: "rgba(8, 12, 18, 0.85)",
        backdropFilter: "blur(24px) saturate(200%)",
        WebkitBackdropFilter: "blur(24px) saturate(200%)",
        borderRight: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      {/* Subtle top-edge gradient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      {/* Left accent glow strip */}
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent" />

      {/* ── Brand Header ── */}
      <div className="px-4 py-5 relative">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          {/* Logo with animated glow ring */}
          <div className="relative shrink-0">
            <div
              className="w-10 h-10 rounded-2xl overflow-hidden border border-accent/25 group-hover:border-accent/50 transition-all duration-300 relative z-10"
              style={{ boxShadow: "0 0 18px -4px rgba(25,197,158,0.35)" }}
            >
              <Image
                src="/logo.jpg"
                alt="KaviVerse"
                width={40}
                height={40}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            {/* Floating glow dot */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent border-2 border-background z-20">
              <span className="absolute inset-0 rounded-full bg-accent animate-ping-slow" />
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-tight text-text-primary leading-none">
                Kavi<span className="gradient-text-teal">Verse</span>
              </span>
              <Sparkles className="w-2.5 h-2.5 text-accent animate-pulse shrink-0" />
            </div>
            <span className="text-[10px] text-text-muted font-semibold tracking-widest uppercase block mt-0.5">
              Control Center
            </span>
          </div>
        </Link>

        {/* Version badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1 text-[9px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
          <Shield className="w-2.5 h-2.5" />
          v1.0
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {NAV_SECTIONS.map((section) => {
          const colors = section.color ? sectionColorMap[section.color] : null;
          return (
            <div key={section.title}>
              {/* Section label */}
              {section.title === "KEUANGAN" || section.title === "SIKAVI DRIVE" ? (
                <button
                  type="button"
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between w-full px-2 mb-1.5 text-left"
                  aria-expanded={openSections[section.title] ?? false}
                >
                  <span className="flex items-center gap-2">
                    {colors && <span className={`w-1 h-1 rounded-full ${colors.dot} shrink-0`} />}
                    <span className="text-[9.5px] font-bold text-text-muted/70 tracking-[0.12em] uppercase">
                      {section.title}
                    </span>
                  </span>
                  {openSections[section.title] ? (
                    <ChevronDown className="w-3 h-3 text-text-muted" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-text-muted" />
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-2 px-2 mb-1.5">
                {colors && <span className={`w-1 h-1 rounded-full ${colors.dot} shrink-0`} />}
                <span className="text-[9.5px] font-bold text-text-muted/70 tracking-[0.12em] uppercase">
                  {section.title}
                </span>
                </div>
              )}

              <div className={cn(
                "space-y-0.5 overflow-hidden transition-[max-height,opacity] duration-200",
                (section.title === "KEUANGAN" || section.title === "SIKAVI DRIVE") &&
                  !openSections[section.title]
                  ? "max-h-0 opacity-0"
                  : "max-h-96 opacity-100"
              )}>
                {section.items.map((item) => {
                  const isExact = pathname === item.href;
                  const isChild =
                    item.href !== "/dashboard" &&
                    item.href !== "/finance" &&
                    item.href !== "/drive" &&
                    pathname.startsWith(item.href + "/");
                  const isDriveTag = item.href === "/drive" && pathname.startsWith("/drive/tags");
                  const isActive = isExact || isChild || isDriveTag;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 text-[12px] font-medium rounded-xl transition-all duration-200 relative group overflow-hidden",
                        isActive
                          ? "text-accent font-semibold"
                          : "text-text-secondary hover:text-text-primary"
                      )}
                      style={
                        isActive
                          ? {
                              background: "linear-gradient(90deg, rgba(25,197,158,0.14) 0%, rgba(25,197,158,0.04) 100%)",
                              boxShadow: "inset 0 0 0 1px rgba(25,197,158,0.18)",
                            }
                          : undefined
                      }
                    >
                      {/* Hover background */}
                      {!isActive && (
                        <span className="absolute inset-0 rounded-xl bg-white/[0.03] opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}

                      {/* Active left bar */}
                      {isActive && (
                        <span
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[55%] rounded-r-full"
                          style={{
                            background: "linear-gradient(to bottom, #19C59E, #3B82F6)",
                            boxShadow: "0 0 8px rgba(25,197,158,0.7)",
                          }}
                        />
                      )}

                      <div className="flex items-center gap-2.5 min-w-0 relative z-10">
                        <Icon
                          className={cn(
                            "w-3.5 h-3.5 shrink-0 transition-all duration-200",
                            isActive
                              ? "text-accent drop-shadow-[0_0_6px_rgba(25,197,158,0.5)]"
                              : "text-text-muted group-hover:text-text-secondary"
                          )}
                        />
                        <span className="truncate">{item.title}</span>
                      </div>

                      <div className="flex items-center gap-1 relative z-10 shrink-0">
                        {item.badge && (
                          <span className="text-[8.5px] font-bold px-1.5 py-px rounded-full bg-accent/20 text-accent border border-accent/30 uppercase tracking-wide">
                            {item.badge}
                          </span>
                        )}
                        {isActive && (
                          <ChevronRight className="w-3 h-3 text-accent/60" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* ── Footer Connection Card ── */}
      <div className="px-3 pb-4 mt-auto">
        <div
          className="rounded-xl p-3.5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(25,197,158,0.08) 0%, rgba(59,130,246,0.05) 100%)",
            border: "1px solid rgba(25,197,158,0.15)",
          }}
        >
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-accent" />
              Sistem Cloud
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-accent">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              Online
            </div>
          </div>
          <p className="text-[10px] text-text-muted leading-relaxed">
            Telegram Bot &amp; Google Sheets<br />sinkron secara real-time
          </p>
        </div>
      </div>
    </aside>
  );
}
