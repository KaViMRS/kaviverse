import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isEmailAllowed } from "@/lib/utils/security";

export async function isAdminAuthenticated(): Promise<boolean> {
  const isMockMode =
    process.env.NODE_ENV !== "production" &&
    (process.env.DATA_SOURCE_PROVIDER === "mock" ||
      process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder"));

  if (isMockMode) {
    return Boolean((await cookies()).get("kaviverse-session")?.value);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return Boolean(user && isEmailAllowed(user.email));
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Akses tidak diizinkan.");
  }
}
