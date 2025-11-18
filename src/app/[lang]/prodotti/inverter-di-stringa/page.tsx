"use client";

import Breadcrumb from "@/components/ui/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import { useParams } from "next/navigation";
import { PRODUCTS, hrefOf } from "@/data/product-data";
import { useTranslation } from "@/hooks/useTranslation";

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
      <section className="relative -mt-16 pt-16">
        <div className="absolute inset-0">
          <img
            src="/image/product_bg.jpg"
            alt="Inverter di Stringa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 text-white">
          <Breadcrumb
            theme="dark"
            items={[
              { label: t('common.breadcrumb.home'), href: "/" },
              { label: t('prodotti.title'), href: "/prodotti" },
              { label: t('prodotti.pvInverter.inverterDiStringa.title') },
            ]}
          />
          <h1 className="mt-3 text-3xl lg:text-5xl font-extrabold tracking-tight">
            {t('prodotti.pvInverter.inverterDiStringa.title')}
          </h1>
          <p className="mt-3 max-w-2xl text-white/85">
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
                title={p.title}
                subtitle={p.subtitle}
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
