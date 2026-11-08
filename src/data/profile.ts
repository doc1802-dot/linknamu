export type LinkItem = {
  id: string;
  title: string;
  url: string;
  emoji?: string;
  // emoji 대신 보여줄 공식 로고 아이콘
  // github은 SVG, 나머지는 public/icons/<이름>.png
  icon?: "github" | "naver-blog" | "brunch";
};

export type Profile = {
  name: string;
  bio: string;
  hobbies: string[];
  image: string;
  links: LinkItem[];
  // 링크 카드 목록과 별도로 이름 옆에 작은 아이콘으로 보여주는 링크
  nameLink?: LinkItem;
};

// 프로필과 링크 목록. 실제 정보로 바꿔서 사용한다.
// id는 클릭 수 집계 키로 쓰이므로 한번 정하면 바꾸지 않는다.
export const profile: Profile = {
  name: "김덕환",
  bio: "살 빼려고 달리다가 코딩에 빠진 사람",
  hobbies: ["개발", "러닝", "자전거", "글쓰기", "와인", "커피"],
  image: "/profile-bike.jpg",
  links: [
    { id: "github", title: "깃허브", url: "https://github.com/doc1802-dot", icon: "github" },
    { id: "blog", title: "블로그", url: "https://blog.naver.com/doc1802", icon: "naver-blog" },
    { id: "brunch", title: "브런치", url: "https://brunch.co.kr/@doc1802", icon: "brunch" },
    { id: "email", title: "이메일", url: "https://mail.google.com/mail/?view=cm&fs=1&to=doc1802@gmail.com", emoji: "📧" },
  ],
  nameLink: { id: "todo", title: "할 일 목록", url: "https://todo-orci-alpha.vercel.app" },
};

// 클릭 수 집계 대상이 되는 모든 링크 (카드 목록 + 이름 옆 링크)
export const allLinks: LinkItem[] = profile.nameLink ? [...profile.links, profile.nameLink] : profile.links;

export function findLink(id: string): LinkItem | undefined {
  return allLinks.find((link) => link.id === id);
}
