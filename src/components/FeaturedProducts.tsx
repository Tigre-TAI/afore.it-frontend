"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { PRODUCTS, hrefOf } from "@/data/product-data";
import ProductCard from "@/components/ProductCard";
import { withLang } from "@/lib/lang-utils";

export default function FeaturedProducts() {
  const { t, lang } = useTranslation();
  // Show first 6 products as featured
  const featuredProducts = PRODUCTS.slice(0, 6);

  return (
    <section className="py-8 md:py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                title={product.title}
                subtitle={product.subtitle}
                image={product.image}
                schedaKey={product.schedaKey}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <Link
            href={withLang("/prodotti", lang)}
            className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-brand-600 text-white text-sm md:text-base font-semibold rounded-lg hover:bg-brand-700 transition-all duration-300 transform hover:scale-105"
          >
            {t("home.featured_products.cta")}
            <svg
              className="ml-2 w-4 h-4 md:w-5 md:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14m-7-7l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

