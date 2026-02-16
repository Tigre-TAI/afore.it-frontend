"use client";

import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumbs";
import SocialPressSidebar from "@/components/SocialPressSidebar";
import { useTranslation } from "@/hooks/useTranslation";
import HeroBackground from "@/components/ui/HeroBackground";
import YouTubeVideoWithTitle from "@/components/YouTubeVideoWithTitle";

const INITIAL_COUNT = 3;

const VIDEO_SECTIONS = [
  {
    key: "videoPromozionali",
    ids: ["RRuIujawV10", "FlUUu4nhiwg", "GWvVtcNlF14", "hSa9bP3kurw", "0uMYCGiLE0k", "I6Kja3E3xD4"],
  },
  {
    key: "guidaInstallazione",
    ids: ["NCfgxc0AKt8", "dpaZM14fJlI", "CjWHKN19tos", "E6VYgChgYYU", "eZYudho-y8g", "3RT4VIuicic", "ZqGaSdd-glw"],
  },
  {
    key: "panoramicaProdotto",
    ids: ["F6VvdYKuG4A"],
  },
  {
    key: "fiereEventi",
    ids: ["dBY-e6mFwOM", "gwUNQt8kcuU"],
  },
];

function VideoGrid({ videoIds }: { videoIds: readonly string[] }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const hasMore = videoIds.length > INITIAL_COUNT;
  const displayIds = hasMore && !expanded ? videoIds.slice(0, INITIAL_COUNT) : videoIds;

  return (
    <div className="space-y-6">
      {/* Mobile: horizontal scroll */}
      <div className="md:hidden overflow-x-auto snap-x snap-mandatory -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex gap-6">
          {displayIds.map((videoId) => (
            <div key={videoId} className="flex-shrink-0 min-w-[85%] sm:min-w-[75%] snap-center overflow-hidden">
              <YouTubeVideoWithTitle videoId={videoId} titleClassName="mt-3 text-sm font-medium text-[#4B5563]" />
            </div>
          ))}
        </div>
      </div>
      {/* Desktop: grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {displayIds.map((videoId) => (
          <div key={videoId} className="overflow-hidden">
            <YouTubeVideoWithTitle videoId={videoId} titleClassName="mt-3 text-sm font-medium text-[#4B5563]" />
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-sm font-semibold text-[#C01C20] hover:text-[#9a1619] transition-colors"
        >
          {expanded ? t("videoPage.showLess") : t("videoPage.showMore")}
        </button>
      )}
    </div>
  );
}

export default function VideoPage() {
  const { t } = useTranslation();

  return (
    <>
      <section className="relative -mt-[88px] pt-[88px]">
        <HeroBackground
          src="/image/heroes/video_hero.jpg"
          alt={t("videoPage.title")}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-white">
          <Breadcrumb
            theme="dark"
            items={[
              { label: t("common.breadcrumb.home"), href: "/" },
              { label: t("videoPage.title") },
            ]}
          />
          <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight break-words">
            {t("videoPage.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/85">
            {t("videoPage.subtitle")}
          </p>
        </div>
      </section>

      <section className="relative z-10 bg-[#F5F6F7] py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left: Video sections */}
            <div className="flex-1 min-w-0 pt-12 lg:pt-12">
              {VIDEO_SECTIONS.map((section) => (
                <div
                  key={section.key}
                  className="py-12 border-t border-slate-200/80 first:border-t-0 first:pt-0 first:mt-0"
                >
                  <h2 className="text-lg sm:text-xl font-semibold text-[#111827] mb-6 sm:mb-8 tracking-tight">
                    {t(`videoPage.${section.key}`)}
                  </h2>
                  <VideoGrid videoIds={section.ids} />
                </div>
              ))}
            </div>

            <SocialPressSidebar />
          </div>
        </div>
      </section>
    </>
  );
}
