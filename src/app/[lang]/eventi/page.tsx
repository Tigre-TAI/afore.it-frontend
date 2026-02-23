"use client";

/**
 * Eventi 页面 — /[lang]/eventi
 * Flat icons, Booth prominent, social share (Facebook, LinkedIn).
 */

import Button from "@/components/ui/Button";
import SocialPressSidebar from "@/components/SocialPressSidebar";
import { useTranslation } from "@/hooks/useTranslation";
import HeroBackground from "@/components/ui/HeroBackground";
import YouTubeVideoWithTitle from "@/components/YouTubeVideoWithTitle";

const FORM_URL = "https://forms.gle/49Qyti1tXG73CguQA";

function openShare(platform: "facebook" | "linkedin") {
  const url = encodeURIComponent(typeof window !== "undefined" ? window.location.href : "");
  const shareUrl = platform === "facebook"
    ? `https://www.facebook.com/sharer/sharer.php?u=${url}`
    : `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
}

const FlatIcons = {
  location: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
  target: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 17a5 5 0 100-10 5 5 0 000 10z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 13a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
  ),
  handshake: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h6a2.25 2.25 0 012.25 2.25v3.75m-13.5 9.75h3.75a2.25 2.25 0 002.25-2.25V15m3 0h3.75a2.25 2.25 0 002.25-2.25V15M3 12h.008v.008H3V12z" />
    </svg>
  ),
  package: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  sparkle: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  email: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  ),
  phone: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
  ),
  phoneOffice: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
  ),
};

function buildFormHref() {
  const utm = new URLSearchParams({
    utm_source: "eventi_page",
    utm_medium: "cta",
    utm_campaign: "event_booking",
  });
  const separator = FORM_URL.includes("?") ? "&" : "?";
  return `${FORM_URL}${separator}${utm.toString()}`;
}

export default function EventiPage() {
  const { t } = useTranslation();

  const expectations = [
    { icon: FlatIcons.target, textKey: "eventi.keyEnergy.expect1" },
    { icon: FlatIcons.handshake, textKey: "eventi.keyEnergy.expect2" },
    { icon: FlatIcons.package, textKey: "eventi.keyEnergy.expect3" },
    { icon: FlatIcons.sparkle, textKey: "eventi.keyEnergy.expect4" },
  ];

  return (
    <>
      {/* Hero — 跟 Garanzia 页面一样的结构 */}
      <section className="relative -mt-[88px] pt-[88px]">
        <HeroBackground src="/image/heroes/eventi_hero.jpg" alt="KEY ENERGY 2026 - Afore Italia" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-white">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight break-words">
            {t("eventi.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/85">
            {t("eventi.subtitle")}
          </p>
        </div>
      </section>

      {/* 主内容区 — event-hero hierarchy, calm spacing */}
      <section className="relative z-10 bg-[#F5F6F7] py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Main content — single column, event-hero flow */}
            <main className="flex-1 min-w-0 max-w-3xl">
              {/* 1. Title & identity */}
              <p className="text-lg sm:text-xl font-bold uppercase tracking-wider text-[#C01C20] mb-2">
                {t("eventi.keyEnergy.booth")}
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111827] tracking-tight mb-1">
                {t("eventi.keyEnergy.title")}
              </h2>
              <p className="text-base text-[#6B7280] mb-8">
                {t("eventi.keyEnergy.subtitle")}
              </p>

              {/* 2. KEY ENERGY 2026 video — container follows video aspect ratio, autoplay, no controls */}
              <div className="mb-10 overflow-hidden w-full">
                <video
                  className="block w-full h-auto"
                  playsInline
                  autoPlay
                  muted
                  loop
                  preload="auto"
                  poster="/image/events/keyenergy2026_hero.jpg"
                >
                  <source src="/videos/key-energy-2026.mp4" type="video/mp4" />
                  <source src="/videos/key-energy-2026.MOV" type="video/quicktime" />
                </video>
              </div>

              {/* 3. Key facts — date, location */}
              <div className="flex flex-wrap gap-x-8 gap-y-4 mb-10">
                <div className="flex items-center gap-2.5 text-[#4B5563]">
                  <span className="text-[#6B7280]" aria-hidden="true">
                    {FlatIcons.location}
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#9CA3AF]">
                      {t("home.eventBooking.locationLabel")}
                    </p>
                    <p className="text-sm font-medium text-[#111827]">
                      {t("eventi.keyEnergy.location")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-[#4B5563]">
                  <span className="text-[#6B7280]" aria-hidden="true">
                    {FlatIcons.calendar}
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#9CA3AF]">
                      {t("home.eventBooking.dateLabel")}
                    </p>
                    <p className="text-sm font-medium text-[#111827]">
                      {t("eventi.keyEnergy.date")}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. Primary CTA — isolated, dominant */}
              <div className="mb-12">
                <Button
                  href={buildFormHref()}
                  variant="primary"
                  externalIcon
                  className="text-base px-8 py-3 h-12"
                >
                  {t("eventi.keyEnergy.ctaForm")}
                </Button>
                <p className="mt-3 text-sm text-[#6B7280]">
                  {t("eventi.keyEnergy.ctaFormNote")}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-xs font-medium text-[#9CA3AF]">{t("eventi.keyEnergy.share")}</span>
                  <button
                    type="button"
                    onClick={() => openShare("facebook")}
                    className="p-1.5 rounded text-[#6B7280] hover:text-[#C01C20] transition-colors"
                    aria-label={`${t("eventi.keyEnergy.shareOn")} Facebook`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => openShare("linkedin")}
                    className="p-1.5 rounded text-[#6B7280] hover:text-[#C01C20] transition-colors"
                    aria-label={`${t("eventi.keyEnergy.shareOn")} LinkedIn`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 5. Secondary — What you'll find at the stand */}
              <div className="mb-10">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#6B7280] mb-4">
                  {t("eventi.keyEnergy.whatToExpect")}
                </h3>
                <ul className="space-y-3" role="list">
                  {expectations.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[#4B5563]">
                      <span className="flex-shrink-0 mt-0.5 text-[#9CA3AF]" aria-hidden="true">
                        {item.icon}
                      </span>
                      <span className="text-sm leading-relaxed">
                        {t(item.textKey)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 6. Description — de-emphasized, bottom */}
              <p className="text-sm text-[#6B7280] leading-relaxed max-w-xl">
                {t("eventi.keyEnergy.description")}
              </p>
            </main>

            {/* Sidebar — clearly secondary */}
            <aside className="lg:w-72 xl:w-80 flex-shrink-0 lg:border-l lg:border-slate-200 lg:pl-10">
              <SocialPressSidebar />
            </aside>
          </div>
        </div>
      </section>

      {/* 过去的活动回顾 — 样式与 assistenza 视频区一致 */}
      <section className="relative z-10 py-12 sm:py-16 lg:py-20 border-t border-slate-200 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              {t("eventi.video.title")}
            </h2>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
              {t("eventi.video.description")}
            </p>
          </div>
          {/* Mobile: 单视频 + 横向滑动 — 标题来自 YouTube */}
          <div className="md:hidden overflow-x-auto snap-x snap-mandatory -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex gap-4">
              {["gwUNQt8kcuU", "dBY-e6mFwOM"].map((videoId) => (
                <div key={videoId} className="flex-shrink-0 min-w-full snap-center">
                  <YouTubeVideoWithTitle videoId={videoId} />
                </div>
              ))}
            </div>
          </div>
          {/* Desktop: 网格 — 标题来自 YouTube */}
          <div className="hidden md:grid md:grid-cols-2 gap-6 lg:gap-8">
            {["gwUNQt8kcuU", "dBY-e6mFwOM"].map((videoId) => (
              <div key={videoId}>
                <YouTubeVideoWithTitle videoId={videoId} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
