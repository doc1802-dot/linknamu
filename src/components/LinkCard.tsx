import GitHubIcon from "@/components/GitHubIcon";
import type { LinkItem } from "@/data/profile";

export default function LinkCard({ link }: { link: LinkItem }) {
  return (
    <a
      href={`/go/${link.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/70 bg-white/45 px-6 py-[1.125rem] text-[15px] font-semibold shadow-[0_8px_24px_-12px_rgb(120_72_44/0.3)] backdrop-blur-md transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/65 hover:shadow-[0_12px_28px_-12px_rgb(120_72_44/0.38)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/60 active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {link.icon === "github" && <GitHubIcon className="h-5 w-5 shrink-0" />}
      {link.icon && link.icon !== "github" && (
        // 공식 앱 아이콘 이미지 (public/icons/)
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/icons/${link.icon}.png`} alt="" aria-hidden="true" width={20} height={20} className="h-5 w-5 shrink-0 rounded-[5px]" />
      )}
      {!link.icon && link.emoji && (
        <span aria-hidden="true" className="text-lg leading-none">
          {link.emoji}
        </span>
      )}
      <span>{link.title}</span>
    </a>
  );
}
