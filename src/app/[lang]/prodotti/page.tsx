// src/app/prodotti/page.tsx
"use client";

import { Suspense, useState } from "react";
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

/** 分类判断 */
const has = (p: any, slug: string) => p?.categories?.some((c: any) => c.slug === slug);

/** 页面分组（严格沿用你导航里的标题） */
const GROUPS = [
  {
    bigTitle: "PV Inverter",
    /** 左侧下拉子项，第一个默认展开 */
    subItems: [
      { label: "Ottimizzatori", lineIndex: 0 },
      { label: "Inverter di Stringa", lineIndex: 1 },
      { label: "Inverter Ibrido", lineIndex: 2 },
    ],
    lines: [
      {
        title: "Ottimizzatori",
        subtitle: "",
        filter: (_p: any) => false, // 暂无产品
      },
      {
        title: "Inverter di Stringa",
        subtitle: "Monofase · Trifase",
        filter: (p: any) => has(p, "inverter") && has(p, "inverter-di-stringa"),
      },
      {
        title: "Inverter Ibrido",
        subtitle: "Monofase · Trifase",
        filter: (p: any) => has(p, "inverter") && has(p, "ibrido"),
      },
    ],
  },
  {
    bigTitle: "Batteria di Accumulo",
    lines: [
      {
        title: "Sistema di accumulo Afore",
        subtitle: "AFORE Serie",
        filter: (p: any) => has(p, "batteria") && has(p, "afore"),
      },
      {
        title: "Sistema di accumulo Hailei",
        subtitle: "AFORE Serie",
        filter: (p: any) => has(p, "batteria") && has(p, "hailei"),
      },
    ],
  },
  {
    bigTitle: "All in One",
    lines: [
      {
        title: "Sistema di accumulo Afore",
        subtitle: "Monofase · Trifase",
        filter: (p: any) => has(p, "all-in-one") && has(p, "afore"),
      },
      {
        title: "Sistema di accumulo Hailei",
        subtitle: "Monofase",
        filter: (p: any) => has(p, "all-in-one") && has(p, "hailei"),
      },
    ],
  },
  {
    bigTitle: "EV CHARGER",
    lines: [
      {
        // 你的数据里形状（diamante/ovale/quadrata）没有独立分类，先合并展示
        title: "Forma a diamante · Forma ovale · Forma quadrata",
        subtitle: "Serie personalizzata",
        filter: (p: any) => has(p, "ev-charger"),
      },
    ],
  },
] as const;

function ProdottiContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const lang = (params?.lang as string) || "it";
  const { t } = useTranslation();
  const searchQ = searchParams?.get("search")?.trim() || "";
  // 左侧小标题展开状态，默认第一个 PV Inverter 展开
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true });

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
            {/* 左侧小标题 */}
            <aside className="lg:w-44 xl:w-52 shrink-0 mb-8 lg:mb-0">
              <nav className="sticky top-24 space-y-0.5">
                {GROUPS.map((g, gi) => {
                  const isExpanded = expanded[gi] ?? false;
                  const hasSub = "subItems" in g && g.subItems && g.subItems.length > 0;

                  return (
                    <div key={gi}>
                      <div className="flex items-center gap-0.5">
                        {hasSub && (
                          <button
                            type="button"
                            onClick={() => setExpanded((s) => ({ ...s, [gi]: !s[gi] }))}
                            className="p-0.5 -ml-0.5 text-slate-500 hover:text-slate-700 transition-colors"
                            aria-expanded={isExpanded}
                          >
                            <svg
                              className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                        <a
                          href={`#group-${gi}`}
                          className="block text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 py-1.5 border-l-2 border-transparent hover:border-slate-300 pl-2 -ml-px transition-colors flex-1"
                        >
                          {g.bigTitle}
                        </a>
                      </div>
                      {hasSub && isExpanded && (
                        <div className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-200 pl-3">
                          {g.subItems!.map((sub, si) => (
                            <a
                              key={si}
                              href={`#group-${gi}-line-${sub.lineIndex}`}
                              className="block text-[11px] sm:text-xs font-medium text-slate-500 hover:text-slate-800 py-1 transition-colors"
                            >
                              {sub.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </aside>

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
