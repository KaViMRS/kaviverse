"use client";

import * as React from "react";
import {
  X,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Tag,
  User,
  Sparkles,
} from "lucide-react";
import { MediaType } from "@/types/file-item";
import { uploadFileToDriveAction } from "@/app/(dashboard)/drive/upload-action";
import { useRouter } from "next/navigation";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

export function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [mediaType, setMediaType] = React.useState<MediaType>("DOCUMENT");
  const [caption, setCaption] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [sender, setSender] = React.useState("Web Upload");
  const [topicId, setTopicId] = React.useState<number>(3);

  const [isDragging, setIsDragging] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Close on ESC
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  // Clean up preview object URL on unmount or file change
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Reset form when modal closes or opens
  React.useEffect(() => {
    if (!isOpen) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFile(null);
      setPreviewUrl(null);
      setCaption("");
      setTags("");
      setError(null);
      setSuccessMessage(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleFileSelection(selectedFile: File) {
    setError(null);

    if (selectedFile.size > MAX_SIZE_BYTES) {
      setError("Ukuran file melebihi batas 50 MB Telegram Bot API.");
      return;
    }

    setFile(selectedFile);

    // Auto detect media type and topic
    const mime = selectedFile.type.toLowerCase();
    if (mime.startsWith("image/")) {
      setMediaType("PHOTO");
      setTopicId(4);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else if (mime.startsWith("video/")) {
      setMediaType("VIDEO");
      setTopicId(5);
      setPreviewUrl(null);
    } else if (mime.startsWith("audio/")) {
      setMediaType("AUDIO");
      setTopicId(6);
      setPreviewUrl(null);
    } else {
      setMediaType("DOCUMENT");
      setTopicId(3);
      setPreviewUrl(null);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleTypeChange(newType: MediaType) {
    setMediaType(newType);
    switch (newType) {
      case "PHOTO":
        setTopicId(4);
        break;
      case "VIDEO":
        setTopicId(5);
        break;
      case "AUDIO":
        setTopicId(6);
        break;
      case "DOCUMENT":
      default:
        setTopicId(3);
        break;
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!file) {
      setError("Silakan pilih berkas terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mediaType", mediaType);
      formData.append("topicId", String(topicId));
      formData.append("caption", caption);
      formData.append("tags", tags);
      formData.append("sender", sender);

      const result = await uploadFileToDriveAction(formData);

      if (!result.success) {
        setError(result.error || "Gagal mengunggah berkas");
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(
        result.message || "Berkas berhasil diunggah ke Telegram dan dicatat di Google Sheets!"
      );

      setTimeout(() => {
        router.refresh();
        if (onSuccess) onSuccess();
        onClose();
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat mengunggah";
      setError(msg);
      setIsSubmitting(false);
    }
  }

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 transition-opacity animate-in fade-in duration-200"
        style={{
          background: "rgba(4, 7, 12, 0.8)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
        onClick={() => !isSubmitting && onClose()}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-lg rounded-2xl shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200"
          style={{
            background: "rgba(13, 18, 28, 0.95)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px -10px rgba(25, 197, 158, 0.15)",
          }}
        >
          {/* Top glowing edge */}
          <div
            className="absolute top-0 inset-x-0 h-[2px]"
            style={{
              background: "linear-gradient(90deg, transparent, #19C59E, #3B82F6, transparent)",
            }}
          />

          {/* Header */}
          <div
            className="flex items-center justify-between pb-4"
            style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.07)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-accent shrink-0"
                style={{
                  background: "rgba(25, 197, 158, 0.12)",
                  border: "1px solid rgba(25, 197, 158, 0.28)",
                }}
              >
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                  <span>Upload Berkas ke Sikavi Drive</span>
                  <Sparkles className="w-3 h-3 text-accent" />
                </h2>
                <p className="text-[11px] text-text-muted">
                  Kirim ke Telegram Supergroup &amp; sinkron otomatis ke Sheets
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1.5 text-text-muted hover:text-white rounded-lg transition-colors disabled:opacity-50"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Error Notification */}
            {error && (
              <div
                className="p-3.5 rounded-xl text-rose-400 text-xs flex items-start gap-2.5 animate-in fade-in duration-200"
                style={{
                  background: "rgba(244, 63, 94, 0.1)",
                  border: "1px solid rgba(244, 63, 94, 0.25)",
                }}
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold">Gagal Mengunggah</div>
                  <div className="text-[11px] text-rose-300">{error}</div>
                </div>
              </div>
            )}

            {/* Success Notification */}
            {successMessage && (
              <div
                className="p-3.5 rounded-xl text-emerald-400 text-xs flex items-center gap-2.5 animate-in fade-in duration-200"
                style={{
                  background: "rgba(25, 197, 158, 0.12)",
                  border: "1px solid rgba(25, 197, 158, 0.3)",
                }}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-accent" />
                <span className="font-semibold text-[11.5px]">{successMessage}</span>
              </div>
            )}

            {/* Drag & Drop Zone */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelection(e.target.files[0]);
                  }
                }}
              />

              {!file ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-2xl p-6 text-center cursor-pointer transition-all duration-300"
                  style={{
                    background: isDragging
                      ? "rgba(25, 197, 158, 0.12)"
                      : "rgba(255, 255, 255, 0.02)",
                    border: isDragging
                      ? "2px dashed #19C59E"
                      : "2px dashed rgba(255, 255, 255, 0.12)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isDragging) {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(25, 197, 158, 0.5)";
                      (e.currentTarget as HTMLDivElement).style.background =
                        "rgba(25, 197, 158, 0.04)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDragging) {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(255, 255, 255, 0.12)";
                      (e.currentTarget as HTMLDivElement).style.background =
                        "rgba(255, 255, 255, 0.02)";
                    }
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-accent mb-3"
                    style={{
                      background: "rgba(25, 197, 158, 0.1)",
                      border: "1px solid rgba(25, 197, 158, 0.25)",
                    }}
                  >
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-text-primary">
                    Pilih berkas atau seret ke area ini
                  </p>
                  <p className="text-[11px] text-text-muted mt-1">
                    Mendukung Foto, Video, Audio, atau Dokumen (Maks. 50 MB)
                  </p>
                </div>
              ) : (
                <div
                  className="p-3.5 rounded-xl flex items-center justify-between gap-3"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {previewUrl ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-black">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: "rgba(255, 255, 255, 0.06)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        {mediaType === "VIDEO" && (
                          <Video className="w-5 h-5 text-rose-400" />
                        )}
                        {mediaType === "AUDIO" && (
                          <Music className="w-5 h-5 text-amber-400" />
                        )}
                        {mediaType === "DOCUMENT" && (
                          <FileText className="w-5 h-5 text-indigo-400" />
                        )}
                        {mediaType === "PHOTO" && (
                          <ImageIcon className="w-5 h-5 text-sky-400" />
                        )}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-primary truncate">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-text-muted font-medium">
                        {formatBytes(file.size)} • {file.type || "Berkas"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setFile(null);
                      if (previewUrl) URL.revokeObjectURL(previewUrl);
                      setPreviewUrl(null);
                    }}
                    className="p-1.5 text-text-muted hover:text-rose-400 rounded-lg transition-colors"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                    }}
                    title="Ganti file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Category / Topic Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary">
                Kategori &amp; Topik Tujuan Telegram
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  {
                    type: "PHOTO" as MediaType,
                    label: "Foto",
                    topicId: 4,
                    icon: ImageIcon,
                    color: "text-sky-400",
                    glow: "rgba(56, 189, 248, 0.2)",
                  },
                  {
                    type: "VIDEO" as MediaType,
                    label: "Video",
                    topicId: 5,
                    icon: Video,
                    color: "text-rose-400",
                    glow: "rgba(244, 63, 94, 0.2)",
                  },
                  {
                    type: "AUDIO" as MediaType,
                    label: "Audio",
                    topicId: 6,
                    icon: Music,
                    color: "text-amber-400",
                    glow: "rgba(245, 158, 11, 0.2)",
                  },
                  {
                    type: "DOCUMENT" as MediaType,
                    label: "Dokumen",
                    topicId: 3,
                    icon: FileText,
                    color: "text-indigo-400",
                    glow: "rgba(129, 140, 248, 0.2)",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = mediaType === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleTypeChange(item.type)}
                      className="flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all text-center"
                      style={{
                        background: isSelected
                          ? "rgba(25, 197, 158, 0.12)"
                          : "rgba(255, 255, 255, 0.03)",
                        border: isSelected
                          ? "1px solid rgba(25, 197, 158, 0.4)"
                          : "1px solid rgba(255, 255, 255, 0.07)",
                        boxShadow: isSelected ? `0 0 14px -2px ${item.glow}` : "none",
                      }}
                    >
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <span
                        className={`text-[11px] font-bold ${
                          isSelected ? "text-accent" : "text-text-secondary"
                        }`}
                      >
                        {item.label}
                      </span>
                      <span className="text-[9px] text-text-muted font-medium">
                        Topik #{item.topicId}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Caption */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary">
                Keterangan / Caption Berkas
              </label>
              <textarea
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                disabled={isSubmitting}
                placeholder="Tuliskan catatan transaksi, nomor invoice, atau deskripsi berkas..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl text-text-primary placeholder:text-text-muted/70 transition-all outline-none"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(25, 197, 158, 0.4)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                }}
              />
            </div>

            {/* Tags & Sender (Row) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-accent" />
                  Tag / Label
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Contoh: nota bukti resep"
                  className="w-full px-3.5 py-2 text-xs rounded-xl text-text-primary placeholder:text-text-muted/70 transition-all outline-none"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(25, 197, 158, 0.4)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
                  <User className="w-3 h-3 text-brand-blue" />
                  Nama Pengirim
                </label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Web Upload"
                  className="w-full px-3.5 py-2 text-xs rounded-xl text-text-primary placeholder:text-text-muted/70 transition-all outline-none"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.4)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  }}
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div
              className="pt-4 flex items-center justify-end gap-3"
              style={{ borderTop: "1px solid rgba(255, 255, 255, 0.07)" }}
            >
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-text-secondary hover:text-white rounded-xl transition-colors disabled:opacity-50"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !file}
                className="px-5 py-2.5 text-xs font-bold rounded-xl text-white transition-all flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #19C59E 0%, #108e71 100%)",
                  boxShadow: "0 4px 20px -4px rgba(25, 197, 158, 0.5)",
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengunggah...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Unggah ke Telegram</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
