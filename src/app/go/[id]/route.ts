import type { NextRequest } from "next/server";
import { findLink } from "@/data/profile";
import { incrementClick } from "@/lib/mongodb";

// 링크 카드 클릭: 클릭 수를 기록한 뒤 실제 주소로 이동시킨다.
export async function GET(_req: NextRequest, ctx: RouteContext<"/go/[id]">) {
  const { id } = await ctx.params;
  const link = findLink(id);
  if (!link) {
    return new Response("링크를 찾을 수 없습니다.", { status: 404 });
  }

  await incrementClick(link.id);
  return Response.redirect(link.url, 302);
}
