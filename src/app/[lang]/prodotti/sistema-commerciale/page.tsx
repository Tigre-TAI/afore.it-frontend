"use client";

import { useParams } from "next/navigation";
import HeroBackground from "@/components/ui/HeroBackground";
import ProductCard from "@/components/ProductCard";
import ProdottiSidebar from "@/components/ProdottiSidebar";
import {
  VISIBLE_PRODUCTS,
  hrefOf,
  getProductTitle,
  getProductSubtitle,
} from "@/data/product-data";

/** ID mostrati in Sistema Residenziale: tutti gli altri vanno in Commerciale */
const RESIDENZIALE_PRODUCT_IDS = [
  "stringa-1-3kw",
  "stringa-3-6kw",
  "stringa-7-10kw",
  "stringa-trifase-3-25kw",
  "ibrido-monofase-1-3-6kw",
  "ibrido-monofase-plus-4-6kw",
  "ev-diamond",
  "ev-oval",
  "ev-square",
] as const;

const residenzialeSet = new Set(RESIDENZIALE_PRODUCT_IDS);
const commercialeProducts = VISIBLE_PRODUCTS.filter(
  (p) => !residenzialeSet.has(p.id as typeof RESIDENZIALE_PRODUCT_IDS[number])
);

export default function SistemaCommercialePage() {
  const params = useParams();
  const lang = (params?.lang as string) || "it";

  return (
    <main className="page-content font-sans">
      <section className="relative -mt-[88px] pt-[88px]">
        <HeroBackground src="/image/heroes/prodotti_hero.jpg" alt="Sistema Commerciale" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-white">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Sistema Commerciale
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/85">
            Soluzioni fotovoltaiche complete per applicazioni commerciali e industriali.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:gap-10 xl:gap-14">
            <ProdottiSidebar linkBase={`/${lang}/prodotti`} />
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {commercialeProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    href={hrefOf(p, lang)}
                    title={getProductTitle(p, lang)}
                    subtitle={getProductSubtitle(p, lang)}
                    image={p.image}
                    schedaKey={p.schedaKey}
                    productId={p.id}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
