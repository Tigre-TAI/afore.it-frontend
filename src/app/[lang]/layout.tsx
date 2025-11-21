import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { StructuredData } from "@/components/SEO/StructuredData";
import CookieConsent from "@/components/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Dynamic metadata based on language
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es"].includes(lang) ? lang : "it";
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  
  const metadataByLang = {
    it: {
      title: "Afore Italia - Inverter Fotovoltaico, Inverter Ibrido, Batterie Accumulo | Leader Mondiale",
      description: "Afore Italia: leader mondiale in inverter fotovoltaici, inverter ibridi, batterie di accumulo e sistemi fotovoltaici. Soluzioni complete per energia solare residenziale e commerciale. Inverter di stringa, inverter ibridi, batterie Afore e Hailei.",
      keywords: "Afore, Afore Italia, inverter fotovoltaico, inverter ibrido, inverter di stringa, batteria accumulo, fotovoltaico, energia solare, inverter solare, pannelli solari, sistemi fotovoltaici, Afore inverter, Hailei, accumulo energia",
    },
    en: {
      title: "Afore Italia - Solar Inverter, Hybrid Inverter, Battery Storage | World Leader",
      description: "Afore Italia: world leader in solar inverters, hybrid inverters, battery storage and photovoltaic systems. Complete solutions for residential and commercial solar energy.",
      keywords: "Afore, Afore Italia, solar inverter, hybrid inverter, string inverter, battery storage, photovoltaic, solar energy, solar systems, Afore inverter, Hailei",
    },
    es: {
      title: "Afore Italia - Inversor Solar, Inversor Híbrido, Baterías | Líder Mundial",
      description: "Afore Italia: líder mundial en inversores solares, inversores híbridos, baterías y sistemas fotovoltaicos. Soluciones completas para energía solar residencial y comercial.",
      keywords: "Afore, Afore Italia, inversor solar, inversor híbrido, inversor de cadena, baterías, fotovoltaico, energía solar, sistemas solares",
    },
  };
  
  const meta = metadataByLang[validLang as keyof typeof metadataByLang] || metadataByLang.it;
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${baseUrl}/${validLang}`,
      languages: {
        'it': `${baseUrl}/it`,
        'en': `${baseUrl}/en`,
        'es': `${baseUrl}/es`,
      },
    },
    openGraph: {
      type: "website",
      locale: validLang === 'it' ? 'it_IT' : validLang === 'es' ? 'es_ES' : 'en_US',
      url: `${baseUrl}/${validLang}`,
      title: meta.title,
      description: meta.description,
      siteName: "Afore Italia",
      images: [
        {
          url: `${baseUrl}/image/logos/logo_afore_light.png`,
          width: 1200,
          height: 630,
          alt: "Afore Italia",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [`${baseUrl}/image/logos/logo_afore_light.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/image/logos/logo_afore_favicon.ico", sizes: "any" },
      ],
      apple: [
        { url: "/image/logos/logo_afore_favicon.ico", sizes: "180x180", type: "image/x-icon" },
      ],
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const validLang = ["it", "en", "es"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";

  return (
    <html lang={validLang}>
      <head>
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="wTytJgj5Dkeb30p4TLBPcD085_ssnf-3FJ5Ju07aCnI" />
        
        {/* Hreflang tags for multilingual SEO */}
        <link rel="alternate" hrefLang="it" href={`${baseUrl}/it`} />
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/en`} />
        <link rel="alternate" hrefLang="es" href={`${baseUrl}/es`} />
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/it`} />
        
        {/* Structured Data for SEO */}
        <StructuredData type="Organization" lang={validLang} />
        <StructuredData type="WebSite" lang={validLang} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}

