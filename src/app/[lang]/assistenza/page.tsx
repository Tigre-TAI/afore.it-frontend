"use client";

import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import HeroBackground from "@/components/ui/HeroBackground";
import YouTubeVideoWithTitle from "@/components/YouTubeVideoWithTitle";
import DownloadSection from "@/components/DownloadSection";

export default function AssistenzaPage() {
  const { t } = useTranslation();
  const [serialNumber, setSerialNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (serialNumber.trim()) {
      window.open(
        `https://warranty.aforenergy.com/index.php?m=home&c=Lists&a=index&tid=73&sn=${encodeURIComponent(serialNumber.trim())}`,
        "_blank"
      );
    } else {
      window.open(
        "https://warranty.aforenergy.com/index.php?m=home&c=Lists&a=index&tid=73",
        "_blank"
      );
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative -mt-[88px] pt-[88px]">
        <HeroBackground src="/image/heroes/assistenza_hero.jpg" alt="Assistenza e supporto" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-white">
          <Breadcrumb
            theme="dark"
            items={[
              { label: t('common.breadcrumb.home'), href: "/" },
              { label: t('garanzia.title') },
            ]}
          />
          <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight break-words">
            {t('garanzia.title')}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/85">
            {t('garanzia.subtitle')}
          </p>
        </div>
      </section>

      {/* 主内容区：桌面端左右两列，移动端单列堆叠（Download 在上） */}
      <section className="relative z-10 mt-8 sm:mt-10 md:mt-14 lg:mt-16 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* 左：Download — 移动端在上，桌面端在左 */}
            <div>
              <DownloadSection />
            </div>
            {/* 右：Verifica Garanzia — 移动端在下，桌面端在右 */}
            <div className="pt-8 md:pt-0 md:pl-8 md:border-l md:border-slate-200">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 break-words">
                  {t('garanzia.verificaGaranzia')}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
                  {t('garanzia.descrizione')}
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="serialNumber"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      {t('garanzia.numeroSerie')}
                    </label>
                    <input
                      id="serialNumber"
                      type="text"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      placeholder={t('garanzia.inserisciNumeroSerie')}
                      className="w-full px-4 py-3 text-base border border-slate-200 rounded-lg focus:border-[#C01C20] focus:outline-none focus-visible:ring-0 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button
                      type="submit"
                      variant="primary"
                      className="flex-1 touch-manipulation"
                    >
                      {t('garanzia.verifica')}
                    </Button>
                    <Button
                      href="https://warranty.aforenergy.com/index.php?m=home&c=Lists&a=index&tid=73"
                      variant="secondary"
                      className="flex-1 sm:flex-none"
                    >
                      {t('garanzia.apriSistema')}
                    </Button>
                  </div>
                </form>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section — Assistenza Tecnica */}
      <section className="relative z-10 py-12 sm:py-16 lg:py-20 border-t border-slate-200 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 sm:mb-8">
            {t("garanzia.videoAssistenzaTecnica") || "Assistenza Tecnica — Video"}
          </h2>
          {/* Mobile: 单视频 + 横向滑动 — 标题来自 YouTube */}
          <div className="md:hidden overflow-x-auto snap-x snap-mandatory -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex gap-4">
              {["NCfgxc0AKt8", "eZYudho-y8g", "dpaZM14fJlI", "E6VYgChgYYU", "CjWHKN19tos"].map((videoId) => (
                <div key={videoId} className="flex-shrink-0 min-w-full snap-center">
                  <YouTubeVideoWithTitle videoId={videoId} />
                </div>
              ))}
            </div>
          </div>
          {/* Desktop: 网格 — 标题来自 YouTube */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {["NCfgxc0AKt8", "eZYudho-y8g", "dpaZM14fJlI", "E6VYgChgYYU", "CjWHKN19tos"].map((videoId) => (
              <div key={videoId}>
                <YouTubeVideoWithTitle videoId={videoId} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contatti — Assistenza Tecnica 联系人员 */}
      <section className="relative z-10 py-12 sm:py-16 lg:py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">
            {t("garanzia.contattiAssistenzaTecnica") || "Assistenza Tecnica — Contatti"}
          </h2>
          <ul className="divide-y divide-slate-200">
            <li className="py-3 flex gap-3">
              <svg className="w-5 h-5 flex-shrink-0 text-slate-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-slate-900">FABRIZIO</p>
                <p className="text-sm text-slate-600 mt-0.5">{t("contatti.installatori")}</p>
                <a href="tel:+393757835095" className="text-sm text-[#C01C20] hover:underline mt-1 inline-block">
                  Tel 375 783 5095
                </a>
              </div>
            </li>
            <li className="py-3 flex gap-3">
              <svg className="w-5 h-5 flex-shrink-0 text-slate-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-slate-900">EMANUELE</p>
                <p className="text-sm text-slate-600 mt-0.5">{t("contatti.installatoriCommerciali")}</p>
                <a href="tel:+393757835095" className="text-sm text-[#C01C20] hover:underline mt-1 inline-block">
                  Tel 375 783 5095
                </a>
              </div>
            </li>
            <li className="py-3 flex gap-3">
              <svg className="w-5 h-5 flex-shrink-0 text-slate-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-slate-900">WILLIAM / WANG</p>
                <p className="text-sm text-slate-600 mt-0.5">{t("contatti.clientiFinali")} · {t("contatti.soloWhatsApp")}</p>
                <a href="https://wa.me/393894313885" target="_blank" rel="noopener noreferrer" className="text-sm text-[#C01C20] hover:underline mt-1 inline-block">
                  Tel 389 431 3885
                </a>
              </div>
            </li>
          </ul>
          <p className="mt-6 text-sm text-slate-600">
            {t("contatti.email")}{" "}
            <a href="mailto:assistenza.tecnica@aforeitaly.com" className="text-[#C01C20] hover:underline">
              assistenza.tecnica@aforeitaly.com
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
