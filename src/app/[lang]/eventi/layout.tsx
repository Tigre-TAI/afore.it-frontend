import type { Metadata } from "next";

/**
 * 【学习要点：generateStaticParams 与 output: "export"】
 *
 * 项目配置了 output: "export"（在 next.config.ts 中），意味着 Next.js 会在构建时
 * 把所有页面生成纯静态 HTML 文件。
 *
 * 因为路径里有动态参数 [lang]，Next.js 不知道该为哪些语言版本生成 HTML，
 * 所以必须在 layout.tsx（或 page.tsx）中导出 generateStaticParams()，
 * 告诉它："请为 it、en、es、fr、de 这 5 个语言各生成一份。"
 *
 * 这跟 assistenza/layout.tsx 的模式完全一致。
 */
export async function generateStaticParams() {
  return [
    { lang: "it" },
    { lang: "en" },
    { lang: "es" },
    { lang: "fr" },
    { lang: "de" },
  ];
}

/** SEO Metadata for eventi page */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  
  const metadataByLang = {
    it: {
      title: "Eventi e Fiere - KEY ENERGY 2026 Booth D5-130 | Afore Italia",
      description: "Incontra Afore Italia a KEY ENERGY 2026, Rimini Fiera, Booth D5-130. Prenota un incontro per demo prodotti, Q&A tecnico e informazioni su inverter fotovoltaici, batterie e sistemi All-in-One.",
      keywords: "Afore eventi, KEY ENERGY 2026, fiera Rimini, Afore booth, inverter fotovoltaico fiera, Afore Italia eventi, Rimini Fiera",
    },
    en: {
      title: "Events & Trade Fairs - KEY ENERGY 2026 Booth D5-130 | Afore Italia",
      description: "Meet Afore Italia at KEY ENERGY 2026, Rimini Fiera, Booth D5-130. Book a meeting for product demos, technical Q&A and information about solar inverters, batteries and All-in-One systems.",
      keywords: "Afore events, KEY ENERGY 2026, Rimini trade fair, Afore booth, solar inverter fair, Afore Italia events",
    },
    es: {
      title: "Eventos y Ferias - KEY ENERGY 2026 Booth D5-130 | Afore Italia",
      description: "Conoce a Afore Italia en KEY ENERGY 2026, Rimini Fiera, Booth D5-130. Reserva una reunión para demos de productos e información sobre inversores solares, baterías y sistemas All-in-One.",
      keywords: "Afore eventos, KEY ENERGY 2026, feria Rimini, Afore stand, inversor solar feria",
    },
    fr: {
      title: "Événements et Salons - KEY ENERGY 2026 Booth D5-130 | Afore Italia",
      description: "Rencontrez Afore Italia à KEY ENERGY 2026, Rimini Fiera, Booth D5-130. Réservez un rendez-vous pour des démos de produits et informations sur les onduleurs solaires, batteries et systèmes All-in-One.",
      keywords: "Afore événements, KEY ENERGY 2026, salon Rimini, Afore stand, onduleur solaire salon",
    },
    de: {
      title: "Events & Messen - KEY ENERGY 2026 Booth D5-130 | Afore Italia",
      description: "Treffen Sie Afore Italia auf der KEY ENERGY 2026, Rimini Fiera, Booth D5-130. Buchen Sie ein Meeting für Produkt-Demos und Informationen zu Solar-Wechselrichtern, Batterien und All-in-One-Systemen.",
      keywords: "Afore Events, KEY ENERGY 2026, Messe Rimini, Afore Stand, Solar-Wechselrichter Messe",
    },
  };
  
  const meta = metadataByLang[validLang as keyof typeof metadataByLang] || metadataByLang.it;
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${baseUrl}/${validLang}/eventi`,
      languages: {
        'it': `${baseUrl}/it/eventi`,
        'en': `${baseUrl}/en/eventi`,
        'es': `${baseUrl}/es/eventi`,
        'fr': `${baseUrl}/fr/eventi`,
        'de': `${baseUrl}/de/eventi`,
      },
    },
    openGraph: {
      type: "website",
      locale: validLang === 'it' ? 'it_IT' : validLang === 'es' ? 'es_ES' : validLang === 'fr' ? 'fr_FR' : validLang === 'de' ? 'de_DE' : 'en_US',
      url: `${baseUrl}/${validLang}/eventi`,
      title: meta.title,
      description: meta.description,
      siteName: "Afore Italia",
    },
  };
}

export default function EventiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
