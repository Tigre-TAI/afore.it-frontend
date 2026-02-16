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

const metadataByLang: Record<
  string,
  { title: string; description: string; keywords: string }
> = {
  it: {
    title: "Webinar - Afore Italia",
    description: "Webinar formativi su inverter fotovoltaici, sistemi di accumulo e soluzioni Afore.",
    keywords: "webinar Afore, formazione fotovoltaico, inverter solare",
  },
  en: {
    title: "Webinar - Afore Italia",
    description: "Training webinars on solar inverters, storage systems and Afore solutions.",
    keywords: "Afore webinar, solar training, solar inverter",
  },
  es: {
    title: "Webinar - Afore Italia",
    description: "Webinars formativos sobre inversores solares, sistemas de almacenamiento y soluciones Afore.",
    keywords: "webinar Afore, formación solar, inversor solar",
  },
  fr: {
    title: "Webinar - Afore Italia",
    description: "Webinaires de formation sur les onduleurs solaires, systèmes de stockage et solutions Afore.",
    keywords: "webinar Afore, formation solaire, onduleur solaire",
  },
  de: {
    title: "Webinar - Afore Italia",
    description: "Schulungswebinare zu Solar-Wechselrichtern, Speichersystemen und Afore-Lösungen.",
    keywords: "Afore Webinar, Solar-Schulung, Solar-Wechselrichter",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  const meta = metadataByLang[validLang] || metadataByLang.it;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${baseUrl}/${validLang}/webinar`,
      languages: {
        it: `${baseUrl}/it/webinar`,
        en: `${baseUrl}/en/webinar`,
        es: `${baseUrl}/es/webinar`,
        fr: `${baseUrl}/fr/webinar`,
        de: `${baseUrl}/de/webinar`,
      },
    },
    openGraph: {
      type: "website",
      locale:
        validLang === "it"
          ? "it_IT"
          : validLang === "es"
            ? "es_ES"
            : validLang === "fr"
              ? "fr_FR"
              : validLang === "de"
                ? "de_DE"
                : "en_US",
      url: `${baseUrl}/${validLang}/webinar`,
      title: meta.title,
      description: meta.description,
      siteName: "Afore Italia",
    },
  };
}

export default function WebinarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
