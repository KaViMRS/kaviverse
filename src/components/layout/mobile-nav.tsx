"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/formatters";
import { LayoutDashboard, Wallet, FolderArchive, Clock, Bot, Sparkles } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { title: "Beranda", href: "/dashboard", icon: LayoutDashboard },
    { title: "Keuangan", href: "/finance", icon: Wallet },
    { title: "Drive", href: "/drive", icon: FolderArchive },
    { title: "Aktivitas", href: "/activity", icon: Clock },
    { title: "Status Bot", href: "/bots", icon: Bot },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-2 py-2 flex items-center justify-around shadow-2xl"
      style={{
        background: "rgba(8, 12, 18, 0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all relative",
              isActive ? "text-accent" : "text-text-muted hover:text-text-secondary"
            )}
          >
            {isActive && (
              <span
                className="absolute -top-1 w-5 h-1 rounded-full bg-accent"
                style={{
                  boxShadow: "0 0 10px rgba(25, 197, 158, 0.8)",
                }}
              />
            )}
            <Icon
              className={cn(
                "w-5 h-5 mb-0.5 transition-transform",
                isActive ? "text-accent scale-110" : "text-text-muted"
              )}
            />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
