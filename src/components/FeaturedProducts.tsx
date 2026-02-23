"use client";

import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/components/ui/Button";
import { VISIBLE_PRODUCTS, hrefOf, getProductTitle, getProductSubtitle } from "@/data/product-data";
import ProductCard from "@/components/ProductCard";
import { withLang } from "@/lib/lang-utils";
import FlatSection from "@/components/ui/FlatSection";

export default function FeaturedProducts() {
  const { t, lang } = useTranslation();
  // Show first 6 products as featured
  const featuredProducts = VISIBLE_PRODUCTS.slice(0, 6);

  return (
    <FlatSection bg="slate-50">
      <div className="container">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            {t("home.featured_products.title")}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            {t("home.featured_products.description")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="transition-all duration-500 opacity-100 h-full"
              style={{ transitionDelay: `${100 * index}ms` }}
            >
              <ProductCard
                href={hrefOf(product, lang)}
                title={getProductTitle(product, lang)}
                subtitle={getProductSubtitle(product, lang)}
                image={product.image}
                schedaKey={product.schedaKey}
                productId={product.id}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <Button href={withLang("/prodotti", lang)} variant="primary" trailingChevron>
            {t("home.featured_products.cta")}
          </Button>
        </div>
      </div>
    </FlatSection>
  );
}

