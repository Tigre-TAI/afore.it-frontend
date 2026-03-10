"use client";

/**
 * BrandShortVideo — 首页品牌短视频区块
 * 纯视频、窄边距、略低高度，上方叠三个关键词（高级感）
 * 视频文件放在：public/video/brand-short.mp4
 */

const DEFAULT_VIDEO_SRC = "/video/brand-short.mp4";

const KEYWORDS = ["Efficienza", "Responsabilità", "Innovazione"] as const;

export default function BrandShortVideo({
  videoSrc = DEFAULT_VIDEO_SRC,
}: {
  videoSrc?: string;
}) {
  return (
    <section
      id="brand-short-video"
      className="relative w-full -mt-16 pt-20 md:pt-24"
      aria-label="Brand short video"
    >
      {/* 与 navbar 同宽：container；直角：无圆角 */}
      <div className="container">
        <div className="relative w-full overflow-hidden bg-black shadow-xl ring-1 ring-black/10 rounded-none">
          <div className="relative w-full max-h-[30.4vh] aspect-video">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="Brand short video"
          />
          {/* 三个关键词 — 高级感：细字重、字间距、细分割线、轻微衬底 */}
          <div className="absolute inset-0 flex items-center justify-center gap-0 px-2">
            {KEYWORDS.map((word, i) => (
              <span key={word} className="contents">
                {i > 0 && (
                  <span className="w-px h-4 sm:h-5 bg-white/40 mx-2 sm:mx-3 md:mx-4 flex-shrink-0" aria-hidden />
                )}
                <span
                  className="text-white font-medium text-xs sm:text-sm md:text-base uppercase tracking-[0.25em] sm:tracking-[0.3em] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  style={{ textShadow: "0 0 24px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.9)" }}
                >
                  {word}
                </span>
              </span>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
