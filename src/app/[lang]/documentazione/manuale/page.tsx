import Breadcrumb from "@/components/ui/Breadcrumbs";
import Filters from "../_components/Filters";
import DocumentList from "../_components/DocumentList";
import { scanDocumentazioneDirectory } from "@/lib/document-utils";
import HeroBackground from "@/components/ui/HeroBackground";
import { withLang } from "@/lib/lang-utils";
import { getTranslations } from "@/lib/i18n";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ lang: string }>;
};

/** 预渲染所有语言版本的页面（静态导出必需） */
export async function generateStaticParams() {
  return [
    { lang: "it" },
    { lang: "en" },
    { lang: "es" },
    { lang: "fr" },
    { lang: "de" },
  ];
}

/** SEO Metadata for manuale page */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  
  return {
    title: "Manuali - Documentazione Tecnica Afore | Afore Italia",
    description: "Manuali tecnici completi per inverter fotovoltaici, inverter ibridi, batterie di accumulo e sistemi all-in-one Afore.",
    alternates: {
      canonical: `${baseUrl}/${validLang}/documentazione/manuale`,
      languages: {
        'it': `${baseUrl}/it/documentazione/manuale`,
        'en': `${baseUrl}/en/documentazione/manuale`,
        'es': `${baseUrl}/es/documentazione/manuale`,
        'fr': `${baseUrl}/fr/documentazione/manuale`,
        'de': `${baseUrl}/de/documentazione/manuale`,
      },
    },
  };
}

export default async function ManualePage({ params }: Props) {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const t = getTranslations(validLang);
  const documents = await scanDocumentazioneDirectory();
  
  return (
    <>
      {/* Hero */}
      <section className="relative -mt-[88px] pt-[88px]">
        <HeroBackground src="/image/documentazione_hero.jpg" alt="Manuale" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-white">
          <Breadcrumb
            theme="dark"
            items={[
              { label: t("common.breadcrumb.home"), href: withLang("/", validLang) },
              { label: t("documentazione.title"), href: withLang("/documentazione", validLang) },
              { label: t("documentazione.manuale.title") },
            ]}
          />
          <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight break-words">
            {t("documentazione.manuale.title") || "Manuale"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/85">
            {t("documentazione.manuale.subtitle") || "Consulta i manuali d'uso e installazione dei nostri prodotti."}
          </p>
        </div>
      </section>

      <Filters />
      <DocumentList documents={documents} />
    </>
  );
}

