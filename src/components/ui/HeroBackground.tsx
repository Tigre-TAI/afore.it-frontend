import Image from "next/image";

type HeroBackgroundProps = {
  src: string;
  alt: string;
  /** Keep hero assets flagged as priority to stabilize LCP */
  priority?: boolean;
  /** Allow per-page overlay tweaks */
  overlayClassName?: string;
  sizes?: string;
};

export default function HeroBackground({
  src,
  alt,
  priority = true,
  overlayClassName = "bg-black/50",
  sizes = "100vw",
}: HeroBackgroundProps) {
  return (
    <div className="absolute inset-0">
      {/* next/image keeps hero background responsive + cached, so it consistently becomes a fast LCP element */}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
      <div className={`absolute inset-0 ${overlayClassName}`} aria-hidden />
    </div>
  );
}



