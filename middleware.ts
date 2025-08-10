export { auth as middleware } from "@/auth";

import { auth } from "@/auth"; // NextAuth config wrapper
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const { pathname } = req.nextUrl;

  const protectedPaths = [
    /\/shipping-address/,
    /\/payment-method/,
    /\/profile/,
    /\/user\/(.*)/,
    /\/order\/(.*)/,
    /\/admin/,
  ];

  // Check if user is not authenticated and accessing protected path
  if (!req.auth && protectedPaths.some((p) => p.test(pathname))) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Check for session cart cookie
  if (!req.cookies.get("sessionCartId")) {
    const sessionCartId = crypto.randomUUID();
    const res = NextResponse.next();
    res.cookies.set("sessionCartId", sessionCartId, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
    return res;
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/shipping-address",
    "/payment-method",
    "/profile",
    "/user/:path*",
    "/order/:path*",
    "/admin/:path*",
    "/cart", // optional: ensure cart cookie on cart page
  ],
};
