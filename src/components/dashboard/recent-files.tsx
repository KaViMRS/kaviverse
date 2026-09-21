"use client";

import Link from "next/link";
import { FileItem } from "@/types/file-item";
import { formatDateIndonesian } from "@/lib/utils/formatters";
import {
  FolderArchive,
  ArrowRight,
  ExternalLink,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Send,
} from "lucide-react";

interface RecentFilesProps {
  files: FileItem[];
}

export function RecentFiles({ files }: RecentFilesProps) {
  function renderMediaIcon(mediaType: string) {
    switch (mediaType) {
      case "PHOTO":
        return <ImageIcon className="w-4 h-4 text-sky-400" />;
      case "VIDEO":
        return <Video className="w-4 h-4 text-rose-400" />;
      case "AUDIO":
        return <Music className="w-4 h-4 text-amber-400" />;
      case "DOCUMENT":
      default:
        return <FileText className="w-4 h-4 text-brand-blue" />;
    }
  }

  function getMediaBadgeStyle(mediaType: string) {
    switch (mediaType) {
      case "PHOTO":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "VIDEO":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "AUDIO":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "DOCUMENT":
      default:
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    }
  }

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(14, 20, 32, 0.75)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 20px -8px rgba(0,0,0,0.3)",
      }}
    >
      {/* Top gradient bar */}
      <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #3B82F6, #7C5CFF, transparent)" }} />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-brand-blue" style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)" }}>
            <FolderArchive className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary">
              Arsip File Sikavi Drive
            </h2>
            <p className="text-[11px] text-text-muted">
              Media tersimpan dari bot Telegram Supergroup
            </p>
          </div>
        </div>

        <Link
          href="/drive"
          className="flex items-center gap-1 text-[11px] font-semibold text-accent hover:text-white transition-colors px-2 py-1 rounded-lg"
          style={{ background: "rgba(25,197,158,0.08)", border: "1px solid rgba(25,197,158,0.15)" }}
        >
          <span>Buka Drive</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2">
        {files.slice(0, 6).map((file) => (
          <div
            key={file.id}
          className="flex items-center justify-between p-3 rounded-xl gap-3 group/file transition-all duration-150"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.background = "rgba(255,255,255,0.04)"; el.style.borderColor = "rgba(255,255,255,0.10)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.background = "rgba(255,255,255,0.025)"; el.style.borderColor = "rgba(255,255,255,0.06)"; }}
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover/file:scale-105 transition-transform" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {renderMediaIcon(file.mediaType)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-text-primary truncate block max-w-[180px] sm:max-w-md group-hover/file:text-accent transition-colors">
                    {file.caption || "Tanpa Keterangan"}
                  </span>
                  <span
                    className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-xs border ${getMediaBadgeStyle(
                      file.mediaType
                    )}`}
                  >
                    {file.mediaType}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-text-muted flex-wrap">
                  <span>{formatDateIndonesian(file.uploadTime)}</span>
                  <span>•</span>
                  <span>Oleh: {file.sender}</span>
                  {file.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-accent font-semibold">
                        {file.tags.slice(0, 2).join(" ")}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Direct Telegram Action Link */}
            {file.directTelegramUrl ? (
              <a
                href={file.directTelegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-blue bg-brand-blue/10 hover:bg-brand-blue/20 px-2.5 py-1 rounded-lg border border-brand-blue/20 transition-colors"
                title="Buka pesan di Telegram"
              >
                <Send className="w-3 h-3" />
                <span className="hidden sm:inline">Buka</span>
              </a>
            ) : (
              <span className="text-[10px] text-text-muted italic shrink-0">
                Topik {file.targetTopicName}
              </span>
            )}
          </div>
        ))}

        {files.length === 0 && (
          <div className="text-center py-8 text-xs text-text-muted italic">
            Belum ada file diarsipkan.
          </div>
        )}
      </div>
    </div>
  );
}
