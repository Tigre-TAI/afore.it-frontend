"use client";

import Image from "next/image";
import Link from "next/link";
import SocialPressSidebar from "@/components/SocialPressSidebar";
import { useTranslation } from "@/hooks/useTranslation";
import { withLang } from "@/lib/lang-utils";
import HeroBackground from "@/components/ui/HeroBackground";

const PRESS_ITEM_KEYS = ["keyEnergy2026", "spazio900"] as const;

export default function ComunicatiStampaPage() {
  const { t, lang } = useTranslation();

  return (
    <>
      <section className="relative -mt-[88px] pt-[88px]">
        <HeroBackground
          src="/image/heroes/comunicati_stampa_hero.jpg"
          alt={t("comunicatiStampa.title")}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-white">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight break-words">
            {t("comunicatiStampa.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/85">
            {t("comunicatiStampa.subtitle")}
          </p>
        </div>
      </section>

      <section className="relative z-10 bg-[#F5F6F7] py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-1 min-w-0 py-12 lg:pt-12">
              <h2 className="text-lg sm:text-xl font-semibold text-[#111827] mb-6 sm:mb-8 tracking-tight">
                {t("comunicatiStampa.latestTitle")}
              </h2>
              <ul className="space-y-8">
                {PRESS_ITEM_KEYS.map((key) => {
                  const date = t(`comunicatiStampa.items.${key}.date`);
                  const title = t(`comunicatiStampa.items.${key}.title`);
                  const excerpt = t(`comunicatiStampa.items.${key}.excerpt`);
                  const href = t(`comunicatiStampa.items.${key}.href`);
                  const image = t(`comunicatiStampa.items.${key}.image`);
                  const linkHref = withLang(href, lang);

                  return (
                    <li key={key}>
                      <Link
                        href={linkHref}
                        className="flex flex-col sm:flex-row gap-4 sm:gap-6 group"
                      >
                        <div className="relative w-full sm:w-64 flex-shrink-0 aspect-[4/3] sm:aspect-video overflow-hidden bg-[#E5E7EB]">
                          <Image
                            src={image}
                            alt=""
                            fill
                            className="object-cover group-hover:scale-[1.02] transition-transform duration-200"
                            sizes="(max-width: 640px) 100vw, 256px"
                            unoptimized={image.startsWith("http")}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#6B7280] mb-1">{date}</p>
                          <h3 className="font-semibold text-[#111827] mb-2 group-hover:text-[#C01C20] transition-colors line-clamp-2">
                            {title}
                          </h3>
                          <p className="text-sm text-[#4B5563] line-clamp-2 mb-3">
                            {excerpt}
                          </p>
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#C01C20] group-hover:underline transition-[text-decoration]">
                            {t("comunicatiStampa.continua")} →
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <SocialPressSidebar />
          </div>
        </div>
      </section>
    </>
  );
}
