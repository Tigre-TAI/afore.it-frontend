import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumbs";
import { withLang } from "@/lib/lang-utils";
import { getTranslations } from "@/lib/i18n";
import itTranslations from "@/locales/it.json";
import enTranslations from "@/locales/en.json";
import esTranslations from "@/locales/es.json";
import { readdir, stat } from "fs/promises";
import { join } from "path";

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
                      <p className="text-xs text-slate-500 mt-1">Lingua: {it.lang}</p>
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

function generateTitle(fileName: string): string {
  let title = fileName
    .replace(/^(IT_|EN_|ES_|FR_|DE_)/, '')
    .replace(/\.pdf$/i, '')
    .replace(/_/g, ' ')
    .replace(/-/g, ' ');
  
  title = title
    .replace(/\bCEI-021\b/gi, 'CEI-021')
    .replace(/\bCEI-0-21\b/gi, 'CEI 0-21')
    .replace(/\bTestReport\b/gi, 'Test Report')
    .replace(/\bVerificationOfConformity\b/gi, 'Verification of Conformity');
  
  return title;
}

function categorizeDocument(fileName: string): string | null {
  const name = fileName.toLowerCase();
  if (name.includes('cei-021') || name.includes('cei-0-21') || name.includes('cei 0-21')) {
    return 'CEI 0-21';
  }
  if (name.includes('test report') || name.includes('testreport')) {
    return 'TEST REPORT';
  }
  if (name.includes('guida') && name.includes('regolamento')) {
    return 'Guida alla compilazione del regolamento di esercizio';
  }
  if (name.includes('addendum') || name.includes('addendum tecnico')) {
    return 'Guida alla compilazione dell\'addendum tecnico';
  }
  if (name.includes('verification') || name.includes('conformity')) {
    return 'TEST VERIFICATION OF CONFORMITY';
  }
  return null;
}

function extractLang(fileName: string): string {
  if (fileName.startsWith('IT_')) return 'IT';
  if (fileName.startsWith('EN_')) return 'EN';
  if (fileName.startsWith('ES_')) return 'ES';
  if (fileName.startsWith('FR_')) return 'FR';
  if (fileName.startsWith('DE_')) return 'DE';
  return 'IT';
}

type Props = {
  params: Promise<{ lang: string }>;
};

/** 预渲染所有语言版本的页面（静态导出必需） */
export async function generateStaticParams() {
  return [
    { lang: "it" },
    { lang: "en" },
    { lang: "es" },
  ];
}

export default async function CertificatiAllInOnePage({ params }: Props) {
  const { lang } = await params;
  const validLang = ["it", "en", "es"].includes(lang) ? lang : "it";
  const t = getTranslations(validLang);
  
  const translations: Record<string, any> = {
    it: itTranslations,
    en: enTranslations,
    es: esTranslations,
  };
  const translationsObj = translations[validLang] || translations.it;

  // Fetch documents on server side
  const DOC_PATH = join(process.cwd(), 'public', 'documentazione');
  let allDocuments: DocumentFile[] = [];
  
  try {
    const productTypes = ['ALL_IN_ONE'];
    for (const productType of productTypes) {
      const dirPath = join(DOC_PATH, productType);
      try {
        const files = await readdir(dirPath);
        for (const file of files) {
          if (!file.toLowerCase().endsWith('.pdf')) continue;
          const filePath = join(dirPath, file);
          const stats = await stat(filePath);
          if (stats.isFile()) {
            const category = categorizeDocument(file);
            const lang = extractLang(file);
            allDocuments.push({
              fileName: file,
              filePath: `/documentazione/${productType}/${file}`,
              category,
              productType,
              lang,
            });
          }
        }
      } catch (error) {
        // Directory not found, skip
      }
    }
  } catch (error) {
    console.error('Failed to scan documents:', error);
  }

  // Filter All-in-One documents
  const allInOneDocuments = (() => {
    return allDocuments.filter((doc) => {
      const category = categorizeDocument(doc.fileName);
      return category === 'CEI 0-21' || 
             category === 'TEST REPORT' ||
             category === 'Guida alla compilazione del regolamento di esercizio' ||
             category === 'Guida alla compilazione dell\'addendum tecnico' ||
             category === 'TEST VERIFICATION OF CONFORMITY';
    });
  })();

  // Group documents
  const productGroups = (() => {
    const groups: Record<string, ProductGroup> = {};

    allInOneDocuments.forEach((doc) => {
      const fileName = doc.fileName.toLowerCase();
      let groupKey = 'allinone';
      let groupTitle = 'Certificati All-in-One';

      if (!groups[groupKey]) {
        groups[groupKey] = {
          title: groupTitle,
          sections: [],
        };
      }

      const category = categorizeDocument(doc.fileName) || 'Other';
      let section = groups[groupKey].sections.find((s) => s.heading === category);
      if (!section) {
        section = { heading: category, items: [] };
        groups[groupKey].sections.push(section);
      }

      const title = generateTitle(doc.fileName);
      const lang = extractLang(doc.fileName);
      const href = doc.filePath;

      section.items.push({
        title,
        href,
        lang,
      });
    });

    // Sort sections by category order
    const categoryOrder = [
      'CEI 0-21',
      'TEST REPORT',
      'Guida alla compilazione del regolamento di esercizio',
      'Guida alla compilazione dell\'addendum tecnico',
      'TEST VERIFICATION OF CONFORMITY',
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

    return Object.values(groups);
  })();

  const pageTitle = translationsObj.documentazione?.certificatiAllInOne?.title || "Certificati All-in-One";
  const pageSubtitle = translationsObj.documentazione?.certificatiAllInOne?.subtitle || "Download tecnici per sistemi integrati residenziali e commerciali.";

  return (
    <main>
      {/* Hero Section */}
      <section className="relative -mt-16 pt-16">
        <div className="absolute inset-0">
          <img
            src="/image/documentazione_hero.jpg"
            alt="Documentazione"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 text-white">
          <Breadcrumb
            theme="dark"
            items={[
              { label: t("common.breadcrumb.home"), href: withLang("/", lang) },
              { label: t("documentazione.title") },
              { label: pageTitle },
            ]}
          />
          
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            DOCUMENTAZIONE
          </p>
          
          <h1 className="mt-3 text-3xl lg:text-5xl font-extrabold tracking-tight">
            {pageTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-white/85">
            {pageSubtitle}
          </p>

          {/* Bullet list with hyphens */}
          <ul className="mt-6 space-y-2 text-white/90">
            <li className="flex items-start gap-2">
              <span className="mt-2 h-0.5 w-4 bg-white/70 flex-shrink-0" />
              <span>CEI 0-21</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-0.5 w-4 bg-white/70 flex-shrink-0" />
              <span>TEST REPORT</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-0.5 w-4 bg-white/70 flex-shrink-0" />
              <span>Guida alla compilazione del regolamento di esercizio</span>
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
            <p className="text-slate-600">Nessun documento trovato.</p>
          </div>
        </section>
      )}
    </main>
  );
}

