export type AuditCategory = "auth" | "finance" | "drive" | "system";
export type AuditStatus = "success" | "failure";

export interface AuditEventInput {
  category: AuditCategory;
  action: string;
  status: AuditStatus;
  actorEmail?: string | null;
  targetType?: string | null;
  targetId?: string | null;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface AuditEvent {
  id: string;
  category: AuditCategory;
  action: string;
  status: AuditStatus;
  actorEmail: string | null;
  targetType: string | null;
  targetId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}
