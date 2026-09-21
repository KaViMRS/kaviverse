"use client";

import * as React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  isDestructive = false,
  loading = false,
}: ConfirmDialogProps) {
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in-50 duration-200">
      <div
        className="w-full max-w-md bg-surface border border-border rounded-xl p-6 shadow-lg space-y-4 animate-in zoom-in-95 duration-200 relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors disabled:opacity-50"
          aria-label="Tutup dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              isDestructive
                ? "bg-danger/10 text-danger border border-danger/20"
                : "bg-warning/10 text-warning border border-warning/20"
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 id="confirm-dialog-title" className="text-sm font-bold text-text-primary">
              {title}
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/60">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-3.5 py-2 text-xs font-medium rounded-md border border-border bg-surface hover:bg-surface-muted text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 text-white disabled:opacity-50 ${
              isDestructive
                ? "bg-danger hover:bg-danger/90"
                : "bg-accent text-accent-foreground hover:opacity-90"
            }`}
          >
            {loading && (
              <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
