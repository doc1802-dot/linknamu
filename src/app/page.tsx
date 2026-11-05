import LinkList from "@/components/LinkList";
import ProfileHeader from "@/components/ProfileHeader";
import { profile } from "@/data/profile";

// wireframe.png 구조: 원형 프로필 사진 → 이름 → 한 줄 소개 → 링크 카드 목록
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-7 pt-16 pb-16 sm:pt-24">
      <ProfileHeader name={profile.name} bio={profile.bio} image={profile.image} />

      <nav aria-label="링크 목록" className="mt-12 w-full">
        <LinkList links={profile.links} />
      </nav>
    </main>
  );
}
