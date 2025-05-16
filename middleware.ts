import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Beispiel: Setze Cookie "visited=true"
  response.cookies.set("visited", "true", { path: "/" });

  return response;
}

export const config = {
  matcher: ["/dashboard", "/profile", "/settings", "/auswertung"],
};