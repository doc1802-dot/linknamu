import Image from "next/image";

type Props = {
  name: string;
  bio: string;
  image: string;
};

export default function ProfileHeader({ name, bio, image }: Props) {
  return (
    <header className="flex flex-col items-center text-center">
      <div className="rounded-full bg-white/70 p-1.5 shadow-[0_18px_40px_-14px_rgb(120_72_44/0.45),0_2px_6px_rgb(120_72_44/0.08)] ring-1 ring-white/80">
        <Image
          src={image}
          alt={`${name} 프로필 사진`}
          width={160}
          height={160}
          priority
          unoptimized
          className="h-32 w-32 rounded-full object-cover sm:h-36 sm:w-36"
        />
      </div>
      {/* 자간을 넓히면 마지막 글자 뒤에도 간격이 생겨 왼쪽에 같은 만큼 더해 가운데를 맞춘다 */}
      <h1 className="mt-7 pl-[0.2em] text-2xl font-bold tracking-[0.2em]">{name}</h1>
      <p className="mt-3 whitespace-pre-line break-keep text-[14px] leading-relaxed sm:text-[15px] text-foreground/65">
        {bio}
      </p>
    </header>
  );
}
