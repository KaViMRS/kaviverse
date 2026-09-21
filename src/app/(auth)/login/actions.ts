"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isEmailAllowed } from "@/lib/utils/security";
import { createClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  // Verify email against admin allowlist
  if (!isEmailAllowed(email)) {
    return {
      error: "Akses ditolak. Email Anda tidak terdaftar dalam allowlist admin Kaviverse.",
    };
  }

  const isMockMode =
    process.env.NODE_ENV !== "production" &&
    (process.env.DATA_SOURCE_PROVIDER === "mock" ||
      process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder"));

  if (isMockMode) {
    // In local dev mock mode, set an HttpOnly session cookie
    const cookieStore = await cookies();
    cookieStore.set("kaviverse-session", JSON.stringify({ email, role: "ADMIN" }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    redirect("/dashboard");
  }

  // Live Supabase Auth
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message || "Gagal masuk. Periksa email dan password Anda." };
    }

    redirect("/dashboard");
  } catch (err: unknown) {
    // Re-throw next navigation redirects
    if (err && typeof err === "object" && "digest" in err) {
      throw err;
    }
    return { error: "Terjadi kesalahan saat memproses otentikasi." };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("kaviverse-session");
  cookieStore.delete("sb-access-token");
  cookieStore.delete("sb-refresh-token");

  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore if running without live Supabase
  }

  redirect("/login");
}
