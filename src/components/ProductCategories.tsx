"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { withLang } from "@/lib/lang-utils";
import FlatSection from "@/components/ui/FlatSection";

export default function ProductCategories() {
  const { t, lang } = useTranslation();

  const categories = [
    {
      title: t("prodotti.pvInverter.title"),
      description: t("prodotti.pvInverter.subtitle"),
      image: "/image/landing/products/category_pv_inverter.png",
      href: "/prodotti/pv-inverter",
      subcategories: [
        {
          title: t("prodotti.pvInverter.inverterDiStringa.title"),
          href: "/prodotti/inverter-di-stringa",
        },
        {
          title: t("prodotti.pvInverter.inverterIbrido.title"),
          href: "/prodotti/ibrido",
        },
      ],
    },
    {
      title: t("prodotti.batteriaDiAccumulo.title"),
      description: t("prodotti.batteriaDiAccumulo.subtitle"),
      image: "/image/landing/products/category_battery_storage.png",
      href: "/prodotti/batteria-di-accumulo",
      subcategories: [
        {
          title: "Sistema di accumulo Afore",
          href: "/prodotti/batteria-di-accumulo/serie-afore",
        },
        {
          title: "Sistema di accumulo Hailei",
          href: "/prodotti/batteria-di-accumulo/serie-accumulo-hailei",
        },
      ],
    },
    {
      title: t("prodotti.allInOne.title"),
      description: t("prodotti.allInOne.subtitle"),
      image: "/image/landing/products/category_all_in_one.png",
      href: "/prodotti/allin1",
      subcategories: [
        {
          title: "Sistema di accumulo Afore",
          href: "/prodotti/allin1/sistema-di-accumulo-afore",
        },
        {
          title: "Sistema di accumulo Hailei",
          href: "/prodotti/allin1/sistema-di-accumulo-hailei",
        },
      ],
    },
    {
      title: t("prodotti.evCharger.title"),
      description: t("prodotti.evCharger.subtitle"),
      image: "/image/landing/products/category_ev_charger.png",
      href: "/prodotti/ev-charger",
      subcategories: [],
    },
  ];

  return (
    <FlatSection bg="white">
      <div className="container">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            {t("home.productsSection.title")}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            {t("home.productsSection.description")}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <div key={index} className="group transition-all duration-300">
              <Link href={withLang(category.href, lang)} className="block">
                <div className="aspect-[4/3] relative overflow-hidden mb-3 sm:mb-4 transition-all duration-200 bg-transparent rounded-lg">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-contain group-hover:opacity-90 transition-opacity duration-200"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                    loading="lazy"
                    onError={(e) => {
                      console.error('Image failed to load:', category.image);
                    }}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 group-hover:text-[#C01C20] transition-colors duration-200 break-words">
                    {category.title}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-16">
          <Button href={withLang("/prodotti", lang)} variant="primary" trailingChevron>
            {t("home.productsSection.cta")}
          </Button>
        </div>
      </div>
    </FlatSection>
  );
}

