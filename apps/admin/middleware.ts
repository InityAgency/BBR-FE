import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("userLoggedIn");
  const url = request.nextUrl.clone();

  if (!isLoggedIn) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url); 
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/profile", "/settings"]
};
