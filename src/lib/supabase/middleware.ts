import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasAdminRole } from "../utils/security";

function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }
  return response;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url = request.nextUrl.clone();
  const isAuthPath = url.pathname.startsWith("/login");
  const isProtectedPath =
    url.pathname === "/" ||
    url.pathname.startsWith("/dashboard") ||
    url.pathname.startsWith("/finance") ||
    url.pathname.startsWith("/drive") ||
    url.pathname.startsWith("/analytics") ||
    url.pathname.startsWith("/activity") ||
    url.pathname.startsWith("/bots") ||
    url.pathname.startsWith("/settings");

  // Local Dev Mock Auth Bypass (if running with placeholder Supabase credentials)
  const isMockMode =
    process.env.NODE_ENV !== "production" &&
    (process.env.DATA_SOURCE_PROVIDER === "mock" ||
      process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder"));

  if (isMockMode) {
    const mockAuthCookie = request.cookies.get("kaviverse-session")?.value;
    if (!mockAuthCookie && isProtectedPath) {
      url.pathname = "/login";
      return withSecurityHeaders(NextResponse.redirect(url));
    }
    if (mockAuthCookie && isAuthPath) {
      url.pathname = "/dashboard";
      return withSecurityHeaders(NextResponse.redirect(url));
    }
    if (url.pathname === "/") {
      url.pathname = "/dashboard";
      return withSecurityHeaders(NextResponse.redirect(url));
    }
    return withSecurityHeaders(supabaseResponse);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (
    process.env.NODE_ENV === "production" &&
    (!supabaseUrl ||
      !supabaseAnonKey ||
      supabaseUrl.includes("placeholder") ||
      supabaseAnonKey.includes("placeholder"))
  ) {
    return withSecurityHeaders(
      NextResponse.json(
        { error: "Authentication service is not configured." },
        { status: 503 }
      )
    );
  }

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options?: Parameters<typeof supabaseResponse.cookies.set>[2];
          }>
        ) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtectedPath) {
    url.pathname = "/login";
    return withSecurityHeaders(NextResponse.redirect(url));
  }

  if (user) {
    // Enforce admin allowlist
    if (!hasAdminRole(user)) {
      url.pathname = "/login";
      url.searchParams.set("error", "unauthorized_email");
      const redirectResponse = NextResponse.redirect(url);
      redirectResponse.cookies.delete("sb-access-token");
      redirectResponse.cookies.delete("sb-refresh-token");
      return withSecurityHeaders(redirectResponse);
    }

    if (isAuthPath) {
      url.pathname = "/dashboard";
      return withSecurityHeaders(NextResponse.redirect(url));
    }
  }

  if (url.pathname === "/") {
    url.pathname = "/dashboard";
    return withSecurityHeaders(NextResponse.redirect(url));
  }

  return withSecurityHeaders(supabaseResponse);
}
