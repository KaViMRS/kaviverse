"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { recordAuditEvent } from "@/lib/audit/repository";

function value(formData: FormData, name: string) {
  return String(formData.get(name) || "").trim();
}

export async function createUserAction(formData: FormData) {
  await requireAdmin();
  const email = value(formData, "email").toLowerCase();
  const password = value(formData, "password");

  if (!email || !password || password.length < 8) {
    return { error: "Email wajib diisi dan password minimal 8 karakter." };
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) return { error: error.message };
    await recordAuditEvent({
      category: "auth",
      action: "admin.created",
      status: "success",
      actorEmail: (await (await createClient()).auth.getUser()).data.user?.email,
      targetType: "user",
      targetId: data?.user?.id,
      metadata: { email },
    });
    revalidatePath("/settings");
    return { success: "Akun berhasil dibuat. Tambahkan email ini ke ALLOWED_ADMIN_EMAILS di Vercel." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal membuat akun." };
  }
}

export async function deleteUserAction(formData: FormData) {
  await requireAdmin();
  const userId = value(formData, "userId");
  if (!userId) return { error: "User tidak valid." };

  try {
    const current = await (await createClient()).auth.getUser();
    if (current.data.user?.id === userId) {
      return { error: "Akun yang sedang digunakan tidak dapat dihapus." };
    }

    const { error } = await createAdminClient().auth.admin.deleteUser(userId);
    if (error) return { error: error.message };
    await recordAuditEvent({
      category: "auth",
      action: "admin.deleted",
      status: "success",
      targetType: "user",
      targetId: userId,
    });
    revalidatePath("/settings");
    return { success: "Akun berhasil dihapus. Hapus emailnya juga dari ALLOWED_ADMIN_EMAILS di Vercel." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menghapus akun." };
  }
}

export async function resetUserPasswordAction(formData: FormData) {
  await requireAdmin();
  const userId = value(formData, "userId");
  const password = value(formData, "password");
  if (!userId || password.length < 8) {
    return { error: "User tidak valid atau password minimal 8 karakter." };
  }

  try {
    const { error } = await createAdminClient().auth.admin.updateUserById(userId, { password });
    if (error) return { error: error.message };
    await recordAuditEvent({
      category: "auth",
      action: "admin.password_reset",
      status: "success",
      targetType: "user",
      targetId: userId,
    });
    revalidatePath("/settings");
    return { success: "Password berhasil diubah." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal mengubah password." };
  }
}
