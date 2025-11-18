"use client";

import Image from "next/image";

export default function ScrollingBanner() {
  // Single canonical banner unit: [TEXT A] [BADGE 1] [BADGE 2] [TEXT B]
  const bannerUnit = (
    <div className="flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 whitespace-nowrap h-full flex-shrink-0">
      {/* TEXT A */}
      <span className="text-white font-black text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl flex-shrink-0">
        AFORE ITALIA - SITO UFFICIALE
      </span>
      
      {/* BADGE 1 */}
      <div className="flex items-center justify-center h-8 sm:h-9 md:h-10 lg:h-10 flex-shrink-0">
        <Image
          src="/image/badges/eupd_top_brand_italy_2025.png"
          alt="EUPD Top Brand Italy 2025"
          width={40}
          height={40}
          className="object-contain h-full w-auto"
          style={{ maxHeight: "100%" }}
          draggable={false}
          priority
        />
      </div>
      
      {/* BADGE 2 */}
      <div className="flex items-center justify-center h-8 sm:h-9 md:h-10 lg:h-10 flex-shrink-0">
        <Image
          src="/image/badges/eupd_top_innovation_italy_2025.png"
          alt="EUPD Top Innovation Italy 2025"
          width={40}
          height={40}
          className="object-contain h-full w-auto"
          style={{ maxHeight: "100%" }}
          draggable={false}
          priority
        />
      </div>
      
      {/* TEXT B */}
      <span className="text-white font-black text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl flex-shrink-0">
        SITO UFFICIALE - GARANZIA 10 ANNI
      </span>
    </div>
  );

  // Duplicate the unit multiple times for seamless scrolling
  // Each unit contains: TEXT A → badges → TEXT B
  const bannerUnits = Array(8).fill(null).map((_, i) => (
    <div key={i} className="flex-shrink-0">
      {bannerUnit}
    </div>
  ));

  return (
    <div
      className="w-full overflow-x-hidden relative"
      style={{ backgroundColor: "#c53030" }}
    >
      <div className="h-12 sm:h-14 md:h-16 flex items-center">
        <div className="flex items-center h-full animate-scroll" style={{ width: "max-content" }}>
          {/* First set of units */}
          {bannerUnits}
          {/* Duplicate for seamless loop */}
          {bannerUnits}
        </div>
      </div>
    </div>
  );
}
