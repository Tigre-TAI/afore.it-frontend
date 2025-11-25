/** 预渲染所有语言版本的页面（静态导出必需） */
import type { Metadata } from "next";

export async function generateStaticParams() {
  return [
    { lang: "it" },
    { lang: "en" },
    { lang: "es" },
    { lang: "fr" },
    { lang: "de" },
  ];
}

/** SEO Metadata for prodotti page */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  
  const metadataByLang = {
    it: {
      title: "Prodotti Afore - Inverter Fotovoltaico, Inverter Ibrido, Batterie Accumulo | Afore Italia",
      description: "Catalogo completo prodotti Afore: inverter fotovoltaici monofase e trifase, inverter ibridi, batterie di accumulo Afore e Hailei, sistemi all-in-one, EV charger. Leader mondiale in soluzioni fotovoltaiche per residenziale e commerciale.",
      keywords: "Afore prodotti, inverter fotovoltaico, inverter ibrido, inverter di stringa, batteria accumulo, sistemi fotovoltaici, pannelli solari, energia solare, Afore inverter, Hailei batterie, EV charger, fotovoltaico Italia",
    },
    en: {
      title: "Afore Products - Solar Inverter, Hybrid Inverter, Battery Storage | Afore Italia",
      description: "Complete Afore product catalog: single-phase and three-phase solar inverters, hybrid inverters, Afore and Hailei battery storage, all-in-one systems, EV chargers. World leader in photovoltaic solutions for residential and commercial.",
      keywords: "Afore products, solar inverter, hybrid inverter, string inverter, battery storage, solar systems, solar panels, solar energy, Afore inverter, Hailei batteries, EV charger",
    },
    es: {
      title: "Productos Afore - Inversor Solar, Inversor Híbrido, Baterías | Afore Italia",
      description: "Catálogo completo de productos Afore: inversores solares monofásicos y trifásicos, inversores híbridos, baterías Afore y Hailei, sistemas all-in-one, cargadores EV. Líder mundial en soluciones fotovoltaicas para residencial y comercial.",
      keywords: "productos Afore, inversor solar, inversor híbrido, inversor de cadena, baterías, sistemas fotovoltaicos, paneles solares, energía solar, inversor Afore, baterías Hailei",
    },
    fr: {
      title: "Produits Afore - Onduleur Solaire, Onduleur Hybride, Batteries | Afore Italia",
      description: "Catalogue complet des produits Afore: onduleurs solaires monophasés et triphasés, onduleurs hybrides, batteries Afore et Hailei, systèmes tout-en-un, chargeurs EV. Leader mondial en solutions photovoltaïques pour résidentiel et commercial.",
      keywords: "produits Afore, onduleur solaire, onduleur hybride, onduleur de chaîne, batteries, systèmes photovoltaïques, panneaux solaires, énergie solaire, onduleur Afore, batteries Hailei",
    },
    de: {
      title: "Afore Produkte - Solar-Wechselrichter, Hybrid-Wechselrichter, Batterien | Afore Italia",
      description: "Vollständiger Afore-Produktkatalog: einphasige und dreiphasige Solar-Wechselrichter, Hybrid-Wechselrichter, Afore- und Hailei-Batterien, All-in-One-Systeme, EV-Ladestationen. Weltmarktführer in Photovoltaik-Lösungen für Wohn- und Gewerbegebäude.",
      keywords: "Afore Produkte, Solar-Wechselrichter, Hybrid-Wechselrichter, String-Wechselrichter, Batterien, Photovoltaik-Systeme, Solarmodule, Solarenergie, Afore Wechselrichter, Hailei Batterien",
    },
  };
  
  const meta = metadataByLang[validLang as keyof typeof metadataByLang] || metadataByLang.it;
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${baseUrl}/${validLang}/prodotti`,
      languages: {
        'it': `${baseUrl}/it/prodotti`,
        'en': `${baseUrl}/en/prodotti`,
        'es': `${baseUrl}/es/prodotti`,
        'fr': `${baseUrl}/fr/prodotti`,
        'de': `${baseUrl}/de/prodotti`,
      },
    },
    openGraph: {
      type: "website",
      locale: validLang === 'it' ? 'it_IT' : validLang === 'es' ? 'es_ES' : validLang === 'fr' ? 'fr_FR' : validLang === 'de' ? 'de_DE' : 'en_US',
      url: `${baseUrl}/${validLang}/prodotti`,
      title: meta.title,
      description: meta.description,
      siteName: "Afore Italia",
      images: [
        {
          url: `${baseUrl}/image/product_bg.jpg`,
          width: 1200,
          height: 630,
          alt: "Afore Italia Prodotti",
        },
      ],
    },
  };
}

export default function ProdottiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

