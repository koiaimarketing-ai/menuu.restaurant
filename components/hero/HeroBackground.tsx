import Image from "next/image";

export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* night storefront photo — subtle backdrop */}
      <Image
        src="/images/hero-night.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* light blue-white overlay so the hero text stays readable (kept strong) */}
      <div className="absolute inset-0 bg-[#f8f9fc]/70" />
      {/* extra readability fade on the left where the text sits */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#f8f9fc]/92 via-[#f8f9fc]/45 to-transparent" />
      {/* accent-blue ambient glow, top-right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 86% 6%, rgba(106,147,241,0.35) 0%, rgba(106,147,241,0.14) 22%, rgba(106,147,241,0) 48%)",
        }}
      />
    </div>
  );
}
