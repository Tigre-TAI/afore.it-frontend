/** 预渲染所有语言版本的页面（静态导出必需） */
import type { Metadata } from "next";

export async function generateStaticParams() {
  return [
    { lang: "it" },
    { lang: "en" },
    { lang: "es" },
  ];
}

/** SEO Metadata for prodotti page */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es"].includes(lang) ? lang : "it";
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
      },
    },
    openGraph: {
      type: "website",
      locale: validLang === 'it' ? 'it_IT' : validLang === 'es' ? 'es_ES' : 'en_US',
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

