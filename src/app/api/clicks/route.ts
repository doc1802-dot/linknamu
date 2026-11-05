import { connection } from "next/server";
import { profile } from "@/data/profile";
import { getClickCounts } from "@/lib/mongodb";

// 모든 링크의 현재 클릭 수를 한 번에 돌려준다. 예: { "counts": { "github": 42, ... } }
export async function GET() {
  // 빌드 때 미리 만들어 두지 않고 요청마다 최신 값을 읽는다.
  await connection();

  const counts = await getClickCounts(profile.links.map((link) => link.id));
  if (!counts) {
    return Response.json({ error: "클릭 수를 불러오지 못했습니다." }, { status: 503 });
  }
  return Response.json({ counts }, { headers: { "Cache-Control": "no-store" } });
}
