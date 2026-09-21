"use client";

import * as React from "react";
import { formatIDR, formatDateIndonesian } from "@/lib/utils/formatters";
import {
  Clock,
  Receipt,
  FolderArchive,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export interface ActivityEventItem {
  id: string;
  type: "finance" | "drive" | "system";
  title: string;
  description: string;
  date: string;
  time: string;
  color: string;
  bg: string;
  border: string;
  iconType: "finance" | "drive" | "system";
  sortTimestamp?: number;
}

interface ActivityTimelineClientProps {
  events: ActivityEventItem[];
}

export function ActivityTimelineClient({ events }: ActivityTimelineClientProps) {
  const [filterType, setFilterType] = React.useState<"ALL" | "finance" | "drive" | "system">("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10; // Exactly 10 items per slide / page

  // Reset page on filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterType, searchQuery]);

  // Filtered events
  const filteredEvents = React.useMemo(() => {
    return events.filter((ev) => {
      // Type filter
      if (filterType !== "ALL" && ev.type !== filterType) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ev.title.toLowerCase().includes(q);
        const matchesDesc = ev.description.toLowerCase().includes(q);
        const matchesDate = ev.date.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesDate) {
          return false;
        }
      }
      return true;
    });
  }, [events, filterType, searchQuery]);

  const totalItems = filteredEvents.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedEvents = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEvents.slice(start, start + pageSize);
  }, [filteredEvents, currentPage, pageSize]);

  const counts = React.useMemo(() => {
    return {
      ALL: events.length,
      finance: events.filter((e) => e.type === "finance").length,
      drive: events.filter((e) => e.type === "drive").length,
      system: events.filter((e) => e.type === "system").length,
    };
  }, [events]);

  return (
    <div className="space-y-4">
      {/* ── Filter Bar & Search ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div
          className="flex items-center gap-1.5 p-1 rounded-xl w-fit"
          style={{
            background: "rgba(14, 20, 32, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {[
            { key: "ALL", label: "Semua", count: counts.ALL },
            { key: "finance", label: "Keuangan", count: counts.finance },
            { key: "drive", label: "Sikavi Drive", count: counts.drive },
            { key: "system", label: "Keamanan", count: counts.system },
          ].map((tab) => {
            const isSelected = filterType === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilterType(tab.key as typeof filterType)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isSelected
                    ? "text-accent"
                    : "text-text-muted hover:text-text-secondary"
                }`}
                style={{
                  background: isSelected ? "rgba(25, 197, 158, 0.12)" : "transparent",
                  border: isSelected ? "1px solid rgba(25, 197, 158, 0.25)" : "1px solid transparent",
                }}
              >
                <span>{tab.label}</span>
                <span
                  className="px-1.5 py-0.2 text-[10px] rounded-full font-bold"
                  style={{
                    background: isSelected
                      ? "rgba(25, 197, 158, 0.25)"
                      : "rgba(255, 255, 255, 0.05)",
                    color: isSelected ? "#19C59E" : "#8B95A7",
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari aktivitas..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs text-text-primary placeholder:text-text-muted/60 transition-all focus:outline-hidden"
            style={{
              background: "rgba(14, 20, 32, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          />
        </div>
      </div>

      {/* ── Timeline Card (Max 10 Items) ── */}
      <div
        className="rounded-2xl p-5 sm:p-6 relative overflow-hidden transition-all duration-300"
        style={{
          background: "rgba(14, 20, 32, 0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 4px 20px -8px rgba(0, 0, 0, 0.3)",
        }}
      >
        {paginatedEvents.length > 0 ? (
          <div className="space-y-3">
            {paginatedEvents.map((ev) => {
              const isFinance = ev.iconType === "finance";
              return (
                <div
                  key={ev.id}
                  className="flex items-start gap-3.5 p-3 rounded-xl transition-all duration-150 hover:bg-white/[0.02] group"
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.04)",
                    background: "rgba(255, 255, 255, 0.015)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform"
                    style={{
                      background: ev.bg,
                      border: `1px solid ${ev.border}`,
                      color: ev.color,
                    }}
                  >
                    {isFinance ? (
                      <Receipt className="w-4 h-4" />
                    ) : ev.iconType === "system" ? (
                      <ShieldCheck className="w-4 h-4" />
                    ) : (
                      <FolderArchive className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors">
                        {ev.title}
                      </span>
                      <span className="text-[10px] text-text-muted shrink-0 font-medium">
                        {formatDateIndonesian(ev.date)} {ev.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                      {ev.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-text-muted italic space-y-2">
            <Sparkles className="w-6 h-6 mx-auto text-text-muted/40" />
            <p>Tidak ada riwayat aktivitas yang sesuai filter.</p>
          </div>
        )}

        {/* ── Slide / Pagination Controls (Max 10 per Slide) ── */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 mt-4 text-xs text-text-muted"
          style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}
        >
          <div>
            Menampilkan{" "}
            <span className="font-bold text-text-primary">
              {totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span>{" "}
            -{" "}
            <span className="font-bold text-text-primary">
              {Math.min(currentPage * pageSize, totalItems)}
            </span>{" "}
            dari{" "}
            <span className="font-bold text-text-primary">{totalItems}</span>{" "}
            riwayat (maksimal 10 per slide)
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Sebelumnya</span>
            </button>

            <span
              className="px-3 py-1.5 rounded-xl font-bold text-accent text-xs"
              style={{
                background: "rgba(25, 197, 158, 0.08)",
                border: "1px solid rgba(25, 197, 158, 0.2)",
              }}
            >
              Slide {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <span>Berikutnya</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
