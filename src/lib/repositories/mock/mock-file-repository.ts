import { FileItem, CreateFileDTO, FileFilter, MediaType, TagCount } from "@/types/file-item";
import { PaginatedResult } from "@/types/transaction";
import { IFileRepository } from "../interfaces";
import { sanitizeTelegramUrl } from "@/lib/utils/security";

const DEFAULT_CHAT_ID = "-1002384910283";

// Initial seed data mirroring the exact PetugasData_Bot screenshot
const INITIAL_FILES: Array<{
  waktu: string;
  msgId: number;
  pengirim: string;
  tipe: MediaType;
  caption: string;
  tags: string;
  topik: string;
  topikId: number;
}> = [
  { waktu: "09/08/2026 16:32:14", msgId: 484, pengirim: "R", tipe: "VIDEO", caption: "Video: VIDEO_AgADuilAAhf2yFc", tags: "#video", topik: "VIDEO", topikId: 5 },
  { waktu: "09/08/2026 17:22:16", msgId: 487, pengirim: "R", tipe: "VIDEO", caption: "#It's_only_me", tags: "#it", topik: "VIDEO", topikId: 5 },
  { waktu: "19/08/2026 13:12:15", msgId: 534, pengirim: "R", tipe: "PHOTO", caption: "Digital Korlantas mama", tags: "#foto", topik: "PHOTO", topikId: 4 },
  { waktu: "19/08/2026 15:04:15", msgId: 550, pengirim: "R", tipe: "PHOTO", caption: "Santaka Diginfo", tags: "#foto", topik: "PHOTO", topikId: 4 },
  { waktu: "19/08/2026 15:26:16", msgId: 568, pengirim: "R", tipe: "PHOTO", caption: "santaka berita", tags: "#photo", topik: "PHOTO", topikId: 4 },
  { waktu: "19/08/2026 16:41:16", msgId: 643, pengirim: "R", tipe: "PHOTO", caption: "Santaka Siswa", tags: "#photo", topik: "PHOTO", topikId: 4 },
  { waktu: "19/08/2026 17:03:15", msgId: 651, pengirim: "R", tipe: "PHOTO", caption: "Visual commands ai", tags: "#photo", topik: "PHOTO", topikId: 4 },
  { waktu: "22/08/2026 23:04:15", msgId: 684, pengirim: "R", tipe: "DOCUMENT", caption: "CV Digital TP", tags: "#document", topik: "DOCUMENT", topikId: 3 },
  { waktu: "24/08/2026 10:00:47", msgId: 731, pengirim: "R", tipe: "DOCUMENT", caption: "CV Digital TP", tags: "#document", topik: "DOCUMENT", topikId: 3 },
  { waktu: "24/08/2026 10:01:55", msgId: 735, pengirim: "R", tipe: "DOCUMENT", caption: "Cv Digital Guru", tags: "#document", topik: "DOCUMENT", topikId: 3 },
  { waktu: "25/08/2026 21:01:17", msgId: 766, pengirim: "R", tipe: "VIDEO", caption: "Story Cover", tags: "#video", topik: "VIDEO", topikId: 5 },
  { waktu: "25/08/2026 21:03:15", msgId: 769, pengirim: "R", tipe: "DOCUMENT", caption: "Surat Lamaran TP pdf", tags: "#dokumen", topik: "DOCUMENT", topikId: 3 },
  { waktu: "25/08/2026 21:04:15", msgId: 772, pengirim: "R", tipe: "DOCUMENT", caption: "Surat Lamaran TP word", tags: "#dokumen", topik: "DOCUMENT", topikId: 3 },
  { waktu: "25/08/2026 21:16:17", msgId: 776, pengirim: "R", tipe: "DOCUMENT", caption: "Surat Lamaran Word v1", tags: "#dokumen", topik: "DOCUMENT", topikId: 3 },
  { waktu: "25/08/2026 21:16:22", msgId: 778, pengirim: "R", tipe: "DOCUMENT", caption: "SUrat Lamaran Pdf v1", tags: "#dokumen", topik: "DOCUMENT", topikId: 3 },
  { waktu: "25/08/2026 21:19:14", msgId: 782, pengirim: "R", tipe: "PHOTO", caption: "Formal Biru", tags: "#foto", topik: "PHOTO", topikId: 4 },
  { waktu: "25/08/2026 21:19:20", msgId: 784, pengirim: "R", tipe: "PHOTO", caption: "Formal Merah", tags: "#foto", topik: "PHOTO", topikId: 4 },
  { waktu: "25/08/2026 21:21:15", msgId: 788, pengirim: "R", tipe: "PHOTO", caption: "Formal Merah kacamata Tanpa Ja #foto", tags: "#photo", topik: "PHOTO", topikId: 4 },
  { waktu: "25/08/2026 21:21:21", msgId: 790, pengirim: "R", tipe: "PHOTO", caption: "Formal Merah Tanpa Jas", tags: "#foto", topik: "PHOTO", topikId: 4 },
  { waktu: "26/08/2026 17:46:15", msgId: 793, pengirim: "R", tipe: "DOCUMENT", caption: "CV digital umum", tags: "#dokumen", topik: "DOCUMENT", topikId: 3 },
  { waktu: "28/08/2026 11:38:17", msgId: 805, pengirim: "R", tipe: "AUDIO", caption: "Pendaftaran operasi papa", tags: "#audio", topik: "AUDIO", topikId: 6 },
  { waktu: "28/08/2026 11:39:14", msgId: 807, pengirim: "R", tipe: "AUDIO", caption: "Rekaman konsul dokter tino", tags: "#audio", topik: "AUDIO", topikId: 6 },
  { waktu: "29/08/2026 8:26:15", msgId: 887, pengirim: "R", tipe: "PHOTO", caption: "STNK BLADE 1", tags: "#foto", topik: "PHOTO", topikId: 4 },
  { waktu: "29/08/2026 8:26:19", msgId: 889, pengirim: "R", tipe: "PHOTO", caption: "STNK BLADE 2", tags: "#foto", topik: "PHOTO", topikId: 4 },
];

