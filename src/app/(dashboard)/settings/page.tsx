import { Shield, Key, Database, Bot, CheckCircle2, Lock, Sparkles, Settings } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { UserManagement } from "@/components/settings/user-management";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  let users: { id: string; email?: string; created_at: string; app_metadata?: Record<string, unknown> }[] = [];
  let userError: string | null = null;

  try {
    const { data, error } = await createAdminClient().auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (error) userError = error.message;
    users = data.users.map(({ id, email, created_at, app_metadata }) => ({
      id,
      email,
      created_at,
      app_metadata,
    }));
  } catch (error) {
    userError = error instanceof Error ? error.message : "Daftar akun tidak dapat dimuat.";
  }

  const integrations = [
    {
      name: "Google Sheets API Gateway",
      sub: "PetugasData, Input, Tagihan",
      status: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? "Configured" : "Mock Standby Active",
      icon: Database,
      color: "#19C59E",
    },
    {
      name: "Supabase SSR Authentication",
      sub: "Secure Cookie Session Token",
      status: "Active (Encrypted)",
      icon: Shield,
      color: "#3B82F6",
    },
    {
      name: "Telegram Bot API (Supergroup)",
      sub: "@inputdata_bot & @PetugasData_Bot",
      status: process.env.TELEGRAM_BOT_TOKEN ? "Connected" : "Web Direct Ready",
      icon: Bot,
      color: "#7C5CFF",
    },
    {
      name: "Formula Injection Shield",
      sub: "RFC 4180 CSV & Sheets Sanitizer",
      status: "Enforced",
      icon: Lock,
      color: "#19C59E",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Banner */}
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
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-text-primary tracking-tight">
                Pengaturan Sistem &amp; Keamanan
              </h1>
              <span
                className="text-[10px] font-extrabold text-accent px-2.5 py-0.5 rounded-full"
                style={{
                  background: "rgba(25, 197, 158, 0.12)",
                  border: "1px solid rgba(25, 197, 158, 0.25)",
                }}
              >
                Security Center
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Konfigurasi kontrol akses admin, proteksi injeksi rumus, dan status integrasi cloud.
            </p>
          </div>
        </div>
      </div>

      {/* Admin Access */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden space-y-4"
        style={{
          background: "rgba(14, 20, 32, 0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 4px 20px -8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-accent" />
          <h2 className="text-sm font-bold text-text-primary">
            Akses Admin Otomatis
          </h2>
        </div>
        <p className="text-xs text-text-muted leading-relaxed">
          Akses ditentukan oleh role admin di Supabase. Menambah atau menghapus akun di bawah ini langsung memperbarui hak akses tanpa perubahan environment variable atau redeploy.
        </p>
        <div className="flex items-center gap-2 text-xs text-accent">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Role-based access control aktif</span>
        </div>
      </div>

      {/* Integrations Status */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden space-y-4"
        style={{
          background: "rgba(14, 20, 32, 0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 4px 20px -8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <Key className="w-5 h-5 text-accent" />
          <h2 className="text-sm font-bold text-text-primary">Manajemen Akun Login</h2>
        </div>
        <p className="text-xs text-text-muted leading-relaxed">
          Buat, reset, atau hapus akun admin secara langsung. Perubahan akses otomatis berlaku tanpa mengubah Vercel.
        </p>
        {userError ? (
          <p className="rounded-md border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
            {userError} Tambahkan SUPABASE_SERVICE_ROLE_KEY di environment Production Vercel untuk mengaktifkan fitur ini.
          </p>
        ) : (
          <UserManagement users={users} />
        )}
      </div>

      {/* Integrations Status */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden space-y-4"
        style={{
          background: "rgba(14, 20, 32, 0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 4px 20px -8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <h2 className="text-sm font-bold text-text-primary">
          Status Integrasi Layanan Backend
        </h2>
        <div className="divide-y divide-white/[0.05]">
          {integrations.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="py-3.5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.07)",
                      color: item.color,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-text-primary block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-text-muted">{item.sub}</span>
                  </div>
                </div>

                <span
                  className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border"
                  style={{
                    background: "rgba(25, 197, 158, 0.1)",
                    border: "1px solid rgba(25, 197, 158, 0.25)",
                    color: "#19C59E",
                  }}
                >
                  {item.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
