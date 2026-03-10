"use client";

import { useTranslation } from "@/hooks/useTranslation";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

/**
 * 四个视频放在 public/video/prodotti/ 下，命名为：
 * - inverter-fotovoltaici.mp4  (Inverter Fotovoltaici)
 * - sistemi-accumulo.mp4       (Sistemi di Accumulo)
 * - ricarica-ev.mp4            (Ricarica per Veicoli Elettrici)
 * - pompe-calore.mp4           (Pompe di Calore)
 */
const VIDEO_SLUGS = [
  "inverter-fotovoltaici",
  "sistemi-accumulo",
  "ricarica-ev",
  "pompe-calore",
] as const;

const TAB_KEYS = ["inverter", "accumulo", "ev", "pompe"] as const;

export type ProdottiVideoTabsProps = {
  activeIndex: number;
  onTabChange: (index: number) => void;
};

export default function ProdottiVideoTabs({ activeIndex, onTabChange }: ProdottiVideoTabsProps) {
  const { t } = useTranslation();

  const videoSrc = `/video/prodotti/${VIDEO_SLUGS[activeIndex]}.mp4`;

  return (
    <RevealOnScroll>
      <div className="mt-10 md:mt-14">
        {/* 四个并列小标题，点击切换，当前项加粗 */}
        <div
          className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:gap-x-6 lg:gap-x-8 mb-6"
          role="tablist"
          aria-label="Video per categoria prodotto"
        >
          {TAB_KEYS.map((key, index) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              onClick={() => onTabChange(index)}
              className={`
                text-sm md:text-base lg:text-lg text-gray-700 transition-colors duration-200
                hover:text-gray-900
                ${activeIndex === index ? "font-bold text-gray-900" : "font-normal"}
              `}
            >
              {t(`home.productsSection.videoTabs.${key}`)}
            </button>
          ))}
        </div>

        {/* 视频随选中项切换 */}
        <div className="relative w-full overflow-hidden bg-black rounded-none shadow-lg ring-1 ring-black/10 aspect-video max-h-[30.4vh]">
          <video
            key={videoSrc}
            className="absolute inset-0 w-full h-full object-cover"
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={t(`home.productsSection.videoTabs.${TAB_KEYS[activeIndex]}`)}
          />
        </div>
      </div>
    </RevealOnScroll>
  );
}
