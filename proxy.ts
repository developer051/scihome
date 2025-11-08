import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const session = await auth();
  
  if (!session) {
    const url = new URL("/api/auth/signin", request.url);
    url.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