export class MockFileRepository implements IFileRepository {
  private files: FileItem[];

  constructor() {
    this.files = INITIAL_FILES.map((item, idx) => {
      const tags = item.tags ? item.tags.split(/\s+/).filter((t) => t.startsWith("#")) : [];
      return {
        id: `file-${idx + 2}-${item.msgId}`,
        uploadTime: item.waktu,
        telegramMessageId: item.msgId,
        sender: item.pengirim,
        mediaType: item.tipe,
        caption: item.caption,
        tags,
        rawTags: item.tags,
        targetTopicName: item.topik,
        targetTopicId: item.topikId,
        directTelegramUrl: sanitizeTelegramUrl(DEFAULT_CHAT_ID, item.topikId, item.msgId),
        rawRowIndex: idx + 2,
      };
    }).reverse();
  }

  async getFiles(filter?: FileFilter): Promise<PaginatedResult<FileItem>> {
    let result = [...this.files];

    if (filter) {
      if (filter.query) {
        const q = filter.query.toLowerCase();
        result = result.filter(
          (f) =>
            f.caption.toLowerCase().includes(q) ||
            f.rawTags.toLowerCase().includes(q) ||
            f.sender.toLowerCase().includes(q) ||
            f.mediaType.toLowerCase().includes(q)
        );
      }
      if (filter.mediaType && filter.mediaType !== "ALL") {
        result = result.filter((f) => f.mediaType === filter.mediaType);
      }
      if (filter.tag) {
        const targetTag = filter.tag.startsWith("#") ? filter.tag : `#${filter.tag}`;
        result = result.filter((f) =>
          f.tags.some((t) => t.toLowerCase() === targetTag.toLowerCase())
        );
      }
    }

    const total = result.length;
    const limit = filter?.limit || 50;
    const offset = filter?.offset || 0;
    const paginated = result.slice(offset, offset + limit);

    return {
      data: paginated,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  async getFileById(id: string): Promise<FileItem | null> {
    return this.files.find((f) => f.id === id) || null;
  }

  async getTags(): Promise<TagCount[]> {
    const tagMap = new Map<string, number>();

    this.files.forEach((file) => {
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
    const defaultChatId = process.env.TELEGRAM_CHAT_ID || DEFAULT_CHAT_ID;
    const directTelegramUrl = sanitizeTelegramUrl(
      defaultChatId,
      dto.targetTopicId,
      dto.telegramMessageId
    );

    const now = new Date();
    const formattedDate =
      dto.uploadTime ||
      `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

    const tags =
      dto.rawTags && dto.rawTags !== "-"
        ? dto.rawTags.split(/\s+/).filter((t) => t.startsWith("#"))
        : [];

    const newFile: FileItem = {
      id: `file-${Date.now()}-${dto.telegramMessageId}`,
      uploadTime: formattedDate,
      telegramMessageId: dto.telegramMessageId,
      sender: dto.sender,
      mediaType: dto.mediaType,
      caption: dto.caption,
      tags,
      rawTags: dto.rawTags,
      targetTopicName: dto.targetTopicName,
      targetTopicId: dto.targetTopicId,
      directTelegramUrl,
    };

    this.files.unshift(newFile);
    return newFile;
  }
}
