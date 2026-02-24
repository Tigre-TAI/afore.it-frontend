// src/app/prodotti/page.tsx
"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import HeroBackground from "@/components/ui/HeroBackground";
import ProductCard from "@/components/ProductCard";
import { VISIBLE_PRODUCTS, hrefOf, getProductTitle, getProductSubtitle, type Product } from "@/data/product-data";
import { useTranslation } from "@/hooks/useTranslation";

/** Match product by search query (title, subtitle, id) */
function productMatchesSearch(p: Product, lang: string, q: string): boolean {
  const displayTitle = getProductTitle(p, lang) || p.title;
  const displaySub = getProductSubtitle(p, lang) || p.subtitle || "";
  const searchable = `${displayTitle} ${displaySub} ${p.id}`.toLowerCase();
  return searchable.includes(q.toLowerCase());
}

import ProdottiSidebar from "@/components/ProdottiSidebar";
import { GROUPS, has } from "@/data/prodotti-nav-data";

function ProdottiContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const lang = (params?.lang as string) || "it";
  const { t } = useTranslation();
  const searchQ = searchParams?.get("search")?.trim() || "";

/** 轻量封装你的 ProductCard */
function Card({ p }: { p: any }) {
  return (
    <ProductCard
      href={hrefOf(p, lang)}
      title={getProductTitle(p, lang)}
      subtitle={getProductSubtitle(p, lang)}
      image={p.image}
      schedaKey={p.schedaKey}
      productId={p.id}
    />
  );
}

  return (
    <main className="page-content font-sans">
      {/* ===== Hero ===== */}
      <section className="relative -mt-[88px] pt-[88px]">
        <HeroBackground src="/image/heroes/prodotti_hero.jpg" alt="Prodotti" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-white">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight break-words">
            {t('prodotti.title')}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/85">
            {t('prodotti.subtitle')}
          </p>
          {searchQ && (
            <p className="mt-3 text-sm text-white/90 font-medium">
              {t("search.resultsFor")} &quot;{searchQ}&quot;
            </p>
          )}
        </div>
      </section>

      {/* ===== 列表分组：左侧小标题 + 右侧内容 ===== */}
      <section className="py-8 sm:py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:gap-10 xl:gap-14">
            <ProdottiSidebar />

            {/* 右侧内容 */}
            <div className="flex-1 min-w-0 space-y-12 sm:space-y-16">
              {GROUPS.map((g, gi) => (
                <div key={gi} id={`group-${gi}`}>
                  {/* 小标题（左侧已有，此处仅作锚点区隔） */}
                  <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 sm:mb-6">
                    {g.bigTitle}
                  </h2>

                  {/* 子线：标题 + 副标题 + 卡片网格 */}
                  {g.lines.map((line, li) => {
                    const list = VISIBLE_PRODUCTS.filter(line.filter).filter(
                      (p) => !searchQ || productMatchesSearch(p, lang, searchQ)
                    );

                    return (
                      <div key={li} id={`group-${gi}-line-${li}`} className="mb-8 sm:mb-10 last:mb-0 scroll-mt-24">
                        <h3 className="text-base sm:text-lg font-semibold tracking-wide break-words text-slate-800">
                          {line.title}
                        </h3>
                        {line.subtitle && (
                          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{line.subtitle}</p>
                        )}

                        {list.length > 0 ? (
                          <div className="mt-4 sm:mt-6 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                            {list.map((p) => (
                              <Card key={p.id} p={p} />
                            ))}
                          </div>
                        ) : (
                          <p className="mt-4 text-xs sm:text-sm text-slate-400 italic">Prodotto in arrivo</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ProdottiPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">...</div>}>
      <ProdottiContent />
    </Suspense>
  );
}
