import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";

// 관리자 페이지에 들어올 수 있는 유일한 구글 계정
export const ADMIN_EMAIL = "doc1802@gmail.com";

export const SESSION_COOKIE = "admin_session";
export const STATE_COOKIE = "oauth_state";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7일

type SessionPayload = { email: string; exp: number };

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET 환경 변수가 없거나 너무 짧습니다(32자 이상).");
  }
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function randomToken(): string {
  return randomBytes(32).toString("base64url");
}

// 서명된 세션 값 생성: base64url(JSON).서명
export function createSessionValue(email: string): string {
  const payload: SessionPayload = { email, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function verifySessionValue(value: string | undefined): SessionPayload | null {
  if (!value) return null;
  const [body, signature] = value.split(".");
  if (!body || !signature) return null;
  const expected = Buffer.from(sign(body));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload;
    if (payload.email !== ADMIN_EMAIL) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

// 요청 쿠키를 읽어 관리자로 로그인했는지 확인한다.
export async function getAdminSession(): Promise<SessionPayload | null> {
  // 만료 확인에 현재 시각을 쓰므로 미리 렌더링하지 않고 요청 때마다 계산한다.
  await connection();
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionValue(value);
}
