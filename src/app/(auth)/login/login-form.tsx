"use client";

import * as React from "react";
import { loginAction } from "./actions";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";

export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginAction(formData);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      }
    } catch {
      // Next.js redirect throws a special internal error which is expected on success
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3.5 text-xs rounded-md bg-danger/10 border border-danger/20 text-danger flex items-start gap-2 animate-in fade-in-50">
          <span className="font-semibold mt-0.5">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-xs font-medium text-text-secondary"
        >
          Email Admin
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue="admin@kaviverse.local"
            placeholder="nama@domain.com"
            className="w-full pl-9 pr-3 py-2 bg-surface text-text-primary placeholder:text-text-muted text-sm rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
        </div>
        <p className="text-[11px] text-text-muted">
          Hanya email yang terdaftar pada allowlist yang dapat masuk.
        </p>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-xs font-medium text-text-secondary"
        >
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            defaultValue="password123"
            placeholder="••••••••"
            className="w-full pl-9 pr-10 py-2 bg-surface text-text-primary placeholder:text-text-muted text-sm rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-secondary focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-accent text-accent-foreground font-medium text-sm rounded-md hover:opacity-90 active:scale-[0.99] transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Masuk ke Kaviverse</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
