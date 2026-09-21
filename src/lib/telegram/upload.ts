import { MediaType } from "@/types/file-item";

export interface TelegramUploadResult {
  success: boolean;
  messageId?: number;
  fileId?: string;
  topicId?: number;
  error?: string;
}

export interface SendTelegramOptions {
  file: File | Blob;
  fileName?: string;
  mediaType: MediaType;
  caption?: string;
  topicId?: number;
}

export function getDefaultTopicId(mediaType: MediaType): number {
  switch (mediaType) {
    case "PHOTO":
      return 4;
    case "VIDEO":
      return 5;
    case "AUDIO":
      return 6;
    case "DOCUMENT":
    default:
      return 3;
  }
}

export function getTopicName(topicId: number): string {
  switch (topicId) {
    case 4:
      return "Foto";
    case 5:
      return "Video";
    case 6:
      return "Audio";
    case 3:
      return "Dokumen";
    default:
      return `Topik ${topicId}`;
  }
}

/**
 * Uploads a file directly to Telegram Supergroup via Telegram Bot API
 */
export async function sendFileToTelegram(
  options: SendTelegramOptions
): Promise<TelegramUploadResult> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || "-1004392765044";

  if (!botToken || botToken.trim() === "" || botToken.includes("placeholder")) {
    return {
      success: false,
      error:
        "Bot token belum dikonfigurasi. Harap tambahkan TELEGRAM_BOT_TOKEN ke file .env.local (dari @PetugasData_Bot)",
    };
  }

  const topicId = options.topicId || getDefaultTopicId(options.mediaType);

  let endpoint = "sendDocument";
  let fieldName = "document";

  switch (options.mediaType) {
    case "PHOTO":
      endpoint = "sendPhoto";
      fieldName = "photo";
      break;
    case "VIDEO":
      endpoint = "sendVideo";
      fieldName = "video";
      break;
    case "AUDIO":
      endpoint = "sendAudio";
      fieldName = "audio";
      break;
    case "DOCUMENT":
    default:
      endpoint = "sendDocument";
      fieldName = "document";
      break;
  }

  try {
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("message_thread_id", String(topicId));

    if (options.caption && options.caption.trim()) {
      formData.append("caption", options.caption.trim());
    }

    if (options.fileName) {
      formData.append(fieldName, options.file, options.fileName);
    } else {
      formData.append(fieldName, options.file);
    }

    const apiUrl = `https://api.telegram.org/bot${botToken.trim()}/${endpoint}`;

    const res = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      return {
        success: false,
        error:
          data.description || `Telegram API Error: status code ${res.status}`,
      };
    }

    const result = data.result;
    const messageId = result.message_id;

    // Extract file_id depending on media type
    let fileId: string | undefined;
    if (result.photo && Array.isArray(result.photo)) {
      const highestRes = result.photo[result.photo.length - 1];
      fileId = highestRes?.file_id;
    } else if (result.video) {
      fileId = result.video.file_id;
    } else if (result.audio) {
      fileId = result.audio.file_id;
    } else if (result.document) {
      fileId = result.document.file_id;
    }

    return {
      success: true,
      messageId,
      fileId,
      topicId,
    };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Gagal mengunggah file ke Telegram";
    return {
      success: false,
      error: errorMessage,
    };
  }
}
