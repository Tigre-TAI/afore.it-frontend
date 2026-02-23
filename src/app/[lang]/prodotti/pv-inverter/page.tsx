"use client";

import { useParams } from "next/navigation";
import HeroBackground from "@/components/ui/HeroBackground";
import ProductCard from "@/components/ProductCard";
import { VISIBLE_PRODUCTS, hrefOf, getProductTitle, getProductSubtitle } from "@/data/product-data";

/** 分类判断 */
const has = (p: any, slug: string) => p?.categories?.some((c: any) => c.slug === slug);

export default function PVInverterPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "it";
  // Filter products that are inverters
  const inverterProducts = VISIBLE_PRODUCTS.filter((p) => has(p, "inverter"));

  return (
    <main className="page-content font-sans">
      {/* Hero */}
      <section className="relative -mt-[88px] pt-[88px]">
        <HeroBackground src="/image/heroes/prodotti_hero.jpg" alt="PV Inverter" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-white">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            PV Inverter
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/85">
            Soluzioni complete per l'inversione dell'energia solare.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {inverterProducts.map((p) => (
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
