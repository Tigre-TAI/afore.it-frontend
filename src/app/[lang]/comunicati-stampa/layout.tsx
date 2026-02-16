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
    title: "Comunicati stampa - Afore Italia",
    description: "Comunicati stampa, novità e aggiornamenti su inverter fotovoltaici e sistemi Afore Italia.",
    keywords: "comunicati stampa Afore, news Afore, inverter fotovoltaico",
  },
  en: {
    title: "Press releases - Afore Italia",
    description: "Press releases, news and updates on solar inverters and Afore Italia systems.",
    keywords: "Afore press releases, Afore news, solar inverter",
  },
  es: {
    title: "Comunicados de prensa - Afore Italia",
    description: "Comunicados de prensa, novedades y actualizaciones sobre inversores solares y sistemas Afore Italia.",
    keywords: "comunicados prensa Afore, noticias Afore, inversor solar",
  },
  fr: {
    title: "Communiqués de presse - Afore Italia",
    description: "Communiqués de presse, nouveautés et mises à jour sur les onduleurs solaires et systèmes Afore Italia.",
    keywords: "communiqués presse Afore, actualités Afore, onduleur solaire",
  },
  de: {
    title: "Pressemitteilungen - Afore Italia",
    description: "Pressemitteilungen, Neuigkeiten und Updates zu Solar-Wechselrichtern und Afore Italia Systemen.",
    keywords: "Afore Pressemitteilungen, Afore News, Solar-Wechselrichter",
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
      canonical: `${baseUrl}/${validLang}/comunicati-stampa`,
      languages: {
        it: `${baseUrl}/it/comunicati-stampa`,
        en: `${baseUrl}/en/comunicati-stampa`,
        es: `${baseUrl}/es/comunicati-stampa`,
        fr: `${baseUrl}/fr/comunicati-stampa`,
        de: `${baseUrl}/de/comunicati-stampa`,
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
      url: `${baseUrl}/${validLang}/comunicati-stampa`,
      title: meta.title,
      description: meta.description,
      siteName: "Afore Italia",
    },
  };
}

export default function ComunicatiStampaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
