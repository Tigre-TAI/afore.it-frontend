"use client";

import { useState } from "react";
import Link from "next/link";

type HeroProps = {
  youtubeId: string;
  title: string;
  badge?: string;
  cta?: string;
  ctaHref?: string;
  backgroundAlt?: string;
  height?: "full" | "screen";
  textAlign?: "left" | "center" | "right";
  centerContent?: boolean;
};

export default function Hero({
  youtubeId,
  title,
  badge,
  cta,
  ctaHref = "/prodotti",
  backgroundAlt,
  height = "full",
  textAlign = "center",
  centerContent = false,
}: HeroProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const videoUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`;

  const textAlignClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  }[textAlign];

  const heightClass = height === "full" ? "min-h-[70vh] h-[70vh]" : "h-screen";

  return (
    <section className={`relative ${heightClass} w-full overflow-hidden -mt-16`}>
      {/* YouTube Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={videoUrl}
          title={backgroundAlt || title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            pointerEvents: "none",
            width: "100vw",
            height: "56.25vw",
            minHeight: "100%",
            minWidth: "177.77vh",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pb-16 lg:pt-24 lg:pb-24 ${
          centerContent ? "items-center" : ""
        } ${textAlignClass}`}
      >
        {/* Badge */}
        {badge && (
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-slate-900">
              {badge}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold text-white mb-4 sm:mb-6 leading-tight break-words">
          {title}
        </h1>

        {/* CTA Button */}
        {cta && (
          <div className="mt-4 sm:mt-6">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-brand-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-brand-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              {cta}
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14m-7-7l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        )}

        {/* Video Controls (optional, hidden by default) */}
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

