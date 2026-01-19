import type { Metadata } from "next";

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

/** SEO Metadata for ibrido page */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  
  const metadataByLang = {
    it: {
      title: "Inverter Ibrido Afore - Inverter con Accumulo Integrato | Afore Italia",
      description: "Inverter ibridi Afore monofase e trifase con accumulo integrato. Soluzioni complete per massimizzare l'autoconsumo dell'energia solare con batterie di accumulo.",
      keywords: "inverter ibrido, inverter con accumulo, inverter fotovoltaico ibrido, Afore inverter ibrido, inverter solare ibrido",
    },
    en: {
      title: "Afore Hybrid Inverter - Inverter with Integrated Storage | Afore Italia",
      description: "Afore single-phase and three-phase hybrid inverters with integrated storage. Complete solutions to maximize solar energy self-consumption with battery storage.",
      keywords: "hybrid inverter, inverter with storage, hybrid solar inverter, Afore hybrid inverter",
    },
    es: {
      title: "Inversor Híbrido Afore - Inversor con Almacenamiento Integrado | Afore Italia",
      description: "Inversores híbridos Afore monofásicos y trifásicos con almacenamiento integrado. Soluciones completas para maximizar el autoconsumo de energía solar con baterías.",
      keywords: "inversor híbrido, inversor con almacenamiento, inversor solar híbrido",
    },
    fr: {
      title: "Onduleur Hybride Afore - Onduleur avec Stockage Intégré | Afore Italia",
      description: "Onduleurs hybrides Afore monophasés et triphasés avec stockage intégré. Solutions complètes pour maximiser l'autoconsommation de l'énergie solaire avec batteries.",
      keywords: "onduleur hybride, onduleur avec stockage, onduleur solaire hybride",
    },
    de: {
      title: "Afore Hybrid-Wechselrichter - Wechselrichter mit Integriertem Speicher | Afore Italia",
      description: "Afore Einphasen- und Dreiphasen-Hybrid-Wechselrichter mit integriertem Speicher. Komplette Lösungen zur Maximierung des solaren Eigenverbrauchs mit Batteriespeicher.",
      keywords: "Hybrid-Wechselrichter, Wechselrichter mit Speicher, Hybrid-Solar-Wechselrichter",
    },
  };
  
  const meta = metadataByLang[validLang as keyof typeof metadataByLang] || metadataByLang.it;
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${baseUrl}/${validLang}/prodotti/ibrido`,
      languages: {
        'it': `${baseUrl}/it/prodotti/ibrido`,
        'en': `${baseUrl}/en/prodotti/ibrido`,
        'es': `${baseUrl}/es/prodotti/ibrido`,
        'fr': `${baseUrl}/fr/prodotti/ibrido`,
        'de': `${baseUrl}/de/prodotti/ibrido`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: validLang === 'it' ? 'it_IT' : validLang === 'es' ? 'es_ES' : validLang === 'fr' ? 'fr_FR' : validLang === 'de' ? 'de_DE' : 'en_US',
      url: `${baseUrl}/${validLang}/prodotti/ibrido`,
      title: meta.title,
      description: meta.description,
      siteName: "Afore Italia",
    },
  };
}

export default function IbridoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}




