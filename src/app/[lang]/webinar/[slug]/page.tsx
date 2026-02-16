"use client";

import { use } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import SocialPressSidebar from "@/components/SocialPressSidebar";
import { useTranslation } from "@/hooks/useTranslation";
import HeroBackground from "@/components/ui/HeroBackground";
import { SLUG_TO_KEY, WEBINAR_ITEM_SLUGS, type WebinarSlug } from "@/data/webinar-data";
import { notFound } from "next/navigation";

export default function WebinarArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { slug } = use(params);
  const { t, lang } = useTranslation();

  if (!WEBINAR_ITEM_SLUGS.includes(slug as WebinarSlug)) {
    notFound();
  }

  const key = SLUG_TO_KEY[slug as WebinarSlug];
  const title = t(`webinar.items.${key}.title`);
  const date = t(`webinar.items.${key}.date`);
  const time = t(`webinar.items.${key}.time`);
  const meetUrl = t(`webinar.items.${key}.meetUrl`);
  const meetDial = t(`webinar.items.${key}.meetDial`);
  const topics = t(`webinar.items.${key}.topics`);
  const cardImage = t(`webinar.items.${key}.image`);
  const heroImage = t(`webinar.items.${key}.heroImage`);
  const image = heroImage?.startsWith("/") ? heroImage : cardImage;
  const listHref = `/${lang}/webinar`;

  return (
    <>
      <section className="relative -mt-[88px] pt-[88px]">
        <HeroBackground src={image} alt={title} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-white">
          <Breadcrumb
            theme="dark"
            items={[
              { label: t("common.breadcrumb.home"), href: "/" },
              { label: t("webinar.title"), href: listHref },
              { label: title },
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
              <div className="space-y-6 text-[#4B5563]">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                  <span className="font-medium text-[#111827]">{date}</span>
                  <span>{time}</span>
                  <span className="text-[#6B7280]">{t(`webinar.items.${key}.timezone`)}</span>
                </div>

                <div className="pt-4 border-t border-slate-200/80">
                  <h3 className="text-lg font-semibold text-[#111827] mb-4">
                    {t(`webinar.items.${key}.joinTitle`)}
                  </h3>
                  <div className="space-y-3">
                    <p>
                      <span className="font-medium text-[#111827]">{t(`webinar.items.${key}.meetLinkLabel`)}:</span>{" "}
                      <a
                        href={meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#C01C20] hover:underline font-medium"
                      >
                        {meetUrl}
                      </a>
                    </p>
                    <p>
                      <span className="font-medium text-[#111827]">{t(`webinar.items.${key}.meetDialLabel`)}:</span>{" "}
                      <span className="font-mono text-sm">{meetDial}</span>
                    </p>
                  </div>
                  <div className="mt-6">
                    <Button
                      href={meetUrl}
                      variant="primary"
                      externalIcon
                      className="text-base px-6 py-2.5 h-11"
                    >
                      {t(`webinar.items.${key}.joinButton`)}
                    </Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200/80">
                  <h3 className="text-lg font-semibold text-[#111827] mb-4">
                    {t(`webinar.items.${key}.topicsTitle`)}
                  </h3>
                  <ul className="space-y-2 text-base leading-relaxed list-disc list-inside">
                    {topics.split("\n").filter(Boolean).map((line, i) => (
                      <li key={i}>{line.replace(/^[-•]\s*/, "")}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                href={listHref}
                className="inline-flex items-center gap-1 mt-8 text-sm font-semibold text-[#C01C20] hover:underline transition-[text-decoration]"
              >
                ← {t("webinar.title")}
              </Link>
            </article>
            <SocialPressSidebar />
          </div>
        </div>
      </section>
    </>
  );
}
