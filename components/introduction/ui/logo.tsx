import Image from "next/image";

/** Brand logo image. Shared by navbar + footer. */
export function Logo({ className = "w-[110px] sm:w-[120px] md:w-[135px]" }: { className?: string }) {
  return (
    <Image
      src="/images/introduction/logo.png"
      alt="Menuu"
      width={1339}
      height={244}
      priority
      className={`h-auto object-contain ${className}`}
    />
  );
}
