import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const loginAttempts = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000
  const maxAttempts = 5

  const record = loginAttempts.get(ip)

  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (record.count >= maxAttempts) {
    return false
  }

  record.count++
  return true
}

export async function middleware(req: NextRequest) {
  const isLoginEndpoint =
    req.nextUrl.pathname === "/api/auth/callback/credentials" &&
    req.method === "POST"

  if (isLoginEndpoint) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() // ← corregido
      ?? req.headers.get("x-real-ip")
      ?? "anonymous"

    const allowed = checkRateLimit(ip)

    if (!allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos. Espera un minuto." },
        { status: 429 }
      )
    }
  }

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = req.nextUrl.pathname === "/login";

  const protectedApiPrefixes = [
    "/api/products", "/api/categories", "/api/contact",
    "/api/locations", "/api/schedule", "/api/theme",
    "/api/promotions", "/api/announcements", "/api/blog"
  ];

  const isProtectedApi = protectedApiPrefixes.some(p =>
    req.nextUrl.pathname.startsWith(p)
  );

  const isWriteMethod = ["POST", "PUT", "DELETE"].includes(req.method);

  if (isProtectedApi && isWriteMethod && !token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/api/auth/callback/credentials", // ← agregado
    "/api/products/:path*",
    "/api/categories/:path*",
    "/api/contact/:path*",
    "/api/locations/:path*",
    "/api/schedule/:path*",
    "/api/theme/:path*",
    "/api/announcements/:path*",
    "/api/promotions/:path*",
    "/api/blog/:path*",
  ],
};