import { NextResponse } from "next/server";
import { getAdminBypassCookieName } from "../../../lib/auth";

export async function GET() {
  if (process.env.NODE_ENV === "production" || !process.env.ADMIN_BYPASS_TOKEN) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: getAdminBypassCookieName(),
    value: process.env.ADMIN_BYPASS_TOKEN,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
