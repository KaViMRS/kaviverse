"use client";

import * as React from "react";
import Link from "next/link";
import { logoutAction } from "@/app/(auth)/login/actions";
import {
  LogOut,
  User,
  ShieldCheck,
  Sun,
  Moon,
  Sunset,
  Sunrise,
  Send,
  Zap,
  Bell,
} from "lucide-react";
import Image from "next/image";

export function Topbar() {
  const [greeting, setGreeting] = React.useState("Selamat datang");
  const [timeIcon, setTimeIcon] = React.useState<React.ReactNode>(null);
  const [currentTime, setCurrentTime] = React.useState("");

  React.useEffect(() => {
    function update() {
      const now = new Date();
      const hour = now.getHours();

      if (hour >= 5 && hour < 12) {
        setGreeting("Selamat pagi");
        setTimeIcon(<Sunrise className="w-3.5 h-3.5 text-amber-400" />);
      } else if (hour >= 12 && hour < 15) {
        setGreeting("Selamat siang");
        setTimeIcon(<Sun className="w-3.5 h-3.5 text-amber-400" />);
      } else if (hour >= 15 && hour < 18) {
        setGreeting("Selamat sore");
        setTimeIcon(<Sunset className="w-3.5 h-3.5 text-orange-400" />);
      } else {
        setGreeting("Selamat malam");
        setTimeIcon(<Moon className="w-3.5 h-3.5 text-indigo-400" />);
      }

      setCurrentTime(
        now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
      );
    }

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className="h-14 sticky top-0 z-30 px-4 md:px-5 flex items-center justify-between gap-4"
      style={{
        background: "rgba(8, 12, 18, 0.80)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.03), 0 4px 20px -4px rgba(0,0,0,0.3)",
      }}
    >
      {/* Subtle top accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      {/* ── Left: Greeting / Mobile Brand ── */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile brand */}
        <div className="md:hidden flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-xl overflow-hidden border border-accent/25 shrink-0"
            style={{ boxShadow: "0 0 12px rgba(25,197,158,0.25)" }}
          >
            <Image src="/logo.jpg" alt="KaviVerse" width={28} height={28} className="w-full h-full object-cover" />
          </div>
          <span className="font-black text-xs tracking-tight">
            Kavi<span className="gradient-text-teal">Verse</span>
          </span>
        </div>

        {/* Desktop greeting */}
        <div className="hidden md:flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-surface-muted/50 border border-border/50 shrink-0">
            {timeIcon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[12px] font-bold text-text-primary leading-none">
                {greeting}, <span className="text-accent">Kavi</span>
              </h1>
              {/* Live clock */}
              <span className="text-[10px] font-mono text-text-muted bg-surface-muted/40 px-1.5 py-0.5 rounded-md border border-border/40 tracking-wider">
                {currentTime}
              </span>
            </div>
            <p className="text-[10px] text-text-muted mt-0.5 leading-none">
              Semua sistem operasional &amp; aktif.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Controls ── */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {/* Telegram Sync Pill */}
        <div
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium text-text-secondary"
          style={{
            background: "rgba(25,197,158,0.06)",
            border: "1px solid rgba(25,197,158,0.15)",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="text-accent font-semibold">Telegram Sync</span>
        </div>

        {/* Quick upload shortcut */}
        <Link
          href="/drive"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
          style={{
            background: "rgba(25,197,158,0.10)",
            border: "1px solid rgba(25,197,158,0.22)",
            color: "#19C59E",
          }}
        >
          <Send className="w-3 h-3" />
          <span>Drive</span>
        </Link>

        {/* User pill */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-border/40">
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-accent shrink-0"
              style={{ background: "rgba(25,197,158,0.15)", border: "1px solid rgba(25,197,158,0.3)" }}
            >
              <User className="w-2.5 h-2.5" />
            </div>
            <span className="text-[11px] font-bold text-text-primary hidden sm:inline">Admin</span>
            <ShieldCheck className="w-3 h-3 text-accent hidden sm:inline" />
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="p-1.5 rounded-xl text-text-muted hover:text-danger transition-colors group"
              style={{ background: "transparent" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(244,63,94,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
              title="Keluar"
              aria-label="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
