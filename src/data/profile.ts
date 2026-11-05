export type LinkItem = {
  id: string;
  title: string;
  url: string;
};

export type Profile = {
  name: string;
  bio: string;
  image: string;
  links: LinkItem[];
};

// 프로필과 링크 목록. 실제 정보로 바꿔서 사용한다.
// id는 클릭 수 집계 키로 쓰이므로 한번 정하면 바꾸지 않는다.
export const profile: Profile = {
  name: "김덕환",
  bio: "세계 최강 바이브코더",
  image: "/profile.svg",
  links: [
    { id: "github", title: "GitHub", url: "https://github.com/" },
    { id: "instagram", title: "Instagram", url: "https://www.instagram.com/" },
    { id: "blog", title: "블로그", url: "https://blog.naver.com/" },
  ],
};

export function findLink(id: string): LinkItem | undefined {
  return profile.links.find((link) => link.id === id);
}
