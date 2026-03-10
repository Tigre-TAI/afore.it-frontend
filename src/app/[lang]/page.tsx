import Hero from "@/components/Hero";
import ScrollingBanner from "@/components/ScrollingBanner";
import HomeSectionNav from "@/components/HomeSectionNav";
import { getTranslations } from "@/lib/i18n";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

// Lazy load below-fold components to improve LCP
const ProductCategories = dynamic(() => import("@/components/ProductCategories"), {
  loading: () => <div className="section bg-white" />,
  ssr: true, // Still SSR for SEO, but code-split
});

const BrandShortVideo = dynamic(() => import("@/components/BrandShortVideo"), {
  loading: () => <div className="section bg-slate-50" />,
  ssr: true,
});

const LandingCards = dynamic(() => import("@/components/LandingCards"), {
  ssr: true,
});

const DataVizSection = dynamic(() => import("@/components/DataVizSection"), {
  ssr: true,
});

/** 预渲染所有语言版本的主页（静态导出必需） */
export async function generateStaticParams() {
  return [
    { lang: "it" },
    { lang: "en" },
    { lang: "es" },
    { lang: "fr" },
    { lang: "de" },
  ];
}

/** SEO Metadata for homepage */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  const t = getTranslations(validLang);
  
  const metadataByLang = {
    it: {
      title: "Afore Italia - il sito ufficiale",
      description: "Afore Italia è leader mondiale in inverter fotovoltaici, inverter ibridi, batterie di accumulo e sistemi fotovoltaici completi. Scopri la nostra gamma di inverter di stringa, inverter ibridi monofase e trifase, batterie Afore e Hailei per energia solare residenziale e commerciale.",
      keywords: "Afore, Afore Italia, inverter fotovoltaico, inverter ibrido, inverter di stringa, batteria accumulo, fotovoltaico Italia, energia solare, inverter solare, pannelli solari, sistemi fotovoltaici, Afore inverter, Hailei batterie, accumulo energia solare, TopBrand 2025",
    },
    en: {
      title: "Afore Italia - World Leader Solar Inverter and Solar Systems | TopBrand 2025",
      description: "Afore Italia is a world leader in solar inverters, hybrid inverters, battery storage and complete photovoltaic systems. Discover our range of string inverters, hybrid inverters, Afore and Hailei batteries for residential and commercial solar energy.",
      keywords: "Afore, Afore Italia, solar inverter, hybrid inverter, string inverter, battery storage, solar energy, photovoltaic systems, Afore inverter, Hailei batteries, TopBrand 2025",
    },
    es: {
      title: "Afore Italia - Líder Mundial Inversor Solar y Sistemas Solares | TopBrand 2025",
      description: "Afore Italia es líder mundial en inversores solares, inversores híbridos, baterías y sistemas fotovoltaicos completos. Descubre nuestra gama de inversores de cadena, inversores híbridos, baterías Afore y Hailei para energía solar residencial y comercial.",
      keywords: "Afore, Afore Italia, inversor solar, inversor híbrido, inversor de cadena, baterías, energía solar, sistemas fotovoltaicos, TopBrand 2025",
    },
    fr: {
      title: "Afore Italia - Leader Mondial Onduleur Solaire et Systèmes Solaires | TopBrand 2025",
      description: "Afore Italia est leader mondial en onduleurs solaires, onduleurs hybrides, batteries et systèmes photovoltaïques complets. Découvrez notre gamme d'onduleurs de chaîne, onduleurs hybrides, batteries Afore et Hailei pour l'énergie solaire résidentielle et commerciale.",
      keywords: "Afore, Afore Italia, onduleur solaire, onduleur hybride, onduleur de chaîne, batteries, énergie solaire, systèmes photovoltaïques, TopBrand 2025",
    },
    de: {
      title: "Afore Italia - Weltmarktführer Solar-Wechselrichter und Solar-Systeme | TopBrand 2025",
      description: "Afore Italia ist Weltmarktführer in Solar-Wechselrichtern, Hybrid-Wechselrichtern, Batterien und vollständigen Photovoltaik-Systemen. Entdecken Sie unser Sortiment an String-Wechselrichtern, Hybrid-Wechselrichtern, Afore- und Hailei-Batterien für private und gewerbliche Solarenergie.",
      keywords: "Afore, Afore Italia, Solar-Wechselrichter, Hybrid-Wechselrichter, String-Wechselrichter, Batterien, Solarenergie, Photovoltaik-Systeme, TopBrand 2025",
    },
  };
  
  const meta = metadataByLang[validLang as keyof typeof metadataByLang] || metadataByLang.it;
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${baseUrl}/${validLang}`,
      languages: {
        'it': `${baseUrl}/it`,
        'en': `${baseUrl}/en`,
        'es': `${baseUrl}/es`,
        'fr': `${baseUrl}/fr`,
        'de': `${baseUrl}/de`,
      },
    },
    openGraph: {
      type: "website",
      locale: validLang === 'it' ? 'it_IT' : validLang === 'es' ? 'es_ES' : validLang === 'fr' ? 'fr_FR' : validLang === 'de' ? 'de_DE' : 'en_US',
      url: `${baseUrl}/${validLang}`,
      title: meta.title,
      description: meta.description,
      siteName: "Afore Italia",
      images: [
        {
          url: `${baseUrl}/image/logos/logo_afore_light.png`,
          width: 1200,
          height: 630,
          alt: validLang === 'it' ? "Afore Italia - il sito ufficiale" : "Afore Italia",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [`${baseUrl}/image/logos/logo_afore_light.png`],
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const t = getTranslations(validLang);

  return (
    <main className="min-h-screen flex-col relative">
      <HomeSectionNav />
      {/* 首屏：-mt-[88px] 使 Hero 轮播顶到视口顶部，导航叠在上方 */}
      <div
        id="hero"
        className="-mt-[88px] h-screen min-h-[480px] flex flex-col overflow-hidden"
      >
        <Hero
            key="hero"
            backgroundImages={[
              "/image/heroes/hero_carousel_1.jpg",
              "/image/heroes/hero_carousel_2.jpg",
              "/image/heroes/hero_carousel_3.jpg",
              "/image/heroes/hero_carousel_4.jpg",
            ]}
            title={t("home.hero.title")}
            badge={t("home.hero.badge")}
            cta={t("home.hero.cta")}
            ctaHref={`/${validLang}/prodotti`}
            backgroundAlt={t("home.hero.title")}
            fillHeight
            textAlign="center"
            centerContent={true}
          />
        <ScrollingBanner />
      </div>

      {/* Brand Short Video */}
      <BrandShortVideo />

      {/* 下方左右卡片 */}
      <LandingCards />

      {/* I Nostri Prodotti Section */}
      <ProductCategories />

      {/* 数据可视化：地球自转视频背景，紧接 footer */}
      <DataVizSection />
    </main>
  );
}
