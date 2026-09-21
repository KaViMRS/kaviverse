import { Suspense } from "react";
import { getFileRepository } from "@/lib/repositories/factory";
import { DriveExplorer } from "@/components/drive/drive-explorer";
import { FolderArchive, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DrivePage() {
  const fileRepo = getFileRepository();
  const [{ data: files }, tags] = await Promise.all([
    fileRepo.getFiles({ limit: 1000 }),
    fileRepo.getTags(),
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4"
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
            background: "linear-gradient(90deg, transparent, #3B82F6, #7C5CFF, #19C59E, transparent)",
          }}
        />

        <div className="flex items-center gap-3.5 relative z-10">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-brand-blue shrink-0"
            style={{
              background: "rgba(59, 130, 246, 0.12)",
              border: "1px solid rgba(59, 130, 246, 0.28)",
              boxShadow: "0 0 20px -4px rgba(59, 130, 246, 0.3)",
            }}
          >
            <FolderArchive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-text-primary tracking-tight">
                Sikavi Drive — Cloud Arsip Berkas
              </h1>
              <span
                className="text-[10px] font-extrabold text-brand-blue px-2.5 py-0.5 rounded-full"
                style={{
                  background: "rgba(59, 130, 246, 0.12)",
                  border: "1px solid rgba(59, 130, 246, 0.25)",
                }}
              >
                Telegram Storage
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Eksplorasi, cari, dan unggah media langsung ke Supergroup Telegram secara real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto relative z-10">
          <div
            className="text-right px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.07)",
            }}
          >
            <span className="text-text-muted text-[11px] block">Total Berkas</span>
            <span className="text-sm font-black text-accent">{files.length} Item</span>
          </div>
        </div>
      </div>

      {/* Explorer Component inside Suspense for searchParams support */}
      <Suspense
        fallback={
          <div className="h-64 flex items-center justify-center text-xs text-text-muted">
            Memuat arsip file...
          </div>
        }
      >
        <DriveExplorer initialFiles={files} tags={tags} />
      </Suspense>
    </div>
  );
}
