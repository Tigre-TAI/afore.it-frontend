import DocumentList from "../_components/DocumentList";
import PageIntro from "../_components/PageIntro";
import { scanDocumentazioneDirectory } from "@/lib/document-utils";
import { withLang } from "@/lib/lang-utils";
import { getTranslations } from "@/lib/i18n";
import HeroBackground from "@/components/ui/HeroBackground";
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

/** SEO Metadata for guida page */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  
  return {
    title: "Guide - Documentazione Tecnica Afore | Afore Italia",
    description: "Guide tecniche per l'installazione e la configurazione di inverter fotovoltaici, inverter ibridi e sistemi di accumulo Afore.",
    alternates: {
      canonical: `${baseUrl}/${validLang}/documentazione/guida`,
      languages: {
        'it': `${baseUrl}/it/documentazione/guida`,
        'en': `${baseUrl}/en/documentazione/guida`,
        'es': `${baseUrl}/es/documentazione/guida`,
        'fr': `${baseUrl}/fr/documentazione/guida`,
        'de': `${baseUrl}/de/documentazione/guida`,
      },
    },
  };
}

export default async function GuidaPage({ params }: Props) {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const t = getTranslations(validLang);
  const documents = await scanDocumentazioneDirectory();
  
  return (
    <main>
      {/* Hero */}
      <section className="relative -mt-[88px] pt-[88px]">
        <HeroBackground src="/image/documentazione_hero.jpg" alt="Guida" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-white">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight break-words">
            {t("documentazione.cei.title") || "Guida Regolamento di Esercizio"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/85">
            {t("documentazione.cei.subtitle") || "Procedure ufficiali per completare correttamente regolamenti, addendum tecnici e verifiche di conformità."}
          </p>
        </div>
      </section>

      <PageIntro
        title={t("documentazione.cei.title") || "Guida Regolamento di Esercizio"}
        description={t("documentazione.cei.subtitle") || "Procedure ufficiali per completare correttamente regolamenti, addendum tecnici e verifiche di conformità."}
        bullets={[
          "Template aggiornati per RDE",
          "Addendum tecnici per impianti monofase e trifase",
          "Test verification of conformity",
        ]}
      />
      <DocumentList documents={documents} docTypeFilter="guida-regolamento" />
    </main>
  );
}

