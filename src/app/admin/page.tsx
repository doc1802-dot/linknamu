import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { allLinks } from "@/data/profile";
import { ADMIN_EMAIL, getAdminSession } from "@/lib/admin-session";
import { getClickStats } from "@/lib/mongodb";

export const metadata: Metadata = {
  title: "관리자 | 링크나무",
  robots: { index: false, follow: false },
};

const ERROR_MESSAGES: Record<string, string> = {
  forbidden: `관리자 계정(${ADMIN_EMAIL})으로만 들어올 수 있습니다.`,
  state: "로그인 요청이 만료되었거나 올바르지 않습니다. 다시 시도해 주세요.",
  token: "구글 로그인 확인에 실패했습니다. 다시 시도해 주세요.",
  config: "서버에 구글 로그인 설정이 없습니다.",
};

const panel =
  "w-full rounded-2xl border border-white/70 bg-white/45 p-6 shadow-[0_8px_24px_-12px_rgb(120_72_44/0.3)] backdrop-blur-md";

export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-7 pt-16 pb-16 sm:pt-24">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-bold">관리자</h1>
        <Link href="/" className="text-sm text-foreground/60 hover:text-foreground">
          ← 메인으로
        </Link>
      </div>
      <Suspense fallback={<div className={`${panel} text-sm text-foreground/60`}>확인하는 중…</div>}>
        <AdminContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function AdminContent({ searchParams }: Pick<PageProps<"/admin">, "searchParams">) {
  const session = await getAdminSession();

  if (!session) {
    const { error } = await searchParams;
    const message = typeof error === "string" ? ERROR_MESSAGES[error] : undefined;
    return (
      <div className={`${panel} flex flex-col items-center gap-5 text-center`}>
        <p className="text-sm leading-relaxed text-foreground/70">
          관리자 페이지는 구글 계정으로 로그인한 뒤
          <br />
          허용된 계정만 볼 수 있습니다.
        </p>
        {message && (
          <p role="alert" className="w-full rounded-xl bg-red-50/80 px-4 py-3 text-sm text-red-700">
            {message}
          </p>
        )}
        {/* 라우트 핸들러로 이동하므로 프리페치되지 않는 일반 a 태그를 쓴다 */}
        <a
          href="/api/auth/login"
          className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/80 bg-white/80 px-5 py-3 text-[15px] font-semibold shadow-sm transition hover:bg-white"
        >
          <GoogleMark />
          Google로 로그인
        </a>
      </div>
    );
  }

  const stats = await getClickStats(allLinks.map((link) => link.id));
  const total = stats ? Object.values(stats).reduce((sum, s) => sum + s.count, 0) : 0;
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  });

  return (
    <div className="flex flex-col gap-5">
      <section className={panel}>
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold text-foreground/70">링크 클릭 수</h2>
          <p className="text-sm text-foreground/60">
            합계 <span className="font-bold tabular-nums text-foreground">{total.toLocaleString("ko-KR")}</span>회
          </p>
        </div>

        {stats ? (
          <ul className="mt-4 divide-y divide-foreground/10">
            {allLinks.map((link) => {
              const stat = stats[link.id];
              return (
                <li key={link.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="font-semibold">{link.title}</p>
                    <p className="truncate text-xs text-foreground/50">
                      {stat.updatedAt ? `마지막 클릭 ${formatter.format(stat.updatedAt)}` : "아직 클릭 없음"}
                    </p>
                  </div>
                  <p className="shrink-0 text-lg font-bold tabular-nums">
                    {stat.count.toLocaleString("ko-KR")}
                    <span className="ml-0.5 text-sm font-medium text-foreground/60">회</span>
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-red-700">클릭 수를 불러오지 못했습니다. DB 연결 설정을 확인해 주세요.</p>
        )}
      </section>

      <div className="flex items-center justify-between text-sm text-foreground/60">
        <span>{session.email}</span>
        <form action="/api/auth/logout" method="post">
          <button type="submit" className="underline-offset-4 hover:text-foreground hover:underline">
            로그아웃
          </button>
        </form>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-5 w-5">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
