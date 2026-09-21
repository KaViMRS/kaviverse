export type ActivitySource = "finance" | "drive" | "bot" | "system";

export interface ActivityEvent {
  id: string;
  source: ActivitySource;
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
