import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

const protectedRoutes = ["/", "/edit", "/addInventory", "/edit/password", "/edit/[inventoryId]"];
const publicRoutes = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isProtected = protectedRoutes.includes(pathname);
  const isPublic = publicRoutes.includes(pathname);

  const cookie = request.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  const isAuthenticated = !!session?.userId;

  // Check with console
  // console.log(session);
  // console.log(session?.userId);

  if (isPublic && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (isProtected && !session?.userId) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  // Use a more inclusive matcher that excludes static files and APIs
  // but includes all paths you might want to protect/redirect.
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
