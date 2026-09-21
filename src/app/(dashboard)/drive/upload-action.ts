"use server";

import { revalidatePath } from "next/cache";
import { getFileRepository } from "@/lib/repositories/factory";
import {
  sendFileToTelegram,
  getDefaultTopicId,
  getTopicName,
} from "@/lib/telegram/upload";
import { MediaType } from "@/types/file-item";
import { requireAdmin } from "@/lib/auth/admin";

export interface UploadActionResult {
  success: boolean;
  message?: string;
  error?: string;
  fileId?: string;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB Telegram Bot API limit

export async function uploadFileToDriveAction(
  formData: FormData
): Promise<UploadActionResult> {
  try {
    await requireAdmin();
    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
      return { success: false, error: "Pilih file yang valid untuk diunggah." };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "Ukuran file melebihi batas 50 MB Telegram Bot API.",
      };
    }

    const rawCaption = (formData.get("caption") as string) || "";
    const rawTagsInput = (formData.get("tags") as string) || "";
    const customTopicId = Number(formData.get("topicId")) || 0;
    const sender = (formData.get("sender") as string) || "Web Upload";
    let requestedMediaType = (formData.get("mediaType") as string) || "";

    // Auto-detect MediaType if not explicitly set
    let mediaType: MediaType = "DOCUMENT";
    if (
      requestedMediaType &&
      ["PHOTO", "VIDEO", "AUDIO", "DOCUMENT"].includes(
        requestedMediaType.toUpperCase()
      )
    ) {
      mediaType = requestedMediaType.toUpperCase() as MediaType;
    } else {
      const mime = file.type.toLowerCase();
      if (mime.startsWith("image/")) {
        mediaType = "PHOTO";
      } else if (mime.startsWith("video/")) {
        mediaType = "VIDEO";
      } else if (mime.startsWith("audio/")) {
        mediaType = "AUDIO";
      } else {
        mediaType = "DOCUMENT";
      }
    }

    // Resolve topic
    const topicId =
      customTopicId > 0 ? customTopicId : getDefaultTopicId(mediaType);
    const topicName = getTopicName(topicId);

    // Format tags cleanly (e.g. "arsip, bukti" -> "#arsip #bukti")
    let formattedTags = "-";
    if (rawTagsInput.trim()) {
      const cleaned = rawTagsInput
        .split(/[,\s]+/)
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => (t.startsWith("#") ? t : `#${t}`))
        .join(" ");
      if (cleaned) {
        formattedTags = cleaned;
      }
    }

    // Combine caption and tags for Telegram
    let telegramCaption = rawCaption.trim() || file.name;
    if (formattedTags !== "-") {
      telegramCaption = `${telegramCaption}\n\n${formattedTags}`;
    }

    // 1. Send file directly to Telegram Supergroup topic
    const telegramRes = await sendFileToTelegram({
      file,
      fileName: file.name,
      mediaType,
      caption: telegramCaption,
      topicId,
    });

    if (!telegramRes.success || !telegramRes.messageId) {
      return {
        success: false,
        error: telegramRes.error || "Gagal mengirim file ke Telegram.",
      };
    }

    // 2. Record metadata in Google Sheets PetugasData
    const fileRepo = getFileRepository();
    const created = await fileRepo.createFile({
      telegramMessageId: telegramRes.messageId,
      sender,
      mediaType,
      caption: rawCaption.trim() || file.name,
      rawTags: formattedTags,
      targetTopicName: topicName,
      targetTopicId: topicId,
    });

    // 3. Revalidate pages
    revalidatePath("/drive");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `File "${file.name}" berhasil diunggah ke Telegram (Topik: ${topicName}) dan dicatat di Sikavi Drive.`,
      fileId: created.id,
    };
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "Terjadi kesalahan saat mengunggah";
    return {
      success: false,
      error: errorMsg,
    };
  }
}
