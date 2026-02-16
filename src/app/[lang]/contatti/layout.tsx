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

/** SEO Metadata for contatti page */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";

  const metadataByLang = {
    it: {
      title: "Contatti - Afore Italia | Assistenza e Supporto",
      description: "Contatta Afore Italia per informazioni su inverter fotovoltaici, batterie di accumulo e sistemi fotovoltaici. Supporto tecnico e commerciale.",
      keywords: "contatti Afore, Afore Italia contatti, supporto Afore, assistenza inverter fotovoltaico",
    },
    en: {
      title: "Contact - Afore Italia | Support and Assistance",
      description: "Contact Afore Italia for information on solar inverters, battery storage and photovoltaic systems. Technical and commercial support.",
      keywords: "Afore contact, Afore Italia contact, Afore support, solar inverter assistance",
    },
    es: {
      title: "Contacto - Afore Italia | Asistencia y Soporte",
      description: "Contacte a Afore Italia para información sobre inversores solares, baterías y sistemas fotovoltaicos. Soporte técnico y comercial.",
      keywords: "contacto Afore, Afore Italia contacto, soporte Afore, asistencia inversor solar",
    },
    fr: {
      title: "Contact - Afore Italia | Assistance et Support",
      description: "Contactez Afore Italia pour des informations sur les onduleurs solaires, les batteries et les systèmes photovoltaïques. Support technique et commercial.",
      keywords: "contact Afore, Afore Italia contact, support Afore, assistance onduleur solaire",
    },
    de: {
      title: "Kontakt - Afore Italia | Unterstützung und Hilfe",
      description: "Kontaktieren Sie Afore Italia für Informationen zu Solar-Wechselrichtern, Batterien und Photovoltaik-Systemen. Technischer und kaufmännischer Support.",
      keywords: "Afore Kontakt, Afore Italia Kontakt, Afore Support, Solar-Wechselrichter Unterstützung",
    },
  };

  const meta = metadataByLang[validLang as keyof typeof metadataByLang] || metadataByLang.it;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${baseUrl}/${validLang}/contatti`,
      languages: {
        it: `${baseUrl}/it/contatti`,
        en: `${baseUrl}/en/contatti`,
        es: `${baseUrl}/es/contatti`,
        fr: `${baseUrl}/fr/contatti`,
        de: `${baseUrl}/de/contatti`,
      },
    },
    openGraph: {
      type: "website",
      locale: validLang === "it" ? "it_IT" : validLang === "es" ? "es_ES" : validLang === "fr" ? "fr_FR" : validLang === "de" ? "de_DE" : "en_US",
      url: `${baseUrl}/${validLang}/contatti`,
      title: meta.title,
      description: meta.description,
      siteName: "Afore Italia",
    },
  };
}

export default function ContattiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
