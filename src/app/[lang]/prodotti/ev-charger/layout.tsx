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

/** SEO Metadata for ev-charger page */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  
  const metadataByLang = {
    it: {
      title: "EV Charger Afore - Colonnine di Ricarica per Veicoli Elettrici | Afore Italia",
      description: "Colonnine di ricarica EV Afore integrate con sistemi fotovoltaici. Soluzioni di ricarica per veicoli elettrici con forma a diamante, ovale e quadrata.",
      keywords: "EV charger, colonnina ricarica, ricarica veicoli elettrici, wallbox, carica elettrica, Afore EV charger",
    },
    en: {
      title: "Afore EV Charger - Electric Vehicle Charging Stations | Afore Italia",
      description: "Afore EV charging stations integrated with photovoltaic systems. Electric vehicle charging solutions with diamond, oval and square shapes.",
      keywords: "EV charger, charging station, electric vehicle charging, wallbox, Afore EV charger",
    },
    es: {
      title: "Cargador EV Afore - Estaciones de Carga para Vehículos Eléctricos | Afore Italia",
      description: "Estaciones de carga EV Afore integradas con sistemas fotovoltaicos. Soluciones de carga para vehículos eléctricos con forma de diamante, ovalada y cuadrada.",
      keywords: "cargador EV, estación carga, carga vehículos eléctricos, wallbox, cargador Afore EV",
    },
    fr: {
      title: "Chargeur EV Afore - Bornes de Recharge pour Véhicules Électriques | Afore Italia",
      description: "Bornes de recharge EV Afore intégrées aux systèmes photovoltaïques. Solutions de recharge pour véhicules électriques avec forme diamant, ovale et carrée.",
      keywords: "chargeur EV, borne recharge, recharge véhicules électriques, wallbox, chargeur Afore EV",
    },
    de: {
      title: "Afore EV-Ladestation - Ladestationen für Elektrofahrzeuge | Afore Italia",
      description: "Afore EV-Ladestationen integriert mit Photovoltaik-Systemen. Ladestationen für Elektrofahrzeuge mit Diamant-, Oval- und Quadratform.",
      keywords: "EV-Ladestation, Ladestation, Elektrofahrzeug-Ladung, Wallbox, Afore EV-Ladestation",
    },
  };
  
  const meta = metadataByLang[validLang as keyof typeof metadataByLang] || metadataByLang.it;
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${baseUrl}/${validLang}/prodotti/ev-charger`,
      languages: {
        'it': `${baseUrl}/it/prodotti/ev-charger`,
        'en': `${baseUrl}/en/prodotti/ev-charger`,
        'es': `${baseUrl}/es/prodotti/ev-charger`,
        'fr': `${baseUrl}/fr/prodotti/ev-charger`,
        'de': `${baseUrl}/de/prodotti/ev-charger`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: validLang === 'it' ? 'it_IT' : validLang === 'es' ? 'es_ES' : validLang === 'fr' ? 'fr_FR' : validLang === 'de' ? 'de_DE' : 'en_US',
      url: `${baseUrl}/${validLang}/prodotti/ev-charger`,
      title: meta.title,
      description: meta.description,
      siteName: "Afore Italia",
    },
  };
}

export default function EVChargerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}




