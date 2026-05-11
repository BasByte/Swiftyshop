import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/src/lib/auth";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  let user = null;

  if (session) {
    try {
      user = await decrypt(session);
    } catch (e) {
      // invalid token
    }
  }

  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (user.role === "customer") {
      // Customers cannot access admin panel
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Role-based access control inside admin
    if (pathname.startsWith("/admin/users") && user.role !== "admin") {
       return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Redirect signed in users away from auth pages
  if (user && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register"],
};
