"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import SocialPressSidebar from "@/components/SocialPressSidebar";
import { useTranslation } from "@/hooks/useTranslation";
import HeroBackground from "@/components/ui/HeroBackground";
import YouTubeVideoWithTitle from "@/components/YouTubeVideoWithTitle";
import { SLUG_TO_KEY, PRESS_ITEM_SLUGS, type PressSlug } from "@/data/comunicati-stampa-data";
import { notFound } from "next/navigation";

const KEYENERGY_LOGO = "/image/events/Logo%20KEY%20verticale%20PRIMARIO.png";
const SPAZIO900_LOGO = "/image/events/Logo%20Spazio%20900.png";
const KEYENERGY_2025_PHOTOS = [
  "/image/events/keyenergy2025_01.jpg",
  "/image/events/keyenergy2025_02.jpg",
  "/image/events/keyenergy2025_03.jpg",
  "/image/events/keyenergy2025_04.jpg",
];
const INITIAL_PHOTO_COUNT = 3;

function KeyEnergyPhotoGrid({
  photos,
  t,
}: {
  photos: readonly string[];
  t: (key: string) => string;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = photos.length > INITIAL_PHOTO_COUNT;
  const displayPhotos = hasMore && !expanded ? photos.slice(0, INITIAL_PHOTO_COUNT) : photos;

  return (
    <div className="mt-10 space-y-6">
      <h3 className="text-lg font-semibold text-[#111827]">
        {t("comunicatiStampa.items.keyEnergy2026.photos2025Title")}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {displayPhotos.map((src) => (
          <a key={src} href={src} target="_blank" rel="noopener noreferrer" className="aspect-[4/3] relative block overflow-hidden bg-[#E5E7EB] group">
            <Image src={src} alt="" fill className="object-cover group-hover:opacity-95 transition-opacity" sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" />
          </a>
        ))}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-sm font-semibold text-[#C01C20] hover:text-[#9a1619] transition-colors"
        >
          {expanded ? t("videoPage.showLess") : t("comunicatiStampa.items.keyEnergy2026.photosShowMore")}
        </button>
      )}
    </div>
  );
}

export default function ComunicatiStampaArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { slug } = use(params);
  const { t, lang } = useTranslation();

  if (!PRESS_ITEM_SLUGS.includes(slug as PressSlug)) {
    notFound();
  }

  const key = SLUG_TO_KEY[slug as PressSlug];
  const date = t(`comunicatiStampa.items.${key}.date`);
  const title = t(`comunicatiStampa.items.${key}.title`);
  const body = t(`comunicatiStampa.items.${key}.body`);
  const cardImage = t(`comunicatiStampa.items.${key}.image`);
  const heroImage = t(`comunicatiStampa.items.${key}.heroImage`);
  const image = heroImage?.startsWith("/") ? heroImage : cardImage;
  const listHref = `/${lang}/comunicati-stampa`;
  const breadcrumbLabel = slug === "key-energy-2026" ? "Key Energy 2026" : title;

  return (
    <>
      <section className="relative -mt-[88px] pt-[88px]">
        <HeroBackground
          src={image}
          alt={title}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-white">
          <Breadcrumb
            theme="dark"
            items={[
              { label: t("common.breadcrumb.home"), href: "/" },
              { label: t("comunicatiStampa.title"), href: listHref },
              { label: breadcrumbLabel },
            ]}
          />
          <p className="mt-2 text-sm text-white/85">{date}</p>
          <h1 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight break-words">
            {title}
          </h1>
        </div>
      </section>

      <section className="relative z-10 bg-[#F5F6F7] py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <article className="flex-1 min-w-0 py-12 lg:pt-12">
              {slug === "key-energy-2026" && (
                <div className="flex justify-center mb-8">
                  <Image
                    src={KEYENERGY_LOGO}
                    alt="Key Energy"
                    width={180}
                    height={120}
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}

              {slug === "spazio-900" && (
                <div className="flex justify-center mb-8">
                  <Image
                    src={SPAZIO900_LOGO}
                    alt="Spazio 900"
                    width={180}
                    height={120}
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}

              <div className="prose prose-slate max-w-none text-[#4B5563]">
                <p className="text-base leading-relaxed whitespace-pre-line">{body}</p>
              </div>

              {slug === "key-energy-2026" && (
                <KeyEnergyPhotoGrid photos={KEYENERGY_2025_PHOTOS} t={t} />
              )}

              {slug === "spazio-900" && (
                <div className="mt-10 pt-8 border-t border-slate-200/80">
                  <h3 className="text-lg font-semibold text-[#111827] mb-4">
                    {t("comunicatiStampa.items.spazio900.videoHeading")}
                  </h3>
                  <div className="max-w-2xl">
                    <YouTubeVideoWithTitle videoId="dBY-e6mFwOM" titleClassName="mt-3 text-sm font-medium text-[#4B5563]" />
                  </div>
                </div>
              )}

              {slug === "key-energy-2026" && (
                <div className="mt-10 pt-8 border-t border-slate-200/80">
                  <h3 className="text-lg font-semibold text-[#111827] mb-2">
                    {t("comunicatiStampa.items.keyEnergy2026.photoUploadHeading")}
                  </h3>
                  <p className="text-sm text-[#6B7280] mb-4">
                    {t("comunicatiStampa.items.keyEnergy2026.photoUploadNote")}
                  </p>
                  <Button
                    href={`/${lang}/comunicati-stampa/key-energy-2026/carica-foto`}
                    variant="primary"
                    trailingChevron
                    className="text-base px-6 py-2.5 h-11"
                  >
                    {t("comunicatiStampa.items.keyEnergy2026.photoUploadCta")}
                  </Button>
                </div>
              )}

              <Link
                href={listHref}
                className="inline-flex items-center gap-1 mt-8 text-sm font-semibold text-[#C01C20] hover:underline transition-[text-decoration]"
              >
                ← {t("comunicatiStampa.title")}
              </Link>
            </article>
            <SocialPressSidebar />
          </div>
        </div>
      </section>
    </>
  );
}
