"use client";

import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumbs";
import { useTranslation } from "@/hooks/useTranslation";

export default function GaranziaPage() {
  const { t } = useTranslation();
  const [serialNumber, setSerialNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (serialNumber.trim()) {
      // 打开外部保修查询系统
      window.open(
        `https://warranty.aforenergy.com/index.php?m=home&c=Lists&a=index&tid=73&sn=${encodeURIComponent(serialNumber.trim())}`,
        "_blank"
      );
    } else {
      // 如果没有输入序列号，直接打开查询页面
      window.open(
        "https://warranty.aforenergy.com/index.php?m=home&c=Lists&a=index&tid=73",
        "_blank"
      );
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative -mt-16 pt-16">
        <div className="absolute inset-0">
          <img
            src="/image/documentazione_hero.jpg"
            alt="Garanzia"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 text-white">
          <Breadcrumb
            theme="dark"
            items={[
                    { label: t('common.breadcrumb.home'), href: "/" },
                    { label: t('garanzia.title') },
            ]}
          />
          <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight break-words">
                  {t('garanzia.title')}
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/85">
                  {t('garanzia.subtitle')}
          </p>
        </div>
      </section>

      {/* 查询表单 */}
      <section className="relative z-10 mt-8 sm:mt-10 md:mt-14 lg:mt-16 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-xl sm:rounded-2xl overflow-hidden ring-1 ring-black/5 p-4 sm:p-6 lg:p-8">
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
                  className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-brand-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-brand-500 active:bg-brand-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 touch-manipulation"
                >
                        {t('garanzia.verifica')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.open(
                      "https://warranty.aforenergy.com/index.php?m=home&c=Lists&a=index&tid=73",
                      "_blank"
                    );
                  }}
                  className="flex-1 sm:flex-none px-6 py-3 border border-slate-300 text-slate-700 text-sm sm:text-base font-semibold rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 touch-manipulation"
                >
                        {t('garanzia.apriSistema')}
                </button>
              </div>
            </form>
          </div>

          {/* Garanzia di 10 anni PDF 下载 */}
          <div className="mt-6 sm:mt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 break-words">
              {t('garanzia.garanzia10Anni.title')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
              {t('garanzia.garanzia10Anni.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="/documentazione/GARANZIA/EN_AFORE_Garanzia_10_anni.pdf"
                download
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-slate-900 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-slate-800 active:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 touch-manipulation"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                AFORE - {t('common.download')}
              </a>
              <a
                href="/documentazione/GARANZIA/EN_HAILEI_Garanzia_10_anni.pdf"
                download
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-slate-900 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-slate-800 active:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 touch-manipulation"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                HAILEI - {t('common.download')}
              </a>
              <a
                href="/documentazione/GARANZIA/IT_HAILEI_Garanzia_Card_10_anni.pdf"
                download
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-slate-900 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-slate-800 active:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 touch-manipulation"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                HAILEI Card - {t('common.download')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

