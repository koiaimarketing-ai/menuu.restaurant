import Image from "next/image";
import type { CSSProperties } from "react";

/**
 * Featured food photo that sits INSIDE the same content column as the cards:
 *  • full grid width (never wider than the column → no horizontal overflow),
 *  • one consistent 16/9 ratio across every category,
 *  • object-fit: cover + object-position: center (no stretch / squash / crop drift),
 *  • the outer perimeter still dissolves softly into the cream page (::after).
 * Never use this for small product thumbnails.
 */
export function FeaturedImageBlend({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div
      className="featured-image-blend w-full min-w-0 overflow-hidden rounded-2xl"
      style={{ "--featured-image": `url("${src}")` } as CSSProperties}
    >
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1080px) 100vw, 900px"
          className="object-cover object-center"
        />
      </div>
    </div>
  );
}
