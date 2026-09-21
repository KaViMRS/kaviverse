import { Suspense } from "react";
import { getFileRepository } from "@/lib/repositories/factory";
import { DriveExplorer } from "@/components/drive/drive-explorer";
import { MediaType } from "@/types/file-item";
import { HardDrive, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MediaTypePage({
  params,
}: {
  params: Promise<{ mediaType: string }>;
}) {
  const { mediaType: rawParam } = await params;
  const raw = rawParam.toLowerCase();

  const typeMap: Record<string, MediaType> = {
    photo: "PHOTO",
    photos: "PHOTO",
    video: "VIDEO",
    videos: "VIDEO",
    audio: "AUDIO",
    document: "DOCUMENT",
    documents: "DOCUMENT",
  };

  const filterType = typeMap[raw] || "DOCUMENT";

  const fileRepo = getFileRepository();
  const [{ data: files }, tags] = await Promise.all([
    fileRepo.getFiles({ limit: 1000 }),
    fileRepo.getTags(),
  ]);

  const typeLabelMap: Record<MediaType, string> = {
    PHOTO: "Galeri Foto & Gambar",
    VIDEO: "Arsip Rekaman Video",
    AUDIO: "Arsip Audio & Suara",
    DOCUMENT: "Dokumen & Berkas Digital",
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden flex items-center justify-between gap-4"
        style={{
          background: "rgba(14, 20, 32, 0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 4px 20px -8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div
          className="absolute top-0 inset-x-0 h-[2px]"
          style={{
            background: "linear-gradient(90deg, transparent, #3B82F6, #19C59E, transparent)",
          }}
        />

        <div className="flex items-center gap-3.5 relative z-10">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-accent shrink-0"
            style={{
              background: "rgba(25, 197, 158, 0.12)",
              border: "1px solid rgba(25, 197, 158, 0.28)",
              boxShadow: "0 0 20px -4px rgba(25, 197, 158, 0.3)",
            }}
          >
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-text-primary tracking-tight">
                {typeLabelMap[filterType]}
              </h1>
              <span
                className="text-[10px] font-extrabold text-accent px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(25, 197, 158, 0.12)",
                  border: "1px solid rgba(25, 197, 158, 0.25)",
                }}
              >
                {filterType}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Menampilkan seluruh berkas kategori {filterType} dari bot Telegram.
            </p>
          </div>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="h-64 flex items-center justify-center text-xs text-text-muted">
            Memuat arsip berkas...
          </div>
        }
      >
        <DriveExplorer
          initialFiles={files}
          initialMediaType={filterType}
          tags={tags}
        />
      </Suspense>
    </div>
  );
}
