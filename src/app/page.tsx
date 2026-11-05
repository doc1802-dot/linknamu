import LinkCard from "@/components/LinkCard";
import ProfileHeader from "@/components/ProfileHeader";
import { profile } from "@/data/profile";

// wireframe.png 구조: 원형 프로필 사진 → 이름 → 한 줄 소개 → 링크 카드 목록
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center px-6 pt-14 pb-12 sm:pt-20">
      <ProfileHeader name={profile.name} bio={profile.bio} image={profile.image} />

      <nav aria-label="링크 목록" className="mt-10 w-full px-4">
        <ul className="flex flex-col gap-7">
          {profile.links.map((link) => (
            <li key={link.id}>
              <LinkCard link={link} />
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
