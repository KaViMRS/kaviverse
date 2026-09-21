import { getSheetsClient } from "@/lib/google/auth";
import { FileItem, CreateFileDTO, FileFilter, MediaType, TagCount } from "@/types/file-item";
import { PaginatedResult } from "@/types/transaction";
import { IFileRepository } from "../interfaces";
import { sanitizeTelegramUrl, sanitizeSheetCell } from "@/lib/utils/security";

export class SheetsFileRepository implements IFileRepository {
  private spreadsheetId: string;
  private defaultChatId: string;

  constructor() {
    this.spreadsheetId =
      process.env.FILE_SPREADSHEET_ID || "1NSHJaXM0heXXDeJ2Fns9U6Ms9eKs0DmHeI9QQ6EcoFk";
    this.defaultChatId = process.env.TELEGRAM_CHAT_ID || "-1004392765044";
  }

  private resolveTopicId(mediaType: string, rawTopicId: string | number | null | undefined): number {
    if (rawTopicId && !isNaN(Number(rawTopicId)) && Number(rawTopicId) > 0) {
      return Number(rawTopicId);
    }
    // Confirmed default fallback mapping for historical data
    switch (mediaType.toUpperCase()) {
      case "PHOTO":
        return 4;
      case "VIDEO":
        return 5;
      case "AUDIO":
      case "VOICE":
        return 6;
      case "DOCUMENT":
      default:
        return 3;
    }
  }

  private async fetchRawRows(): Promise<string[][]> {
    const sheets = getSheetsClient();
    if (!sheets) throw new Error("Google Sheets client is not configured.");

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: "PetugasData!A2:H",
    });

    return (response.data.values as string[][]) || [];
  }

  async getFiles(filter?: FileFilter): Promise<PaginatedResult<FileItem>> {
    const rows = await this.fetchRawRows();

    let files: FileItem[] = rows
      .map((row, idx) => ({ row, idx }))
      .filter(({ row }) => row && row.length > 0 && row.some((cell) => cell && String(cell).trim() !== ""))
      .map(({ row, idx }) => {
      const uploadTime = row[0] ? String(row[0]).trim() : "";
      const telegramMessageId = Number(row[1]) || 0;
      const sender = row[2] ? String(row[2]).trim() : "Unknown";
      const mediaType = (row[3] ? String(row[3]).trim().toUpperCase() : "DOCUMENT") as MediaType;
      const caption = row[4] ? String(row[4]).trim() : "";
      const rawTags = row[5] ? String(row[5]).trim() : "-";
      const targetTopicName = row[6] ? String(row[6]).trim() : mediaType;
      const targetTopicId = this.resolveTopicId(mediaType, row[7]);

      const tags =
        rawTags && rawTags !== "-"
          ? rawTags.split(/\s+/).filter((t) => t.startsWith("#"))
          : [];

      const directTelegramUrl = sanitizeTelegramUrl(
        this.defaultChatId,
        targetTopicId,
        telegramMessageId
      );

      const rowIndex = idx + 2;
      return {
        id: `file-${rowIndex}-${telegramMessageId}`,
        uploadTime,
        telegramMessageId,
        sender,
        mediaType,
        caption,
        tags,
        rawTags,
        targetTopicName,
        targetTopicId,
        directTelegramUrl,
        rawRowIndex: rowIndex,
      };
    });

    // Sort descending (most recent first)
    files.reverse();

    // Filter
    if (filter) {
      if (filter.query) {
        const q = filter.query.toLowerCase();
        files = files.filter(
          (f) =>
            f.caption.toLowerCase().includes(q) ||
            f.rawTags.toLowerCase().includes(q) ||
            f.sender.toLowerCase().includes(q) ||
            f.mediaType.toLowerCase().includes(q)
        );
      }
      if (filter.mediaType && filter.mediaType !== "ALL") {
        files = files.filter((f) => f.mediaType === filter.mediaType);
      }
      if (filter.tag) {
        const targetTag = filter.tag.startsWith("#") ? filter.tag : `#${filter.tag}`;
        files = files.filter((f) =>
          f.tags.some((t) => t.toLowerCase() === targetTag.toLowerCase())
        );
      }
      if (filter.sender) {
        files = files.filter(
          (f) => f.sender.toLowerCase() === filter.sender!.toLowerCase()
        );
      }
    }

    const total = files.length;
    const limit = filter?.limit || 50;
    const offset = filter?.offset || 0;
    const paginated = files.slice(offset, offset + limit);

    return {
      data: paginated,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  async getFileById(id: string): Promise<FileItem | null> {
    const { data } = await this.getFiles({ limit: 10000 });
    return data.find((f) => f.id === id) || null;
  }

  async getTags(): Promise<TagCount[]> {
    const { data } = await this.getFiles({ limit: 10000 });
    const tagMap = new Map<string, number>();

    data.forEach((file) => {
      file.tags.forEach((tag) => {
        const clean = tag.toLowerCase();
        tagMap.set(clean, (tagMap.get(clean) || 0) + 1);
      });
    });

    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  async createFile(dto: CreateFileDTO): Promise<FileItem> {
    const sheets = getSheetsClient();
    if (!sheets) throw new Error("Google Sheets client is not configured.");

    const now = new Date();
    const formattedDate =
      dto.uploadTime ||
      `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

    const cleanCaption = sanitizeSheetCell(dto.caption || "");
    const cleanTags = sanitizeSheetCell(dto.rawTags || "-");
    const cleanSender = sanitizeSheetCell(dto.sender || "Web Upload");

    const rowValues = [
      formattedDate,
      String(dto.telegramMessageId),
      cleanSender,
      dto.mediaType,
      cleanCaption,
      cleanTags,
      dto.targetTopicName,
      String(dto.targetTopicId),
    ];

    const appendRes = await sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: "PetugasData!A:H",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [rowValues],
      },
    });

    const updatedRange = appendRes.data.updates?.updatedRange || "";
    const matchRow = updatedRange.match(/!A(\d+)/);
    const rowIndex = matchRow ? parseInt(matchRow[1], 10) : 999;

    const tags =
      cleanTags && cleanTags !== "-"
        ? cleanTags.split(/\s+/).filter((t) => t.startsWith("#"))
        : [];

    const directTelegramUrl = sanitizeTelegramUrl(
      this.defaultChatId,
      dto.targetTopicId,
      dto.telegramMessageId
    );

    return {
      id: `file-${rowIndex}-${dto.telegramMessageId}`,
      uploadTime: formattedDate,
      telegramMessageId: dto.telegramMessageId,
      sender: cleanSender,
      mediaType: dto.mediaType,
      caption: cleanCaption,
      tags,
      rawTags: cleanTags,
      targetTopicName: dto.targetTopicName,
      targetTopicId: dto.targetTopicId,
      directTelegramUrl,
      rawRowIndex: rowIndex,
    };
  }
}
