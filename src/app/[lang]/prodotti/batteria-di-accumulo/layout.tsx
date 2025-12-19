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

/** SEO Metadata for batteria-di-accumulo page */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  
  const metadataByLang = {
    it: {
      title: "Batteria di Accumulo Afore - Sistemi di Accumulo Fotovoltaico | Afore Italia",
      description: "Batterie di accumulo Afore e Hailei per sistemi fotovoltaici. Sistemi di accumulo per massimizzare l'autoconsumo dell'energia solare residenziale e commerciale.",
      keywords: "batteria accumulo, batteria fotovoltaico, accumulo energia solare, batteria Afore, batteria Hailei, sistema accumulo",
    },
    en: {
      title: "Afore Battery Storage - Photovoltaic Storage Systems | Afore Italia",
      description: "Afore and Hailei battery storage for photovoltaic systems. Storage systems to maximize solar energy self-consumption for residential and commercial applications.",
      keywords: "battery storage, solar battery, solar energy storage, Afore battery, Hailei battery, storage system",
    },
    es: {
      title: "Batería de Almacenamiento Afore - Sistemas de Almacenamiento Fotovoltaico | Afore Italia",
      description: "Baterías de almacenamiento Afore y Hailei para sistemas fotovoltaicos. Sistemas de almacenamiento para maximizar el autoconsumo de energía solar residencial y comercial.",
      keywords: "batería almacenamiento, batería fotovoltaico, almacenamiento energía solar, batería Afore, batería Hailei",
    },
    fr: {
      title: "Batterie de Stockage Afore - Systèmes de Stockage Photovoltaïque | Afore Italia",
      description: "Batteries de stockage Afore et Hailei pour systèmes photovoltaïques. Systèmes de stockage pour maximiser l'autoconsommation de l'énergie solaire résidentielle et commerciale.",
      keywords: "batterie stockage, batterie photovoltaïque, stockage énergie solaire, batterie Afore, batterie Hailei",
    },
    de: {
      title: "Afore Batteriespeicher - Photovoltaik-Speichersysteme | Afore Italia",
      description: "Afore- und Hailei-Batteriespeicher für Photovoltaik-Systeme. Speichersysteme zur Maximierung des solaren Eigenverbrauchs für Wohn- und Gewerbeanwendungen.",
      keywords: "Batteriespeicher, Solarbatterie, Solarenergie-Speicher, Afore Batterie, Hailei Batterie",
    },
  };
  
  const meta = metadataByLang[validLang as keyof typeof metadataByLang] || metadataByLang.it;
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${baseUrl}/${validLang}/prodotti/batteria-di-accumulo`,
      languages: {
        'it': `${baseUrl}/it/prodotti/batteria-di-accumulo`,
        'en': `${baseUrl}/en/prodotti/batteria-di-accumulo`,
        'es': `${baseUrl}/es/prodotti/batteria-di-accumulo`,
        'fr': `${baseUrl}/fr/prodotti/batteria-di-accumulo`,
        'de': `${baseUrl}/de/prodotti/batteria-di-accumulo`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: validLang === 'it' ? 'it_IT' : validLang === 'es' ? 'es_ES' : validLang === 'fr' ? 'fr_FR' : validLang === 'de' ? 'de_DE' : 'en_US',
      url: `${baseUrl}/${validLang}/prodotti/batteria-di-accumulo`,
      title: meta.title,
      description: meta.description,
      siteName: "Afore Italia",
    },
  };
}

export default function BatteriaDiAccumuloLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

