export interface BotStatus {
  botId: "inputdata_bot" | "sikavidrive_bot";
  name: string;
  role: string;
  status: "ONLINE" | "STANDBY" | "ERROR";
  lastActivity: string;
  lastRecordSummary: string;
}
