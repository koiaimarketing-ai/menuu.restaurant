export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/jakarta.png"
        alt=""
        className="h-full w-full object-cover object-[72%_center] md:object-[80%_center]"
      />
      {/* readability gradient on the left only, kept light so the monument stays visible */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FBF5EE]/90 via-[#FBF5EE]/20 to-transparent" />
      {/* warm coral ambient glow, top-right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 86% 6%, rgba(243,197,186,0.55) 0%, rgba(243,197,186,0.2) 22%, rgba(243,197,186,0) 48%)",
        }}
      />
    </div>
  );
}
