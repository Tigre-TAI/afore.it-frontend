import Breadcrumb from "@/components/ui/Breadcrumbs";
import { withLang } from "@/lib/lang-utils";
import { getTranslations } from "@/lib/i18n";
import { readdir, stat } from "fs/promises";
import { join } from "path";
import HeroBackground from "@/components/ui/HeroBackground";
import type { Metadata } from "next";

type DocumentFile = {
  fileName: string;
  filePath: string;
  category: string | null;
  productType: string;
  lang: string;
};

type DocItem = {
  title: string;
  href: string;
  lang: string;
};

type DocSection = {
  heading: string;
  items: DocItem[];
};

type ProductGroup = {
  title: string;
  sections: DocSection[];
};

type Props = {
  params: Promise<{ lang: string }>;
};

/* ---------- helper functions ---------- */

function DocumentSection({ title, sections }: { title: string; sections: DocSection[] }) {
  return (
    <section className="py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 break-words">{title}</h2>
        <div className="mt-4 sm:mt-6 space-y-6 sm:space-y-8">
          {sections.map((sec) => (
            <div key={sec.heading}>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-3 break-words">{sec.heading}</h3>
              <ul className="divide-y divide-slate-200 border border-slate-200 bg-white rounded-lg overflow-hidden">
                {sec.items.map((it, idx) => (
                  <li key={`${it.href}-${idx}`} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-slate-900 break-words">{it.title}</p>
                      <p className="text-xs text-slate-500 mt-1">Idioma: {it.lang}</p>
                    </div>
                    <a
                      href={it.href}
                      download
                      className="shrink-0 w-full sm:w-auto text-center sm:text-left rounded-md bg-slate-900 px-4 py-2.5 sm:py-2 text-white text-sm font-semibold hover:bg-slate-800 active:bg-slate-700 transition-colors touch-manipulation inline-block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Categorize Spanish certificates by standard type
 */
function categorizeSpanishDocument(fileName: string): string | null {
  const name = fileName.toLowerCase();
  if (name.includes('une217001') || name.includes('une 217001')) {
    return 'UNE 217001 – Código de Red';
  }
  if (name.includes('une217002') && (name.includes('rd647') || name.includes('rd 647'))) {
    return 'UNE 217002 – RD 647/2020';
  }
  if (name.includes('une217002') && (name.includes('iec62116') || name.includes('iec 62116'))) {
    return 'UNE 217002 – IEC 62116 Anti-Islanding';
  }
  if (name.includes('nts') && name.includes('typea')) {
    return 'NTS Type A – Normas Técnicas de Supervisión';
  }
  // Fallback: any remaining UNE217002
  if (name.includes('une217002') || name.includes('une 217002')) {
    return 'UNE 217002';
  }
  if (name.includes('certificado')) {
    return 'Certificados';
  }
  return null;
}

function generateTitle(fileName: string): string {
  let title = fileName
    .replace(/^(IT_|EN_|ES_|FR_|DE_)/, '')
    .replace(/\.pdf$/i, '')
    .replace(/_/g, ' ')
    .replace(/-/g, ' ');

  // Clean up common patterns
  title = title
    .replace(/\bCertificado\s*\d*$/i, 'Certificado')
    .replace(/\bTypeA\b/gi, 'Type A')
    .replace(/\bIEC62116\b/gi, 'IEC 62116')
    .replace(/\bTED749\b/gi, 'TED 749')
    .replace(/\bUNE217001\b/gi, 'UNE 217001')
    .replace(/\bUNE217002\b/gi, 'UNE 217002')
    .replace(/\bRD647\b/gi, 'RD 647');

  return title;
}

function extractLang(fileName: string): string {
  if (fileName.startsWith('IT_')) return 'IT';
  if (fileName.startsWith('EN_')) return 'EN';
  if (fileName.startsWith('ES_')) return 'ES';
  if (fileName.startsWith('FR_')) return 'FR';
  if (fileName.startsWith('DE_')) return 'DE';
  return 'IT';
}

/* ---------- static generation ---------- */

export async function generateStaticParams() {
  return [
    { lang: "it" },
    { lang: "en" },
    { lang: "es" },
    { lang: "fr" },
    { lang: "de" },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";

  const metaByLang: Record<string, { title: string; description: string }> = {
    es: {
      title: "Certificados para España – Documentación Técnica | Afore Italia",
      description: "Certificados oficiales para el mercado español: UNE 217001, UNE 217002, RD 647/2020, IEC 62116 y NTS Type A para inversores fotovoltaicos Afore.",
    },
    it: {
      title: "Certificati per la Spagna – Documentazione Tecnica | Afore Italia",
      description: "Certificati ufficiali per il mercato spagnolo: UNE 217001, UNE 217002, RD 647/2020, IEC 62116 e NTS Type A per inverter fotovoltaici Afore.",
    },
    en: {
      title: "Certificates for Spain – Technical Documentation | Afore Italia",
      description: "Official certificates for the Spanish market: UNE 217001, UNE 217002, RD 647/2020, IEC 62116 and NTS Type A for Afore solar inverters.",
    },
    fr: {
      title: "Certificats pour l'Espagne – Documentation Technique | Afore Italia",
      description: "Certificats officiels pour le marché espagnol: UNE 217001, UNE 217002, RD 647/2020, IEC 62116 et NTS Type A pour onduleurs solaires Afore.",
    },
    de: {
      title: "Zertifikate für Spanien – Technische Dokumentation | Afore Italia",
      description: "Offizielle Zertifikate für den spanischen Markt: UNE 217001, UNE 217002, RD 647/2020, IEC 62116 und NTS Typ A für Afore Solar-Wechselrichter.",
    },
  };

  const meta = metaByLang[validLang] || metaByLang.es;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${baseUrl}/${validLang}/documentazione/certificati-spagna`,
      languages: {
        it: `${baseUrl}/it/documentazione/certificati-spagna`,
        en: `${baseUrl}/en/documentazione/certificati-spagna`,
        es: `${baseUrl}/es/documentazione/certificati-spagna`,
        fr: `${baseUrl}/fr/documentazione/certificati-spagna`,
        de: `${baseUrl}/de/documentazione/certificati-spagna`,
      },
    },
  };
}

/* ---------- page component ---------- */

export default async function CertificatiSpagnaPage({ params }: Props) {
  const { lang } = await params;
  const validLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const t = getTranslations(validLang);

  // Scan PV_INVERTER for ES_ files
  const DOC_PATH = join(process.cwd(), "public", "documentazione");
  const allDocuments: DocumentFile[] = [];

  try {
    const productTypes = ["PV_INVERTER", "ALL_IN_ONE", "BATTERIA_DI_ACCUMULO", "EV_CHARGER"];
    for (const productType of productTypes) {
      const dirPath = join(DOC_PATH, productType);
      try {
        const files = await readdir(dirPath);
        for (const file of files) {
          if (!file.toLowerCase().endsWith(".pdf")) continue;
          if (!file.startsWith("ES_")) continue; // Only Spanish files
          const filePath = join(dirPath, file);
          const stats = await stat(filePath);
          if (stats.isFile()) {
            const category = categorizeSpanishDocument(file);
            const docLang = extractLang(file);
            allDocuments.push({
              fileName: file,
              filePath: `/documentazione/${productType}/${file}`,
              category,
              productType,
              lang: docLang,
            });
          }
        }
      } catch {
        // Directory not found, skip
      }
    }
  } catch (error) {
    console.error("Failed to scan documents:", error);
  }

  // Group by product series
  const productGroups = (() => {
    const groups: Record<string, ProductGroup> = {};

    allDocuments.forEach((doc) => {
      const fileName = doc.fileName.toLowerCase();
      let groupKey = "";
      let groupTitle = "";

      if (fileName.includes("hns1000-3000") || fileName.includes("hns1000 3000")) {
        groupKey = "hns-1-3kw";
        groupTitle = "Inversor de Cadena Monofásico HNS 1–3kW";
      } else if (fileName.includes("hns3000-10000") || fileName.includes("hns3000 10000")) {
        groupKey = "hns-3-10kw";
        groupTitle = "Inversor de Cadena Monofásico HNS 3–10kW";
      } else if (fileName.includes("bnt003-025") || fileName.includes("bnt003-25") || fileName.includes("bnt003 025") || fileName.includes("bnt003 25")) {
        groupKey = "bnt-3-25kw";
        groupTitle = "Inversor de Cadena Trifásico BNT 3–25kW";
      } else if (fileName.includes("bnt030-60") || fileName.includes("bnt030 60")) {
        groupKey = "bnt-30-60kw";
        groupTitle = "Inversor de Cadena Trifásico BNT 30–60kW";
      } else if (fileName.includes("af3-6k") || fileName.includes("af3 6k")) {
        groupKey = "af3-6k";
        groupTitle = "Inversor Híbrido Monofásico AF3 1–6kW";
      } else if (fileName.includes("af3-30k") || fileName.includes("af3 30k")) {
        groupKey = "af3-30k";
        groupTitle = "Inversor Híbrido Trifásico AF3 30kW";
      } else {
        groupKey = "otros";
        groupTitle = "Otros Certificados";
      }

      if (!groups[groupKey]) {
        groups[groupKey] = { title: groupTitle, sections: [] };
      }

      const category = doc.category || "Certificados";
      let section = groups[groupKey].sections.find((s) => s.heading === category);
      if (!section) {
        section = { heading: category, items: [] };
        groups[groupKey].sections.push(section);
      }

      section.items.push({
        title: generateTitle(doc.fileName),
        href: doc.filePath,
        lang: doc.lang,
      });
    });

    // Sort sections by category order
    const categoryOrder = [
      "UNE 217001 – Código de Red",
      "UNE 217002 – RD 647/2020",
      "UNE 217002 – IEC 62116 Anti-Islanding",
      "NTS Type A – Normas Técnicas de Supervisión",
      "UNE 217002",
      "Certificados",
    ];

    Object.values(groups).forEach((group) => {
      group.sections.sort((a, b) => {
        const aIdx = categoryOrder.indexOf(a.heading);
        const bIdx = categoryOrder.indexOf(b.heading);
        if (aIdx === -1 && bIdx === -1) return 0;
        if (aIdx === -1) return 1;
        if (bIdx === -1) return -1;
        return aIdx - bIdx;
      });
    });

    // Sort groups: Monofase first, then Trifase, then Ibrido
    const groupOrder = ["hns-1-3kw", "hns-3-10kw", "bnt-3-25kw", "bnt-30-60kw", "af3-6k", "af3-30k", "otros"];
    return Object.entries(groups)
      .sort(([a], [b]) => {
        const aIdx = groupOrder.indexOf(a);
        const bIdx = groupOrder.indexOf(b);
        return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
      })
      .map(([, group]) => group);
  })();

  // Page content translations
  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    es: {
      title: "Certificados para España",
      subtitle: "Documentación normativa española: UNE 217001, UNE 217002, RD 647/2020, NTS Type A",
    },
    it: {
      title: "Certificati per la Spagna",
      subtitle: "Documentazione normativa spagnola: UNE 217001, UNE 217002, RD 647/2020, NTS Type A",
    },
    en: {
      title: "Certificates for Spain",
      subtitle: "Spanish regulatory documentation: UNE 217001, UNE 217002, RD 647/2020, NTS Type A",
    },
    fr: {
      title: "Certificats pour l'Espagne",
      subtitle: "Documentation réglementaire espagnole: UNE 217001, UNE 217002, RD 647/2020, NTS Type A",
    },
    de: {
      title: "Zertifikate für Spanien",
      subtitle: "Spanische regulatorische Dokumentation: UNE 217001, UNE 217002, RD 647/2020, NTS Type A",
    },
  };

  const pageContent = pageTitles[validLang] || pageTitles.es;

  return (
    <main>
      {/* Hero Section */}
      <section className="relative -mt-16 pt-16">
        <HeroBackground src="/image/documentazione_hero.jpg" alt="Documentazione" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 text-white">
          <Breadcrumb
            theme="dark"
            items={[
              { label: t("common.breadcrumb.home"), href: withLang("/", lang) },
              { label: t("documentazione.title"), href: withLang("/documentazione", lang) },
              { label: pageContent.title },
            ]}
          />

          <p className="mt-4 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            DOCUMENTACIÓN
          </p>

          <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight break-words">
            {pageContent.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/85">
            {pageContent.subtitle}
          </p>

          {/* Standards bullet list */}
          <ul className="mt-4 sm:mt-6 space-y-2 text-sm sm:text-base text-white/90">
            <li className="flex items-start gap-2">
              <span className="mt-2 h-0.5 w-4 bg-white/70 flex-shrink-0" />
              <span>UNE 217001 – Código de Red</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-0.5 w-4 bg-white/70 flex-shrink-0" />
              <span>UNE 217002 – RD 647/2020</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-0.5 w-4 bg-white/70 flex-shrink-0" />
              <span>UNE 217002 – IEC 62116 Anti-Islanding</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-0.5 w-4 bg-white/70 flex-shrink-0" />
              <span>NTS Type A – Normas Técnicas de Supervisión</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Document Sections */}
      {productGroups.length > 0 ? (
        productGroups.map((group) => (
          <DocumentSection key={group.title} title={group.title} sections={group.sections} />
        ))
      ) : (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-slate-600">No se encontraron documentos.</p>
          </div>
        </section>
      )}
    </main>
  );
}
