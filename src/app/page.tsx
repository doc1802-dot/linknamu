import Link from "next/link";
import LinkCard from "@/components/LinkCard";
import ProfileHeader from "@/components/ProfileHeader";
import { profile } from "@/data/profile";

// wireframe.png 구조: 원형 프로필 사진 → 이름 → 한 줄 소개 → 링크 카드 목록
export default function Home() {
  return (
    <>
      <Link
        href="/admin"
        className="fixed top-4 right-4 z-10 rounded-full border border-white/70 bg-white/40 px-3.5 py-1.5 text-xs font-medium text-foreground/60 backdrop-blur-md transition hover:bg-white/65 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/60 sm:top-5 sm:right-5"
      >
        관리자
      </Link>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-7 pt-16 pb-16 sm:pt-24">
        <ProfileHeader name={profile.name} bio={profile.bio} hobbies={profile.hobbies} image={profile.image} nameLink={profile.nameLink} />

        <nav aria-label="링크 목록" className="mt-12 w-full">
          <ul className="flex flex-col gap-4">
            {profile.links.map((link) => (
              <li key={link.id}>
                <LinkCard link={link} />
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </>
  );
}
