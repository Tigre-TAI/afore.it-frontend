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

/** SEO Metadata for allin1/sistema-di-accumulo-afore page */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  
  const metadataByLang = {
    it: {
      title: "Sistema di Accumulo Afore All in One - Sistemi Integrati Serie Afore | Afore Italia",
      description: "Sistemi All in One con accumulo della serie Afore. Soluzioni integrate con inverter e accumulo in un'unica unità per massimizzare l'autoconsumo dell'energia solare.",
      keywords: "sistema accumulo Afore, all in one Afore, sistemi integrati Afore, accumulo Afore serie, Afore all-in-one",
    },
    en: {
      title: "Afore Storage System All in One - Integrated Afore Series Systems | Afore Italia",
      description: "All in One systems with Afore series storage. Integrated solutions with inverter and storage in a single unit to maximize solar energy self-consumption.",
      keywords: "Afore storage system, Afore all in one, Afore integrated systems, Afore series storage",
    },
    es: {
      title: "Sistema de Almacenamiento Afore All in One - Sistemas Integrados Serie Afore | Afore Italia",
      description: "Sistemas All in One con almacenamiento de la serie Afore. Soluciones integradas con inversor y almacenamiento en una sola unidad para maximizar el autoconsumo de energía solar.",
      keywords: "sistema almacenamiento Afore, all in one Afore, sistemas integrados Afore",
    },
    fr: {
      title: "Système de Stockage Afore All in One - Systèmes Intégrés Série Afore | Afore Italia",
      description: "Systèmes All in One avec stockage de la série Afore. Solutions intégrées avec onduleur et stockage dans une seule unité pour maximiser l'autoconsommation de l'énergie solaire.",
      keywords: "système stockage Afore, all in one Afore, systèmes intégrés Afore",
    },
    de: {
      title: "Afore Speichersystem All in One - Integrierte Afore-Serien-Systeme | Afore Italia",
      description: "All in One Systeme mit Afore-Serien-Speicher. Integrierte Lösungen mit Wechselrichter und Speicher in einer einzigen Einheit zur Maximierung des solaren Eigenverbrauchs.",
      keywords: "Afore Speichersystem, Afore all in one, Afore integrierte Systeme",
    },
  };
  
  const meta = metadataByLang[validLang as keyof typeof metadataByLang] || metadataByLang.it;
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${baseUrl}/${validLang}/prodotti/allin1/sistema-di-accumulo-afore`,
      languages: {
        'it': `${baseUrl}/it/prodotti/allin1/sistema-di-accumulo-afore`,
        'en': `${baseUrl}/en/prodotti/allin1/sistema-di-accumulo-afore`,
        'es': `${baseUrl}/es/prodotti/allin1/sistema-di-accumulo-afore`,
        'fr': `${baseUrl}/fr/prodotti/allin1/sistema-di-accumulo-afore`,
        'de': `${baseUrl}/de/prodotti/allin1/sistema-di-accumulo-afore`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: validLang === 'it' ? 'it_IT' : validLang === 'es' ? 'es_ES' : validLang === 'fr' ? 'fr_FR' : validLang === 'de' ? 'de_DE' : 'en_US',
      url: `${baseUrl}/${validLang}/prodotti/allin1/sistema-di-accumulo-afore`,
      title: meta.title,
      description: meta.description,
      siteName: "Afore Italia",
    },
  };
}

export default function SistemaDiAccumuloAforeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

