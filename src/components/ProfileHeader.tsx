import Image from "next/image";

type Props = {
  name: string;
  bio: string;
  image: string;
};

export default function ProfileHeader({ name, bio, image }: Props) {
  return (
    <header className="flex flex-col items-center text-center">
      <Image
        src={image}
        alt={`${name} 프로필 사진`}
        width={192}
        height={192}
        priority
        unoptimized
        className="h-48 w-48 rounded-full border-2 border-foreground/80 object-cover"
      />
      <h1 className="mt-10 text-lg font-semibold tracking-[0.2em]">{name}</h1>
      <p className="mt-2 text-base text-foreground/80">{bio}</p>
    </header>
  );
}
