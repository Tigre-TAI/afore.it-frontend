"use client";

import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/components/ui/Button";
import { VISIBLE_PRODUCTS, hrefOf, getProductTitle, getProductSubtitle } from "@/data/product-data";
import ProductCard from "@/components/ProductCard";
import { withLang } from "@/lib/lang-utils";
import FlatSection from "@/components/ui/FlatSection";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function FeaturedProducts() {
  const { t, lang } = useTranslation();
  const featuredProducts = VISIBLE_PRODUCTS.slice(0, 6);

  return (
    <FlatSection bg="slate-50" className="-mt-8">
      <div id="featured" className="container scroll-mt-24">
        <RevealOnScroll>
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              {t("home.featured_products.title")}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              {t("home.featured_products.description")}
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="reveal-stagger-children grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              href={hrefOf(product, lang)}
              title={getProductTitle(product, lang)}
              subtitle={getProductSubtitle(product, lang)}
              image={product.image}
              schedaKey={product.schedaKey}
              productId={product.id}
            />
          ))}
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="text-center mt-8 md:mt-12">
            <Button href={withLang("/prodotti", lang)} variant="primary" trailingChevron>
              {t("home.featured_products.cta")}
            </Button>
          </div>
        </RevealOnScroll>
      </div>
    </FlatSection>
  );
}

