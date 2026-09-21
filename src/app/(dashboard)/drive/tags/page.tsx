import Link from "next/link";
import { getFileRepository } from "@/lib/repositories/factory";
import { Hash, Tag as TagIcon, ArrowRight, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  const fileRepo = getFileRepository();
  const tags = await fileRepo.getTags();

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
            background: "linear-gradient(90deg, transparent, #19C59E, #3B82F6, transparent)",
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
            <TagIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-text-primary tracking-tight">
                Eksplorasi Tag &amp; Hashtag
              </h1>
              <span
                className="text-[10px] font-extrabold text-accent px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(25, 197, 158, 0.12)",
                  border: "1px solid rgba(25, 197, 158, 0.25)",
                }}
              >
                {tags.length} Tag Aktif
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Daftar hashtag yang diekstrak otomatis dari caption file Telegram. Klik tag untuk melihat berkas terkait.
            </p>
          </div>
        </div>
      </div>

      {/* Tag Pills Cloud */}
      <div className="flex flex-wrap gap-3">
        {tags.map((t) => {
          const cleanTagName = t.name.replace(/^#/, "");
          return (
            <Link
              key={t.name}
              href={`/drive?tag=${encodeURIComponent(cleanTagName)}`}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs text-text-primary transition-all duration-200 group"
              style={{
                background: "rgba(14, 20, 32, 0.75)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Hash className="w-3.5 h-3.5 text-accent group-hover:scale-125 transition-transform" />
              <span className="font-bold group-hover:text-accent transition-colors">
                {t.name}
              </span>
              <span
                className="text-[10px] font-extrabold px-2 py-0.5 rounded-full transition-colors"
                style={{
                  background: "rgba(25, 197, 158, 0.1)",
                  color: "#19C59E",
                }}
              >
                {t.count}
              </span>
              <ArrowRight className="w-3 h-3 text-accent opacity-0 group-hover:opacity-100 -ml-0.5 transition-opacity" />
            </Link>
          );
        })}

        {tags.length === 0 && (
          <div className="text-xs text-text-muted italic py-8">
            Belum ada tag yang terdaftar.
          </div>
        )}
      </div>
    </div>
  );
}
