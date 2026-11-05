"use client";

import { useEffect, useState } from "react";
import LinkCard from "@/components/LinkCard";
import type { LinkItem } from "@/data/profile";

type Counts = Record<string, number>;

// 링크 카드 목록. 처음에는 0회로 그리고, 클릭 수를 받아 오면 실제 값으로 바꾼다.
export default function LinkList({ links }: { links: LinkItem[] }) {
  const [counts, setCounts] = useState<Counts>({});

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/clicks", { signal: controller.signal, cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { counts?: Counts } | null) => {
        // 받아 오는 동안 누른 클릭(+1)이 덮어써지지 않도록 큰 값을 남긴다.
        if (data?.counts) {
          const fetched = data.counts;
          setCounts((prev) => {
            const next = { ...fetched };
            for (const [id, n] of Object.entries(prev)) next[id] = Math.max(next[id] ?? 0, n);
            return next;
          });
        }
      })
      .catch(() => {
        // 실패하면 0회 표시를 그대로 둔다.
      });
    return () => controller.abort();
  }, []);

  // 카드를 누르면 서버(/go/[id])가 1을 올리므로 화면에도 바로 반영한다.
  const handleClick = (id: string) => {
    setCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };

  return (
    <ul className="flex flex-col gap-4">
      {links.map((link) => (
        <li key={link.id}>
          <LinkCard link={link} count={counts[link.id] ?? 0} onClick={() => handleClick(link.id)} />
        </li>
      ))}
    </ul>
  );
}
