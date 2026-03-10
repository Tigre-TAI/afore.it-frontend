"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

type HeroProps = {
  title: string;
  badge?: string;
  cta?: string;
  ctaHref?: string;
  backgroundAlt?: string;
  /** 背景轮播图列表（绝对路径，例如 /image/heroes/hero_carousel_1.jpg） */
  backgroundImages?: string[];
  height?: "full" | "screen";
  /** 在 flex 容器内填满剩余高度（与 ScrollingBanner 组合为整屏时使用） */
  fillHeight?: boolean;
  textAlign?: "left" | "center" | "right";
  centerContent?: boolean;
};

export default function Hero({
  title,
  badge,
  cta,
  ctaHref = "/prodotti",
  backgroundAlt,
  backgroundImages,
  height = "full",
  fillHeight = false,
  textAlign = "center",
  centerContent = false,
}: HeroProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [heroRevealed, setHeroRevealed] = useState(false);

  // 如果没有显式传入，则回退到单张通用 Hero 图
  const images = backgroundImages && backgroundImages.length > 0
    ? backgroundImages
    : ["/image/heroes/hero_universal.jpg"];

  // 检测 reduced motion，用户偏好不动效时禁用轮播动画
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(reducedMotionQuery.matches);

    update();
    reducedMotionQuery.addEventListener("change", update);

    return () => {
      reducedMotionQuery.removeEventListener("change", update);
    };
  }, []);

  // 首屏内容顺序出现
  useEffect(() => {
    const t = requestAnimationFrame(() => setTimeout(() => setHeroRevealed(true), 80));
    return () => cancelAnimationFrame(t);
  }, []);

  // 简单淡入淡出轮播：仅在有多于一张图片且不偏好 reduced motion 时启用
  useEffect(() => {
    if (images.length <= 1) return;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length, prefersReducedMotion]);

  const textAlignClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  }[textAlign];

  const heightClass = fillHeight
    ? "flex-1 min-h-0"
    : height === "full"
      ? "min-h-[75vh] h-[75vh]"
      : "min-h-screen h-screen";

  return (
    <section className={`relative ${heightClass} w-full overflow-hidden ${!fillHeight ? "-mt-[88px]" : ""}`}>
      {/* Hero image — full section (same as original), no extra cropping */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {images.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={backgroundAlt || title}
            fill
            priority={index === 0}
            sizes="100vw"
            quality={85}
            className={`object-cover absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/35" />
      </div>

      {/* Text block: container width. pt-[176px] keeps badge/title/CTA below Navbar+Topbar (88px). No solid overlay — text on image. */}
      <div className="relative z-10 w-full pt-[176px]">
        <div
          className={`container pt-6 pb-6 sm:pt-8 sm:pb-8 lg:pt-10 lg:pb-10 ${
            heroRevealed ? "hero-revealed" : ""
          } ${centerContent ? "flex flex-col items-center text-center" : ""} ${!centerContent ? textAlignClass : ""}`}
        >
          {badge && (
            <div className="hero-reveal-item hero-reveal-delay-0 mb-3 sm:mb-4">
              <span className="inline-block px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 border border-white/30 rounded bg-white/10">
                {badge}
              </span>
            </div>
          )}
          <h1 className="hero-reveal-item hero-reveal-delay-1 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6 leading-[1.15] tracking-tight break-words [text-shadow:0_1px_2px_rgba(0,0,0,0.4),0_2px_8px_rgba(0,0,0,0.3)]">
            {title}
          </h1>
          {cta && (
            <div className="hero-reveal-item hero-reveal-delay-2">
              <Button href={ctaHref} variant="primaryInvert" trailingChevron>
                {cta}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Scroll hint, social, dots */}
      <div
        className={`relative z-10 h-full flex flex-col justify-end pointer-events-none ${
          centerContent ? "items-center" : ""
        }`}
      >
        {/* Scroll to explore — smooth scroll to next section */}
        <a
          href="#brand-short-video"
          className="hero-reveal-item hero-reveal-delay-3 absolute left-1/2 -translate-x-1/2 bottom-20 sm:bottom-24 flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors duration-200 pointer-events-auto"
          aria-label="Scroll to next section"
        >
          <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
          <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>

        {/* Social — bottom-right, subtle, not dominant */}
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 lg:bottom-10 lg:right-10 z-20 flex items-center gap-2 sm:gap-2.5 pointer-events-auto">
          {/* WhatsApp */}
          <a 
            href="https://wa.me/393513399999" 
            aria-label="WhatsApp"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="p-2 sm:p-2.5 rounded-full text-white/90 hover:text-white hover:bg-white/15 transition-all duration-200 border border-white/15"
          >
            <Image
              src="/image/social/social_whatsapp.svg"
              alt="WhatsApp"
              width={18}
              height={18}
              className="transition-opacity"
              unoptimized
              loading="lazy"
            />
          </a>
          
          {/* LinkedIn */}
          <a 
            href="https://it.linkedin.com/company/afore-italia" 
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="p-2 sm:p-2.5 rounded-full text-white/90 hover:text-white hover:bg-white/15 transition-all duration-200 border border-white/15"
          >
            <Image
              src="/image/social/social_linkedin.svg"
              alt="LinkedIn"
              width={18}
              height={18}
              className="transition-opacity"
              unoptimized
              loading="lazy"
            />
          </a>

          {/* Instagram */}
          <a 
            href="https://www.instagram.com/afore.italia/" 
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="p-2 sm:p-2.5 rounded-full text-white/90 hover:text-white hover:bg-white/15 transition-all duration-200 border border-white/15"
          >
            <Image
              src="/image/social/social_instagram.svg"
              alt="Instagram"
              width={18}
              height={18}
              className="transition-opacity"
              unoptimized
              loading="lazy"
            />
          </a>

          {/* YouTube */}
          <a 
            href="https://www.youtube.com/@aforeitalia" 
            aria-label="YouTube"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="p-2 sm:p-2.5 rounded-full text-white/90 hover:text-white hover:bg-white/15 transition-all duration-200 border border-white/15"
          >
            <Image
              src="/image/social/social_youtube.svg"
              alt="YouTube"
              width={18}
              height={18}
              className="transition-opacity"
              unoptimized
              loading="lazy"
            />
          </a>
        </div>

        {/* Carousel dots */}
        {images.length > 1 && (
          <div className="absolute left-1/2 bottom-6 -translate-x-1/2 flex gap-2 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`
                  w-2.5 h-2.5 rounded-full border border-white/70 transition-all duration-300
                  ${index === currentIndex ? "bg-white" : "bg-transparent opacity-60 hover:opacity-100"}
                `}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

