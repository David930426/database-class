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

  // const isAuthenticated = !!session?.userId;

  console.log(session); // test
  console.log(session?.userId);

  // if (isPublic && isAuthenticated) {
  //   return NextResponse.redirect(new URL("/", request.nextUrl))
  // }

  if (isProtected && !session?.userId) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (
    isPublic &&
    session?.userId &&
    !request.nextUrl.pathname.startsWith("/")
  ) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  // This matcher is correct for targeting all application pages except /login and /register
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|register).*)"],
};
