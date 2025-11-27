import DocumentList from "../_components/DocumentList";
import PageIntro from "../_components/PageIntro";
import { scanDocumentazioneDirectory } from "@/lib/document-utils";
import Breadcrumb from "@/components/ui/Breadcrumbs";
import { withLang } from "@/lib/lang-utils";
import { getTranslations } from "@/lib/i18n";
import HeroBackground from "@/components/ui/HeroBackground";

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

export default async function ArchivioPage({ params }: Props) {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const t = getTranslations(validLang);
  const documents = await scanDocumentazioneDirectory();
  
  return (
    <main>
      {/* Hero */}
      <section className="relative -mt-16 pt-16">
        <HeroBackground src="/image/documentazione_hero.jpg" alt="Archivio" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 text-white">
          <Breadcrumb
            theme="dark"
            items={[
              { label: t("common.breadcrumb.home"), href: withLang("/", validLang) },
              { label: t("documentazione.title"), href: withLang("/documentazione", validLang) },
              { label: t("documentazione.archivio.title") || "Archivio Documentazione" },
            ]}
          />
          <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight break-words">
            {t("documentazione.archivio.title") || "Archivio Documentazione"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/85">
            {t("documentazione.archivio.subtitle") || "Archivio completo di certificazioni, manuali, schede tecniche e report ufficiali sempre accessibili."}
          </p>
        </div>
      </section>

      <PageIntro
        title={t("documentazione.archivio.title") || "Archivio Documentazione"}
        description={t("documentazione.archivio.subtitle") || "Archivio completo di certificazioni, manuali, schede tecniche e report ufficiali sempre accessibili."}
        bullets={[
          "Storico completo dei documenti pubblicati",
          "Download rapidi in formato originale",
          "Aggiornamenti costanti a cura del team tecnico",
        ]}
      />
      <DocumentList documents={documents} />
    </main>
  );
}

