"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/ProductCard";
import { useTranslation } from "@/hooks/useTranslation";
import { withLang } from "@/lib/lang-utils";
import { byId, hrefOf, getProductTitle, getProductSubtitle } from "@/data/product-data";
import FlatSection from "@/components/ui/FlatSection";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import ProdottiVideoTabs from "@/components/ProdottiVideoTabs";

/** 每个 tab 下方展示的产品 id：Inverter / Accumulo / EV / Pompe */
const FEATURED_PRODUCT_IDS: readonly (readonly string[])[] = [
  ["ibrido-monofase-plus-4-6kw", "ibrido-trifase-3-30kw", "stringa-trifase-36-60kw", "stringa-trifase-70-110kw"],
  ["atomwb512100-1", "atomwb512100", "bat-hailei-atom-ls-10-15kwh", "bat-hailei-atom-hs-15-41kwh"],
  ["ev-diamond", "ev-oval", "ev-square"], // Ricarica per Veicoli Elettrici
  ["shenling-r290", "shenling-r290-2", "shenling-r290-all-in-one", "shenling-r32"], // Pompe di Calore
];

export default function ProductCategories() {
  const { t, lang } = useTranslation();
  const [videoTabIndex, setVideoTabIndex] = useState(0);

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
    {
      title: t("prodotti.pompaDiCalore.title"),
      description: t("prodotti.pompaDiCalore.subtitle"),
      image: "/products/Heat pump/Shenling R290.png",
      href: "/prodotti#group-3",
      subcategories: [
        {
          title: "Shenling R290 · R32 · All in One",
          href: "/prodotti#group-3",
        },
      ],
    },
  ];

  return (
    <FlatSection bg="white" className="-mt-8">
      <div id="products" className="container scroll-mt-24">
        <RevealOnScroll>
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              {t("home.productsSection.title")}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              {t("home.productsSection.description")}
            </p>
          </div>
        </RevealOnScroll>

        {/* 卡片布局更接近参考截图：四列产品卡片，图标 + 标题 + 简短描述 */}
        <RevealOnScroll className="reveal-stagger-children grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={withLang(category.href, lang)}
              className="flex flex-col items-center bg-transparent pt-5 pb-4 px-4 text-center"
            >
              <span className="group/product flex flex-col items-center w-full">
                <div className="relative w-full max-w-[180px] aspect-[3/4] mb-0 overflow-hidden rounded-xl">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-contain transition-transform duration-300 group-hover/product:scale-105"
                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 20vw"
                    loading="lazy"
                    onError={() => {
                      console.error("Image failed to load:", category.image);
                    }}
                  />
                </div>
                <h3 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover/product:text-[#C01C20]">
                  {category.title}
                </h3>
              </span>
              {category.description && (
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </RevealOnScroll>

        {/* 四分类标签 + 视频切换（与下方产品卡片联动） */}
        <ProdottiVideoTabs activeIndex={videoTabIndex} onTabChange={setVideoTabIndex} />

        {/* 视频下方四个产品卡片，随 tab 切换（Inverter / Sistemi di Accumulo / …） */}
        <RevealOnScroll className="mt-6 sm:mt-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {FEATURED_PRODUCT_IDS[videoTabIndex]
              .map((id) => byId[id])
              .filter(Boolean)
              .map((p) => (
                <ProductCard
                  key={p.id}
                  href={hrefOf(p, lang)}
                  image={p.image}
                  title={getProductTitle(p, lang) ?? p.title}
                  subtitle={getProductSubtitle(p, lang) ?? p.subtitle}
                  schedaKey={p.schedaKey}
                  productId={p.id}
                />
              ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="text-center mt-8 md:mt-16">
            <Button href={withLang("/prodotti", lang)} variant="primary" trailingChevron>
              {t("home.productsSection.cta")}
            </Button>
          </div>
        </RevealOnScroll>
      </div>
    </FlatSection>
  );
}

