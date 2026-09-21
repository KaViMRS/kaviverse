import Image from "next/image";
import { LoginForm } from "./login-form";
import { Shield, Sparkles, Zap } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* ── Animated nebula orbs ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Primary teal orb */}
        <div
          className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full blur-[140px] animate-nebula-float"
          style={{ background: "radial-gradient(circle, rgba(25,197,158,0.18) 0%, transparent 70%)" }}
        />
        {/* Blue orb */}
        <div
          className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full blur-[120px] animate-nebula-float-reverse"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 70%)" }}
        />
        {/* Purple orb bottom */}
        <div
          className="absolute bottom-0 left-1/3 w-[600px] h-[600px] rounded-full blur-[150px] animate-nebula-slow"
          style={{ background: "radial-gradient(circle, rgba(124,92,255,0.12) 0%, transparent 70%)" }}
        />

        {/* Cyber grid */}
        <div
          className="absolute inset-0 opacity-[0.028]"
          style={{
            backgroundImage: "linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 40%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Left: Brand Panel (desktop only) ── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 xl:w-[55%] relative z-10 p-12 xl:p-16">
        {/* Brand logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl overflow-hidden border border-white/10 shadow-glow-teal"
            style={{ boxShadow: "0 0 20px rgba(25,197,158,0.3)" }}
          >
            <Image src="/logo.jpg" alt="KaviVerse" width={40} height={40} className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-text-primary tracking-tight">
              Kavi<span className="gradient-text-teal">Verse</span>
            </span>
            <div className="text-[10px] text-text-muted font-medium tracking-wider">CONTROL CENTER</div>
          </div>
        </div>

        {/* Hero text */}
        <div className="space-y-8 max-w-md animate-fade-in-up">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-5">
              <Sparkles className="w-3 h-3" />
              <span>Private · Encrypted · Real-time</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-text-primary leading-[1.1] mb-4">
              Kendali penuh<br />
              <span className="gradient-text-animated">hidup teratur.</span>
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Satu dasbor untuk keuangan, penyimpanan file, dan bot Telegram —
              semua tersinkron secara real-time.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2.5">
            {[
              { icon: "💰", label: "Manajemen Keuangan" },
              { icon: "📁", label: "Sikavi Drive" },
              { icon: "🤖", label: "Telegram Bot" },
              { icon: "📊", label: "Laporan Real-time" },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface/60 border border-border/60 text-xs font-medium text-text-secondary backdrop-blur-sm"
              >
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8 pt-2">
            {[
              { value: "100%", label: "Data Privat" },
              { value: "∞", label: "File Storage" },
              { value: "24/7", label: "Monitoring" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-black gradient-text-teal">{s.value}</div>
                <div className="text-[11px] text-text-muted font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom blurb */}
        <div className="flex items-center gap-2 text-[11px] text-text-muted">
          <Shield className="w-3.5 h-3.5 text-success" />
          <span>Sistem privat terlindungi enkripsi — hanya untuk Anda</span>
        </div>
      </div>

      {/* ── Right: Auth Panel ── */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-6">
        {/* Glowing card */}
        <div className="w-full max-w-[380px] space-y-6">
          {/* Mobile branding */}
          <div className="lg:hidden text-center space-y-3 mb-2">
            <div
              className="inline-flex w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shadow-glow-teal mx-auto"
            >
              <Image src="/logo.jpg" alt="KaviVerse" width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">
                Kavi<span className="gradient-text-teal">Verse</span>
              </h1>
              <p className="text-xs text-text-muted mt-0.5">Catat Keuangan • Kelola File • Hidup Teratur</p>
            </div>
          </div>

          {/* Auth card */}
          <div
            className="rounded-2xl border border-border/60 p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden"
            style={{
              background: "rgba(14, 20, 32, 0.72)",
              boxShadow: "0 25px 60px -15px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Subtle top-border gradient */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            <div className="absolute top-0 inset-x-0 h-[80px] bg-gradient-to-b from-accent/[0.04] to-transparent pointer-events-none" />

            {/* Card header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-accent" />
                <h2 className="text-base font-bold text-text-primary">Masuk ke Dashboard</h2>
              </div>
              <p className="text-xs text-text-muted">
                Gunakan passkey pribadi Anda untuk mengakses sistem.
              </p>
            </div>

            <LoginForm />
          </div>

          {/* Security notice */}
          <div className="text-center">
            <p className="text-[11px] text-text-muted flex items-center justify-center gap-1.5">
              <Shield className="w-3 h-3 text-success shrink-0" />
              <span>Koneksi aman · Data tidak pernah dibagikan</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
