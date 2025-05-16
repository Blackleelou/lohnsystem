import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.has("next-auth.session-token") || request.cookies.has("__Secure-next-auth.session-token");

  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isProtectedPage = ["/dashboard", "/profile", "/settings", "/auswertung"].some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/profile", "/settings", "/auswertung", "/login"],
};