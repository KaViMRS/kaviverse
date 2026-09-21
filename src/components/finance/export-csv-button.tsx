"use client";

import * as React from "react";
import { Download, Loader2 } from "lucide-react";
import { exportTransactionsCsvAction } from "@/app/(dashboard)/finance/actions";

interface ExportCsvButtonProps {
  className?: string;
  variant?: "outline" | "default";
}

export function ExportCsvButton({
  className = "",
  variant = "outline",
}: ExportCsvButtonProps) {
  const [loading, setLoading] = React.useState(false);

  async function handleExport() {
    try {
      setLoading(true);
      const csvData = await exportTransactionsCsvAction();
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const dateStr = new Date().toISOString().split("T")[0];
      link.setAttribute("href", url);
      link.setAttribute("download", `KaviVerse_Laporan_Keuangan_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal mengekspor CSV:", err);
      alert("Gagal mengekspor data ke CSV. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const baseStyles =
    "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const variantStyles =
    variant === "default"
      ? "bg-accent text-accent-foreground hover:opacity-90 shadow-xs"
      : "border border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-muted";

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading}
      className={`${baseStyles} ${variantStyles} ${className}`}
      title="Download seluruh transaksi dalam format CSV untuk Excel"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Download className="w-3.5 h-3.5" />
      )}
      <span>{loading ? "Mengekspor..." : "Export CSV"}</span>
    </button>
  );
}
