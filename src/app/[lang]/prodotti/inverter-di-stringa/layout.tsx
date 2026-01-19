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

/** SEO Metadata for inverter-di-stringa page */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  
  const metadataByLang = {
    it: {
      title: "Inverter di Stringa Afore - Inverter Fotovoltaico Monofase e Trifase | Afore Italia",
      description: "Inverter di stringa Afore monofase e trifase per impianti fotovoltaici. Soluzioni professionali per la conversione dell'energia solare con massima efficienza e affidabilità.",
      keywords: "inverter di stringa, inverter fotovoltaico, inverter monofase, inverter trifase, Afore inverter stringa, inverter solare",
    },
    en: {
      title: "Afore String Inverter - Single-Phase and Three-Phase Solar Inverter | Afore Italia",
      description: "Afore single-phase and three-phase string inverters for photovoltaic systems. Professional solutions for solar energy conversion with maximum efficiency and reliability.",
      keywords: "string inverter, solar inverter, single-phase inverter, three-phase inverter, Afore string inverter",
    },
    es: {
      title: "Inversor de Cadena Afore - Inversor Solar Monofásico y Trifásico | Afore Italia",
      description: "Inversores de cadena Afore monofásicos y trifásicos para sistemas fotovoltaicos. Soluciones profesionales para la conversión de energía solar con máxima eficiencia y confiabilidad.",
      keywords: "inversor de cadena, inversor solar, inversor monofásico, inversor trifásico",
    },
    fr: {
      title: "Onduleur de Chaîne Afore - Onduleur Solaire Monophasé et Triphasé | Afore Italia",
      description: "Onduleurs de chaîne Afore monophasés et triphasés pour systèmes photovoltaïques. Solutions professionnelles pour la conversion de l'énergie solaire avec une efficacité et une fiabilité maximales.",
      keywords: "onduleur de chaîne, onduleur solaire, onduleur monophasé, onduleur triphasé",
    },
    de: {
      title: "Afore String-Wechselrichter - Einphasen- und Dreiphasen-Solar-Wechselrichter | Afore Italia",
      description: "Afore Einphasen- und Dreiphasen-String-Wechselrichter für Photovoltaik-Systeme. Professionelle Lösungen für die Umwandlung von Solarenergie mit maximaler Effizienz und Zuverlässigkeit.",
      keywords: "String-Wechselrichter, Solar-Wechselrichter, Einphasen-Wechselrichter, Dreiphasen-Wechselrichter",
    },
  };
  
  const meta = metadataByLang[validLang as keyof typeof metadataByLang] || metadataByLang.it;
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${baseUrl}/${validLang}/prodotti/inverter-di-stringa`,
      languages: {
        'it': `${baseUrl}/it/prodotti/inverter-di-stringa`,
        'en': `${baseUrl}/en/prodotti/inverter-di-stringa`,
        'es': `${baseUrl}/es/prodotti/inverter-di-stringa`,
        'fr': `${baseUrl}/fr/prodotti/inverter-di-stringa`,
        'de': `${baseUrl}/de/prodotti/inverter-di-stringa`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: validLang === 'it' ? 'it_IT' : validLang === 'es' ? 'es_ES' : validLang === 'fr' ? 'fr_FR' : validLang === 'de' ? 'de_DE' : 'en_US',
      url: `${baseUrl}/${validLang}/prodotti/inverter-di-stringa`,
      title: meta.title,
      description: meta.description,
      siteName: "Afore Italia",
    },
  };
}

export default function InverterDiStringaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}




