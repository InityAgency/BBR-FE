// apps/admin/src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for API requests
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Authentication logic
  const isAuthPath = pathname.startsWith('/auth/');
  
  // For session-based auth, we need to check if we have the userLoggedIn cookie
  const userLoggedIn = request.cookies.get("userLoggedIn")?.value === 'true';
  const bbrSession = request.cookies.get("bbr-session")?.value;
  
  // Check if session exists and is valid
  const isLoggedIn = userLoggedIn && bbrSession;
  
  // Clone the URL to potentially redirect
  const url = request.nextUrl.clone();

  // If the user is not logged in or session is invalid and trying to access a protected route
  if (!isLoggedIn && !isAuthPath && pathname !== '/') {
    // Clear all auth-related cookies
    const response = NextResponse.redirect(url);
    response.cookies.delete("userLoggedIn");
    response.cookies.delete("bbr-session");
    
    url.pathname = "/auth/login"; 
    
    // Store the original URL to redirect back after login
    if (pathname !== '/') {
      url.searchParams.set('callbackUrl', pathname);
    }
    
    return response;
  }

  // If the user is logged in and trying to access an auth page, redirect to dashboard
  if (isLoggedIn && isAuthPath) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // For root path ("/"), redirect based on auth status
  if (pathname === '/') {
    url.pathname = isLoggedIn ? "/dashboard" : "/auth/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Only run middleware on these paths
export const config = {
  matcher: [
    // Protected routes
    "/dashboard/:path*",
    "/brands/:path*",
    "/rankings/:path*",
    "/residences/:path*",
    "/user-management/:path*",
    // Auth routes
    "/auth/:path*",
    // Root
    "/"
  ],
};