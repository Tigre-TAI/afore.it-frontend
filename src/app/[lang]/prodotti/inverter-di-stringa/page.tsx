"use client";

import Breadcrumb from "@/components/ui/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import { useParams } from "next/navigation";
import { PRODUCTS, hrefOf, getProductTitle, getProductSubtitle } from "@/data/product-data";
import { useTranslation } from "@/hooks/useTranslation";
import HeroBackground from "@/components/ui/HeroBackground";

/** 分类判断 */
const has = (p: any, slug: string) => p?.categories?.some((c: any) => c.slug === slug);

export default function InverterDiStringaPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "it";
  const { t } = useTranslation();
  const products = PRODUCTS.filter(
    (p) => has(p, "inverter") && has(p, "inverter-di-stringa")
  );

  return (
    <main className="page-content font-sans">
      {/* Hero */}
      <section className="relative -mt-[88px] pt-[88px]">
        <HeroBackground src="/image/heroes/prodotti_hero.jpg" alt="Inverter di Stringa" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-white">
          <Breadcrumb
            theme="dark"
            items={[
              { label: t('common.breadcrumb.home'), href: "/" },
              { label: t('prodotti.title'), href: "/prodotti" },
              { label: t('prodotti.pvInverter.inverterDiStringa.title') },
            ]}
          />
          <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            {t('prodotti.pvInverter.inverterDiStringa.title')}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/85">
            {t('prodotti.pvInverter.inverterDiStringa.subtitle')}
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                href={hrefOf(p, lang)}
                title={getProductTitle(p, lang)}
                subtitle={getProductSubtitle(p, lang)}
                image={p.image}
                schedaKey={p.schedaKey}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
