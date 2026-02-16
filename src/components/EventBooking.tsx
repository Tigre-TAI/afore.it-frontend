"use client";

/**
 * EventBooking — 活动/会议预约 CTA 区块（首页用）
 * Flat icons, Luogo/Evento above CTA on the left, content + image height aligned.
 */

import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { withLang } from "@/lib/lang-utils";
import Button from "@/components/ui/Button";

const FORM_URL = "https://forms.gle/49Qyti1tXG73CguQA";

const FlatIcons = {
  clock: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  check: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
  location: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
};

function buildFormHref() {
  const utm = new URLSearchParams({
    utm_source: "homepage",
    utm_medium: "cta",
    utm_campaign: "event_booking",
  });
  // 如果 FORM_URL 本身已经有 ? 参数，就用 & 拼接；否则用 ?
  const separator = FORM_URL.includes("?") ? "&" : "?";
  return `${FORM_URL}${separator}${utm.toString()}`;
}

export default function EventBooking() {
  const { t, lang } = useTranslation();

  return (
    /**
     * 【学习要点：设计系统一致性】
     * - py-8 md:py-16 lg:py-24 → 跟项目里其他 section 完全一样的垂直间距
     * - bg-gray-50 → 浅灰背景，跟 FeaturedProducts 一致
     * - max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 → 项目通用的容器宽度和边距
     * - aria-labelledby → 无障碍：告诉屏幕阅读器这个 section 的标题是哪个元素
     */
    <section
      className="py-12 md:py-16 bg-slate-50"
      aria-labelledby="event-booking-heading"
    >
      <div className="container">
        {/**
         * 【学习要点：响应式布局】
         * grid-cols-1 → 移动端：单列堆叠
         * lg:grid-cols-2 → 桌面端（≥1024px）：两列并排
         * gap-8 lg:gap-16 → 列间距，桌面端更宽
         * items-start → 两列顶部对齐（不是居中拉伸）
         */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">
          {/* ── 左列：文案 + Luogo/Evento + CTA，左对齐 ── */}
          <div className="flex flex-col items-start text-left">
            <span className="inline-block pl-0 pr-4 py-1.5 mb-4 rounded-lg text-xs sm:text-sm font-semibold tracking-widest uppercase bg-brand-100 text-brand-700 w-fit">
              {t("home.eventBooking.badge")}
            </span>

            <h2
              id="event-booking-heading"
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight text-left w-full"
            >
              {t("home.eventBooking.title")}
            </h2>

            <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 max-w-xl">
              {t("home.eventBooking.description")}
            </p>

            {/* Luogo + Evento — icon 固定 w-6 pt-1 对齐基线 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3 text-slate-500">
                <span className="w-6 flex-shrink-0 pt-1 [&>svg]:w-5 [&>svg]:h-5">{FlatIcons.location}</span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400">{t("home.eventBooking.locationLabel")}</p>
                  <p className="text-base md:text-lg font-semibold text-gray-900">{t("home.eventBooking.locationValue")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-slate-500">
                <span className="w-6 flex-shrink-0 pt-1 [&>svg]:w-5 [&>svg]:h-5">{FlatIcons.calendar}</span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400">{t("home.eventBooking.dateLabel")}</p>
                  <p className="text-base md:text-lg font-semibold text-gray-900">{t("home.eventBooking.dateValue")}</p>
                </div>
              </div>
            </div>

            {/* 按钮组 — pill primary + link secondary */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
              <Button href={buildFormHref()} variant="primary" externalIcon>
                {t("home.eventBooking.cta")}
              </Button>
              <Button href={withLang("/eventi", lang)} variant="secondary">
                {t("home.eventBooking.detailsCta")}
              </Button>
            </div>

            {/* 辅助说明：填写时间 + 确认方式 — 扁平图标 */}
            <p className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="text-gray-400">{FlatIcons.clock}</span>
                {t("home.eventBooking.noteTime")}
              </span>
              <span className="text-gray-300" aria-hidden>·</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="text-gray-400">{FlatIcons.check}</span>
                {t("home.eventBooking.noteConfirm")}
              </span>
            </p>
          </div>

          {/* ── 右列：活动图片，高度与左列对齐 ── */}
          <div className="relative w-full min-h-[280px] sm:min-h-[320px] lg:min-h-0 lg:h-full">
            <Image
              src="/image/events/keyenergy2026_cta.jpg"
              alt="KEY ENERGY 2026 - Afore Italia Booth B5-D5"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
