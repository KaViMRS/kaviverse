"use client";

import * as React from "react";
import {
  X,
  ExternalLink,
  Tag,
  User,
  Clock,
  Send,
  FileSpreadsheet,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Copy,
  Check,
  Info,
  Sparkles,
} from "lucide-react";
import { FileItem, MediaType } from "@/types/file-item";
import { formatDateIndonesian } from "@/lib/utils/formatters";

interface FileDetailDrawerProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
  onTagClick?: (tag: string) => void;
}

export function FileDetailDrawer({
  file,
  isOpen,
  onClose,
  onTagClick,
}: FileDetailDrawerProps) {
  const [copiedCaption, setCopiedCaption] = React.useState(false);

  // Close on ESC
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !file) return null;

  function renderMediaIcon(mediaType: MediaType) {
    switch (mediaType) {
      case "PHOTO":
        return <ImageIcon className="w-5 h-5 text-sky-400" />;
      case "VIDEO":
        return <Video className="w-5 h-5 text-rose-400" />;
      case "AUDIO":
        return <Music className="w-5 h-5 text-amber-400" />;
      case "DOCUMENT":
      default:
        return <FileText className="w-5 h-5 text-indigo-400" />;
    }
  }

  function handleCopyCaption() {
    if (!file?.caption) return;
    navigator.clipboard.writeText(file.caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 transition-opacity animate-in fade-in duration-200"
        style={{
          background: "rgba(4, 7, 12, 0.75)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-md flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl relative overflow-hidden"
          style={{
            background: "rgba(13, 18, 28, 0.97)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Top glowing accent line */}
          <div
            className="absolute top-0 inset-x-0 h-[2px]"
            style={{
              background: "linear-gradient(90deg, #19C59E, #3B82F6, #7C5CFF)",
            }}
          />

          {/* Header */}
          <div
            className="p-5 flex items-center justify-between"
            style={{
              borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
              background: "rgba(255, 255, 255, 0.02)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                {renderMediaIcon(file.mediaType)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    {file.mediaType}
                  </span>
                  <span
                    className="text-[10px] font-bold text-accent px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(25, 197, 158, 0.1)",
                      border: "1px solid rgba(25, 197, 158, 0.2)",
                    }}
                  >
                    ID #{file.telegramMessageId}
                  </span>
                </div>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Detail Berkas Sikavi Drive
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-text-muted hover:text-white rounded-xl transition-colors"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Telegram Direct Action Banner */}
            {file.directTelegramUrl ? (
              <a
                href={file.directTelegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-4 rounded-2xl transition-all group"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(124, 92, 255, 0.08) 100%)",
                  border: "1px solid rgba(59, 130, 246, 0.28)",
                  boxShadow: "0 4px 15px -4px rgba(59, 130, 246, 0.2)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "rgba(59, 130, 246, 0.5)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 6px 20px -2px rgba(59, 130, 246, 0.35)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "rgba(59, 130, 246, 0.28)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 4px 15px -4px rgba(59, 130, 246, 0.2)";
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white"
                    style={{
                      background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                      boxShadow: "0 2px 10px rgba(59, 130, 246, 0.4)",
                    }}
                  >
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-sky-300 flex items-center gap-1.5 transition-colors">
                      <span>Buka Pesan Asli di Telegram</span>
                      <ExternalLink className="w-3.5 h-3.5 inline" />
                    </div>
                    <div className="text-[11px] text-text-muted mt-0.5">
                      Topik {file.targetTopicName} • ID #{file.telegramMessageId}
                    </div>
                  </div>
                </div>
              </a>
            ) : (
              <div
                className="p-3.5 rounded-xl text-xs text-text-muted flex items-center gap-2"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <Info className="w-4 h-4 shrink-0 text-brand-blue" />
                <span>Tautan Telegram langsung belum tersedia untuk berkas ini.</span>
              </div>
            )}

            {/* Caption / Keterangan */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                  Keterangan / Caption
                </label>
                <button
                  type="button"
                  onClick={handleCopyCaption}
                  className="inline-flex items-center gap-1 text-[11px] text-text-muted hover:text-accent transition-colors"
                >
                  {copiedCaption ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
              <div
                className="p-4 rounded-xl text-xs text-text-primary whitespace-pre-wrap leading-relaxed"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                }}
              >
                {file.caption || (
                  <span className="text-text-muted italic">
                    Tanpa keterangan atau caption
                  </span>
                )}
              </div>
            </div>

            {/* Tags / Label */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                Tag &amp; Label
              </label>
              {file.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {file.tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (onTagClick) {
                          onTagClick(tag);
                          onClose();
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-white px-3 py-1 rounded-lg transition-all"
                      style={{
                        background: "rgba(25, 197, 158, 0.08)",
                        border: "1px solid rgba(25, 197, 158, 0.2)",
                      }}
                    >
                      <Tag className="w-3 h-3" />
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text-muted italic">Tidak ada tag tercatat</p>
              )}
            </div>

            {/* Metadata Detail List */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                Informasi Metadata
              </label>
              <div
                className="rounded-2xl divide-y divide-white/[0.05] overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.025)",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                }}
              >
                <div className="flex items-center justify-between p-3.5 text-xs">
                  <span className="text-text-muted flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-text-muted/80" />
                    Waktu Upload
                  </span>
                  <span className="font-semibold text-text-primary text-right">
                    {formatDateIndonesian(file.uploadTime)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 text-xs">
                  <span className="text-text-muted flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-text-muted/80" />
                    Pengirim
                  </span>
                  <span className="font-semibold text-text-primary">
                    {file.sender}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 text-xs">
                  <span className="text-text-muted flex items-center gap-2">
                    <Send className="w-3.5 h-3.5 text-brand-teal" />
                    Topik Telegram
                  </span>
                  <span className="font-semibold text-text-primary">
                    {file.targetTopicName} (ID: #{file.targetTopicId})
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 text-xs">
                  <span className="text-text-muted flex items-center gap-2">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-accent" />
                    Google Sheets
                  </span>
                  <span className="font-mono text-accent font-semibold">
                    PetugasData!A{file.rawRowIndex || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Info Notice */}
            <div
              className="p-4 rounded-xl text-[11px] text-text-muted leading-relaxed space-y-1.5"
              style={{
                background: "rgba(255, 255, 255, 0.025)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div className="font-bold text-text-secondary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Penyimpanan Awan Telegram
              </div>
              <p>
                File fisik terenkripsi dan disimpan secara permanen di cloud
                Telegram Supergroup. Unduh file resolusi asli melalui tautan di atas.
              </p>
            </div>
          </div>

          {/* Drawer Footer */}
          <div
            className="p-4 flex items-center justify-end"
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.07)",
              background: "rgba(255, 255, 255, 0.02)",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-text-secondary hover:text-white rounded-xl transition-colors"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
