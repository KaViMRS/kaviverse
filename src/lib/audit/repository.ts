import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AuditEvent, AuditEventInput } from "./types";

export async function getCurrentActorEmail() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email ?? null;
}

export async function recordAuditEvent(input: AuditEventInput) {
  try {
    const actorEmail = input.actorEmail === undefined
      ? await getCurrentActorEmail()
      : input.actorEmail;
    const { error } = await createAdminClient().from("audit_logs").insert({
      category: input.category,
      action: input.action,
      status: input.status,
      actor_email: actorEmail,
      target_type: input.targetType ?? null,
      target_id: input.targetId ?? null,
      metadata: input.metadata ?? {},
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("[audit] Failed to record audit event:", error);
    return false;
  }
}

export async function getAuditEvents(limit = 100): Promise<AuditEvent[]> {
  try {
    const { data, error } = await createAdminClient()
      .from("audit_logs")
      .select("id, category, action, status, actor_email, target_type, target_id, metadata, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data ?? []).map((event) => ({
      id: event.id,
      category: event.category,
      action: event.action,
      status: event.status,
      actorEmail: event.actor_email,
      targetType: event.target_type,
      targetId: event.target_id,
      metadata: event.metadata ?? {},
      createdAt: event.created_at,
    }));
  } catch (error) {
    console.error("[audit] Failed to read audit events:", error);
    return [];
  }
}
