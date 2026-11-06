import Image from "next/image";

type Props = {
  name: string;
  bio: string;
  hobbies: string[];
  image: string;
};

// 배경(크림 → 살구)과 어울리게 채도를 낮춘 색 조합 (바탕 + 글자색)
const CHIP_TONES = [
  "bg-[#e3e9ef]/70 text-[#4f6476]", // 더스티 블루
  "bg-[#f6dccd]/75 text-[#a5583a]", // 테라코타
  "bg-[#e1e8d9]/75 text-[#5c7350]", // 세이지
  "bg-[#f3dde0]/75 text-[#9a5866]", // 더스티 로즈
  "bg-[#ecdbe2]/75 text-[#7b3f55]", // 와인
  "bg-[#ecdfd2]/80 text-[#6f4e37]", // 커피
];

export default function ProfileHeader({ name, bio, hobbies, image }: Props) {
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
      <p className="mt-3 break-keep text-[14px] leading-relaxed text-foreground/65 sm:text-[15px]">{bio}</p>

      <ul aria-label="취미" className="mt-5 flex flex-wrap justify-center gap-1.5 sm:gap-2">
        {hobbies.map((hobby, i) => (
          // 채도를 낮춘 흙빛 톤을 돌아가며 쓰고, 마우스를 올리면 살짝 떠오른다
          <li
            key={hobby}
            className={`cursor-default rounded-full border border-white/70 px-2.5 py-1 text-[12px] font-medium tracking-tight shadow-[0_3px_10px_-6px_rgb(120_72_44/0.3)] backdrop-blur-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_6px_14px_-6px_rgb(120_72_44/0.4)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:px-3 sm:text-[13px] ${CHIP_TONES[i % CHIP_TONES.length]}`}
          >
            {hobby}
          </li>
        ))}
      </ul>
    </header>
  );
}
