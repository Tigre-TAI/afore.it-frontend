import type { Metadata } from "next";

/** 预渲染所有语言版本的页面（静态导出必需） */
export async function generateStaticParams() {
  return [
    { lang: "it" },
    { lang: "en" },
    { lang: "es" },
  ];
}

/** SEO Metadata for garanzia page */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  
  const metadataByLang = {
    it: {
      title: "Garanzia 10 Anni Afore - Verifica Garanzia Inverter Fotovoltaico | Afore Italia",
      description: "Garanzia 10 anni su inverter fotovoltaici Afore e Hailei. Verifica la garanzia del tuo prodotto inserendo il numero di serie. Download certificati garanzia Afore, Hailei e Hailei Card. Assistenza clienti Afore Italia.",
      keywords: "garanzia Afore, garanzia 10 anni, garanzia inverter fotovoltaico, verifica garanzia Afore, certificato garanzia, garanzia Hailei, assistenza Afore, Afore Italia garanzia",
    },
    en: {
      title: "Afore 10 Year Warranty - Verify Solar Inverter Warranty | Afore Italia",
      description: "10 year warranty on Afore and Hailei solar inverters. Verify your product warranty by entering the serial number. Download warranty certificates for Afore, Hailei and Hailei Card. Afore Italia customer support.",
      keywords: "Afore warranty, 10 year warranty, solar inverter warranty, verify Afore warranty, warranty certificate, Hailei warranty, Afore support",
    },
    es: {
      title: "Garantía 10 Años Afore - Verificar Garantía Inversor Solar | Afore Italia",
      description: "Garantía de 10 años en inversores solares Afore y Hailei. Verifica la garantía de tu producto ingresando el número de serie. Descarga certificados de garantía para Afore, Hailei y Hailei Card. Soporte al cliente Afore Italia.",
      keywords: "garantía Afore, garantía 10 años, garantía inversor solar, verificar garantía Afore, certificado garantía, garantía Hailei",
    },
  };
  
  const meta = metadataByLang[validLang as keyof typeof metadataByLang] || metadataByLang.it;
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${baseUrl}/${validLang}/garanzia`,
      languages: {
        'it': `${baseUrl}/it/garanzia`,
        'en': `${baseUrl}/en/garanzia`,
        'es': `${baseUrl}/es/garanzia`,
      },
    },
    openGraph: {
      type: "website",
      locale: validLang === 'it' ? 'it_IT' : validLang === 'es' ? 'es_ES' : 'en_US',
      url: `${baseUrl}/${validLang}/garanzia`,
      title: meta.title,
      description: meta.description,
      siteName: "Afore Italia",
    },
  };
}

export default function GaranziaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

