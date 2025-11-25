"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

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
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const idleCallbackRef = useRef<ReturnType<typeof setTimeout> | number | null>(null);

  // 初始视频 URL（静音）——只在需要时构建，避免多余字符串运算
  const videoUrl = shouldLoadVideo
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`
    : "";

  // 检测移动端与 reduced motion，优先渲染轻量海报图来收敛 LCP
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateFlags = () => {
      setIsMobile(mediaQuery.matches);
      setPrefersReducedMotion(reducedMotionQuery.matches);
    };

    updateFlags();
    mediaQuery.addEventListener("change", updateFlags);
    reducedMotionQuery.addEventListener("change", updateFlags);

    return () => {
      mediaQuery.removeEventListener("change", updateFlags);
      reducedMotionQuery.removeEventListener("change", updateFlags);
    };
  }, []);

  // 延迟加载 iframe：跳过移动端 & 减少首屏 JS，利用 requestIdleCallback 提升 LCP
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;
    if (shouldLoadVideo) return;

    const triggerLoad = () => setShouldLoadVideo(true);
    if ("requestIdleCallback" in window) {
      idleCallbackRef.current = (window as any).requestIdleCallback(triggerLoad, { timeout: 2000 });
    } else {
      idleCallbackRef.current = setTimeout(triggerLoad, 1500);
    }

    return () => {
      if (idleCallbackRef.current) {
        if ("cancelIdleCallback" in window) {
          (window as any).cancelIdleCallback(idleCallbackRef.current);
        } else {
          clearTimeout(idleCallbackRef.current);
        }
      }
    };
  }, [isMobile, prefersReducedMotion, shouldLoadVideo]);

  // 切换静音状态，使用 YouTube IFrame API
  const toggleMute = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const newMutedState = !isMuted;
      
      // 使用 postMessage 与 YouTube IFrame API 通信
      iframe.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: newMutedState ? "mute" : "unMute",
          args: [],
        }),
        "https://www.youtube.com"
      );
      
      setIsMuted(newMutedState);
    }
  };

  // 加载 YouTube IFrame API——仅在需要展示视频时才拉取，减小 INP/LCP 的阻塞脚本
  useEffect(() => {
    if (!shouldLoadVideo) return;
    if ((window as any).YT && (window as any).YT.Player) {
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.defer = true;
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
  }, [shouldLoadVideo]);

  const textAlignClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  }[textAlign];

  const heightClass = height === "full" ? "min-h-[70vh] h-[70vh]" : "h-screen";

  return (
    <section className={`relative ${heightClass} w-full overflow-hidden -mt-16`}>
      {/* 优先渲染轻量海报图片，确保 LCP 可快速绘制 */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Image
          src="/image/heroes/hero_universal.jpg"
          alt={backgroundAlt || title}
          fill
          priority
          sizes="100vw"
          className={`object-cover transition-opacity duration-500 ${
            isVideoReady ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* 延迟加载的 YouTube Video Background */}
        {shouldLoadVideo && (
          <iframe
            ref={iframeRef}
            id="youtube-player"
            className="absolute top-0 left-0 w-full h-full"
            src={videoUrl}
            title={backgroundAlt || title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsVideoReady(true)}
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
        )}

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

        {/* Social Media Icons and Sound Toggle Button - Always Visible */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 flex items-center gap-2 sm:gap-3">
          {/* WhatsApp */}
          <a 
            href="https://wa.me/393513399999" 
            aria-label="WhatsApp"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="p-2.5 sm:p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 active:bg-white/40 transition-all duration-200 shadow-lg border border-white/20"
          >
            <Image
              src="/image/social/social_whatsapp.svg"
              alt="WhatsApp"
              width={20}
              height={20}
              className="opacity-90 hover:opacity-100 transition-opacity"
              unoptimized
            />
          </a>
          
          {/* LinkedIn */}
          <a 
            href="https://it.linkedin.com/company/afore-italia" 
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="p-2.5 sm:p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 active:bg-white/40 transition-all duration-200 shadow-lg border border-white/20"
          >
            <Image
              src="/image/social/social_linkedin.svg"
              alt="LinkedIn"
              width={20}
              height={20}
              className="opacity-90 hover:opacity-100 transition-opacity"
              unoptimized
            />
          </a>
          
          {/* Sound Toggle Button */}
          <button
            onClick={toggleMute}
            className="p-3 sm:p-3.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 active:bg-white/40 transition-all duration-200 shadow-lg border border-white/20"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

