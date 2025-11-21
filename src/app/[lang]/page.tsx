import Hero from "@/components/Hero";
import ScrollingBanner from "@/components/ScrollingBanner";
import ProductCategories from "@/components/ProductCategories";
import FeaturedProducts from "@/components/FeaturedProducts";
import { getTranslations } from "@/lib/i18n";
import type { Metadata } from "next";

/** 预渲染所有语言版本的主页（静态导出必需） */
export async function generateStaticParams() {
  return [
    { lang: "it" },
    { lang: "en" },
    { lang: "es" },
  ];
}

/** SEO Metadata for homepage */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es"].includes(lang) ? lang : "it";
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
      },
    },
    openGraph: {
      type: "website",
      locale: validLang === 'it' ? 'it_IT' : validLang === 'es' ? 'es_ES' : 'en_US',
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
  const validLang = ["it", "en", "es"].includes(lang) ? lang : "it";
  const t = getTranslations(validLang);

  return (
    <main className="min-h-screen flex-col">
      {/* Hero Section with YouTube Video */}
      <Hero
        youtubeId="dBY-e6mFwOM"
        title={t("home.hero.title")}
        badge={t("home.hero.badge")}
        cta={t("home.hero.cta")}
        ctaHref={`/${validLang}/prodotti`}
        backgroundAlt={t("home.hero.title")}
        height="full"
        textAlign="center"
        centerContent={true}
      />

      {/* Scrolling Banner with Badges */}
      <ScrollingBanner />

      {/* I Nostri Prodotti Section */}
      <ProductCategories />

      {/* Featured Products Section */}
      <FeaturedProducts />
    </main>
  );
}
