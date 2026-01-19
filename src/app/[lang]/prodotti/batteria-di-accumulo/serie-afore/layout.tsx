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

/** SEO Metadata for batteria-di-accumulo/serie-afore page */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  
  const metadataByLang = {
    it: {
      title: "Serie Afore Batteria di Accumulo - Batterie Accumulo Fotovoltaico | Afore Italia",
      description: "Batterie di accumulo della serie Afore per sistemi fotovoltaici. Sistemi di accumulo per applicazioni residenziali e commerciali per massimizzare l'autoconsumo dell'energia solare.",
      keywords: "serie Afore batteria, batteria accumulo Afore, accumulo Afore serie, batteria fotovoltaico Afore, sistema accumulo Afore",
    },
    en: {
      title: "Afore Series Battery Storage - Photovoltaic Storage Batteries | Afore Italia",
      description: "Afore series battery storage for photovoltaic systems. Storage systems for residential and commercial applications to maximize solar energy self-consumption.",
      keywords: "Afore series battery, Afore battery storage, Afore series storage, Afore solar battery, Afore storage system",
    },
    es: {
      title: "Serie Afore Batería de Almacenamiento - Baterías Almacenamiento Fotovoltaico | Afore Italia",
      description: "Baterías de almacenamiento de la serie Afore para sistemas fotovoltaicos. Sistemas de almacenamiento para aplicaciones residenciales y comerciales para maximizar el autoconsumo de energía solar.",
      keywords: "serie Afore batería, batería almacenamiento Afore, almacenamiento Afore serie",
    },
    fr: {
      title: "Série Afore Batterie de Stockage - Batteries Stockage Photovoltaïque | Afore Italia",
      description: "Batteries de stockage de la série Afore pour systèmes photovoltaïques. Systèmes de stockage pour applications résidentielles et commerciales pour maximiser l'autoconsommation de l'énergie solaire.",
      keywords: "série Afore batterie, batterie stockage Afore, stockage Afore série",
    },
    de: {
      title: "Afore-Serie Batteriespeicher - Photovoltaik-Speicherbatterien | Afore Italia",
      description: "Afore-Serien-Batteriespeicher für Photovoltaik-Systeme. Speichersysteme für Wohn- und Gewerbeanwendungen zur Maximierung des solaren Eigenverbrauchs.",
      keywords: "Afore-Serie Batterie, Afore Batteriespeicher, Afore-Serien-Speicher",
    },
  };
  
  const meta = metadataByLang[validLang as keyof typeof metadataByLang] || metadataByLang.it;
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${baseUrl}/${validLang}/prodotti/batteria-di-accumulo/serie-afore`,
      languages: {
        'it': `${baseUrl}/it/prodotti/batteria-di-accumulo/serie-afore`,
        'en': `${baseUrl}/en/prodotti/batteria-di-accumulo/serie-afore`,
        'es': `${baseUrl}/es/prodotti/batteria-di-accumulo/serie-afore`,
        'fr': `${baseUrl}/fr/prodotti/batteria-di-accumulo/serie-afore`,
        'de': `${baseUrl}/de/prodotti/batteria-di-accumulo/serie-afore`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: validLang === 'it' ? 'it_IT' : validLang === 'es' ? 'es_ES' : validLang === 'fr' ? 'fr_FR' : validLang === 'de' ? 'de_DE' : 'en_US',
      url: `${baseUrl}/${validLang}/prodotti/batteria-di-accumulo/serie-afore`,
      title: meta.title,
      description: meta.description,
      siteName: "Afore Italia",
    },
  };
}

export default function SerieAforeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}




