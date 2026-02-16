"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import Breadcrumb from "@/components/ui/Breadcrumbs";
import HeroBackground from "@/components/ui/HeroBackground";
import { search, TYPE_ORDER, type SearchResult } from "@/lib/search";

function RicercaContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const lang = (params?.lang as string) || "it";
  const { t } = useTranslation();
  const q = searchParams?.get("q")?.trim() || "";
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";

  const results = q ? search(q, validLang as "it" | "en" | "es" | "fr" | "de") : [];

  const grouped = TYPE_ORDER.reduce<Record<string, SearchResult[]>>((acc, type) => {
    acc[type] = results.filter((r) => r.type === type);
    return acc;
  }, {});

  return (
    <main className="page-content font-sans">
      <section className="relative -mt-[88px] pt-[88px]">
        <HeroBackground src="/image/heroes/prodotti_hero.jpg" alt={t("search.ariaLabel")} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-white">
          <Breadcrumb
            theme="dark"
            items={[
              { label: t("common.breadcrumb.home"), href: `/${lang}` },
              { label: t("search.ariaLabel") },
            ]}
          />
          <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight break-words">
            {t("search.ariaLabel")}
          </h1>
          {q && (
            <p className="mt-3 text-sm text-white/90 font-medium">
              {t("search.resultsFor")} &quot;{q}&quot; — {results.length}{" "}
              {results.length === 1 ? t("search.resultSingular") : t("search.resultPlural")}
            </p>
          )}
        </div>
      </section>

      <section className="relative z-10 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {!q ? (
            <p className="text-slate-600">{t("search.placeholder")}</p>
          ) : results.length === 0 ? (
            <p className="text-slate-600">{t("search.noResults")}</p>
          ) : (
            <div className="space-y-10">
              {TYPE_ORDER.map((type) => {
                const items = grouped[type] || [];
                if (items.length === 0) return null;

                const typeLabel = t(`search.types.${type}` as any) || type;
                return (
                  <div key={type}>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                      {typeLabel} ({items.length})
                    </h2>
                    <ul className="space-y-3">
                      {items.map((item, idx) => (
                        <li key={`${item.path}-${idx}`}>
                          <Link
                            href={`/${lang}${item.path}`}
                            className="block p-3 sm:p-4 rounded-lg border border-slate-200 hover:border-[#C01C20] hover:bg-red-50/30 transition-colors group"
                          >
                            <span className="font-medium text-slate-900 group-hover:text-[#C01C20] transition-colors">
                              {item.title}
                            </span>
                            {item.snippet && (
                              <p className="mt-1 text-sm text-slate-600 line-clamp-2">{item.snippet}</p>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function RicercaPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">...</div>}>
      <RicercaContent />
    </Suspense>
  );
}
