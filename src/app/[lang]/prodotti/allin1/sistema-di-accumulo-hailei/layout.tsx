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

/** SEO Metadata for allin1/sistema-di-accumulo-hailei page */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  
  const metadataByLang = {
    it: {
      title: "Sistema di Accumulo Hailei All in One - Sistemi Integrati Serie Hailei | Afore Italia",
      description: "Sistemi All in One con accumulo della serie Hailei. Soluzioni integrate con inverter e accumulo in un'unica unità per massimizzare l'autoconsumo dell'energia solare.",
      keywords: "sistema accumulo Hailei, all in one Hailei, sistemi integrati Hailei, accumulo Hailei serie, Hailei all-in-one",
    },
    en: {
      title: "Hailei Storage System All in One - Integrated Hailei Series Systems | Afore Italia",
      description: "All in One systems with Hailei series storage. Integrated solutions with inverter and storage in a single unit to maximize solar energy self-consumption.",
      keywords: "Hailei storage system, Hailei all in one, Hailei integrated systems, Hailei series storage",
    },
    es: {
      title: "Sistema de Almacenamiento Hailei All in One - Sistemas Integrados Serie Hailei | Afore Italia",
      description: "Sistemas All in One con almacenamiento de la serie Hailei. Soluciones integradas con inversor y almacenamiento en una sola unidad para maximizar el autoconsumo de energía solar.",
      keywords: "sistema almacenamiento Hailei, all in one Hailei, sistemas integrados Hailei",
    },
    fr: {
      title: "Système de Stockage Hailei All in One - Systèmes Intégrés Série Hailei | Afore Italia",
      description: "Systèmes All in One avec stockage de la série Hailei. Solutions intégrées avec onduleur et stockage dans une seule unité pour maximiser l'autoconsommation de l'énergie solaire.",
      keywords: "système stockage Hailei, all in one Hailei, systèmes intégrés Hailei",
    },
    de: {
      title: "Hailei Speichersystem All in One - Integrierte Hailei-Serien-Systeme | Afore Italia",
      description: "All in One Systeme mit Hailei-Serien-Speicher. Integrierte Lösungen mit Wechselrichter und Speicher in einer einzigen Einheit zur Maximierung des solaren Eigenverbrauchs.",
      keywords: "Hailei Speichersystem, Hailei all in one, Hailei integrierte Systeme",
    },
  };
  
  const meta = metadataByLang[validLang as keyof typeof metadataByLang] || metadataByLang.it;
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${baseUrl}/${validLang}/prodotti/allin1/sistema-di-accumulo-hailei`,
      languages: {
        'it': `${baseUrl}/it/prodotti/allin1/sistema-di-accumulo-hailei`,
        'en': `${baseUrl}/en/prodotti/allin1/sistema-di-accumulo-hailei`,
        'es': `${baseUrl}/es/prodotti/allin1/sistema-di-accumulo-hailei`,
        'fr': `${baseUrl}/fr/prodotti/allin1/sistema-di-accumulo-hailei`,
        'de': `${baseUrl}/de/prodotti/allin1/sistema-di-accumulo-hailei`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: validLang === 'it' ? 'it_IT' : validLang === 'es' ? 'es_ES' : validLang === 'fr' ? 'fr_FR' : validLang === 'de' ? 'de_DE' : 'en_US',
      url: `${baseUrl}/${validLang}/prodotti/allin1/sistema-di-accumulo-hailei`,
      title: meta.title,
      description: meta.description,
      siteName: "Afore Italia",
    },
  };
}

export default function SistemaDiAccumuloHaileiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}




