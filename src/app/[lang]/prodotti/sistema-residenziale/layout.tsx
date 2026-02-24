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
    it: "Sistema Residenziale - Soluzioni Fotovoltaiche | Afore Italia",
    en: "Residential System - Photovoltaic Solutions | Afore Italia",
    es: "Sistema Residencial - Soluciones Fotovoltaicas | Afore Italia",
    fr: "Système Résidentiel - Solutions Photovoltaïques | Afore Italia",
    de: "Wohnsystem - Photovoltaik-Lösungen | Afore Italia",
  };
  return {
    title: titles[validLang] || titles.it,
    alternates: {
      canonical: `${baseUrl}/${validLang}/prodotti/sistema-residenziale`,
      languages: { it: `${baseUrl}/it/prodotti/sistema-residenziale`, en: `${baseUrl}/en/prodotti/sistema-residenziale`, es: `${baseUrl}/es/prodotti/sistema-residenziale`, fr: `${baseUrl}/fr/prodotti/sistema-residenziale`, de: `${baseUrl}/de/prodotti/sistema-residenziale` },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
