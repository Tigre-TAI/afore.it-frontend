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

/** SEO Metadata for pv-inverter page */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  
  const metadataByLang = {
    it: {
      title: "PV Inverter Afore - Inverter Fotovoltaici Completi | Afore Italia",
      description: "Inverter fotovoltaici Afore: soluzioni complete per l'inversione dell'energia solare. Inverter di stringa e inverter ibridi monofase e trifase.",
      keywords: "PV inverter, inverter fotovoltaico, inverter solare, inverter stringa, inverter ibrido, Afore inverter",
    },
    en: {
      title: "Afore PV Inverter - Complete Solar Inverters | Afore Italia",
      description: "Afore photovoltaic inverters: complete solutions for solar energy inversion. String inverters and hybrid inverters single-phase and three-phase.",
      keywords: "PV inverter, solar inverter, string inverter, hybrid inverter, Afore inverter",
    },
    es: {
      title: "Inversor PV Afore - Inversores Solares Completos | Afore Italia",
      description: "Inversores fotovoltaicos Afore: soluciones completas para la inversión de energía solar. Inversores de cadena e inversores híbridos monofásicos y trifásicos.",
      keywords: "inversor PV, inversor solar, inversor de cadena, inversor híbrido, inversor Afore",
    },
    fr: {
      title: "Onduleur PV Afore - Onduleurs Solaires Complets | Afore Italia",
      description: "Onduleurs photovoltaïques Afore: solutions complètes pour l'inversion de l'énergie solaire. Onduleurs de chaîne et onduleurs hybrides monophasés et triphasés.",
      keywords: "onduleur PV, onduleur solaire, onduleur de chaîne, onduleur hybride, onduleur Afore",
    },
    de: {
      title: "Afore PV-Wechselrichter - Komplette Solar-Wechselrichter | Afore Italia",
      description: "Afore Photovoltaik-Wechselrichter: komplette Lösungen für die Umwandlung von Solarenergie. String-Wechselrichter und Hybrid-Wechselrichter einphasig und dreiphasig.",
      keywords: "PV-Wechselrichter, Solar-Wechselrichter, String-Wechselrichter, Hybrid-Wechselrichter, Afore Wechselrichter",
    },
  };
  
  const meta = metadataByLang[validLang as keyof typeof metadataByLang] || metadataByLang.it;
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${baseUrl}/${validLang}/prodotti/pv-inverter`,
      languages: {
        'it': `${baseUrl}/it/prodotti/pv-inverter`,
        'en': `${baseUrl}/en/prodotti/pv-inverter`,
        'es': `${baseUrl}/es/prodotti/pv-inverter`,
        'fr': `${baseUrl}/fr/prodotti/pv-inverter`,
        'de': `${baseUrl}/de/prodotti/pv-inverter`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: validLang === 'it' ? 'it_IT' : validLang === 'es' ? 'es_ES' : validLang === 'fr' ? 'fr_FR' : validLang === 'de' ? 'de_DE' : 'en_US',
      url: `${baseUrl}/${validLang}/prodotti/pv-inverter`,
      title: meta.title,
      description: meta.description,
      siteName: "Afore Italia",
    },
  };
}

export default function PVInverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

