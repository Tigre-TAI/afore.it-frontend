"use client";

import { use } from "react";
import Link from "next/link";
import SocialPressSidebar from "@/components/SocialPressSidebar";
import { useTranslation } from "@/hooks/useTranslation";
import HeroBackground from "@/components/ui/HeroBackground";
import { notFound } from "next/navigation";

export default function CaricaFotoPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { slug } = use(params);
  const { t, lang } = useTranslation();

  if (slug !== "key-energy-2026") {
    notFound();
  }

  const articleHref = `/${lang}/comunicati-stampa/key-energy-2026`;
  const listHref = `/${lang}/comunicati-stampa`;

  return (
    <>
      <section className="relative -mt-[88px] pt-[88px]">
        <HeroBackground
          src="/image/events/keyenergy2026_cta.jpg"
          alt={t("comunicatiStampa.items.keyEnergy2026.photoUploadHeading")}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-white">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            {t("comunicatiStampa.items.keyEnergy2026.photoUploadHeading")}
          </h1>
          <p className="mt-2 text-sm text-white/85 max-w-2xl">
            {t("comunicatiStampa.items.keyEnergy2026.photoUploadNote")}
          </p>
        </div>
      </section>

      <section className="relative z-10 bg-[#F5F6F7] py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-slate-200/80">
                <iframe
                  src={`https://forms.gle/49Qyti1tXG73CguQA?embedded=true`}
                  title={t("comunicatiStampa.items.keyEnergy2026.photoUploadCta")}
                  className="w-full min-h-[600px] border-0"
                  loading="lazy"
                />
              </div>
              <Link
                href={articleHref}
                className="inline-flex items-center gap-1 mt-6 text-sm font-semibold text-[#C01C20] hover:underline transition-[text-decoration]"
              >
                ← Key Energy 2026
              </Link>
            </div>
            <SocialPressSidebar />
          </div>
        </div>
      </section>
    </>
  );
}
