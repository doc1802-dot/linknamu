import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_EMAIL,
  SESSION_COOKIE,
  STATE_COOKIE,
  createSessionValue,
  sessionCookieOptions,
} from "@/lib/admin-session";

type IdTokenClaims = {
  iss?: string;
  aud?: string;
  exp?: number;
  email?: string;
  email_verified?: boolean;
};

function fail(req: NextRequest, reason: string) {
  const res = NextResponse.redirect(new URL(`/admin?error=${reason}`, req.nextUrl.origin));
  res.cookies.delete(STATE_COOKIE);
  return res;
}

// 구글이 돌려보낸 code를 토큰으로 바꾸고, 이메일이 관리자와 같을 때만 세션을 만든다.
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const savedState = req.cookies.get(STATE_COOKIE)?.value;

  if (!code || !state || !savedState || state !== savedState) {
    return fail(req, "state");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return fail(req, "config");

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${req.nextUrl.origin}/api/auth/callback`,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) return fail(req, "token");

  const { id_token: idToken } = (await tokenRes.json()) as { id_token?: string };
  if (!idToken) return fail(req, "token");

  // id_token은 구글 토큰 서버에서 TLS로 직접 받았으므로 서명 검증 없이 내용을 읽을 수 있다(OIDC 3.1.3.7).
  // 그래도 발급자·대상·만료·이메일은 모두 확인한다.
  let claims: IdTokenClaims;
  try {
    claims = JSON.parse(Buffer.from(idToken.split(".")[1], "base64url").toString());
  } catch {
    return fail(req, "token");
  }

  const validIssuer = claims.iss === "https://accounts.google.com" || claims.iss === "accounts.google.com";
  const notExpired = (claims.exp ?? 0) > Math.floor(Date.now() / 1000);
  if (!validIssuer || claims.aud !== clientId || !notExpired) return fail(req, "token");

  if (claims.email !== ADMIN_EMAIL || claims.email_verified !== true) {
    return fail(req, "forbidden");
  }

  const res = NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  res.cookies.delete(STATE_COOKIE);
  res.cookies.set(SESSION_COOKIE, createSessionValue(claims.email), sessionCookieOptions);
  return res;
}
