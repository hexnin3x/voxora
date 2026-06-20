import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Protect all dashboard routes
  if (path.startsWith("/dashboards")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    try {
      verifyToken(token);
    } catch {
      // Invalid/expired token: clear cookie and redirect to login page
      const res = NextResponse.redirect(new URL("/login", req.nextUrl));
      res.cookies.delete("token");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboards/:path*"],
};
