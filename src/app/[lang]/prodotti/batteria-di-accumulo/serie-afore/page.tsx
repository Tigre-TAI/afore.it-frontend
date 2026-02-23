"use client";

import ProductCard from "@/components/ProductCard";
import { useParams } from "next/navigation";
import { VISIBLE_PRODUCTS, hrefOf, getProductTitle, getProductSubtitle } from "@/data/product-data";
import HeroBackground from "@/components/ui/HeroBackground";

/** 分类判断 */
const has = (p: any, slug: string) => p?.categories?.some((c: any) => c.slug === slug);

export default function SerieAforePage() {
  const params = useParams();
  const lang = (params?.lang as string) || "it";
  const products = VISIBLE_PRODUCTS.filter(
    (p) => has(p, "batteria") && has(p, "afore")
  );

  return (
    <main className="page-content font-sans">
      {/* Hero */}
      <section className="relative -mt-[88px] pt-[88px]">
        <HeroBackground src="/image/heroes/prodotti_hero.jpg" alt="Serie Afore" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 text-white">
          <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight">
            Serie Afore
          </h1>
          <p className="mt-3 max-w-2xl text-white/85">
            Batterie di accumulo della serie Afore per applicazioni residenziali e commerciali.
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
