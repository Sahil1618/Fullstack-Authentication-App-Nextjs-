import { NextResponse, NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // All public paths that don't require authentication
  const isPublicPath =
    path === "/login" ||
    path === "/signup" ||
    path === "/verifyemail" ||
    path === "/forgot-password" ||
    path === "/reset-password";

  const token = request.cookies.get("token")?.value || "";

  // If user is logged in and tries to access login/signup, redirect to profile
  if (token && (path === "/login" || path === "/signup")) {
    return NextResponse.redirect(new URL("/profile", request.nextUrl));
  }

  // If user is not logged in and tries to access protected routes, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/profile",
    "/profile/:path*",
    "/login",
    "/signup",
    "/verifyemail",
    "/forgot-password",
    "/reset-password",
  ],
};
