import Hero from "@/components/Hero";
import ScrollingBanner from "@/components/ScrollingBanner";
import ProductCategories from "@/components/ProductCategories";
import FeaturedProducts from "@/components/FeaturedProducts";
import { getTranslations } from "@/lib/i18n";

/** 预渲染所有语言版本的主页（静态导出必需） */
export async function generateStaticParams() {
  return [
    { lang: "it" },
    { lang: "en" },
    { lang: "es" },
  ];
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
