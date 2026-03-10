"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

const GAP_CLASS = "gap-3 sm:gap-4 md:gap-5 lg:gap-6";

export default function ScrollingBanner() {
  const { t } = useTranslation();
  const bannerText = t("home.bannerText");

  // One segment: 2 badges + text. Loop: [2 badges] [text] [2 badges] [text] … with same gap; padding on both sides.
  const badge1 = (
    <div className="flex items-center justify-center h-8 sm:h-9 md:h-10 lg:h-10 flex-shrink-0">
      <Image
        src="/image/badges/eupd_top_brand_italy_2025.png"
        alt="EUPD Top Brand Italy 2025"
        width={40}
        height={40}
        className="object-contain h-full w-auto"
        style={{ maxHeight: "100%" }}
        draggable={false}
        loading="lazy"
      />
    </div>
  );
  const badge2 = (
    <div className="flex items-center justify-center h-8 sm:h-9 md:h-10 lg:h-10 flex-shrink-0">
      <Image
        src="/image/badges/eupd_top_innovation_italy_2025.png"
        alt="EUPD Top Innovation Italy 2025"
        width={40}
        height={40}
        className="object-contain h-full w-auto"
        style={{ maxHeight: "100%" }}
        draggable={false}
        loading="lazy"
      />
    </div>
  );
  const textSpan = (
    <span className="text-white font-black text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl flex-shrink-0 whitespace-nowrap">
      {bannerText}
    </span>
  );

  // One repeating block: 2 badges + text
  const segment = (
    <>
      {badge1}
      {badge2}
      {textSpan}
    </>
  );

  const repeatCount = 8;
  const segments = Array(repeatCount).fill(null).map((_, i) => <span key={i} className="contents">{segment}</span>);

  return (
    <div
      className="w-full overflow-x-hidden relative flex-shrink-0"
      style={{ backgroundColor: "#c53030" }}
    >
      <div className="h-12 sm:h-14 md:h-16 flex items-center">
        <div
          className={`flex items-center h-full animate-scroll px-4 sm:px-6 md:px-8 lg:px-10 ${GAP_CLASS}`}
          style={{ width: "max-content" }}
        >
          {segments}
          {segments}
        </div>
      </div>
    </div>
  );
}
