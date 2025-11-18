// src/app/prodotti/page.tsx
"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS, hrefOf } from "@/data/product-data";
import { useTranslation } from "@/hooks/useTranslation";

/** 分类判断 */
const has = (p: any, slug: string) => p?.categories?.some((c: any) => c.slug === slug);

/** 页面分组（严格沿用你导航里的标题） */
const GROUPS = [
  {
    bigTitle: "PV Inverter",
    lines: [
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

export default function ProdottiPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "it";
  const { t } = useTranslation();

  /** 轻量封装你的 ProductCard */
  function Card({ p }: { p: any }) {
    return (
      <ProductCard
        href={hrefOf(p, lang)}
        title={p.title}
        subtitle={p.subtitle}
        image={p.image}
        schedaKey={p.schedaKey}
      />
    );
  }

  return (
    <main className="page-content font-sans">
      {/* ===== Hero ===== */}
      <section className="relative -mt-16 pt-16">
        <div className="absolute inset-0">
          <img
            src="/image/product_bg.jpg"
            alt="Prodotti"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 text-white">
          <Breadcrumb
            theme="dark"
            items={[
              { label: t('common.breadcrumb.home'), href: "/" },
              { label: t('prodotti.title') }, // 当前页
            ]}
          />
          <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight break-words">
            {t('prodotti.title')}
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/85">
            {t('prodotti.subtitle')}
          </p>
        </div>
      </section>

      {/* ===== 列表分组（按照导航结构与标题） ===== */}
      <section className="py-8 sm:py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
          {GROUPS.map((g, gi) => (
            <div key={gi}>
              {/* 大标题 + 横线 */}
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide break-words">
                  {g.bigTitle}
                </h2>
                <div className="mt-2 h-[2px] w-32 sm:w-40 bg-black/10" />
              </div>

              {/* 子线：标题 + 副标题 + 卡片网格 */}
              {g.lines.map((line, li) => {
                const list = PRODUCTS.filter(line.filter);
                if (list.length === 0) return null;

                return (
                  <div key={li} className="mb-8 sm:mb-10 last:mb-0">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-wide break-words">
                      {line.title}
                    </h3>
                    {line.subtitle && (
                      <p className="text-sm sm:text-base text-slate-500 mt-1">{line.subtitle}</p>
                    )}

                    <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                      {list.map((p) => (
                        <Card key={p.id} p={p} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
