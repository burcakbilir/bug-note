import jwt from "jsonwebtoken";

import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "bug_note_session";

export function proxy(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (request.nextUrl.pathname.startsWith("/dashboard") && !hasSession) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
