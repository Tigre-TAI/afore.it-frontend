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

/** SEO Metadata for batteria-di-accumulo/serie-accumulo-hailei page */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  
  const metadataByLang = {
    it: {
      title: "Serie Accumulo Hailei - Batterie Accumulo Fotovoltaico Hailei | Afore Italia",
      description: "Batterie di accumulo Hailei consigliate da Afore per prestazioni superiori. Sistemi di accumulo per applicazioni residenziali e commerciali per massimizzare l'autoconsumo dell'energia solare.",
      keywords: "serie Hailei batteria, batteria accumulo Hailei, accumulo Hailei serie, batteria fotovoltaico Hailei, sistema accumulo Hailei",
    },
    en: {
      title: "Hailei Storage Series - Hailei Photovoltaic Storage Batteries | Afore Italia",
      description: "Hailei battery storage recommended by Afore for superior performance. Storage systems for residential and commercial applications to maximize solar energy self-consumption.",
      keywords: "Hailei series battery, Hailei battery storage, Hailei series storage, Hailei solar battery, Hailei storage system",
    },
    es: {
      title: "Serie Almacenamiento Hailei - Baterías Almacenamiento Fotovoltaico Hailei | Afore Italia",
      description: "Baterías de almacenamiento Hailei recomendadas por Afore para un rendimiento superior. Sistemas de almacenamiento para aplicaciones residenciales y comerciales para maximizar el autoconsumo de energía solar.",
      keywords: "serie Hailei batería, batería almacenamiento Hailei, almacenamiento Hailei serie",
    },
    fr: {
      title: "Série Stockage Hailei - Batteries Stockage Photovoltaïque Hailei | Afore Italia",
      description: "Batteries de stockage Hailei recommandées par Afore pour des performances supérieures. Systèmes de stockage pour applications résidentielles et commerciales pour maximiser l'autoconsommation de l'énergie solaire.",
      keywords: "série Hailei batterie, batterie stockage Hailei, stockage Hailei série",
    },
    de: {
      title: "Hailei Speicher-Serie - Hailei Photovoltaik-Speicherbatterien | Afore Italia",
      description: "Hailei-Batteriespeicher von Afore empfohlen für überlegene Leistung. Speichersysteme für Wohn- und Gewerbeanwendungen zur Maximierung des solaren Eigenverbrauchs.",
      keywords: "Hailei-Serie Batterie, Hailei Batteriespeicher, Hailei-Serien-Speicher",
    },
  };
  
  const meta = metadataByLang[validLang as keyof typeof metadataByLang] || metadataByLang.it;
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${baseUrl}/${validLang}/prodotti/batteria-di-accumulo/serie-accumulo-hailei`,
      languages: {
        'it': `${baseUrl}/it/prodotti/batteria-di-accumulo/serie-accumulo-hailei`,
        'en': `${baseUrl}/en/prodotti/batteria-di-accumulo/serie-accumulo-hailei`,
        'es': `${baseUrl}/es/prodotti/batteria-di-accumulo/serie-accumulo-hailei`,
        'fr': `${baseUrl}/fr/prodotti/batteria-di-accumulo/serie-accumulo-hailei`,
        'de': `${baseUrl}/de/prodotti/batteria-di-accumulo/serie-accumulo-hailei`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: validLang === 'it' ? 'it_IT' : validLang === 'es' ? 'es_ES' : validLang === 'fr' ? 'fr_FR' : validLang === 'de' ? 'de_DE' : 'en_US',
      url: `${baseUrl}/${validLang}/prodotti/batteria-di-accumulo/serie-accumulo-hailei`,
      title: meta.title,
      description: meta.description,
      siteName: "Afore Italia",
    },
  };
}

export default function SerieAccumuloHaileiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

