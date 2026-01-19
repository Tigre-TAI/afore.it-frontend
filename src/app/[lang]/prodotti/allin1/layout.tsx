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

/** SEO Metadata for allin1 page */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  
  const metadataByLang = {
    it: {
      title: "All in One Afore - Sistemi Integrati Inverter e Accumulo | Afore Italia",
      description: "Sistemi All in One Afore: soluzioni integrate con inverter e accumulo in un'unica unità. Sistemi di accumulo Afore e Hailei per massimizzare l'autoconsumo dell'energia solare.",
      keywords: "Afore all in one, sistemi integrati, inverter accumulo, sistemi fotovoltaici integrati, Afore all-in-one, Hailei all in one",
    },
    en: {
      title: "Afore All in One - Integrated Inverter and Storage Systems | Afore Italia",
      description: "Afore All in One systems: integrated solutions with inverter and storage in a single unit. Afore and Hailei storage systems to maximize solar energy self-consumption.",
      keywords: "Afore all in one, integrated systems, inverter storage, integrated solar systems, Afore all-in-one, Hailei all in one",
    },
    es: {
      title: "All in One Afore - Sistemas Integrados Inversor y Almacenamiento | Afore Italia",
      description: "Sistemas All in One Afore: soluciones integradas con inversor y almacenamiento en una sola unidad. Sistemas de almacenamiento Afore y Hailei para maximizar el autoconsumo de energía solar.",
      keywords: "Afore all in one, sistemas integrados, inversor almacenamiento, sistemas fotovoltaicos integrados",
    },
    fr: {
      title: "All in One Afore - Systèmes Intégrés Onduleur et Stockage | Afore Italia",
      description: "Systèmes All in One Afore: solutions intégrées avec onduleur et stockage dans une seule unité. Systèmes de stockage Afore et Hailei pour maximiser l'autoconsommation de l'énergie solaire.",
      keywords: "Afore all in one, systèmes intégrés, onduleur stockage, systèmes photovoltaïques intégrés",
    },
    de: {
      title: "Afore All in One - Integrierte Wechselrichter- und Speichersysteme | Afore Italia",
      description: "Afore All in One Systeme: integrierte Lösungen mit Wechselrichter und Speicher in einer einzigen Einheit. Afore- und Hailei-Speichersysteme zur Maximierung des solaren Eigenverbrauchs.",
      keywords: "Afore all in one, integrierte Systeme, Wechselrichter Speicher, integrierte Photovoltaik-Systeme",
    },
  };
  
  const meta = metadataByLang[validLang as keyof typeof metadataByLang] || metadataByLang.it;
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${baseUrl}/${validLang}/prodotti/allin1`,
      languages: {
        'it': `${baseUrl}/it/prodotti/allin1`,
        'en': `${baseUrl}/en/prodotti/allin1`,
        'es': `${baseUrl}/es/prodotti/allin1`,
        'fr': `${baseUrl}/fr/prodotti/allin1`,
        'de': `${baseUrl}/de/prodotti/allin1`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: validLang === 'it' ? 'it_IT' : validLang === 'es' ? 'es_ES' : validLang === 'fr' ? 'fr_FR' : validLang === 'de' ? 'de_DE' : 'en_US',
      url: `${baseUrl}/${validLang}/prodotti/allin1`,
      title: meta.title,
      description: meta.description,
      siteName: "Afore Italia",
    },
  };
}

export default function AllInOneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}




