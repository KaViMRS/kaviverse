"use client";

import { Bot, CheckCircle2, Shield, Activity, RefreshCw, Sparkles, Send, HardDrive, Wallet } from "lucide-react";

export default function BotsStatusPage() {
  const bots = [
    {
      id: "inputdata_bot",
      name: "Finance Bot (@inputdata_bot)",
      type: "Telegram Forum Webhook (Topik #39 - Money)",
      status: "ONLINE",
      themeColor: "#19C59E",
      glowColor: "rgba(25, 197, 158, 0.25)",
      topGradient: "linear-gradient(90deg, transparent, #19C59E, transparent)",
      icon: Wallet,
      sheetTarget: "Input & Tagihan",
      features: [
        "Natural Language Parsing (Gemini AI + Fallback)",
        "Pencatatan Pemasukan & Pengeluaran Otomatis",
        "Kalkulasi Saldo Real-Time Antar Rekening",
        "Peringatan Ambang Batas Budget Limit Bulanan",
        "Pengingat & Rekonsiliasi Tagihan Rutin",
      ],
    },
    {
      id: "sikavidrive_bot",
      name: "Sikavi Drive Bot (@PetugasData_Bot)",
      type: "Telegram Forum Storage (Topik #3, #4, #5, #6)",
      status: "ONLINE",
      themeColor: "#3B82F6",
      glowColor: "rgba(59, 130, 246, 0.25)",
      topGradient: "linear-gradient(90deg, transparent, #3B82F6, transparent)",
      icon: HardDrive,
      sheetTarget: "PetugasData!A:H",
      features: [
        "Penyortiran Media Otomatis (Foto, Video, Audio, Dokumen)",
        "Ekstraksi Hashtag & Tagging Pintar",
        "Forwarding Otomatis ke Dedicated Topic Supergroup",
        "Sinkronisasi Berkas Fisik & URL Pesan Langsung Telegram",
        "Dukungan Upload File via Web Dashboard (Maks. 50 MB)",
      ],
    },
  ];

  return (
    <div className="space-y-6">
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
            background: "linear-gradient(90deg, transparent, #19C59E, #3B82F6, #7C5CFF, transparent)",
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
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-text-primary tracking-tight">
                Status Bot &amp; Integrasi Otomasi
              </h1>
              <span
                className="text-[10px] font-extrabold text-accent px-2.5 py-0.5 rounded-full"
                style={{
                  background: "rgba(25, 197, 158, 0.12)",
                  border: "1px solid rgba(25, 197, 158, 0.25)",
                }}
              >
                Telegram Engine
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Status gateway Telegram Supergroup ke Google Sheets dan KaviVerse Command Center.
            </p>
          </div>
        </div>

        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-accent self-start sm:self-auto relative z-10"
          style={{
            background: "rgba(25, 197, 158, 0.1)",
            border: "1px solid rgba(25, 197, 158, 0.25)",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span>Semua Bot Operasional</span>
        </div>
      </div>

      {/* Bot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {bots.map((b) => {
          const Icon = b.icon;

          return (
            <div
              key={b.id}
              className="p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 group"
              style={{
                background: "rgba(14, 20, 32, 0.75)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 4px 20px -8px rgba(0, 0, 0, 0.3)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = b.glowColor;
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 36px -10px rgba(0,0,0,0.5), 0 0 25px -8px ${b.glowColor}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(255, 255, 255, 0.08)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 4px 20px -8px rgba(0, 0, 0, 0.3)";
              }}
            >
              {/* Top glowing line */}
              <div
                className="absolute top-0 inset-x-0 h-[2px] opacity-70 group-hover:opacity-100 transition-opacity"
                style={{ background: b.topGradient }}
              />

              <div className="space-y-5 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        color: b.themeColor,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
                        {b.name}
                      </h2>
                      <span className="text-[10.5px] text-text-muted">{b.type}</span>
                    </div>
                  </div>

                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1.5"
                    style={{
                      background: "rgba(25, 197, 158, 0.12)",
                      border: "1px solid rgba(25, 197, 158, 0.3)",
                      color: "#19C59E",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    {b.status}
                  </span>
                </div>

                <div
                  className="py-2.5 px-3.5 rounded-xl flex items-center justify-between text-xs"
                  style={{
                    background: "rgba(255, 255, 255, 0.025)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <span className="text-text-muted text-[11px]">Database Spreadsheet:</span>
                  <span className="font-bold text-accent font-mono text-[11.5px]">
                    {b.sheetTarget}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-2.5">
                    Fitur &amp; Kemampuan Gateway:
                  </span>
                  <ul className="space-y-2 text-xs">
                    {b.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-text-secondary">
                        <CheckCircle2
                          className="w-3.5 h-3.5 shrink-0"
                          style={{ color: b.themeColor }}
                        />
                        <span className="font-medium text-[11.5px]">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
