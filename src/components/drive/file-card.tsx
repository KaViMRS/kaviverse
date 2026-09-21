"use client";

import * as React from "react";
import { FileItem, MediaType } from "@/types/file-item";
import { formatDateIndonesian } from "@/lib/utils/formatters";
import {
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  ExternalLink,
  Tag,
  User,
  Clock,
  Send,
  Sparkles,
} from "lucide-react";

interface FileCardProps {
  file: FileItem;
  onSelect: (file: FileItem) => void;
  onTagClick?: (tag: string) => void;
}

export function FileCard({ file, onSelect, onTagClick }: FileCardProps) {
  function getMediaConfig(mediaType: MediaType) {
    switch (mediaType) {
      case "PHOTO":
        return {
          icon: <ImageIcon className="w-4 h-4 text-sky-400" />,
          badgeColor: "text-sky-400 bg-sky-400/10 border-sky-400/25",
          iconBg: "rgba(56, 189, 248, 0.12)",
          iconBorder: "rgba(56, 189, 248, 0.28)",
          topGradient: "linear-gradient(90deg, transparent, #38BDF8, transparent)",
          glowColor: "rgba(56, 189, 248, 0.25)",
        };
      case "VIDEO":
        return {
          icon: <Video className="w-4 h-4 text-rose-400" />,
          badgeColor: "text-rose-400 bg-rose-400/10 border-rose-400/25",
          iconBg: "rgba(244, 63, 94, 0.12)",
          iconBorder: "rgba(244, 63, 94, 0.28)",
          topGradient: "linear-gradient(90deg, transparent, #F43F5E, transparent)",
          glowColor: "rgba(244, 63, 94, 0.25)",
        };
      case "AUDIO":
        return {
          icon: <Music className="w-4 h-4 text-amber-400" />,
          badgeColor: "text-amber-400 bg-amber-400/10 border-amber-400/25",
          iconBg: "rgba(245, 158, 11, 0.12)",
          iconBorder: "rgba(245, 158, 11, 0.28)",
          topGradient: "linear-gradient(90deg, transparent, #F59E0B, transparent)",
          glowColor: "rgba(245, 158, 11, 0.25)",
        };
      case "DOCUMENT":
      default:
        return {
          icon: <FileText className="w-4 h-4 text-indigo-400" />,
          badgeColor: "text-indigo-400 bg-indigo-400/10 border-indigo-400/25",
          iconBg: "rgba(129, 140, 248, 0.12)",
          iconBorder: "rgba(129, 140, 248, 0.28)",
          topGradient: "linear-gradient(90deg, transparent, #818CF8, transparent)",
          glowColor: "rgba(129, 140, 248, 0.25)",
        };
    }
  }

  const config = getMediaConfig(file.mediaType);

  return (
    <div
      onClick={() => onSelect(file)}
      className="group relative rounded-xl p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
      style={{
        background: "rgba(14, 20, 32, 0.75)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.07)",
        boxShadow: "0 4px 20px -8px rgba(0, 0, 0, 0.35)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = config.glowColor;
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 36px -10px rgba(0,0,0,0.5), 0 0 25px -8px ${config.glowColor}`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255, 255, 255, 0.07)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px -8px rgba(0, 0, 0, 0.35)";
      }}
    >
      {/* Top glowing accent line */}
      <div
        className="absolute top-0 inset-x-0 h-[2px] transition-opacity duration-300 opacity-60 group-hover:opacity-100"
        style={{ background: config.topGradient }}
      />

      {/* Top subtle radial glow */}
      <div
        className="absolute top-0 inset-x-0 h-16 pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${config.glowColor} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 space-y-3">
        {/* Header: Media Icon, Category Badge, Topic Pill */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
              style={{
                background: config.iconBg,
                border: `1px solid ${config.iconBorder}`,
              }}
            >
              {config.icon}
            </div>
            <div>
              <span
                className={`text-[9.5px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border ${config.badgeColor}`}
              >
                {file.mediaType}
              </span>
            </div>
          </div>

          <div
            className="flex items-center gap-1.5 text-[10px] font-medium text-text-muted px-2 py-0.5 rounded-md transition-colors"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <Send className="w-2.5 h-2.5 text-brand-teal" />
            <span className="truncate max-w-[95px]">{file.targetTopicName}</span>
          </div>
        </div>

        {/* Caption with glowing text on hover */}
        <div>
          <h3 className="text-xs font-semibold text-text-primary line-clamp-2 leading-relaxed group-hover:text-accent transition-colors duration-200">
            {file.caption || "Tanpa Keterangan"}
          </h3>
        </div>

        {/* Tags with clean glass badges */}
        {file.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {file.tags.slice(0, 3).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onTagClick) onTagClick(tag);
                }}
                className="inline-flex items-center gap-1 text-[9.5px] font-medium text-accent hover:text-white px-2 py-0.5 rounded-lg transition-all duration-150"
                style={{
                  background: "rgba(25, 197, 158, 0.08)",
                  border: "1px solid rgba(25, 197, 158, 0.18)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(25, 197, 158, 0.22)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(25, 197, 158, 0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(25, 197, 158, 0.08)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(25, 197, 158, 0.18)";
                }}
              >
                <Tag className="w-2.5 h-2.5" />
                <span>{tag}</span>
              </button>
            ))}
            {file.tags.length > 3 && (
              <span className="text-[9.5px] text-text-muted self-center font-medium">
                +{file.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info: Clock, Sender, Telegram Link */}
      <div
        className="relative z-10 pt-3 mt-3 flex items-center justify-between text-[10.5px] text-text-muted"
        style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-text-muted/70" />
            {formatDateIndonesian(file.uploadTime)}
          </span>
          <span className="flex items-center gap-1 truncate max-w-[90px]">
            <User className="w-3 h-3 text-text-muted/70" />
            {file.sender}
          </span>
        </div>

        {file.directTelegramUrl && (
          <a
            href={file.directTelegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-blue hover:text-white px-2 py-0.5 rounded-lg transition-all"
            style={{
              background: "rgba(59, 130, 246, 0.08)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(59, 130, 246, 0.25)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(59, 130, 246, 0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(59, 130, 246, 0.08)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(59, 130, 246, 0.2)";
            }}
            title="Buka pesan di Telegram"
          >
            <span>Buka</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
