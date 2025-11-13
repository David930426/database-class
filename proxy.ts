import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

const protectedRoutes = ["/"];
const publicRoutes = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some((path) => pathname.startsWith(path));
  const isPublic = publicRoutes.includes(pathname);

  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  const isAuthenticated = !!session?.userId;

  console.log(session); // test
  console.log(session?.userId); // test

  if (isPublic && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.nextUrl))
  }

  if (isProtected && !session?.userId) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
    // FIX: Include the paths in the matcher so the middleware runs on them.
    // This matcher tells Next.js to run the middleware on the root (/) and the public pages,
    // while still excluding static assets and APIs.
    matcher: [
        /*
          This pattern explicitly matches the pages you want to manage:
          - / (The root page)
          - /login
          - /register
          - And any other path that is NOT an API or static asset
        */
        '/',
        '/login',
        '/register',
        '/dashboard/:path*', // Include other protected routes
    ],
};
