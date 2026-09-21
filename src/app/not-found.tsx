import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-text-primary">
      <div className="text-center max-w-md space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto text-accent shadow-sm">
          <FileQuestion className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            404 — Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
            Halaman atau arsip yang Anda tuju tidak ditemukan atau telah dipindahkan.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
