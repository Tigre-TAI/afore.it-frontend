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

/** SEO Metadata for pv-inverter/inverter-ibrido page */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  
  const metadataByLang = {
    it: {
      title: "Inverter Ibrido PV - Inverter con Accumulo Integrato | Afore Italia",
      description: "Inverter ibridi PV Afore monofase e trifase con accumulo integrato. Soluzioni complete per massimizzare l'autoconsumo dell'energia solare.",
      keywords: "inverter ibrido PV, inverter con accumulo, inverter fotovoltaico ibrido, Afore inverter ibrido",
    },
    en: {
      title: "PV Hybrid Inverter - Inverter with Integrated Storage | Afore Italia",
      description: "Afore single-phase and three-phase PV hybrid inverters with integrated storage. Complete solutions to maximize solar energy self-consumption.",
      keywords: "PV hybrid inverter, inverter with storage, hybrid solar inverter, Afore hybrid inverter",
    },
    es: {
      title: "Inversor Híbrido PV - Inversor con Almacenamiento Integrado | Afore Italia",
      description: "Inversores híbridos PV Afore monofásicos y trifásicos con almacenamiento integrado. Soluciones completas para maximizar el autoconsumo de energía solar.",
      keywords: "inversor híbrido PV, inversor con almacenamiento, inversor solar híbrido",
    },
    fr: {
      title: "Onduleur Hybride PV - Onduleur avec Stockage Intégré | Afore Italia",
      description: "Onduleurs hybrides PV Afore monophasés et triphasés avec stockage intégré. Solutions complètes pour maximiser l'autoconsommation de l'énergie solaire.",
      keywords: "onduleur hybride PV, onduleur avec stockage, onduleur solaire hybride",
    },
    de: {
      title: "PV Hybrid-Wechselrichter - Wechselrichter mit Integriertem Speicher | Afore Italia",
      description: "Afore Einphasen- und Dreiphasen-PV-Hybrid-Wechselrichter mit integriertem Speicher. Komplette Lösungen zur Maximierung des solaren Eigenverbrauchs.",
      keywords: "PV Hybrid-Wechselrichter, Wechselrichter mit Speicher, Hybrid-Solar-Wechselrichter",
    },
  };
  
  const meta = metadataByLang[validLang as keyof typeof metadataByLang] || metadataByLang.it;
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${baseUrl}/${validLang}/prodotti/pv-inverter/inverter-ibrido`,
      languages: {
        'it': `${baseUrl}/it/prodotti/pv-inverter/inverter-ibrido`,
        'en': `${baseUrl}/en/prodotti/pv-inverter/inverter-ibrido`,
        'es': `${baseUrl}/es/prodotti/pv-inverter/inverter-ibrido`,
        'fr': `${baseUrl}/fr/prodotti/pv-inverter/inverter-ibrido`,
        'de': `${baseUrl}/de/prodotti/pv-inverter/inverter-ibrido`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: validLang === 'it' ? 'it_IT' : validLang === 'es' ? 'es_ES' : validLang === 'fr' ? 'fr_FR' : validLang === 'de' ? 'de_DE' : 'en_US',
      url: `${baseUrl}/${validLang}/prodotti/pv-inverter/inverter-ibrido`,
      title: meta.title,
      description: meta.description,
      siteName: "Afore Italia",
    },
  };
}

export default function PVInverterInverterIbridoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

