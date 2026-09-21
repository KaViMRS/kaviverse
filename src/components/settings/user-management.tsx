"use client";

import * as React from "react";
import { createUserAction, deleteUserAction, resetUserPasswordAction } from "@/app/(dashboard)/settings/actions";

type User = {
  id: string;
  email?: string;
  created_at: string;
  app_metadata?: Record<string, unknown>;
};

export function UserManagement({ users }: { users: User[] }) {
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  return (
    <div className="space-y-4">
      {message && <p className="rounded-md border border-accent/30 bg-accent/10 p-3 text-xs text-accent">{message}</p>}
      {error && <p className="rounded-md border border-danger/30 bg-danger/10 p-3 text-xs text-danger">{error}</p>}
      <form action={async (data) => {
        setMessage(null); setError(null);
        const result = await createUserAction(data);
        if (result.error) setError(result.error);
        if (result.success) setMessage(result.success);
        return;
      }} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <input name="email" type="email" required placeholder="email@domain.com" className="rounded-md border border-border bg-surface px-3 py-2 text-sm" />
        <input name="password" type="password" required minLength={8} placeholder="Password minimal 8 karakter" className="rounded-md border border-border bg-surface px-3 py-2 text-sm" />
        <button type="submit" className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">Tambah akun</button>
      </form>
      <div className="divide-y divide-white/[0.05]">
        {users.map((user) => (
          <div key={user.id} className="flex flex-col gap-3 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-text-primary">{user.email}</p>
              <p className="text-xs text-text-muted">
                Dibuat {new Date(user.created_at).toLocaleDateString("id-ID")} ·{" "}
                {user.app_metadata?.kaviverse_role === "admin" ? "Akses aktif" : "Belum diizinkan"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <form action={async (data) => {
                setMessage(null); setError(null);
                const result = await resetUserPasswordAction(data);
                if (result.error) setError(result.error);
                if (result.success) setMessage(result.success);
              }} className="flex gap-2">
                <input type="hidden" name="userId" value={user.id} />
                <input name="password" type="password" required minLength={8} placeholder="Password baru" className="w-32 rounded-md border border-border bg-surface px-2 py-1.5 text-xs" />
                <button type="submit" className="rounded-md border border-accent/30 px-3 py-1.5 text-xs text-accent">Reset</button>
              </form>
              <form action={async (data) => {
                setMessage(null); setError(null);
                const result = await deleteUserAction(data);
                if (result.error) setError(result.error);
                if (result.success) setMessage(result.success);
              }}>
                <input type="hidden" name="userId" value={user.id} />
                <button type="submit" onClick={(event) => {
                  if (!window.confirm(`Hapus akun ${user.email || "ini"}?`)) event.preventDefault();
                }} className="rounded-md border border-danger/30 px-3 py-1.5 text-xs text-danger">Hapus</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
