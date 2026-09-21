import { getFinanceRepository, getFileRepository } from "@/lib/repositories/factory";
import { formatIDR } from "@/lib/utils/formatters";
import { Clock } from "lucide-react";
import { getAuditEvents } from "@/lib/audit/repository";
import {
  ActivityTimelineClient,
  ActivityEventItem,
} from "@/components/activity/activity-timeline-client";

export const dynamic = "force-dynamic";

function describeAuditEvent(event: Awaited<ReturnType<typeof getAuditEvents>>[number]) {
  const actor = event.actorEmail || "Sistem";
  const target = event.targetId ? ` • ID: ${event.targetId}` : "";
  const labels: Record<string, string> = {
    "auth.login_success": "Login berhasil",
    "auth.login_failed": "Login gagal",
    "admin.created": "Akun admin dibuat",
    "admin.deleted": "Akun admin dihapus",
    "admin.password_reset": "Password admin diubah",
    "transaction.created": "Transaksi dibuat",
    "transaction.updated": "Transaksi diperbarui",
    "transaction.deleted": "Transaksi dihapus",
    "data.exported": "Data transaksi diekspor",
    "file.uploaded": "Berkas diunggah",
    "file.deleted": "Berkas dihapus",
  };
  const title = labels[event.action] || event.action;
  const reason = typeof event.metadata.reason === "string"
    ? ` • ${event.metadata.reason === "invalid_credentials" ? "Kredensial tidak valid" : event.metadata.reason}`
    : "";

  return {
    title,
    description: `${actor} • ${event.status === "success" ? "Berhasil" : "Gagal"}${target}${reason}`,
  };
}

function parseActivityDate(date: string, time = "") {
  const normalizedDate = date.trim();
  const dayFirstMatch = normalizedDate.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  const value = dayFirstMatch
    ? `${dayFirstMatch[3].length === 2 ? `20${dayFirstMatch[3]}` : dayFirstMatch[3]}-${dayFirstMatch[2].padStart(2, "0")}-${dayFirstMatch[1].padStart(2, "0")}T${time || "00:00"}`
    : `${normalizedDate}T${time || "00:00"}`;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export default async function ActivityPage() {
  const financeRepo = getFinanceRepository();
  const fileRepo = getFileRepository();

  const [txRes, fileRes, auditEvents] = await Promise.all([
    financeRepo.getTransactions({ limit: 50 }),
    fileRepo.getFiles({ limit: 50 }),
    getAuditEvents(50),
  ]);

  // Combine into unified activity timeline
  const events: ActivityEventItem[] = [
    ...txRes.data.map((tx) => ({
      id: `act-tx-${tx.id}`,
      type: "finance" as const,
      title: `${tx.type === "Pemasukan" ? "Pemasukan Masuk" : "Pengeluaran Tercatat"}: ${formatIDR(tx.amount)}`,
      description: `${tx.activity} • Rekening: ${tx.account} • Kategori: ${tx.category}`,
      date: tx.date,
      time: tx.time,
      iconType: "finance" as const,
      color: tx.type === "Pemasukan" ? "#19C59E" : "#F43F5E",
      bg: tx.type === "Pemasukan" ? "rgba(25, 197, 158, 0.12)" : "rgba(244, 63, 94, 0.12)",
      border: tx.type === "Pemasukan" ? "rgba(25, 197, 158, 0.25)" : "rgba(244, 63, 94, 0.25)",
      sortTimestamp: parseActivityDate(tx.date, tx.time),
    })),
    ...fileRes.data.map((f) => ({
      id: `act-file-${f.id}`,
      type: "drive" as const,
      title: `Berkas ${f.mediaType} Diarsipkan di Sikavi Drive`,
      description: `${f.caption || "Tanpa keterangan"} • Topik: ${f.targetTopicName} • ${f.rawTags}`,
      date: f.uploadTime,
      time: "",
      iconType: "drive" as const,
      color: "#3B82F6",
      bg: "rgba(59, 130, 246, 0.12)",
      border: "rgba(59, 130, 246, 0.25)",
      sortTimestamp: parseActivityDate(f.uploadTime),
    })),
    ...auditEvents.map((event) => {
      const description = describeAuditEvent(event);
      return {
        id: `audit-${event.id}`,
        type: event.category === "auth" ? ("system" as const) : event.category === "drive" ? ("drive" as const) : ("finance" as const),
        title: description.title,
        description: description.description,
        date: new Date(event.createdAt).toLocaleDateString("id-ID"),
        time: new Date(event.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        iconType: event.category === "auth" ? ("system" as const) : event.category === "drive" ? ("drive" as const) : ("finance" as const),
        color: event.status === "success" ? "#19C59E" : "#F43F5E",
        bg: event.status === "success" ? "rgba(25, 197, 158, 0.12)" : "rgba(244, 63, 94, 0.12)",
        border: event.status === "success" ? "rgba(25, 197, 158, 0.25)" : "rgba(244, 63, 94, 0.25)",
        sortTimestamp: new Date(event.createdAt).getTime(),
      };
    }),
  ].sort((a, b) => b.sortTimestamp - a.sortTimestamp);

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
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-text-primary tracking-tight">
                Log Aktivitas Terpadu KaviVerse
              </h1>
              <span
                className="text-[10px] font-extrabold text-accent px-2.5 py-0.5 rounded-full"
                style={{
                  background: "rgba(25, 197, 158, 0.12)",
                  border: "1px solid rgba(25, 197, 158, 0.25)",
                }}
              >
                Audit Trail
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Kronologi linimasa transaksi finansial dan pengarsipan berkas dari bot Telegram.
            </p>
          </div>
        </div>

        <span
          className="text-xs font-bold text-text-muted px-3 py-1.5 rounded-xl self-start sm:self-auto relative z-10"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.07)",
          }}
        >
          {events.length} Riwayat Aktivitas
        </span>
      </div>

      {/* Paginated Activity Timeline Client */}
      <ActivityTimelineClient events={events} />
    </div>
  );
}
