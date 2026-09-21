"use client";

import * as React from "react";
import { FileItem, MediaType, TagCount } from "@/types/file-item";
import { FileCard } from "./file-card";
import { FileDetailDrawer } from "./file-detail-drawer";
import { UploadModal } from "./upload-modal";
import { formatDateIndonesian } from "@/lib/utils/formatters";
import {
  Search,
  UploadCloud,
  LayoutGrid,
  List as ListIcon,
  Tag,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  FolderArchive,
  Sparkles,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

interface DriveExplorerProps {
  initialFiles: FileItem[];
  initialMediaType?: MediaType | "ALL";
  initialTag?: string;
  tags?: TagCount[];
}

export function DriveExplorer({
  initialFiles,
  initialMediaType = "ALL",
  initialTag,
  tags = [],
}: DriveExplorerProps) {
  const searchParams = useSearchParams();

  // Read initial tag or mediaType from URL params if present
  const paramTag = searchParams.get("tag") || initialTag || null;

  const [activeCategory, setActiveCategory] = React.useState<MediaType | "ALL">(
    initialMediaType
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTag, setSelectedTag] = React.useState<string | null>(paramTag);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  const [selectedFile, setSelectedFile] = React.useState<FileItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  // Sync selectedTag if paramTag changes
  React.useEffect(() => {
    if (paramTag) {
      setSelectedTag(paramTag);
    }
  }, [paramTag]);

  // Reset pagination on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, selectedTag, viewMode]);

  // Compute category counts
  const counts = React.useMemo(() => {
    const c = { ALL: initialFiles.length, PHOTO: 0, VIDEO: 0, AUDIO: 0, DOCUMENT: 0 };
    initialFiles.forEach((f) => {
      if (f.mediaType in c) {
        c[f.mediaType as keyof typeof c]++;
      }
    });
    return c;
  }, [initialFiles]);

  // Filtered files
  const filteredFiles = React.useMemo(() => {
    let result = initialFiles;

    // 1. Category filter
    if (activeCategory !== "ALL") {
      result = result.filter((f) => f.mediaType === activeCategory);
    }

    // 2. Tag filter
    if (selectedTag) {
      const cleanTarget = selectedTag.toLowerCase().replace(/^#/, "");
      result = result.filter((f) =>
        f.tags.some((t) => t.toLowerCase().replace(/^#/, "") === cleanTarget)
      );
    }

    // 3. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (f) =>
          f.caption.toLowerCase().includes(q) ||
          f.rawTags.toLowerCase().includes(q) ||
          f.sender.toLowerCase().includes(q) ||
          f.targetTopicName.toLowerCase().includes(q) ||
          String(f.telegramMessageId).includes(q)
      );
    }

    return result;
  }, [initialFiles, activeCategory, selectedTag, searchQuery]);

  // Paginated files
  const totalItems = filteredFiles.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedFiles = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredFiles.slice(start, start + pageSize);
  }, [filteredFiles, currentPage, pageSize]);

  function handleCardClick(file: FileItem) {
    setSelectedFile(file);
    setIsDrawerOpen(true);
  }

  function handleTagClick(tag: string) {
    setSelectedTag(tag);
  }

  function renderMediaIcon(type: MediaType) {
    switch (type) {
      case "PHOTO":
        return <ImageIcon className="w-4 h-4 text-sky-400" />;
      case "VIDEO":
        return <Video className="w-4 h-4 text-rose-400" />;
      case "AUDIO":
        return <Music className="w-4 h-4 text-amber-400" />;
      case "DOCUMENT":
      default:
        return <FileText className="w-4 h-4 text-indigo-400" />;
    }
  }

  return (
    <div className="space-y-5">
      {/* Top action bar: Search, Upload Button, View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input with dark glass glow */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berkas berdasarkan caption, tag, pengirim, atau ID..."
            className="w-full pl-10 pr-8 py-2.5 text-xs rounded-xl text-text-primary placeholder:text-text-muted/70 transition-all duration-200 outline-none"
            style={{
              background: "rgba(14, 20, 32, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(25, 197, 158, 0.4)";
              e.currentTarget.style.boxShadow = "0 0 16px -2px rgba(25, 197, 158, 0.2)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {/* View mode toggle */}
          <div
            className="flex items-center rounded-xl p-1"
            style={{
              background: "rgba(14, 20, 32, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-accent/20 text-accent font-semibold shadow-xs"
                  : "text-text-muted hover:text-text-primary"
              }`}
              title="Tampilan Grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-accent/20 text-accent font-semibold shadow-xs"
                  : "text-text-muted hover:text-text-primary"
              }`}
              title="Tampilan List"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Upload Button */}
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-bold transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] group"
            style={{
              background: "linear-gradient(135deg, #19C59E 0%, #108e71 100%)",
              boxShadow: "0 4px 20px -4px rgba(25, 197, 158, 0.45)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 6px 25px -2px rgba(25, 197, 158, 0.65)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 4px 20px -4px rgba(25, 197, 158, 0.45)";
            }}
          >
            <UploadCloud className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            <span>Upload Berkas</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Active Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: "ALL" as const, label: "Semua Media", icon: FolderArchive },
            { key: "PHOTO" as const, label: "Foto", icon: ImageIcon },
            { key: "VIDEO" as const, label: "Video", icon: Video },
            { key: "AUDIO" as const, label: "Audio", icon: Music },
            { key: "DOCUMENT" as const, label: "Dokumen", icon: FileText },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isSelected
                    ? "text-accent shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
                style={{
                  background: isSelected
                    ? "rgba(25, 197, 158, 0.12)"
                    : "rgba(14, 20, 32, 0.6)",
                  border: isSelected
                    ? "1px solid rgba(25, 197, 158, 0.35)"
                    : "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors"
                  style={{
                    background: isSelected
                      ? "rgba(25, 197, 158, 0.25)"
                      : "rgba(255, 255, 255, 0.05)",
                    color: isSelected ? "#19C59E" : "#8B95A7",
                  }}
                >
                  {counts[cat.key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Tag Clear Badge */}
        {selectedTag && (
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-accent text-xs font-semibold"
            style={{
              background: "rgba(25, 197, 158, 0.12)",
              border: "1px solid rgba(25, 197, 158, 0.3)",
            }}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Tag: {selectedTag}</span>
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              className="p-0.5 hover:bg-accent/20 rounded-md transition-colors ml-1"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {paginatedFiles.length > 0 ? (
        viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {paginatedFiles.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onSelect={handleCardClick}
                onTagClick={handleTagClick}
              />
            ))}
          </div>
        ) : (
          /* List View (Table) */
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(14, 20, 32, 0.75)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.07)",
              boxShadow: "0 4px 20px -8px rgba(0, 0, 0, 0.35)",
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr
                    className="text-[10.5px] font-bold text-text-muted uppercase tracking-wider"
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                  >
                    <th className="py-3.5 px-4">Media &amp; Keterangan</th>
                    <th className="py-3.5 px-4">Tag / Label</th>
                    <th className="py-3.5 px-4">Topik</th>
                    <th className="py-3.5 px-4">Pengirim</th>
                    <th className="py-3.5 px-4">Waktu</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {paginatedFiles.map((file) => (
                    <tr
                      key={file.id}
                      onClick={() => handleCardClick(file)}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3 max-w-xs sm:max-w-md">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              background: "rgba(255, 255, 255, 0.04)",
                              border: "1px solid rgba(255, 255, 255, 0.07)",
                            }}
                          >
                            {renderMediaIcon(file.mediaType)}
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-text-primary group-hover:text-accent transition-colors block truncate">
                              {file.caption || "Tanpa Keterangan"}
                            </span>
                            <span className="text-[9.5px] text-text-muted uppercase tracking-wider font-semibold">
                              {file.mediaType} • #{file.telegramMessageId}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {file.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {file.tags.slice(0, 2).map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTagClick(t);
                                }}
                                className="text-[9.5px] font-medium text-accent px-2 py-0.5 rounded-lg transition-colors"
                                style={{
                                  background: "rgba(25, 197, 158, 0.08)",
                                  border: "1px solid rgba(25, 197, 158, 0.18)",
                                }}
                              >
                                {t}
                              </button>
                            ))}
                            {file.tags.length > 2 && (
                              <span className="text-[10px] text-text-muted self-center">
                                +{file.tags.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-text-muted">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className="text-[10.5px] text-text-secondary px-2.5 py-1 rounded-full"
                          style={{
                            background: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 255, 255, 0.06)",
                          }}
                        >
                          {file.targetTopicName}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-text-secondary font-medium">
                        {file.sender}
                      </td>

                      <td className="py-3.5 px-4 text-text-muted text-[10.5px] whitespace-nowrap">
                        {formatDateIndonesian(file.uploadTime)}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {file.directTelegramUrl && (
                          <a
                            href={file.directTelegramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-blue hover:text-white px-2.5 py-1 rounded-lg transition-all"
                            style={{
                              background: "rgba(59, 130, 246, 0.08)",
                              border: "1px solid rgba(59, 130, 246, 0.2)",
                            }}
                            title="Buka di Telegram"
                          >
                            <span>Telegram</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Empty State */
        <div
          className="rounded-2xl p-12 text-center max-w-md mx-auto space-y-4 shadow-xl"
          style={{
            background: "rgba(14, 20, 32, 0.75)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.07)",
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-brand-teal"
            style={{
              background: "rgba(25, 197, 158, 0.1)",
              border: "1px solid rgba(25, 197, 158, 0.25)",
            }}
          >
            <FolderArchive className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-text-primary">
              Tidak ada berkas ditemukan
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              {searchQuery || selectedTag || activeCategory !== "ALL"
                ? "Coba ubah kata kunci pencarian atau bersihkan filter yang aktif."
                : "Belum ada berkas yang diarsipkan. Unggah berkas pertama Anda sekarang."}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-2.5">
            {(searchQuery || selectedTag || activeCategory !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTag(null);
                  setActiveCategory("ALL");
                }}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl text-text-secondary hover:text-white transition-colors"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                Reset Filter
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl text-white transition-all shadow-md inline-flex items-center gap-2"
              style={{
                background: "linear-gradient(135deg, #19C59E 0%, #108e71 100%)",
                boxShadow: "0 4px 15px rgba(25, 197, 158, 0.4)",
              }}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Berkas</span>
            </button>
          </div>
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between pt-4 text-xs text-text-muted"
          style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}
        >
          <div>
            Menampilkan{" "}
            <span className="font-bold text-text-primary">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            -{" "}
            <span className="font-bold text-text-primary">
              {Math.min(currentPage * pageSize, totalItems)}
            </span>{" "}
            dari{" "}
            <span className="font-bold text-text-primary">
              {totalItems}
            </span>{" "}
            berkas
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-xl text-text-secondary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span
              className="px-3 py-1 rounded-xl font-bold text-accent text-xs"
              style={{
                background: "rgba(25, 197, 158, 0.08)",
                border: "1px solid rgba(25, 197, 158, 0.2)",
              }}
            >
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-xl text-text-secondary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* File Detail Drawer */}
      <FileDetailDrawer
        file={selectedFile}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedFile(null);
        }}
        onTagClick={handleTagClick}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
