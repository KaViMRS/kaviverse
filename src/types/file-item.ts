export type MediaType = "PHOTO" | "VIDEO" | "AUDIO" | "DOCUMENT";

export interface FileItem {
  id: string;
  uploadTime: string; // ISO string or formatted DD/MM/YYYY HH:mm:ss
  telegramMessageId: number;
  sender: string;
  mediaType: MediaType;
  caption: string;
  tags: string[];
  rawTags: string;
  targetTopicName: string;
  targetTopicId: number;
  directTelegramUrl: string | null;
  rawRowIndex?: number;
}

export interface CreateFileDTO {
  uploadTime?: string;
  telegramMessageId: number;
  sender: string;
  mediaType: MediaType;
  caption: string;
  rawTags: string;
  targetTopicName: string;
  targetTopicId: number;
}

export interface FileFilter {
  query?: string;
  mediaType?: MediaType | "ALL";
  tag?: string;
  sender?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface TagCount {
  name: string;
  count: number;
}
