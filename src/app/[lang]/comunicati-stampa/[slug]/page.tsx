"use client";

import { use, useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import BreadcrumbSetter from "@/components/BreadcrumbSetter";
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
/** KEY ENERGY 2026 Afore Italia 现场照片：与 public/image/events/ 中实际文件一致、按编号顺序排列（缺 10、19） */
const KEYENERGY2026_AFORE_ITALIA_PHOTOS = [
  "/image/events/keyenergy2026_afore_italia_01.jpg",
  "/image/events/keyenergy2026_afore_italia_02.jpg",
  "/image/events/keyenergy2026_afore_italia_03.jpg",
  "/image/events/keyenergy2026_afore_italia_04.jpg",
  "/image/events/keyenergy2026_afore_italia_05.jpg",
  "/image/events/keyenergy2026_afore_italia_06.jpg",
  "/image/events/keyenergy2026_afore_italia_07.jpg",
  "/image/events/keyenergy2026_afore_italia_08.jpg",
  "/image/events/keyenergy2026_afore_italia_09.jpg",
  "/image/events/keyenergy2026_afore_italia_11.jpg",
  "/image/events/keyenergy2026_afore_italia_12.jpg",
  "/image/events/keyenergy2026_afore_italia_13.jpg",
  "/image/events/keyenergy2026_afore_italia_14.jpg",
  "/image/events/keyenergy2026_afore_italia_15.jpg",
  "/image/events/keyenergy2026_afore_italia_16.jpg",
  "/image/events/keyenergy2026_afore_italia_17.jpg",
  "/image/events/keyenergy2026_afore_italia_18.jpg",
  "/image/events/keyenergy2026_afore_italia_20.jpg",
  "/image/events/keyenergy2026_afore_italia_21.jpg",
  "/image/events/keyenergy2026_afore_italia_22.jpg",
  "/image/events/keyenergy2026_afore_italia_23.jpg",
  "/image/events/keyenergy2026_afore_italia_24.jpg",
  "/image/events/keyenergy2026_afore_italia_25.jpg",
];
const INITIAL_PHOTO_COUNT = 6;
const SWIPE_THRESHOLD = 50;

/** Key Energy 2026 Afore Italia 顶部视频：放在 public/video/key-energy-2026-afore-italia.mp4 */
const KEYENERGY2026_AFORE_ITALIA_VIDEO = "/video/key-energy-2026-afore-italia.mp4";

function VideoWithSoundToggle({ src }: { src: string }) {
  const [muted, setMuted] = useState(true);

  return (
    <div className="relative w-full max-w-4xl">
      <video
        className="w-full aspect-video bg-black rounded-none overflow-hidden object-cover"
        src={src}
        autoPlay
        loop
        playsInline
        muted={muted}
        preload="metadata"
        controls
        aria-label="Video"
      />
      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        className="absolute bottom-3 right-3 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
        aria-label={muted ? "Attiva audio" : "Disattiva audio"}
        title={muted ? "Attiva audio" : "Disattiva audio"}
      >
        {muted ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
        )}
      </button>
    </div>
  );
}

function PhotoLightbox({
  photos,
  initialIndex,
  onClose,
}: {
  photos: readonly string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const touchStartX = useRef<number | null>(null);

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? photos.length - 1 : i - 1));
  }, [photos.length]);
  const goNext = useCallback(() => {
    setIndex((i) => (i >= photos.length - 1 ? 0 : i + 1));
  }, [photos.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current == null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;
      if (Math.abs(dx) < SWIPE_THRESHOLD) return;
      if (dx > 0) goPrev();
      else goNext();
    },
    [goPrev, goNext]
  );

  const src = photos[index] ?? photos[0];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
        aria-label="Close"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      {/* Desktop: left/right arrows */}
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-2 md:p-3 text-white hover:bg-white/20 transition-colors hidden sm:flex items-center justify-center"
            aria-label="Previous"
          >
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-2 md:p-3 text-white hover:bg-white/20 transition-colors hidden sm:flex items-center justify-center"
            aria-label="Next"
          >
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </>
      )}

      {/* Image area: click doesn't close, swipe on mobile */}
      <div
        className="relative w-full h-full flex items-center justify-center p-12 sm:p-16"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative w-full h-full max-w-5xl max-h-[85vh]">
          <Image
            src={src}
            alt=""
            fill
            className="object-contain"
            sizes="100vw"
            unoptimized={!src.endsWith(".jpg") && !src.endsWith(".png") && !src.endsWith(".webp")}
          />
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-white/80 text-sm">
        {index + 1} / {photos.length}
      </div>
    </div>
  );
}

function EventPhotoGrid({
  photos,
  t,
  itemKey,
}: {
  photos: readonly string[];
  t: (key: string) => string;
  itemKey: "keyEnergy2026" | "webinarHailei24Marzo2026";
}) {
  const [expanded, setExpanded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const hasMore = photos.length > INITIAL_PHOTO_COUNT;
  const displayPhotos = hasMore && !expanded ? photos.slice(0, INITIAL_PHOTO_COUNT) : photos;
  const titleKey = itemKey === "keyEnergy2026" ? "comunicatiStampa.items.keyEnergy2026.photos2025Title" : "comunicatiStampa.items.webinarHailei24Marzo2026.photosTitle";
  const showMoreKey = itemKey === "keyEnergy2026" ? "comunicatiStampa.items.keyEnergy2026.photosShowMore" : "comunicatiStampa.items.webinarHailei24Marzo2026.photosShowMore";

  return (
    <div className="mt-10 space-y-6">
      <h3 className="text-lg font-semibold text-[#111827]">
        {t(titleKey)}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {displayPhotos.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setLightboxIndex(i)}
            className="aspect-[4/3] relative block w-full overflow-hidden rounded-lg bg-[#E5E7EB] group cursor-pointer border-0 p-0 text-left"
          >
            <Image src={src} alt="" fill className="object-cover group-hover:opacity-95 transition-opacity" sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 33vw" unoptimized={!src.endsWith(".jpg") && !src.endsWith(".png") && !src.endsWith(".webp")} />
          </button>
        ))}
      </div>
      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-sm font-semibold text-[#C01C20] hover:text-[#9a1619] transition-colors"
        >
          {expanded ? t("videoPage.showLess") : t(showMoreKey)}
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

  const breadcrumbItems = [
    { label: t("common.breadcrumb.home"), href: "/" },
    { label: t("comunicatiStampa.title"), href: listHref },
    { label: breadcrumbLabel },
  ];

  return (
    <>
      <BreadcrumbSetter items={breadcrumbItems} />
      <section className="relative -mt-[88px] pt-[88px]">
        <HeroBackground
          src={image}
          alt={title}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-white">
          <p className="text-sm text-white/85">{date}</p>
          <h1 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight break-words">
            {title}
          </h1>
        </div>
      </section>

      <section className="relative z-10 bg-[#F5F6F7] py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <article className="flex-1 min-w-0 py-12 lg:pt-12">
              {slug === "key-energy-2026-afore-italia" && (
                <div className="mb-8">
                  <VideoWithSoundToggle src={KEYENERGY2026_AFORE_ITALIA_VIDEO} />
                </div>
              )}

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
                <EventPhotoGrid photos={KEYENERGY_2025_PHOTOS} t={t} itemKey="keyEnergy2026" />
              )}

              {slug === "key-energy-2026-afore-italia" && (
                <EventPhotoGrid photos={KEYENERGY2026_AFORE_ITALIA_PHOTOS} t={t} itemKey="webinarHailei24Marzo2026" />
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
