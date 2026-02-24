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

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  const titles: Record<string, string> = {
    it: "Sistema Commerciale - Soluzioni Fotovoltaiche | Afore Italia",
    en: "Commercial System - Photovoltaic Solutions | Afore Italia",
    es: "Sistema Comercial - Soluciones Fotovoltaicas | Afore Italia",
    fr: "Système Commercial - Solutions Photovoltaïques | Afore Italia",
    de: "Gewerbesystem - Photovoltaik-Lösungen | Afore Italia",
  };
  return {
    title: titles[validLang] || titles.it,
    alternates: {
      canonical: `${baseUrl}/${validLang}/prodotti/sistema-commerciale`,
      languages: { it: `${baseUrl}/it/prodotti/sistema-commerciale`, en: `${baseUrl}/en/prodotti/sistema-commerciale`, es: `${baseUrl}/es/prodotti/sistema-commerciale`, fr: `${baseUrl}/fr/prodotti/sistema-commerciale`, de: `${baseUrl}/de/prodotti/sistema-commerciale` },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
