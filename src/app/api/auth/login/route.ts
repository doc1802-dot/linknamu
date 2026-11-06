import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_EMAIL, STATE_COOKIE, randomToken } from "@/lib/admin-session";

// 구글 로그인 화면으로 보낸다. state 값으로 위조 요청(CSRF)을 막는다.
export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return new Response("GOOGLE_CLIENT_ID 환경 변수가 설정되지 않았습니다.", { status: 500 });
  }

  const state = randomToken();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${req.nextUrl.origin}/api/auth/callback`,
    response_type: "code",
    scope: "openid email",
    state,
    login_hint: ADMIN_EMAIL,
    prompt: "select_account",
  });

  const res = NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  res.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
