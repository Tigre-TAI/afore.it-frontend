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
      window.location.href = `https://warranty.aforenergy.com/index.php?m=home&c=Lists&a=index&tid=73&sn=${encodeURIComponent(serialNumber.trim())}`;
    } else {
      window.location.href = "https://warranty.aforenergy.com/index.php?m=home&c=Lists&a=index&tid=73";
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

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 text-white">
          <Breadcrumb
            theme="dark"
            items={[
                    { label: t('common.breadcrumb.home'), href: "/" },
                    { label: t('garanzia.title') },
            ]}
          />
          <h1 className="mt-3 text-3xl lg:text-5xl font-extrabold tracking-tight">
                  {t('garanzia.title')}
          </h1>
          <p className="mt-3 max-w-2xl text-white/85">
                  {t('garanzia.subtitle')}
          </p>
        </div>
      </section>

      {/* 查询表单 */}
      <section className="relative z-10 mt-10 md:mt-14 lg:mt-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden ring-1 ring-black/5 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    {t('garanzia.verificaGaranzia')}
            </h2>
            <p className="text-slate-600 mb-6">
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
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-500 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                >
                        {t('garanzia.verifica')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href =
                      "https://warranty.aforenergy.com/index.php?m=home&c=Lists&a=index&tid=73";
                  }}
                  className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                >
                        {t('garanzia.apriSistema')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

