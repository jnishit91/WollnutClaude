// src/middleware.ts
// Auth middleware — protects dashboard, admin, and API routes

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Admin routes require ADMIN role
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/v1/admin")) {
      if (token?.role !== "ADMIN") {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "FORBIDDEN",
                message: "Admin access required",
              },
            },
            { status: 403 }
          );
        }
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // API routes return 401 JSON instead of redirecting
        if (pathname.startsWith("/api/v1/") && !token) {
          return false;
        }

        // Dashboard and admin routes require authentication
        if (
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/admin")
        ) {
          return !!token;
        }

        return true;
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/v1/:path*",
  ],
};
