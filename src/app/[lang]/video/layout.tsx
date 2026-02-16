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

const metadataByLang: Record<string, { title: string; description: string; keywords: string }> = {
  it: {
    title: "Video - Afore Italia",
    description: "Video tutorial, demo prodotti e contenuti multimediali su inverter fotovoltaici Afore.",
    keywords: "video Afore, tutorial inverter, demo prodotti fotovoltaico",
  },
  en: {
    title: "Video - Afore Italia",
    description: "Video tutorials, product demos and multimedia content on Afore solar inverters.",
    keywords: "Afore video, inverter tutorial, solar product demo",
  },
  es: {
    title: "Video - Afore Italia",
    description: "Tutoriales en video, demos de productos y contenido multimedia sobre inversores solares Afore.",
    keywords: "video Afore, tutorial inversor, demo producto solar",
  },
  fr: {
    title: "Vidéo - Afore Italia",
    description: "Tutoriels vidéo, démos produits et contenu multimédia sur les onduleurs solaires Afore.",
    keywords: "vidéo Afore, tutoriel onduleur, démo produit solaire",
  },
  de: {
    title: "Video - Afore Italia",
    description: "Video-Tutorials, Produktdemos und Multimedia-Inhalte zu Afore Solar-Wechselrichtern.",
    keywords: "Afore Video, Wechselrichter Tutorial, Solar Produkt-Demo",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  const meta = metadataByLang[validLang] || metadataByLang.it;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${baseUrl}/${validLang}/video`,
      languages: {
        it: `${baseUrl}/it/video`,
        en: `${baseUrl}/en/video`,
        es: `${baseUrl}/es/video`,
        fr: `${baseUrl}/fr/video`,
        de: `${baseUrl}/de/video`,
      },
    },
    openGraph: {
      type: "website",
      locale: validLang === "it" ? "it_IT" : validLang === "es" ? "es_ES" : validLang === "fr" ? "fr_FR" : validLang === "de" ? "de_DE" : "en_US",
      url: `${baseUrl}/${validLang}/video`,
      title: meta.title,
      description: meta.description,
      siteName: "Afore Italia",
    },
  };
}

export default function VideoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
