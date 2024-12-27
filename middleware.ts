import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest, response: NextResponse) {
  const cookie = request.cookies.get("a");

  if (request.url?.includes("a=DcTcE9wSsKk8okrwk3fCxKnvMK3nQ4WGnfh23YKJauvV")) {
    const response = NextResponse.next();
    response.cookies.set("a", "1");
    return response;
  }

  if (cookie) {
    return NextResponse.next();
  } else if (
    request.url &&
    !request.url.includes(".") &&
    request.url !== new URL("/", request.url).toString()
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static/:file*|_next/image|favicon.ico|manifest.json).*)",
    "/:path*",
    "/mining/:path*",
    "/create/:path*",
    "/detail/:path*",
    "/profile/:path*",
    "/discover/:path*",
    "/trends/:path*"
  ]
};
