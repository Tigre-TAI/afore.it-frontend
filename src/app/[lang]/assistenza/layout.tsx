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

/** SEO Metadata for assistenza page (Assistenza e supporto / Garanzia) */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  
  const metadataByLang = {
    it: {
      title: "Assistenza e supporto - Garanzia 10 Anni Afore | Afore Italia",
      description: "Garanzia 10 anni su inverter fotovoltaici Afore e Hailei. Verifica la garanzia del tuo prodotto inserendo il numero di serie. Download certificati garanzia Afore, Hailei e Hailei Card. Assistenza clienti Afore Italia.",
      keywords: "garanzia Afore, garanzia 10 anni, garanzia inverter fotovoltaico, verifica garanzia Afore, certificato garanzia, garanzia Hailei, assistenza Afore, Afore Italia garanzia",
    },
    en: {
      title: "Assistance and support - Afore 10 Year Warranty | Afore Italia",
      description: "10 year warranty on Afore and Hailei solar inverters. Verify your product warranty by entering the serial number. Download warranty certificates for Afore, Hailei and Hailei Card. Afore Italia customer support.",
      keywords: "Afore warranty, 10 year warranty, solar inverter warranty, verify Afore warranty, warranty certificate, Hailei warranty, Afore support",
    },
    es: {
      title: "Asistencia y soporte - Garantía 10 Años Afore | Afore Italia",
      description: "Garantía de 10 años en inversores solares Afore y Hailei. Verifica la garantía de tu producto ingresando el número de serie. Descarga certificados de garantía para Afore, Hailei y Hailei Card. Soporte al cliente Afore Italia.",
      keywords: "garantía Afore, garantía 10 años, garantía inversor solar, verificar garantía Afore, certificado garantía, garantía Hailei",
    },
    fr: {
      title: "Assistance et support - Garantie 10 Ans Afore | Afore Italia",
      description: "Garantie de 10 ans sur les onduleurs solaires Afore et Hailei. Vérifiez la garantie de votre produit en entrant le numéro de série. Téléchargez les certificats de garantie pour Afore, Hailei et Hailei Card. Support client Afore Italia.",
      keywords: "garantie Afore, garantie 10 ans, garantie onduleur solaire, vérifier garantie Afore, certificat garantie, garantie Hailei",
    },
    de: {
      title: "Assistenz und Support - Afore 10-Jahres-Garantie | Afore Italia",
      description: "10-Jahres-Garantie auf Afore- und Hailei-Solar-Wechselrichter. Überprüfen Sie die Garantie Ihres Produkts, indem Sie die Seriennummer eingeben. Laden Sie Garantiezertifikate für Afore, Hailei und Hailei Card herunter. Afore Italia Kundensupport.",
      keywords: "Afore Garantie, 10-Jahres-Garantie, Solar-Wechselrichter-Garantie, Afore Garantie prüfen, Garantiezertifikat, Hailei Garantie",
    },
  };
  
  const meta = metadataByLang[validLang as keyof typeof metadataByLang] || metadataByLang.it;
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${baseUrl}/${validLang}/assistenza`,
      languages: {
        'it': `${baseUrl}/it/assistenza`,
        'en': `${baseUrl}/en/assistenza`,
        'es': `${baseUrl}/es/assistenza`,
        'fr': `${baseUrl}/fr/assistenza`,
        'de': `${baseUrl}/de/assistenza`,
      },
    },
    openGraph: {
      type: "website",
      locale: validLang === 'it' ? 'it_IT' : validLang === 'es' ? 'es_ES' : validLang === 'fr' ? 'fr_FR' : validLang === 'de' ? 'de_DE' : 'en_US',
      url: `${baseUrl}/${validLang}/assistenza`,
      title: meta.title,
      description: meta.description,
      siteName: "Afore Italia",
    },
  };
}

export default function AssistenzaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
