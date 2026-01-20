import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow auth API routes and login page
  if (pathname.startsWith("/admin/api/auth") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  // For other admin routes, we let the layout handle auth via server component
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
