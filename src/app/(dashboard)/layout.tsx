import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background relative selection:bg-accent/25 overflow-x-hidden">

      {/* ── Animated Cosmic Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Primary teal nebula — top-left */}
        <div
          className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full blur-[160px] animate-nebula-float"
          style={{ background: "radial-gradient(circle, rgba(25,197,158,0.11) 0%, transparent 70%)" }}
        />
        {/* Electric blue — top-right */}
        <div
          className="absolute -top-24 -right-24 w-[550px] h-[550px] rounded-full blur-[140px] animate-nebula-float-reverse"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)" }}
        />
        {/* Cosmic purple — bottom-right */}
        <div
          className="absolute -bottom-48 right-1/4 w-[680px] h-[680px] rounded-full blur-[180px] animate-nebula-slow"
          style={{ background: "radial-gradient(circle, rgba(124,92,255,0.08) 0%, transparent 70%)" }}
        />
        {/* Subtle warm accent — bottom-left */}
        <div
          className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full blur-[120px]"
          style={{
            background: "radial-gradient(circle, rgba(25,197,158,0.06) 0%, transparent 70%)",
            animation: "nebula-float-reverse 30s ease-in-out infinite",
          }}
        />

        {/* Cyber grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "3.5rem 3.5rem",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, #000 60%, transparent 100%)",
          }}
        />
      </div>

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0 relative z-10 md:pl-[240px]">
        <Topbar />
        <main className="flex-1 px-3 py-4 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Sticky Bottom Nav */}
      <MobileNav />
    </div>
  );
}
