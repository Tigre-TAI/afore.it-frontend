import Image from "next/image";
import { notFound } from "next/navigation";
import BreadcrumbSetter from "@/components/BreadcrumbSetter";
import Button from "@/components/ui/Button";
import { VISIBLE_PRODUCTS, findProductBySlugs, resolvePath, labelOf } from "@/data/product-data";
import { readdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { getTranslations } from "@/lib/i18n";
import { StructuredData } from "@/components/SEO/StructuredData";
import HeroBackground from "@/components/ui/HeroBackground";
import DownloadSection from "@/components/DownloadSection";
import YouTubeVideoWithTitle from "@/components/YouTubeVideoWithTitle";
import { EV_CHARGER_ITEMS, type DownloadSectionItem } from "@/data/download-items";
import { getSchedaPdfUrl } from "@/data/scheda-pdf-map";
import { getProductDocConfig } from "@/data/product-documentazione-map";
import SplitCompareSection from "@/components/SplitCompareSection";

/** 读取 documentazione 文件夹并按产品过滤，生成 DownloadSectionItem */
async function getDocumentazioneItems(
  productId: string,
  family: string,
  docLabel: string
): Promise<DownloadSectionItem[]> {
  const cfg = getProductDocConfig(productId, family);
  if (!cfg) return [];

  const { folder: docFolder, include } = cfg;

  // include 为空数组表示该产品无对应文档（如 Hailei 电池、stringa 70-110）
  if (include.length === 0) return [];

  const docPath = join(process.cwd(), "public", "documentazione", docFolder);
  if (!existsSync(docPath)) return [];

  try {
    const entries = await readdir(docPath, { withFileTypes: true });
    const files: Array<{ label: string; href: string }> = [];

    const matchAll = include.includes("");
    const patterns = include.filter((p) => p.length > 0);

    for (const e of entries) {
      if (e.isDirectory()) continue;
      if (!e.name.toLowerCase().endsWith(".pdf")) continue;

      const nameLower = e.name.toLowerCase();

      if (!matchAll && patterns.length > 0) {
        const matches = patterns.some((p) => nameLower.includes(p.toLowerCase()));
        if (!matches) continue;
      }

      const href = `/documentazione/${docFolder}/${e.name}`;
      const label = e.name.replace(/\.pdf$/i, "").replace(/_/g, " ");
      files.push({ label, href });
    }

    files.sort((a, b) => a.label.localeCompare(b.label));

    if (files.length === 0) return [];
    return [
      {
        type: "folder",
        label: docLabel,
        items: files.map((f) => ({ type: "file" as const, label: f.label, href: f.href })),
      },
    ];
  } catch {
    return [];
  }
}

/** 构建产品页的 Area Download 列表 */
async function buildProductDownloadItems(
  p: { id: string; schedaKey?: string },
  family: string,
  lang: string,
  allDownloads: Array<{ file: string; name: string; lang?: string }>,
  schedaLabel: string,
  docLabel: string
): Promise<DownloadSectionItem[]> {
  const items: DownloadSectionItem[] = [];

  // 1. Scheda Tecnica（仅非 EV Charger；EV Charger 在 EV_CHARGER_ITEMS 里已有）
  if (family !== "ev-charger") {
    const schedaFromMap = p.schedaKey && getSchedaPdfUrl(p.schedaKey, p.id, lang as "it" | "en" | "es" | "fr" | "de");
    const schedaFromDisk = allDownloads.find(
      (d) => d.name?.toLowerCase().includes("scheda") || d.file?.toLowerCase().includes("scheda")
    );

    if (schedaFromDisk) {
      items.push({
        type: "file",
        label: `${schedaFromDisk.name}${schedaFromDisk.lang ? ` (${schedaFromDisk.lang})` : ""}`,
        href: `/prodotti/${p.id}/downloads/${schedaFromDisk.file}`,
      });
    } else if (schedaFromMap) {
      items.push({ type: "file", label: schedaLabel, href: schedaFromMap });
    }

    // 其他产品专属文件（非 Scheda）
    for (const d of allDownloads) {
      if (d.name?.toLowerCase().includes("scheda") || d.file?.toLowerCase().includes("scheda")) continue;
      items.push({
        type: "file",
        label: `${d.name}${d.lang ? ` (${d.lang})` : ""}`,
        href: `/prodotti/${p.id}/downloads/${d.file}`,
      });
    }
  }

  // 2. EV Charger: EV_CHARGER_ITEMS
  if (family === "ev-charger") {
    for (const item of EV_CHARGER_ITEMS) {
      items.push(item);
    }
  }

  // 3. Documentazione 文件夹（按产品过滤）
  const docItems = await getDocumentazioneItems(p.id, family, docLabel);
  for (const item of docItems) {
    items.push(item);
  }

  return items;
}

type Props = { 
  params: Promise<{ 
    lang: string;
    category: string; 
    id: string;
  }>;
};

/** 预渲染所有产品详情页（利于 SEO） */
export async function generateStaticParams() {
  const langs = ["it", "en", "es", "fr", "de"];
  const params: Array<{ lang: string; category: string; id: string }> = [];
  
  for (const lang of langs) {
    for (const p of VISIBLE_PRODUCTS) {
      const { family } = resolvePath(p);
      params.push({ lang, category: family, id: p.id });
    }
  }
  
  return params;
}

/** SEO 元信息 */
export async function generateMetadata({ params }: Props) {
  const { lang, category, id } = await params;
  const p = findProductBySlugs(category, id);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  
  if (!p) return { title: "Prodotto non trovato" };
  
  // Generate SEO-optimized title and description with keywords
  const getProductKeywords = (product: typeof p, lang: string) => {
    const keywords = {
      it: `Afore, Afore Italia, ${p.title}, inverter fotovoltaico, inverter ibrido, inverter di stringa, batteria accumulo, fotovoltaico, energia solare, ${p.subtitle || ''}`,
      en: `Afore, Afore Italia, ${p.title}, solar inverter, hybrid inverter, string inverter, battery storage, photovoltaic, solar energy, ${p.subtitle || ''}`,
      es: `Afore, Afore Italia, ${p.title}, inversor solar, inversor híbrido, inversor de cadena, baterías, fotovoltaico, energía solar, ${p.subtitle || ''}`,
    };
    return keywords[lang as keyof typeof keywords] || keywords.it;
  };
  
  const description = {
    it: `${p.title} di Afore Italia. ${p.subtitle || 'Inverter fotovoltaico e sistemi di accumulo per energia solare residenziale e commerciale.'} Scopri specifiche tecniche, certificazioni e documentazione completa.`,
    en: `${p.title} by Afore Italia. ${p.subtitle || 'Solar inverter and battery storage systems for residential and commercial solar energy.'} Discover technical specifications, certifications and complete documentation.`,
    es: `${p.title} de Afore Italia. ${p.subtitle || 'Inversor solar y sistemas de baterías para energía solar residencial y comercial.'} Descubre especificaciones técnicas, certificaciones y documentación completa.`,
  };
  
  const metaDesc = description[lang as keyof typeof description] || description.it;
  const keywords = getProductKeywords(p, lang);
  
  return {
    title: `${p.title} | Afore Italia - Inverter Fotovoltaico e Sistemi Solari`,
    description: metaDesc,
    keywords: keywords,
    alternates: {
      canonical: `${baseUrl}/${lang}/prodotti/${category}/${id}`,
      languages: {
        'it': `${baseUrl}/it/prodotti/${category}/${id}`,
        'en': `${baseUrl}/en/prodotti/${category}/${id}`,
        'es': `${baseUrl}/es/prodotti/${category}/${id}`,
        'fr': `${baseUrl}/fr/prodotti/${category}/${id}`,
        'de': `${baseUrl}/de/prodotti/${category}/${id}`,
      },
    },
    openGraph: {
      type: "website",
      locale: lang === 'it' ? 'it_IT' : lang === 'es' ? 'es_ES' : 'en_US',
      url: `${baseUrl}/${lang}/prodotti/${category}/${id}`,
      title: `${p.title} | Afore Italia`,
      description: metaDesc,
      siteName: "Afore Italia",
      images: [
        {
          url: `${baseUrl}${p.image}`,
          width: 1200,
          height: 630,
          alt: p.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${p.title} | Afore Italia`,
      description: metaDesc,
      images: [`${baseUrl}${p.image}`],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { lang, category, id } = await params;
  const p = findProductBySlugs(category, id);
  if (!p) return notFound();

  const MODEL_BAR_LABEL: Record<string, string> = {
    "ev-diamond": "SWG5E-7/32-11/16-22/32",
    "stringa-1-3kw": "HNS1000TL-1 / HNS1500TL-1 / HNS2000TL-1 / HNS2500TL-1 / HNS3000TL-1",
    "stringa-3-6kw": "HNS3000TL / HNS3600TL / HNS4000TL / HNS5000TL / HNS6000TL",
    "stringa-7-10kw": "HNS7000TL / HNS8000TL / HNS9000TL / HNS10000TL",
    "stringa-trifase-3-25kw":
      "BNT003KTL / BNT004KTL / BNT005KTL / BNT006KTL / BNT010KTL / BNT012KTL / BNT013KTL / BNT015KTL / BNT017KTL / BNT020KTL / BNT025KTL",
    "stringa-trifase-30kw": "BNT030KTL",
    "stringa-trifase-36-60kw": "BNT036KTL / BNT040KTL / BNT050KTL / BNT060KTL",
    "stringa-trifase-70-110kw": "BNT070KTL / BNT075KTL / BNT080KTL / BNT090KTL / BNT100KTL / BNT110KTL",
    "ibrido-monofase-1-3-6kw": "AF3K-SL-1 / AF3.6K-SL-1 / AF3K-SL / AF3.6K-SL",
    "ibrido-monofase-plus-4-6kw": "AF4K-SLP / AF4.6K-SLP / AF5K-SLP / AF5.5K-SLP / AF6K-SLP",
    "ibrido-trifase-3-15kw": "AF3K-MTH / AF4K-MTH / AF5K-MTH / AF6K-MTH / AF8K-MTH / AF10K-MTH / AF12K-MTH / AF15K-MTH",
    "ibrido-trifase-plus-3-12kw": "AF3K-THP / AF4K-THP / AF5K-THP / AF6K-THP / AF8K-THP / AF10K-THP / AF12K-THP",
    "ibrido-trifase-plus-8-12kw": "AF8K-SLP / AF9K-SLP / AF10K-SLP / AF11K-SLP / AF12K-SLP",
    "ibrido-trifase-3-30kw": "AF3K-TH ~ AF30K-TH",
    "ibrido-trifase-36-60kw": "AF36K-TH / AF40K-TH / AF45K-TH / AF50K-TH / AF60K-TH",
    "bat-hailei-atom-ls-10-15kwh": "ATOM-LS 10.24kWh / ATOM-LS 15.36kWh",
    atomwb512100: "ATOM-WB512100",
    "atomwb512100-1": "ATOM-WB512100-1",
    // Pompa di calore
    "shenling-r290": "Shenling R290",
    "shenling-r290-2": "Shenling R290 · Hydro Box",
    "shenling-r290-all-in-one": "Shenling R290 · All in One",
    "shenling-r32": "Shenling R32",
  };

  // 推导宏类/子类，并校验 URL 类别是否匹配（防止串类访问）
  const { macro, family } = resolvePath(p);
  if (category !== family) return notFound();

  // 可选：尝试读取 public/prodotti/<id>/meta.json（没有也完全不影响渲染）
  // 如果你有站点基地址，可以设置 NEXT_PUBLIC_SITE_URL，提高服务端读取的稳定性。
  let meta: any = null;
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL;
    if (base) {
      const url = `${base}/prodotti/${p.id}/meta.json`;
      const r = await fetch(url, { cache: "force-cache" });
      if (r.ok) meta = await r.json();
    }
  } catch {
    // 忽略读取失败，按最小信息展示
  }

  // 扫描下载目录，自动发现 Scheda_Tecnica 等文件
  // 文件必须放在 /public/prodotti/<product_id>/downloads/ 目录下才会被匹配
  // 这意味着文件已经和对应的产品页面正确关联了
  const discoveredFiles: Array<{ file: string; name: string; lang?: string }> = [];
  try {
    const downloadsDir = join(process.cwd(), "public", "prodotti", p.id, "downloads");
    // 使用同步检查避免阻塞，并且快速失败
    if (existsSync(downloadsDir)) {
      // 使用 Promise.race 添加超时保护，避免构建时卡住
      const readPromise = readdir(downloadsDir);
      const timeoutPromise = new Promise<string[]>((_, reject) => 
        setTimeout(() => reject(new Error("Timeout")), 5000)
      );
      
      const files = await Promise.race([readPromise, timeoutPromise]);
      
      for (const file of files) {
        // 只处理 PDF 文件，加快处理速度
        if (!file.toLowerCase().endsWith('.pdf')) continue;
        
        const fileNameLower = file.toLowerCase();
        // 匹配包含 Scheda_Tecnica 或 Scheda Tecnica 的文件（支持多种变体）
        if (
          fileNameLower.includes("scheda_tecnica") ||
          fileNameLower.includes("scheda-tecnica") ||
          fileNameLower.includes("scheda tecnica") ||
          fileNameLower.includes("schedatecnica")
        ) {
          // 提取语言信息（如果有）
          let lang: string | undefined;
          if (fileNameLower.includes("_it") || fileNameLower.includes("-it")) {
            lang = "IT";
          } else if (fileNameLower.includes("_en") || fileNameLower.includes("-en")) {
            lang = "EN";
          } else if (fileNameLower.includes("_fr") || fileNameLower.includes("-fr")) {
            lang = "FR";
          } else if (fileNameLower.includes("_es") || fileNameLower.includes("-es")) {
            lang = "ES";
          } else if (fileNameLower.includes("_de") || fileNameLower.includes("-de")) {
            lang = "DE";
          }

          discoveredFiles.push({
            file,
            name: "Scheda Tecnica",
            lang,
          });
        }
      }
    }
  } catch (error) {
    // 忽略扫描失败（目录不存在或超时都是正常情况）
    // 不在构建时打印错误，避免日志污染
  }

  // 合并 meta.json 中的下载文件和自动发现的文件
  const allDownloads = [
    ...(meta?.downloads || []),
    // 只添加不在 meta.json 中的文件
    ...discoveredFiles.filter(
      (df) => !meta?.downloads?.some((d: any) => d.file === df.file)
    ),
  ];

  const t = getTranslations(lang);

  // 构建 Area Download 列表（Scheda Tecnica + Documentazione）
  const productDownloadItems = await buildProductDownloadItems(
    p,
    family,
    lang,
    allDownloads,
    t("prodotti.schedaTecnica"),
    t("prodotti.documentazione")
  );
  
  // 面包屑：统一从数据推导（可覆盖全局 Breadcrumbs 的默认行为）
  const crumbs = [
    { href: "/", label: t("common.breadcrumb.home") },
    { href: "/prodotti", label: t("prodotti.title") },
    { href: `/prodotti/${family}`, label: labelOf(family) },
    { label: p.title },
  ];

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afore.it";
  const currentUrl = `${baseUrl}/${lang}/prodotti/${category}/${id}`;

  return (
    <main>
      <BreadcrumbSetter items={crumbs} />
      {/* Structured Data for SEO */}
      <StructuredData type="Organization" lang={lang} />
      <StructuredData type="WebPage" data={{ 
        title: p.title,
        description: p.subtitle || p.title,
        url: currentUrl,
        path: `/${lang}/prodotti/${category}/${id}`
      }} lang={lang} />
      <StructuredData type="BreadcrumbList" data={{ items: crumbs.map((c, i) => ({ 
        label: c.label, 
        href: c.href ? `/${lang}${c.href}` : undefined
      })) }} lang={lang} />
      
      {/* Hero Section */}
      <section className="relative -mt-[88px] pt-[88px]">
        <HeroBackground src="/image/heroes/prodotti_hero.jpg" alt={p.title} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-white">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            {p.title}
          </h1>
          {p.subtitle && (
            <p className="mt-2 max-w-2xl text-sm text-white/85">
              {p.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* ev-diamond / stringa-1-3kw / ibrido-monofase-1-3-6kw / ... : Model bar + tab nav 左型号，右三按钮组，顶对齐 */}
      {MODEL_BAR_LABEL[p.id] && (
        <div className="bg-black">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 py-4">
              <span className="text-sm font-mono text-white shrink-0">
                {MODEL_BAR_LABEL[p.id]}
              </span>
              <nav className="flex flex-wrap gap-6 sm:gap-8 sm:ml-auto shrink-0" aria-label="Sezioni prodotto">
                <a href="#panoramica" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
                  Panoramica
                </a>
                <a href="#specifiche" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
                  Dati tecnici
                </a>
                <a href="#download-e-supporto" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
                  Download e supporto
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10 space-y-10">
        {/* Hero：左图右文 */}
        <section id="panoramica" className="grid gap-8 md:grid-cols-2 items-center scroll-mt-24">
        <div className="w-full">
          <Image
            src={meta?.hero?.product ?? p.image}
            alt={p.title}
            width={1200}
            height={900}
            className="w-full object-contain product-image-shadow"
            priority
          />
        </div>
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold">{p.title}</h1>
          {p.subtitle && (
            <p className="mt-3 text-slate-600 text-lg leading-relaxed">
              {p.subtitle}
            </p>
          )}
          {/* Scheda Tecnica: un solo pulsante (primo file disponibile o da mappa) */}
          <div className="mt-6 flex flex-wrap gap-4">
            {(() => {
              const schedaFiles = allDownloads.filter(
                (d: any) =>
                  d.name?.toLowerCase().includes("scheda") ||
                  d.file?.toLowerCase().includes("scheda")
              );
              const schedaFromMap = p.schedaKey && getSchedaPdfUrl(p.schedaKey, p.id, lang as "it" | "en" | "es" | "fr" | "de");
              const langOrder = [lang.toUpperCase(), "IT", "EN", "ES", "FR", "DE"];
              const preferred = schedaFiles.length > 0
                ? schedaFiles.find((d: any) => d.lang === langOrder[0]) ?? schedaFiles[0]
                : null;
              if (preferred) {
                return (
                  <Button
                    href={`/prodotti/${p.id}/downloads/${preferred.file}`}
                    variant="primary"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("prodotti.schedaTecnica")}{preferred.lang ? ` (${preferred.lang})` : ""}
                  </Button>
                );
              }
              if (schedaFromMap) {
                return (
                  <Button
                    href={schedaFromMap}
                    variant="primary"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("prodotti.schedaTecnica")}
                  </Button>
                );
              }
              return null;
            })()}
          </div>
        </div>
      </section>

      {/* Pompa di calore: sezione Dati tecnici in stile uniforme (CTA alla Scheda Tecnica) */}
      {(p.id === "shenling-r290" ||
        p.id === "shenling-r290-2" ||
        p.id === "shenling-r290-all-in-one" ||
        p.id === "shenling-r32") && (
        <section id="specifiche" className="scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Dati tecnici</h2>
          <div className="space-y-6">
            {p.techTableImage && (
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="min-w-[980px] rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
                  <Image
                    src={p.techTableImage}
                    alt={`Dati tecnici - ${p.title}`}
                    width={1800}
                    height={1100}
                    className="w-full h-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <p className="text-slate-700 leading-relaxed">
                I dati tecnici completi sono disponibili nella scheda tecnica del prodotto.
              </p>
              <div className="mt-5">
                {p.schedaKey && (
                  <Button
                    href={getSchedaPdfUrl(p.schedaKey, p.id, lang as "it" | "en" | "es" | "fr" | "de") ?? "#"}
                    variant="primary"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("prodotti.schedaTecnica")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ev-diamond: Specifiche section Dati tecnici (flat style) */}
      {p.id === "ev-diamond" && (
        <section id="specifiche" className="scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Dati tecnici</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-left bg-transparent">Modello</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">SWG5E-7/32</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">SWG5E-11/16</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">SWG5E-22/32</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Alimentazione</td><td className="px-4 py-2.5 text-center">1P+N+PE</td><td className="px-4 py-2.5 text-center">3P+N+PE</td><td className="px-4 py-2.5 text-center">3P+N+PE</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Tensione nominale</td><td className="px-4 py-2.5 text-center">220-240V AC</td><td className="px-4 py-2.5 text-center">380-415V AC</td><td className="px-4 py-2.5 text-center">380-450V AC</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Corrente nominale</td><td className="px-4 py-2.5 text-center">Max 32A (6-32A regolabile)</td><td className="px-4 py-2.5 text-center">Max 16A (6-16A regolabile)</td><td className="px-4 py-2.5 text-center">Max 32A (6-32A regolabile)</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Frequenza</td><td className="px-4 py-2.5 text-center">50/60Hz</td><td className="px-4 py-2.5 text-center">50/60Hz</td><td className="px-4 py-2.5 text-center">50/60Hz</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Tensione di uscita</td><td className="px-4 py-2.5 text-center">220-240V AC</td><td className="px-4 py-2.5 text-center">380-415V AC</td><td className="px-4 py-2.5 text-center">380-415V AC</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Corrente massima</td><td className="px-4 py-2.5 text-center">32A</td><td className="px-4 py-2.5 text-center">16A</td><td className="px-4 py-2.5 text-center">32A</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Potenza nominale</td><td className="px-4 py-2.5 text-center">7 kW</td><td className="px-4 py-2.5 text-center">11 kW</td><td className="px-4 py-2.5 text-center">22 kW</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Presa di ricarica</td><td colSpan={3} className="px-4 py-2.5 text-center">Cavo Tipo 2 / Cavo Tipo GBT / Cavo Tipo 1</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Lunghezza cavo</td><td colSpan={3} className="px-4 py-2.5 text-center">5/7/10 M Opzionale</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Materiale del guscio</td><td colSpan={3} className="px-4 py-2.5 text-center">PC + Lega di Silossano</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Indicatore LED</td><td colSpan={3} className="px-4 py-2.5 text-center">Rosso/Blu/Verde</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Display LCD</td><td colSpan={3} className="px-4 py-2.5 text-center">4.3&quot; LCD Display</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Lettore RFID</td><td colSpan={3} className="px-4 py-2.5 text-center">MIFARE ISO/IEC 14443-A</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Modalità di avvio</td><td colSpan={3} className="px-4 py-2.5 text-center">Plug &amp; Charge / Scheda RFID / APP</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Arresto di emergenza</td><td colSpan={3} className="px-4 py-2.5 text-center">Supporto</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Wi-Fi</td><td colSpan={3} className="px-4 py-2.5 text-center">Opzionale</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">3G/4G/5G</td><td colSpan={3} className="px-4 py-2.5 text-center">4G Opzionale</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Ethernet</td><td colSpan={3} className="px-4 py-2.5 text-center">Opzionale</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Bluetooth</td><td colSpan={3} className="px-4 py-2.5 text-center">Supporto</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Protocollo di comunicazione</td><td colSpan={3} className="px-4 py-2.5 text-center">OCPP1.6J (con supporto per l&apos;aggiornamento a OCPP2.0) opzionale</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Protezione corrente residua</td><td colSpan={3} className="px-4 py-2.5 text-center">Tipo A + 6mA DC (equivalente a Tipo B) / Tipo A</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Grado di protezione IP</td><td colSpan={3} className="px-4 py-2.5 text-center">IP65</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Protezione da impatto</td><td colSpan={3} className="px-4 py-2.5 text-center">IK08</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Protezioni multiple</td><td colSpan={3} className="px-4 py-2.5 text-center">Sovracorrente/Sottocorrente, Cortocircuito, Messa a terra, Sovratensione, Sovratemperatura/Sottotemperatura, Sovratensione/Sottotensione</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Norme di certificazione</td><td colSpan={3} className="px-4 py-2.5 text-center">EN IEC 61851-1:2019; EN 62752:2016/A1:2020, EN IEC 61851-21-2:2021; EN IEC 61000-6-1:2019, EN IEC 61000-6-3:2021</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Garanzia</td><td colSpan={3} className="px-4 py-2.5 text-center">2 Anni</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Installazione</td><td colSpan={3} className="px-4 py-2.5 text-center">A parete (colonna opzionale)</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Temperatura operativa</td><td colSpan={3} className="px-4 py-2.5 text-center">-30 ℃~50 ℃</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Temperatura di stoccaggio</td><td colSpan={3} className="px-4 py-2.5 text-center">-40 ℃~70 ℃</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Umidità di esercizio</td><td colSpan={3} className="px-4 py-2.5 text-center">5%-95%RH</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Altitudine di esercizio</td><td colSpan={3} className="px-4 py-2.5 text-center">&lt;2000M</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Peso</td><td className="px-4 py-2.5 text-center">3.9 kg</td><td className="px-4 py-2.5 text-center">4.2 kg</td><td className="px-4 py-2.5 text-center">5.2 kg</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Colore</td><td colSpan={3} className="px-4 py-2.5 text-center">Grigio scuro</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2.5 font-medium">Standby Power</td><td className="px-4 py-2.5 text-center">≤3W</td><td className="px-4 py-2.5 text-center">≤6W</td><td className="px-4 py-2.5 text-center">≤6W</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* stringa-1-3kw: Dati tecnici 5 modelli HNS1000TL-1 ~ HNS3000TL-1 */}
      {p.id === "stringa-1-3kw" && (
        <section id="specifiche" className="scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Dati tecnici</h2>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[900px] text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="sticky left-0 z-10 min-w-[200px] px-4 py-2.5 font-medium text-slate-800 text-left bg-white whitespace-nowrap border-r border-slate-200">Modello</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">HNS1000TL-1</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">HNS1500TL-1</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">HNS2000TL-1</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">HNS2500TL-1</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">HNS3000TL-1</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Ingresso FV</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza massima in ingresso (DC) (W)</td><td className="px-4 py-2.5 text-center">1500</td><td className="px-4 py-2.5 text-center">2250</td><td className="px-4 py-2.5 text-center">3000</td><td className="px-4 py-2.5 text-center">3750</td><td className="px-4 py-2.5 text-center">4200</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione massima in ingresso (DC) (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">500</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo tensione MPPT (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">50-500</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione MPPT alla massima efficienza (V)</td><td className="px-4 py-2.5 text-center">70-500</td><td className="px-4 py-2.5 text-center">110-500</td><td className="px-4 py-2.5 text-center">145-500</td><td className="px-4 py-2.5 text-center">180-500</td><td className="px-4 py-2.5 text-center">220-500</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione ottimale (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">360</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di avviamento (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">50</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente massima in ingresso (A)</td><td colSpan={5} className="px-4 py-2.5 text-center">14</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente di corto circuito (A)</td><td colSpan={5} className="px-4 py-2.5 text-center">18</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">N. di inseguitori MPPT / N. di stringhe FV</td><td colSpan={5} className="px-4 py-2.5 text-center">1/1</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tipo di connettore FV</td><td colSpan={5} className="px-4 py-2.5 text-center">MC4</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Uscita CA</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza massima in uscita (VA)</td><td className="px-4 py-2.5 text-center">1100</td><td className="px-4 py-2.5 text-center">1650</td><td className="px-4 py-2.5 text-center">2200</td><td className="px-4 py-2.5 text-center">2750</td><td className="px-4 py-2.5 text-center">3300</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza nominale AC (W)</td><td className="px-4 py-2.5 text-center">1000</td><td className="px-4 py-2.5 text-center">1500</td><td className="px-4 py-2.5 text-center">2000</td><td className="px-4 py-2.5 text-center">2500</td><td className="px-4 py-2.5 text-center">3000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente massima in uscita (A)</td><td className="px-4 py-2.5 text-center">6</td><td className="px-4 py-2.5 text-center">9</td><td className="px-4 py-2.5 text-center">12</td><td className="px-4 py-2.5 text-center">13</td><td className="px-4 py-2.5 text-center">15</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale di uscita (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">L/N/PE, 220Vac, 230Vac, 240Vac</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di rete</td><td colSpan={5} className="px-4 py-2.5 text-center">180Vac-276Vac</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di frequenza di rete (Hz)</td><td colSpan={5} className="px-4 py-2.5 text-center">50/60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Frequenza di rete</td><td colSpan={5} className="px-4 py-2.5 text-center">45-55Hz/54-66Hz</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Fattore di potenza</td><td colSpan={5} className="px-4 py-2.5 text-center">1 default (regolabile da 0,8 in anticipo a 0,8 in ritardo)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">THD della corrente</td><td colSpan={5} className="px-4 py-2.5 text-center">&lt;3%</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Rendimento</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rendimento massimo (%)</td><td className="px-4 py-2.5 text-center">97.50</td><td className="px-4 py-2.5 text-center">97.80</td><td className="px-4 py-2.5 text-center">98.10</td><td className="px-4 py-2.5 text-center">98.10</td><td className="px-4 py-2.5 text-center">98.13</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rendimento europeo (%)</td><td className="px-4 py-2.5 text-center">96.60</td><td className="px-4 py-2.5 text-center">96.70</td><td className="px-4 py-2.5 text-center">96.80</td><td className="px-4 py-2.5 text-center">97.23</td><td className="px-4 py-2.5 text-center">97.56</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Protezione</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione contro inversione polarità</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento della resistenza</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da cortocircuito</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da sovracorrente</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da sovratensione</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione anti-isola</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento corrente residua</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione contro il surriscaldamento</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Interruttore lato DC integrato</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione contro le scariche</td><td colSpan={5} className="px-4 py-2.5 text-center">Integrata (Tipo III)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Scansione della curva</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Interruzione guasto arco (ArcFault)</td><td colSpan={5} className="px-4 py-2.5 text-center">Opzionale</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Generale</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Dimensioni (W x H x D, mm)</td><td colSpan={5} className="px-4 py-2.5 text-center">280 x 260 x 116</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Peso (kg)</td><td colSpan={5} className="px-4 py-2.5 text-center">6</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Grado di protezione (IP)</td><td colSpan={5} className="px-4 py-2.5 text-center">IP65</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Materiale</td><td colSpan={5} className="px-4 py-2.5 text-center">Alluminio</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo temperatura ambiente (°C)</td><td colSpan={5} className="px-4 py-2.5 text-center">-25 to 60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di umidità</td><td colSpan={5} className="px-4 py-2.5 text-center">0-100%</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Topologia: senza trasformatore</td><td colSpan={5} className="px-4 py-2.5 text-center">Senza trasformatore</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Interfaccia di comunicazione</td><td colSpan={5} className="px-4 py-2.5 text-center">RS485 / WiFi / Wire Ethernet / GPRS (opzionale)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Metodo di raffreddamento</td><td colSpan={5} className="px-4 py-2.5 text-center">Convezione</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Consumo in modalità standby (W)</td><td className="px-4 py-2.5 text-center">&lt;0.2</td><td className="px-4 py-2.5 text-center">&lt;0.2</td><td className="px-4 py-2.5 text-center">&lt;1</td><td className="px-4 py-2.5 text-center">&lt;1</td><td className="px-4 py-2.5 text-center">&lt;1</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Altitudine operativa (m)</td><td colSpan={5} className="px-4 py-2.5 text-center">4000</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Certificazioni</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Standard EMC</td><td colSpan={5} className="px-4 py-2.5 text-center">EN/IEC 61000-6-2, EN/IEC 61000-6-3, EN61000-3-2, EN61000-3-3</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Standard di sicurezza</td><td colSpan={5} className="px-4 py-2.5 text-center">IEC 60068, UL1741, EN62109</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Connettività / Collegamento rete</td><td colSpan={5} className="px-4 py-2.5 text-center">IEEE1547, CSA C22, EN50549, VDE4105, VDEO126, RD1699, ABNT NBR16149 &amp; 16150, AS4777.2, NB/T32004, G98, IEC61727</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* stringa-3-6kw: Dati tecnici 5 modelli HNS3000TL ~ HNS6000TL */}
      {p.id === "stringa-3-6kw" && (
        <section id="specifiche" className="scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Dati tecnici</h2>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[900px] text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="sticky left-0 z-10 min-w-[200px] px-4 py-2.5 font-medium text-slate-800 text-left bg-white whitespace-nowrap border-r border-slate-200">Modello</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">HNS3000TL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">HNS3600TL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">HNS4000TL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">HNS5000TL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">HNS6000TL</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Ingresso FV</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza massima in ingresso (DC) (W)</td><td className="px-4 py-2.5 text-center">4500</td><td className="px-4 py-2.5 text-center">5400</td><td className="px-4 py-2.5 text-center">6000</td><td className="px-4 py-2.5 text-center">7500</td><td className="px-4 py-2.5 text-center">9000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione massima in ingresso (DC) (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">500</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo tensione MPPT (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">50-500</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione MPPT alla massima efficienza (V)</td><td className="px-4 py-2.5 text-center">150-500</td><td className="px-4 py-2.5 text-center">180-500</td><td className="px-4 py-2.5 text-center">200-500</td><td className="px-4 py-2.5 text-center">240-500</td><td className="px-4 py-2.5 text-center">280-500</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione ottimale (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">360</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di avviamento (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">70</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente massima in ingresso (A)</td><td colSpan={5} className="px-4 py-2.5 text-center">14 x 2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente di corto circuito (A)</td><td colSpan={5} className="px-4 py-2.5 text-center">18 x 2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">N. di inseguitori MPPT / N. di stringhe FV</td><td colSpan={5} className="px-4 py-2.5 text-center">2/2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tipo di connettore FV</td><td colSpan={5} className="px-4 py-2.5 text-center">MC4</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Uscita CA</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza massima in uscita (VA)</td><td className="px-4 py-2.5 text-center">3300</td><td className="px-4 py-2.5 text-center">3960</td><td className="px-4 py-2.5 text-center">4400</td><td className="px-4 py-2.5 text-center">5500</td><td className="px-4 py-2.5 text-center">6600</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza nominale AC (W)</td><td className="px-4 py-2.5 text-center">3000</td><td className="px-4 py-2.5 text-center">3600</td><td className="px-4 py-2.5 text-center">4000</td><td className="px-4 py-2.5 text-center">5000</td><td className="px-4 py-2.5 text-center">6000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente massima in uscita (A)</td><td className="px-4 py-2.5 text-center">14</td><td className="px-4 py-2.5 text-center">17</td><td className="px-4 py-2.5 text-center">19</td><td className="px-4 py-2.5 text-center">22</td><td className="px-4 py-2.5 text-center">26</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale di uscita (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">L/N/PE, 220Vac, 230Vac, 240Vac</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di rete</td><td colSpan={5} className="px-4 py-2.5 text-center">180Vac-276Vac</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di frequenza di rete (Hz)</td><td colSpan={5} className="px-4 py-2.5 text-center">50/60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Fattore di potenza</td><td colSpan={5} className="px-4 py-2.5 text-center">1 default (regolabile da 0,8 in anticipo a 0,8 in ritardo)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">THD della corrente</td><td colSpan={5} className="px-4 py-2.5 text-center">&lt;3%</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Rendimento</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rendimento massimo (%)</td><td colSpan={5} className="px-4 py-2.5 text-center">98.20</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rendimento europeo (%)</td><td className="px-4 py-2.5 text-center">97.80</td><td className="px-4 py-2.5 text-center">97.85</td><td className="px-4 py-2.5 text-center">97.88</td><td className="px-4 py-2.5 text-center">97.90</td><td className="px-4 py-2.5 text-center">97.92</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Protezione</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione contro inversione polarità</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento della resistenza</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da cortocircuito</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da sovracorrente</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da sovratensione</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione anti-isola</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento corrente residua</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione contro il surriscaldamento</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Interruttore lato DC integrato</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione contro le scariche</td><td colSpan={5} className="px-4 py-2.5 text-center">Integrata (Tipo III)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Scansione della curva</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Interruzione guasto arco (ArcFault)</td><td colSpan={5} className="px-4 py-2.5 text-center">Opzionale</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Generale</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Dimensioni (W x H x D, mm)</td><td colSpan={5} className="px-4 py-2.5 text-center">360 x 358 x 142</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Peso (kg)</td><td colSpan={5} className="px-4 py-2.5 text-center">10</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Grado di protezione (IP)</td><td colSpan={5} className="px-4 py-2.5 text-center">IP66</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Materiale</td><td colSpan={5} className="px-4 py-2.5 text-center">Alluminio</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo temperatura ambiente (°C)</td><td colSpan={5} className="px-4 py-2.5 text-center">-25 to 60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di umidità</td><td colSpan={5} className="px-4 py-2.5 text-center">0-100%</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Topologia: senza trasformatore</td><td colSpan={5} className="px-4 py-2.5 text-center">Senza trasformatore</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Interfaccia di comunicazione</td><td colSpan={5} className="px-4 py-2.5 text-center">RS485 / WiFi / Wire Ethernet / GPRS (opzionale)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Metodo di raffreddamento</td><td colSpan={5} className="px-4 py-2.5 text-center">Convezione</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Consumo in modalità standby (W)</td><td colSpan={5} className="px-4 py-2.5 text-center">&lt;1</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Altitudine operativa (m)</td><td colSpan={5} className="px-4 py-2.5 text-center">4000</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Certificazioni</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Standard EMC</td><td colSpan={5} className="px-4 py-2.5 text-center">EN/IEC 61000-6-2, EN/IEC 61000-6-3, EN61000-3-2, EN61000-3-3</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Standard di sicurezza</td><td colSpan={5} className="px-4 py-2.5 text-center">IEC 60068, UL1741, EN62109</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Connettività / Collegamento rete</td><td colSpan={5} className="px-4 py-2.5 text-center">IEEE1547, CSA C22, EN50549, VDE4105, VDEO126, RD1699, ABNT NBR16149 &amp; 16150, AS4777.2, NB/T32004, G98, IEC61727</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* stringa-7-10kw: Dati tecnici 4 modelli HNS7000TL ~ HNS10000TL */}
      {p.id === "stringa-7-10kw" && (
        <section id="specifiche" className="scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Dati tecnici</h2>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[800px] text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="sticky left-0 z-10 min-w-[200px] px-4 py-2.5 font-medium text-slate-800 text-left bg-white whitespace-nowrap border-r border-slate-200">Modello</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">HNS7000TL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">HNS8000TL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">HNS9000TL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">HNS10000TL</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Ingresso FV</td><td colSpan={4}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza massima in ingresso (DC) (W)</td><td className="px-4 py-2.5 text-center">9800</td><td className="px-4 py-2.5 text-center">11200</td><td className="px-4 py-2.5 text-center">12600</td><td className="px-4 py-2.5 text-center">14000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione massima in ingresso (DC) (V)</td><td colSpan={4} className="px-4 py-2.5 text-center">600</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo tensione MPPT (V)</td><td colSpan={4} className="px-4 py-2.5 text-center">70-550</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione MPPT alla massima efficienza (V)</td><td colSpan={4} className="px-4 py-2.5 text-center">220-550</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione ottimale (V)</td><td colSpan={4} className="px-4 py-2.5 text-center">360</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di avviamento (V)</td><td colSpan={4} className="px-4 py-2.5 text-center">70</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente massima in ingresso (A)</td><td colSpan={2} className="px-4 py-2.5 text-center">14+26</td><td colSpan={2} className="px-4 py-2.5 text-center">26+26</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente di corto circuito (A)</td><td colSpan={2} className="px-4 py-2.5 text-center">18+35</td><td colSpan={2} className="px-4 py-2.5 text-center">35+35</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">N. di inseguitori MPPT / N. di stringhe FV</td><td colSpan={2} className="px-4 py-2.5 text-center">2/3</td><td colSpan={2} className="px-4 py-2.5 text-center">2/4</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tipo di connettore FV</td><td colSpan={4} className="px-4 py-2.5 text-center">MC4</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Uscita CA</td><td colSpan={4}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza massima in uscita (VA)</td><td className="px-4 py-2.5 text-center">7700</td><td className="px-4 py-2.5 text-center">8800</td><td className="px-4 py-2.5 text-center">9900</td><td className="px-4 py-2.5 text-center">11000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza nominale AC (W)</td><td className="px-4 py-2.5 text-center">7000</td><td className="px-4 py-2.5 text-center">8000</td><td className="px-4 py-2.5 text-center">9000</td><td className="px-4 py-2.5 text-center">10000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente massima in uscita (A)</td><td className="px-4 py-2.5 text-center">33.6</td><td className="px-4 py-2.5 text-center">38.3</td><td className="px-4 py-2.5 text-center">45</td><td className="px-4 py-2.5 text-center">50</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale di uscita (V)</td><td colSpan={4} className="px-4 py-2.5 text-center">L/N/PE, 220Vac, 230Vac, 240Vac</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di rete</td><td colSpan={4} className="px-4 py-2.5 text-center">180Vac-276Vac</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di frequenza di rete (Hz)</td><td colSpan={4} className="px-4 py-2.5 text-center">50/60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Fattore di potenza</td><td colSpan={4} className="px-4 py-2.5 text-center">1 default (regolabile da 0,8 in anticipo a 0,8 in ritardo)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">THD della corrente</td><td colSpan={4} className="px-4 py-2.5 text-center">&lt;3%</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Rendimento</td><td colSpan={4}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rendimento massimo (%)</td><td colSpan={2} className="px-4 py-2.5 text-center">98.20</td><td className="px-4 py-2.5 text-center">98.32</td><td className="px-4 py-2.5 text-center">98.40</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rendimento europeo (%)</td><td className="px-4 py-2.5 text-center">97.95</td><td className="px-4 py-2.5 text-center">98.00</td><td className="px-4 py-2.5 text-center">98.00</td><td className="px-4 py-2.5 text-center">98.10</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Protezione</td><td colSpan={4}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione contro inversione polarità</td><td colSpan={4} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento della resistenza</td><td colSpan={4} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da cortocircuito</td><td colSpan={4} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da sovracorrente</td><td colSpan={4} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da sovratensione</td><td colSpan={4} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione anti-isola</td><td colSpan={4} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento corrente residua</td><td colSpan={4} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione contro il surriscaldamento</td><td colSpan={4} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Interruttore lato DC integrato</td><td colSpan={4} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione contro le scariche</td><td colSpan={4} className="px-4 py-2.5 text-center">Integrata (Tipo III)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Scansione della curva</td><td colSpan={4} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Interruzione guasto arco (ArcFault)</td><td colSpan={4} className="px-4 py-2.5 text-center">Opzionale</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Generale</td><td colSpan={4}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Dimensioni (W x H x D, mm)</td><td colSpan={4} className="px-4 py-2.5 text-center">370 x 535 x 192</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Peso (kg)</td><td colSpan={2} className="px-4 py-2.5 text-center">17</td><td colSpan={2} className="px-4 py-2.5 text-center">18</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Grado di protezione (IP)</td><td colSpan={4} className="px-4 py-2.5 text-center">IP66</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Materiale</td><td colSpan={4} className="px-4 py-2.5 text-center">Alluminio</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo temperatura ambiente (°C)</td><td colSpan={4} className="px-4 py-2.5 text-center">-25 to 60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di umidità</td><td colSpan={4} className="px-4 py-2.5 text-center">0-100%</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Topologia: senza trasformatore</td><td colSpan={4} className="px-4 py-2.5 text-center">Senza trasformatore</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Interfaccia di comunicazione</td><td colSpan={4} className="px-4 py-2.5 text-center">RS485 / WiFi / Wire Ethernet / GPRS (opzionale)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Metodo di raffreddamento</td><td colSpan={2} className="px-4 py-2.5 text-center">Convezione</td><td colSpan={2} className="px-4 py-2.5 text-center">Ventilatore</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Consumo in modalità standby (W)</td><td colSpan={4} className="px-4 py-2.5 text-center">&lt;1</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Altitudine operativa (m)</td><td colSpan={4} className="px-4 py-2.5 text-center">4000</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Certificazioni</td><td colSpan={4}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Standard EMC</td><td colSpan={4} className="px-4 py-2.5 text-center">EN/IEC 61000-6-2, EN/IEC 61000-6-3, EN61000-3-2, EN61000-3-3, EN61000-3-11, EN61000-3-12</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Standard di sicurezza</td><td colSpan={4} className="px-4 py-2.5 text-center">IEC 60068, UL1741, EN62109</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Connettività / Collegamento rete</td><td colSpan={4} className="px-4 py-2.5 text-center">IEEE1547, CSA C22, EN50549, VDE4105, VDE0126, RD1699, ABNT NBR16149 &amp; 16150, AS4777.2, NB/T32004, IEC61727</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* stringa-trifase-3-25kw: Dati tecnici 11 modelli BNT003KTL ~ BNT025KTL */}
      {p.id === "stringa-trifase-3-25kw" && (
        <section id="specifiche" className="scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Dati tecnici</h2>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[1400px] text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="sticky left-0 z-10 min-w-[200px] px-4 py-2.5 font-medium text-slate-800 text-left bg-white whitespace-nowrap border-r border-slate-200">Modello</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">BNT003KTL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">BNT004KTL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">BNT005KTL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">BNT006KTL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">BNT010KTL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">BNT012KTL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">BNT013KTL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">BNT015KTL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">BNT017KTL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">BNT020KTL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">BNT025KTL</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">PV In ingresso</td><td colSpan={11}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. PV Potenza (W)</td><td className="px-4 py-2.5 text-center">4500</td><td className="px-4 py-2.5 text-center">6000</td><td className="px-4 py-2.5 text-center">7500</td><td className="px-4 py-2.5 text-center">9000</td><td className="px-4 py-2.5 text-center">15000</td><td className="px-4 py-2.5 text-center">18000</td><td className="px-4 py-2.5 text-center">19500</td><td className="px-4 py-2.5 text-center">22500</td><td className="px-4 py-2.5 text-center">25500</td><td className="px-4 py-2.5 text-center">30000</td><td className="px-4 py-2.5 text-center">37500</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. DC Tensione (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">550</td><td colSpan={6} className="px-4 py-2.5 text-center">1000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">MPPT range tensione (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">80-500</td><td colSpan={6} className="px-4 py-2.5 text-center">150-1000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione ottimale (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">360</td><td colSpan={6} className="px-4 py-2.5 text-center">620</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di avviamento (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">50</td><td colSpan={6} className="px-4 py-2.5 text-center">150</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente massima in ingresso (A)</td><td className="px-4 py-2.5 text-center">14</td><td className="px-4 py-2.5 text-center">18.5</td><td className="px-4 py-2.5 text-center">18.5</td><td className="px-4 py-2.5 text-center">18.5</td><td className="px-4 py-2.5 text-center">18.5 x 2</td><td className="px-4 py-2.5 text-center">18.3 x 2</td><td className="px-4 py-2.5 text-center">23 x 2</td><td className="px-4 py-2.5 text-center">30 x 2</td><td className="px-4 py-2.5 text-center">32 x 2</td><td className="px-4 py-2.5 text-center">32 x 2</td><td className="px-4 py-2.5 text-center">40 x 2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente di corto circuito (A)</td><td className="px-4 py-2.5 text-center">22</td><td className="px-4 py-2.5 text-center">26</td><td className="px-4 py-2.5 text-center">26</td><td className="px-4 py-2.5 text-center">26</td><td className="px-4 py-2.5 text-center">26 x 2</td><td className="px-4 py-2.5 text-center">26 x 2</td><td className="px-4 py-2.5 text-center">32 x 2</td><td className="px-4 py-2.5 text-center">40 x 2</td><td className="px-4 py-2.5 text-center">40 x 2</td><td className="px-4 py-2.5 text-center">40 x 2</td><td className="px-4 py-2.5 text-center">50 x 2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">N. di inseguitori MPPT / N. di stringhe FV</td><td className="px-4 py-2.5 text-center">1/1</td><td className="px-4 py-2.5 text-center">2/2</td><td className="px-4 py-2.5 text-center">2/2</td><td className="px-4 py-2.5 text-center">2/2</td><td className="px-4 py-2.5 text-center">2/2</td><td className="px-4 py-2.5 text-center">2/3</td><td className="px-4 py-2.5 text-center">2/3</td><td className="px-4 py-2.5 text-center">2/4</td><td className="px-4 py-2.5 text-center">2/4</td><td className="px-4 py-2.5 text-center">2/4</td><td className="px-4 py-2.5 text-center">2/4</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tipo di connettore FV</td><td colSpan={11} className="px-4 py-2.5 text-center">MC4</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">AC in uscita</td><td colSpan={11}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza nominale in uscita (kVA)</td><td className="px-4 py-2.5 text-center">3</td><td className="px-4 py-2.5 text-center">4</td><td className="px-4 py-2.5 text-center">5</td><td className="px-4 py-2.5 text-center">6</td><td className="px-4 py-2.5 text-center">10</td><td className="px-4 py-2.5 text-center">12</td><td className="px-4 py-2.5 text-center">13</td><td className="px-4 py-2.5 text-center">15</td><td className="px-4 py-2.5 text-center">17</td><td className="px-4 py-2.5 text-center">20</td><td className="px-4 py-2.5 text-center">25</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale di uscita (V)</td><td colSpan={11} className="px-4 py-2.5 text-center">230/400 (trifase)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di frequenza di rete (Hz)</td><td colSpan={11} className="px-4 py-2.5 text-center">50/60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Fattore di potenza</td><td colSpan={11} className="px-4 py-2.5 text-center">1 default (regolabile da 0,8 in anticipo a 0,8 in ritardo)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">THD della corrente</td><td colSpan={11} className="px-4 py-2.5 text-center">&lt;3%</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Efficienza</td><td colSpan={11}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rendimento massimo (%)</td><td className="px-4 py-2.5 text-center">98.0</td><td className="px-4 py-2.5 text-center">98.0</td><td className="px-4 py-2.5 text-center">98.1</td><td className="px-4 py-2.5 text-center">98.1</td><td className="px-4 py-2.5 text-center">98.2</td><td className="px-4 py-2.5 text-center">98.2</td><td className="px-4 py-2.5 text-center">98.2</td><td className="px-4 py-2.5 text-center">98.3</td><td className="px-4 py-2.5 text-center">98.3</td><td className="px-4 py-2.5 text-center">98.3</td><td className="px-4 py-2.5 text-center">98.4</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rendimento europeo (%)</td><td className="px-4 py-2.5 text-center">97.2</td><td className="px-4 py-2.5 text-center">97.4</td><td className="px-4 py-2.5 text-center">97.5</td><td className="px-4 py-2.5 text-center">97.6</td><td className="px-4 py-2.5 text-center">97.8</td><td className="px-4 py-2.5 text-center">97.9</td><td className="px-4 py-2.5 text-center">97.9</td><td className="px-4 py-2.5 text-center">98.0</td><td className="px-4 py-2.5 text-center">98.0</td><td className="px-4 py-2.5 text-center">98.1</td><td className="px-4 py-2.5 text-center">98.2</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Protezione</td><td colSpan={11}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione contro inversione polarità</td><td colSpan={11} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da sovracorrente/sovratensione</td><td colSpan={11} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione anti-isola</td><td colSpan={11} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da cortocircuito</td><td colSpan={11} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento corrente residua</td><td colSpan={11} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione contro le scariche</td><td colSpan={11} className="px-4 py-2.5 text-center">Integrato (Tipo III)</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Generale</td><td colSpan={11}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Dimensioni (W x H x D, mm)</td><td colSpan={11} className="px-4 py-2.5 text-center">370 x 535 x 192</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Peso (kg)</td><td className="px-4 py-2.5 text-center">17</td><td className="px-4 py-2.5 text-center">17</td><td className="px-4 py-2.5 text-center">17</td><td className="px-4 py-2.5 text-center">17</td><td className="px-4 py-2.5 text-center">20</td><td className="px-4 py-2.5 text-center">20</td><td className="px-4 py-2.5 text-center">20</td><td className="px-4 py-2.5 text-center">20</td><td className="px-4 py-2.5 text-center">22</td><td className="px-4 py-2.5 text-center">25</td><td className="px-4 py-2.5 text-center">28</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Grado di protezione (IP)</td><td colSpan={11} className="px-4 py-2.5 text-center">IP65</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Materiale</td><td colSpan={11} className="px-4 py-2.5 text-center">Alluminio</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo temperatura ambiente (°C)</td><td colSpan={11} className="px-4 py-2.5 text-center">-25 to 60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di umidità</td><td colSpan={11} className="px-4 py-2.5 text-center">0-100%</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Topologia</td><td colSpan={11} className="px-4 py-2.5 text-center">Senza trasformatore</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Interfaccia di comunicazione</td><td colSpan={11} className="px-4 py-2.5 text-center">RS485 / WiFi / Ethernet / GPRS / Smart USB</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Metodo di raffreddamento</td><td colSpan={11} className="px-4 py-2.5 text-center">Convezione</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Consumo in modalità standby (W)</td><td colSpan={11} className="px-4 py-2.5 text-center">&lt;1</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Altitudine operativa (m)</td><td colSpan={11} className="px-4 py-2.5 text-center">4000</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Certificazioni</td><td colSpan={11}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">EMC Standard</td><td colSpan={11} className="px-4 py-2.5 text-center">EN/IEC 61000-6-2, EN/IEC 61000-6-3, EN61000-3-2, EN61000-3-3, EN61000-3-11, EN61000-3-12</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Sicurezza Standard</td><td colSpan={11} className="px-4 py-2.5 text-center">UL1741, EN62109</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Messa in rete</td><td colSpan={11} className="px-4 py-2.5 text-center">IEEE1547, CSA C22, EN50549, VDE4105, RD1699, PORTARIA N° 140+515, G99, IEC61727, CEI 0-21</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* stringa-trifase-30kw: Dati tecnici solo BNT030KTL */}
      {p.id === "stringa-trifase-30kw" && (
        <section id="specifiche" className="scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Dati tecnici</h2>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[400px] text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="sticky left-0 z-10 min-w-[200px] px-4 py-2.5 font-medium text-slate-800 text-left bg-white whitespace-nowrap border-r border-slate-200">Modello</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">BNT030KTL</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">PV In ingresso</td><td></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. DC Potenza (W)</td><td className="px-4 py-2.5 text-center">45000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. DC tensione (V)</td><td className="px-4 py-2.5 text-center">1100</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">MPPT range tensione (V)</td><td className="px-4 py-2.5 text-center">200-1000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione ottimale (V)</td><td className="px-4 py-2.5 text-center">620</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di avvio (V)</td><td className="px-4 py-2.5 text-center">200</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Input Corrente (A)</td><td className="px-4 py-2.5 text-center">38 x 2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. corrente in corto (A)</td><td className="px-4 py-2.5 text-center">48 x 2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">N. di inseguitori MPPT / N. di stringhe FV</td><td className="px-4 py-2.5 text-center">2/5</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tipo di connettore FV</td><td className="px-4 py-2.5 text-center">MC4</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">AC in uscita</td><td></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Potenza (VA)</td><td className="px-4 py-2.5 text-center">33000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza nominale (W)</td><td className="px-4 py-2.5 text-center">30000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. corrente (A)</td><td className="px-4 py-2.5 text-center">48</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale (V)</td><td className="px-4 py-2.5 text-center">3P+N+PE / 3P+PE 230/400</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di rete</td><td className="px-4 py-2.5 text-center">260Vac-519Vac (in conformità agli standard locali)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Frequenza nominale (Hz)</td><td className="px-4 py-2.5 text-center">50/60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Frequenza di rete</td><td className="px-4 py-2.5 text-center">45-55Hz / 55-65Hz (in conformità agli standard locali)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Output fattore di potenza</td><td className="px-4 py-2.5 text-center">1 default (regolabile da 0,8 in anticipo a 0,8 in ritardo)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Output Corrente THD</td><td className="px-4 py-2.5 text-center">&lt;3%</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Efficienza</td><td></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rendimento massimo (%)</td><td className="px-4 py-2.5 text-center">98.50</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rendimento europeo (%)</td><td className="px-4 py-2.5 text-center">98.10</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Protezione</td><td></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione dall&apos;inversione di polarità</td><td className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento della resistenza di isolamento</td><td className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da cortocircuito</td><td className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da sovracorrente</td><td className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da sovratensione</td><td className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione anti-isola</td><td className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento corrente residua</td><td className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione sovratemperatura</td><td className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Interruttore CC integrato</td><td className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da scarica</td><td className="px-4 py-2.5 text-center">Integrato (Tipo III)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Scansione della curva</td><td className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Interruzione guasto dell&apos;arco</td><td className="px-4 py-2.5 text-center">Opzionale</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Generale</td><td></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Dimensioni (W x H x D, mm)</td><td className="px-4 py-2.5 text-center">450 x 485 x 210</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Peso (kg)</td><td className="px-4 py-2.5 text-center">26</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Grado di protezione (IP)</td><td className="px-4 py-2.5 text-center">IP66</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Materiale</td><td className="px-4 py-2.5 text-center">Alluminio</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo temperatura ambiente (°C)</td><td className="px-4 py-2.5 text-center">-25 to 60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di umidità</td><td className="px-4 py-2.5 text-center">0-100%</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Topologia</td><td className="px-4 py-2.5 text-center">Senza trasformatore</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Interfaccia di comunicazione</td><td className="px-4 py-2.5 text-center">RS485 / WiFi / Ethernet / GPRS (opzionale) / Sunspec</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Raffreddamento</td><td className="px-4 py-2.5 text-center">Ventola</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Consumo in standby (W)</td><td className="px-4 py-2.5 text-center">&lt;1</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Altitudine (m)</td><td className="px-4 py-2.5 text-center">≤4000</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Certificazioni</td><td></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">EMC Standard</td><td className="px-4 py-2.5 text-center">EN/IEC 61000-6-2, EN/IEC 61000-6-3, EN61000-3-2, EN61000-3-3, EN61000-3-11, EN61000-3-12</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Sicurezza Standard</td><td className="px-4 py-2.5 text-center">UL1741, EN62109</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Messa in rete</td><td className="px-4 py-2.5 text-center">IEEE1547, CSA C22, EN50549, VDE4105, RD1699, PORTARIA N° 140+515, G99, IEC61727, CEI 0-21</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* stringa-trifase-36-60kw: Dati tecnici 4 modelli BNT036KTL ~ BNT060KTL */}
      {p.id === "stringa-trifase-36-60kw" && (
        <section id="specifiche" className="scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Dati tecnici</h2>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[900px] text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="sticky left-0 z-10 min-w-[200px] px-4 py-2.5 font-medium text-slate-800 text-left bg-white whitespace-nowrap border-r border-slate-200">Modello</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">BNT036KTL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">BNT040KTL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">BNT050KTL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">BNT060KTL</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">PV In ingresso</td><td colSpan={4}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. DC Potenza (W)</td><td className="px-4 py-2.5 text-center">54000</td><td className="px-4 py-2.5 text-center">60000</td><td className="px-4 py-2.5 text-center">75000</td><td className="px-4 py-2.5 text-center">90000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. DC tensione (V)</td><td colSpan={4} className="px-4 py-2.5 text-center">1100</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">MPPT range tensione (V)</td><td colSpan={4} className="px-4 py-2.5 text-center">200-1000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione ottimale (V)</td><td colSpan={4} className="px-4 py-2.5 text-center">620</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di avvio (V)</td><td colSpan={4} className="px-4 py-2.5 text-center">200</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Input Corrente (A)</td><td className="px-4 py-2.5 text-center">38 x 3</td><td className="px-4 py-2.5 text-center">38 x 3</td><td className="px-4 py-2.5 text-center">40 x 3</td><td className="px-4 py-2.5 text-center">38 x 4</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. corrente in corto (A)</td><td className="px-4 py-2.5 text-center">48 x 3</td><td className="px-4 py-2.5 text-center">48 x 3</td><td className="px-4 py-2.5 text-center">48 x 3</td><td className="px-4 py-2.5 text-center">48 x 4</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">N. di inseguitori MPPT / N. di stringhe FV</td><td className="px-4 py-2.5 text-center">3/6</td><td className="px-4 py-2.5 text-center">3/6</td><td className="px-4 py-2.5 text-center">3/7</td><td className="px-4 py-2.5 text-center">4/8</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tipo di connettore FV</td><td colSpan={4} className="px-4 py-2.5 text-center">MC4</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">AC in uscita</td><td colSpan={4}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Potenza (VA)</td><td className="px-4 py-2.5 text-center">39600</td><td className="px-4 py-2.5 text-center">44000</td><td className="px-4 py-2.5 text-center">55000</td><td className="px-4 py-2.5 text-center">66000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza nominale (W)</td><td className="px-4 py-2.5 text-center">36000</td><td className="px-4 py-2.5 text-center">40000</td><td className="px-4 py-2.5 text-center">50000</td><td className="px-4 py-2.5 text-center">60000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. corrente (A)</td><td className="px-4 py-2.5 text-center">60</td><td className="px-4 py-2.5 text-center">65</td><td className="px-4 py-2.5 text-center">80</td><td className="px-4 py-2.5 text-center">96</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale (V)</td><td colSpan={4} className="px-4 py-2.5 text-center">3P+N+PE / 3P+PE 230/400</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di rete</td><td colSpan={4} className="px-4 py-2.5 text-center">260Vac-519Vac (in conformità agli standard locali)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Frequenza nominale (Hz)</td><td colSpan={4} className="px-4 py-2.5 text-center">50/60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Frequenza di rete</td><td colSpan={4} className="px-4 py-2.5 text-center">45-55Hz / 55-65Hz (in conformità agli standard locali)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Output fattore di potenza</td><td colSpan={4} className="px-4 py-2.5 text-center">1 default (regolabile da 0,8 in anticipo a 0,8 in ritardo)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Output Corrente THD</td><td colSpan={4} className="px-4 py-2.5 text-center">&lt;3%</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Efficienza</td><td colSpan={4}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rendimento massimo (%)</td><td className="px-4 py-2.5 text-center">98.65</td><td className="px-4 py-2.5 text-center">98.65</td><td className="px-4 py-2.5 text-center">98.80</td><td className="px-4 py-2.5 text-center">99.00</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rendimento europeo (%)</td><td className="px-4 py-2.5 text-center">98.20</td><td className="px-4 py-2.5 text-center">98.25</td><td className="px-4 py-2.5 text-center">98.45</td><td className="px-4 py-2.5 text-center">98.50</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Protezione</td><td colSpan={4}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione dall&apos;inversione di polarità</td><td colSpan={4} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento della resistenza di isolamento</td><td colSpan={4} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da cortocircuito</td><td colSpan={4} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da sovracorrente / sovratensione / anti-isola / corrente residua / sovratemperatura</td><td colSpan={4} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Interruttore CC integrato</td><td colSpan={4} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da scarica</td><td colSpan={4} className="px-4 py-2.5 text-center">Integrato (Tipo III)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Scansione della curva / Interruzione guasto arco</td><td colSpan={4} className="px-4 py-2.5 text-center">Sì / Opzionale</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Generale</td><td colSpan={4}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Dimensioni (W x H x D, mm)</td><td className="px-4 py-2.5 text-center">450 x 485 x 210</td><td className="px-4 py-2.5 text-center">710 x 470 x 236</td><td className="px-4 py-2.5 text-center">710 x 470 x 236</td><td className="px-4 py-2.5 text-center">710 x 470 x 236</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Peso (kg)</td><td className="px-4 py-2.5 text-center">26</td><td className="px-4 py-2.5 text-center">44</td><td className="px-4 py-2.5 text-center">44</td><td className="px-4 py-2.5 text-center">51</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Grado di protezione (IP)</td><td colSpan={4} className="px-4 py-2.5 text-center">IP66</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Materiale</td><td colSpan={4} className="px-4 py-2.5 text-center">Alluminio</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo temperatura ambiente (°C)</td><td colSpan={4} className="px-4 py-2.5 text-center">-25 to 60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di umidità</td><td colSpan={4} className="px-4 py-2.5 text-center">0-100%</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Topologia</td><td colSpan={4} className="px-4 py-2.5 text-center">Senza trasformatore</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Interfaccia di comunicazione</td><td colSpan={4} className="px-4 py-2.5 text-center">RS485 / WiFi / Ethernet / GPRS (opzionale) / Sunspec</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Raffreddamento</td><td colSpan={4} className="px-4 py-2.5 text-center">Ventola</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Consumo in standby (W)</td><td colSpan={4} className="px-4 py-2.5 text-center">&lt;1</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Altitudine (m)</td><td colSpan={4} className="px-4 py-2.5 text-center">≤4000</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Certificazioni</td><td colSpan={4}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">EMC Standard</td><td colSpan={4} className="px-4 py-2.5 text-center">EN/IEC 61000-6-2, EN/IEC 61000-6-3, EN61000-3-2, EN61000-3-3, EN61000-3-11, EN61000-3-12</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Sicurezza Standard</td><td colSpan={4} className="px-4 py-2.5 text-center">UL1741, EN62109</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Messa in rete</td><td colSpan={4} className="px-4 py-2.5 text-center">IEEE1547, CSA C22, EN50549, VDE4105, RD1699, PORTARIA N° 140+515, G99, IEC61727, CEI 0-21</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* bat-hailei-atom-ls-10-15kwh: Dati tecnici ATOM-LS 10.24kWh / 15.36kWh */}
      {p.id === "bat-hailei-atom-ls-10-15kwh" && (
        <section id="specifiche" className="scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Dati tecnici</h2>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[600px] text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="sticky left-0 z-10 min-w-[220px] px-4 py-2.5 font-medium text-slate-800 text-left bg-white whitespace-nowrap border-r border-slate-200">Modello</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">ATOM-LS 10.24kWh</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">ATOM-LS 15.36kWh</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Prestazioni</td><td colSpan={2}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Modulo</td><td className="px-4 py-2.5 text-center">2</td><td className="px-4 py-2.5 text-center">3</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tipo di batteria</td><td colSpan={2} className="px-4 py-2.5 text-center">LiFePO4</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Capacità nominale</td><td className="px-4 py-2.5 text-center">200Ah</td><td className="px-4 py-2.5 text-center">300Ah</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Energia</td><td className="px-4 py-2.5 text-center">10.24kWh</td><td className="px-4 py-2.5 text-center">15.36kWh</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale</td><td colSpan={2} className="px-4 py-2.5 text-center">51.2V</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di tensione operativa</td><td colSpan={2} className="px-4 py-2.5 text-center">43.2V~58.4V</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di fine carica</td><td colSpan={2} className="px-4 py-2.5 text-center">57.6V~58.4V</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Limite tensione di carica</td><td colSpan={2} className="px-4 py-2.5 text-center">58.4V</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente di scarica continua massima</td><td colSpan={2} className="px-4 py-2.5 text-center">≤120A / 6kW</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente di scarica di picco</td><td colSpan={2} className="px-4 py-2.5 text-center">120A MAX</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di fine scarica</td><td colSpan={2} className="px-4 py-2.5 text-center">43.2V</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Profondità di scarica consigliata (DOD)</td><td colSpan={2} className="px-4 py-2.5 text-center">90%</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Durata del ciclo</td><td colSpan={2} className="px-4 py-2.5 text-center">6000/0.5C</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Durata di progetto</td><td colSpan={2} className="px-4 py-2.5 text-center">10 Anni</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Specifiche Generali</td><td colSpan={2}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Comunicazione</td><td colSpan={2} className="px-4 py-2.5 text-center">CAN / RS485</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Efficienza</td><td colSpan={2} className="px-4 py-2.5 text-center">97%</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Unità parallele massime</td><td colSpan={2} className="px-4 py-2.5 text-center">≤4 unità</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di temperatura di scarica</td><td colSpan={2} className="px-4 py-2.5 text-center">-20°C~60°C</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di temperatura di carica</td><td colSpan={2} className="px-4 py-2.5 text-center">0°C~50°C</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di temperatura di stoccaggio</td><td colSpan={2} className="px-4 py-2.5 text-center">-15°C~40°C</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tipo di terminale</td><td colSpan={2} className="px-4 py-2.5 text-center">Connettore rapido</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Materiale dell&apos;involucro</td><td colSpan={2} className="px-4 py-2.5 text-center">SPCC</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Grado di protezione</td><td colSpan={2} className="px-4 py-2.5 text-center">IP65</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Grado di protezione dalla corrosione</td><td colSpan={2} className="px-4 py-2.5 text-center">C4</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Funzione di riscaldamento ausiliario</td><td colSpan={2} className="px-4 py-2.5 text-center">Opzionale</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Certificazioni</td><td colSpan={2} className="px-4 py-2.5 text-center">IEC 62619 / CE / UN38.3 / MSDS</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Compatibilità inverter</td><td colSpan={2} className="px-4 py-2.5 text-center">Afore</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Dimensioni (L x P)</td><td colSpan={2} className="px-4 py-2.5 text-center">600 x 167 mm</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Altezza (H)</td><td className="px-4 py-2.5 text-center">1240 mm</td><td className="px-4 py-2.5 text-center">1700 mm</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* stringa-trifase-70-110kw: Dati tecnici 6 modelli BNT070KTL ~ BNT110KTL */}
      {p.id === "stringa-trifase-70-110kw" && (
        <section id="specifiche" className="scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Dati tecnici</h2>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[1100px] text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="sticky left-0 z-10 min-w-[200px] px-4 py-2.5 font-medium text-slate-800 text-left bg-white whitespace-nowrap border-r border-slate-200">Modello</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">BNT070KTL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">BNT075KTL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">BNT080KTL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">BNT090KTL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">BNT100KTL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">BNT110KTL</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">PV In ingresso</td><td colSpan={6}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. DC Potenza (W)</td><td className="px-4 py-2.5 text-center">105000</td><td className="px-4 py-2.5 text-center">112500</td><td className="px-4 py-2.5 text-center">120000</td><td className="px-4 py-2.5 text-center">135000</td><td className="px-4 py-2.5 text-center">150000</td><td className="px-4 py-2.5 text-center">165000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. DC tensione (V)</td><td colSpan={6} className="px-4 py-2.5 text-center">1100</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">MPPT range tensione (V)</td><td colSpan={6} className="px-4 py-2.5 text-center">200-1000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione ottimale (V)</td><td colSpan={6} className="px-4 py-2.5 text-center">620</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di avvio (V)</td><td colSpan={6} className="px-4 py-2.5 text-center">300</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Input Corrente (A)</td><td colSpan={6} className="px-4 py-2.5 text-center">38 x 6</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. corrente in corto (A)</td><td colSpan={6} className="px-4 py-2.5 text-center">48 x 6</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">N. di inseguitori MPPT / N. di stringhe FV</td><td colSpan={6} className="px-4 py-2.5 text-center">6/12</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tipo di connettore FV</td><td colSpan={6} className="px-4 py-2.5 text-center">MC4</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">AC in uscita</td><td colSpan={6}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Potenza (VA)</td><td className="px-4 py-2.5 text-center">77000</td><td className="px-4 py-2.5 text-center">82500</td><td className="px-4 py-2.5 text-center">88000</td><td className="px-4 py-2.5 text-center">99000</td><td className="px-4 py-2.5 text-center">110000</td><td className="px-4 py-2.5 text-center">110000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza nominale (W)</td><td className="px-4 py-2.5 text-center">70000</td><td className="px-4 py-2.5 text-center">75000</td><td className="px-4 py-2.5 text-center">80000</td><td className="px-4 py-2.5 text-center">90000</td><td className="px-4 py-2.5 text-center">100000</td><td className="px-4 py-2.5 text-center">110000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. corrente (A)</td><td className="px-4 py-2.5 text-center">111</td><td className="px-4 py-2.5 text-center">120</td><td className="px-4 py-2.5 text-center">127</td><td className="px-4 py-2.5 text-center">143</td><td className="px-4 py-2.5 text-center">158</td><td className="px-4 py-2.5 text-center">159.5</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale (V)</td><td colSpan={6} className="px-4 py-2.5 text-center">3P+N+PE / 3P+PE 230/400</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di rete</td><td colSpan={6} className="px-4 py-2.5 text-center">260Vac-519Vac (in conformità agli standard locali)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Frequenza nominale (Hz)</td><td colSpan={6} className="px-4 py-2.5 text-center">50/60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Frequenza di rete</td><td colSpan={6} className="px-4 py-2.5 text-center">45-55Hz / 55-66Hz (in conformità agli standard locali)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Output fattore di potenza</td><td colSpan={6} className="px-4 py-2.5 text-center">1 default (regolabile da 0,8 in anticipo a 0,8 in ritardo)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Output Corrente THD</td><td colSpan={6} className="px-4 py-2.5 text-center">&lt;3%</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Efficienza</td><td colSpan={6}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rendimento massimo (%)</td><td colSpan={6} className="px-4 py-2.5 text-center">99.00</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rendimento europeo (%)</td><td className="px-4 py-2.5 text-center">98.30</td><td className="px-4 py-2.5 text-center">98.30</td><td className="px-4 py-2.5 text-center">98.30</td><td className="px-4 py-2.5 text-center">98.30</td><td className="px-4 py-2.5 text-center">98.40</td><td className="px-4 py-2.5 text-center">98.40</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Protezione</td><td colSpan={6}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione dall&apos;inversione di polarità / Rilevamento resistenza isolamento</td><td colSpan={6} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da cortocircuito / sovracorrente / sovratensione / anti-isola / corrente residua / sovratemperatura</td><td colSpan={6} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Interruttore CC integrato</td><td colSpan={6} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da scarica</td><td colSpan={6} className="px-4 py-2.5 text-center">Integrato (Tipo III)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Scansione della curva / Interruzione guasto arco</td><td colSpan={6} className="px-4 py-2.5 text-center">Sì / Opzionale</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Generale</td><td colSpan={6}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Dimensioni (W x H x D, mm)</td><td colSpan={6} className="px-4 py-2.5 text-center">983 x 610 x 318</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Peso (kg)</td><td colSpan={6} className="px-4 py-2.5 text-center">78</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Grado di protezione (IP)</td><td colSpan={6} className="px-4 py-2.5 text-center">IP66</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Materiale</td><td colSpan={6} className="px-4 py-2.5 text-center">Alluminio</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo temperatura ambiente (°C)</td><td colSpan={6} className="px-4 py-2.5 text-center">-25 to 60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di umidità</td><td colSpan={6} className="px-4 py-2.5 text-center">0-100%</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Topologia</td><td colSpan={6} className="px-4 py-2.5 text-center">Senza trasformatore</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Interfaccia di comunicazione</td><td colSpan={6} className="px-4 py-2.5 text-center">RS485 / WiFi / Ethernet cablata / GPRS (opzionale) / Sunspec</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Raffreddamento</td><td colSpan={6} className="px-4 py-2.5 text-center">Ventola</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Consumo in standby (W)</td><td colSpan={6} className="px-4 py-2.5 text-center">&lt;1</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Altitudine (m)</td><td colSpan={6} className="px-4 py-2.5 text-center">≤4000</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Certificazioni</td><td colSpan={6}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">EMC Standard</td><td colSpan={6} className="px-4 py-2.5 text-center">EN/IEC 61000-6-2, EN/IEC 61000-6-4, EN61000-3-11, EN61000-3-12</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Sicurezza Standard</td><td colSpan={6} className="px-4 py-2.5 text-center">UL1741, EN62109</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Messa in rete</td><td colSpan={6} className="px-4 py-2.5 text-center">IEEE1547, CSA C22, EN50549, PORTARIA N° 140+515, IEC61727, CEI 0-21</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ibrido-monofase-1-3-6kw: Dati tecnici 8 modelli, scroll orizzontale */}
      {p.id === "ibrido-monofase-1-3-6kw" && (
        <section id="specifiche" className="scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Dati tecnici</h2>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[1280px] text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="sticky left-0 z-10 min-w-[200px] px-4 py-2.5 font-medium text-slate-800 text-left bg-white whitespace-nowrap border-r border-slate-200">Modello</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF1K-SL-1</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF1.5K-SL-1</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF2K-SL-1</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF2.5K-SL-1</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF3K-SL-1</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF3.6K-SL-1</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF3K-SL</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF3.6K-SL</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">PV in ingresso</td><td colSpan={8}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. potenza (kW)</td><td className="px-4 py-2.5 text-center">2</td><td className="px-4 py-2.5 text-center">3</td><td className="px-4 py-2.5 text-center">4</td><td className="px-4 py-2.5 text-center">5</td><td className="px-4 py-2.5 text-center">6</td><td className="px-4 py-2.5 text-center">7.2</td><td className="px-4 py-2.5 text-center">6</td><td className="px-4 py-2.5 text-center">7.2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. PV Tensione (V)</td><td colSpan={8} className="px-4 py-2.5 text-center">550</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">MPPT Range (V)</td><td colSpan={8} className="px-4 py-2.5 text-center">80 - 500</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione normale (V)</td><td colSpan={8} className="px-4 py-2.5 text-center">360</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di avvio (V)</td><td colSpan={8} className="px-4 py-2.5 text-center">100</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. corrente (A)</td><td colSpan={4} className="px-4 py-2.5 text-center">18.5 x 1</td><td colSpan={2} className="px-4 py-2.5 text-center">18.5 x 1</td><td colSpan={2} className="px-4 py-2.5 text-center">18.5 x 2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. corrente di corto circuito (A)</td><td colSpan={4} className="px-4 py-2.5 text-center">26 x 1</td><td colSpan={2} className="px-4 py-2.5 text-center">26 x 1</td><td colSpan={2} className="px-4 py-2.5 text-center">26 x 2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">No. of MPP Tracker / No. of PV Stringa</td><td colSpan={4} className="px-4 py-2.5 text-center">1/1</td><td colSpan={2} className="px-4 py-2.5 text-center">1/1</td><td colSpan={2} className="px-4 py-2.5 text-center">2/2</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Batteria</td><td colSpan={8}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Carica/Scarica potenza (kW)</td><td className="px-4 py-2.5 text-center">1.0</td><td className="px-4 py-2.5 text-center">1.5</td><td className="px-4 py-2.5 text-center">2.0</td><td className="px-4 py-2.5 text-center">2.5</td><td className="px-4 py-2.5 text-center">3.0</td><td className="px-4 py-2.5 text-center">3.6</td><td className="px-4 py-2.5 text-center">3.0</td><td className="px-4 py-2.5 text-center">3.6</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Carica/Scarica Corrente (A)</td><td className="px-4 py-2.5 text-center">25</td><td className="px-4 py-2.5 text-center">40</td><td className="px-4 py-2.5 text-center">50</td><td className="px-4 py-2.5 text-center">63</td><td colSpan={4} className="px-4 py-2.5 text-center">80</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Batteria Normale Tensione (V)</td><td colSpan={8} className="px-4 py-2.5 text-center">51.2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Batteria Tensione Range (V)</td><td colSpan={8} className="px-4 py-2.5 text-center">40-60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Batteria</td><td colSpan={8} className="px-4 py-2.5 text-center">Li-ion / Lead-acid etc.</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">AC Rete</td><td colSpan={8}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max corrente (A)</td><td className="px-4 py-2.5 text-center">5.0</td><td className="px-4 py-2.5 text-center">7.0</td><td className="px-4 py-2.5 text-center">10.0</td><td className="px-4 py-2.5 text-center">12.0</td><td className="px-4 py-2.5 text-center">14.0</td><td className="px-4 py-2.5 text-center">17.0</td><td className="px-4 py-2.5 text-center">14.0</td><td className="px-4 py-2.5 text-center">17.0</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max potenza continua (kVA)</td><td className="px-4 py-2.5 text-center">1.0</td><td className="px-4 py-2.5 text-center">1.5</td><td className="px-4 py-2.5 text-center">2.0</td><td className="px-4 py-2.5 text-center">2.5</td><td className="px-4 py-2.5 text-center">3.0</td><td className="px-4 py-2.5 text-center">3.6</td><td className="px-4 py-2.5 text-center">3.0</td><td className="px-4 py-2.5 text-center">3.6</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente nominale (A)</td><td className="px-4 py-2.5 text-center">4.6/4.4</td><td className="px-4 py-2.5 text-center">6.9/6.6</td><td className="px-4 py-2.5 text-center">9.1/8.7</td><td className="px-4 py-2.5 text-center">11.4/10.9</td><td className="px-4 py-2.5 text-center">13.7/13.1</td><td className="px-4 py-2.5 text-center">16.4/15.7</td><td className="px-4 py-2.5 text-center">13.7/13.1</td><td className="px-4 py-2.5 text-center">16.4/15.7</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale (V)</td><td colSpan={8} className="px-4 py-2.5 text-center">198 to 242 @ 220 / 207 to 253 @ 230</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Frequenza nominale (Hz)</td><td colSpan={8} className="px-4 py-2.5 text-center">50/60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza fattore</td><td colSpan={8} className="px-4 py-2.5 text-center">1 default (regolabile da 0,8 in anticipo a 0,8 in ritardo)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente THD (%)</td><td colSpan={8} className="px-4 py-2.5 text-center">&lt; 3</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">AC in uscita</td><td colSpan={8}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max Corrente (A)</td><td className="px-4 py-2.5 text-center">5.0</td><td className="px-4 py-2.5 text-center">7.0</td><td className="px-4 py-2.5 text-center">10.0</td><td className="px-4 py-2.5 text-center">12.0</td><td className="px-4 py-2.5 text-center">14.0</td><td className="px-4 py-2.5 text-center">17.0</td><td className="px-4 py-2.5 text-center">14.0</td><td className="px-4 py-2.5 text-center">17.0</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max potenza continua (kVA)</td><td className="px-4 py-2.5 text-center">1.0</td><td className="px-4 py-2.5 text-center">1.5</td><td className="px-4 py-2.5 text-center">2.0</td><td className="px-4 py-2.5 text-center">2.5</td><td className="px-4 py-2.5 text-center">3.0</td><td className="px-4 py-2.5 text-center">3.6</td><td className="px-4 py-2.5 text-center">3.0</td><td className="px-4 py-2.5 text-center">3.6</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max Picco di corrente (A) (10min)</td><td className="px-4 py-2.5 text-center">6.9/6.6</td><td className="px-4 py-2.5 text-center">10.5/10.0</td><td className="px-4 py-2.5 text-center">13.7/13.1</td><td className="px-4 py-2.5 text-center">17.3/16.6</td><td className="px-4 py-2.5 text-center">20.5/19.6</td><td className="px-4 py-2.5 text-center">24.6/23.5</td><td className="px-4 py-2.5 text-center">20.5/19.6</td><td className="px-4 py-2.5 text-center">24.6/23.5</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max Picco potenza (kVA) (10min)</td><td className="px-4 py-2.5 text-center">1.5</td><td className="px-4 py-2.5 text-center">2.3</td><td className="px-4 py-2.5 text-center">3.0</td><td className="px-4 py-2.5 text-center">3.8</td><td className="px-4 py-2.5 text-center">4.5</td><td className="px-4 py-2.5 text-center">5.4</td><td className="px-4 py-2.5 text-center">4.5</td><td className="px-4 py-2.5 text-center">5.4</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale L-N (V)</td><td colSpan={8} className="px-4 py-2.5 text-center">220/230</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">AC Frequenza (Hz)</td><td colSpan={8} className="px-4 py-2.5 text-center">50/60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Switching Tempo (s)</td><td colSpan={8} className="px-4 py-2.5 text-center">immediata</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione THD (%)</td><td colSpan={8} className="px-4 py-2.5 text-center">&lt; 3</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Efficenza</td><td colSpan={8}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">CEC Efficenza (%)</td><td colSpan={8} className="px-4 py-2.5 text-center">97.0</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Efficenza (%)</td><td colSpan={8} className="px-4 py-2.5 text-center">97.6</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">PV to Bat. Efficenza (%)</td><td colSpan={8} className="px-4 py-2.5 text-center">98.1</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Bat. AC Efficenza (%)</td><td colSpan={8} className="px-4 py-2.5 text-center">96.8</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Protezione</td><td colSpan={8}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione dall&apos;inversione di polarità FV</td><td colSpan={8} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da sovracorrente/tensione</td><td colSpan={8} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione A-Isola</td><td colSpan={8} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da cortocircuito CA</td><td colSpan={8} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento corrente residua</td><td colSpan={8} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Monitoraggio dei guasti a terra</td><td colSpan={8} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento del resistore di isolamento</td><td colSpan={8} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento dell&apos;arco FV</td><td colSpan={8} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Livello di protezione del contenitore</td><td colSpan={8} className="px-4 py-2.5 text-center">IP66 / NEMA4X</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione contro le sovratensioni AC/DC</td><td colSpan={8} className="px-4 py-2.5 text-center">Tipo II</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Generale</td><td colSpan={8}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Dimensioni (W x H x D, mm)</td><td colSpan={8} className="px-4 py-2.5 text-center">370 x 535 x 192</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Peso (kg)</td><td colSpan={8} className="px-4 py-2.5 text-center">17</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tipologia</td><td colSpan={8} className="px-4 py-2.5 text-center">Senza trasformatore</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Raffreddamento</td><td colSpan={8} className="px-4 py-2.5 text-center">Ventilatore intelligente</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Umidità</td><td colSpan={8} className="px-4 py-2.5 text-center">0-100%</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Temperatura di lavoro Range (°C)</td><td colSpan={8} className="px-4 py-2.5 text-center">-25 to 60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Altitudine di lavoro (m)</td><td colSpan={8} className="px-4 py-2.5 text-center">&lt; 4000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Consumo in Standby (W)</td><td colSpan={8} className="px-4 py-2.5 text-center">&lt; 10</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Montaggio</td><td colSpan={8} className="px-4 py-2.5 text-center">Supporto a parete</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Communicazione RSD</td><td colSpan={8} className="px-4 py-2.5 text-center">SUNSPEC</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Display &amp; Interfaccia</td><td colSpan={8} className="px-4 py-2.5 text-center">LCD, LED, RS485, CAN, Wi-Fi, GPRS, 4G, Sunspec</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Certificazioni</td><td colSpan={8} className="px-4 py-2.5 text-center">NRS097, G98, EN50549-1, C10/C11, AS4777.2, VDE-AR-N4105, IEC62109-1, IEC62109-2, IEC62477-1, CEI 0-21</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">EMC</td><td colSpan={8} className="px-4 py-2.5 text-center">EN61000-6-2, EN61000-6-3</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ibrido-monofase-plus-4-6kw: Dati tecnici 5 modelli, sticky prima colonna */}
      {p.id === "ibrido-monofase-plus-4-6kw" && (
        <section id="specifiche" className="scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Dati tecnici</h2>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[900px] text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="sticky left-0 z-10 min-w-[200px] px-4 py-2.5 font-medium text-slate-800 text-left bg-white whitespace-nowrap border-r border-slate-200">Modello</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF4K-SLP</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF4.6K-SLP</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF5K-SLP</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF5.5K-SLP</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF6K-SLP</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">PV in ingresso</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. potenza (kW)</td><td className="px-4 py-2.5 text-center">8</td><td className="px-4 py-2.5 text-center">9.2</td><td className="px-4 py-2.5 text-center">10</td><td className="px-4 py-2.5 text-center">11</td><td className="px-4 py-2.5 text-center">12</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. PV Tensione (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">550</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">MPPT Range (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">80-500</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione normale (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">360</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di avvio (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">100</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. corrente (A)</td><td colSpan={5} className="px-4 py-2.5 text-center">18.5 x 2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. corrente di corto circuito (A)</td><td colSpan={5} className="px-4 py-2.5 text-center">26 x 2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">No. of MPP Tracker / No. of PV Stringa</td><td colSpan={5} className="px-4 py-2.5 text-center">2/2</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Batteria</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Carica/Scarica potenza (kW)</td><td className="px-4 py-2.5 text-center">4.0</td><td className="px-4 py-2.5 text-center">4.6</td><td className="px-4 py-2.5 text-center">5.0</td><td className="px-4 py-2.5 text-center">5.5</td><td className="px-4 py-2.5 text-center">6.0</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Carica/Scarica Corrente (A)</td><td colSpan={5} className="px-4 py-2.5 text-center">120</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Batteria Normale Tensione (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">51.2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Batteria Tensione Range (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">40-60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Batteria</td><td colSpan={5} className="px-4 py-2.5 text-center">Li-ion / Lead-acid etc.</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">AC Rete</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max corrente (A)</td><td className="px-4 py-2.5 text-center">19.0</td><td className="px-4 py-2.5 text-center">22.0</td><td className="px-4 py-2.5 text-center">23.0</td><td className="px-4 py-2.5 text-center">26.0</td><td className="px-4 py-2.5 text-center">28.0</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max potenza continua (kVA)</td><td className="px-4 py-2.5 text-center">4.0</td><td className="px-4 py-2.5 text-center">4.6</td><td className="px-4 py-2.5 text-center">5.0</td><td className="px-4 py-2.5 text-center">5.5</td><td className="px-4 py-2.5 text-center">6.0</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente nominale (A)</td><td className="px-4 py-2.5 text-center">18.2/17.4</td><td className="px-4 py-2.5 text-center">21.0/20.0</td><td className="px-4 py-2.5 text-center">22.8/21.8</td><td className="px-4 py-2.5 text-center">25.0/24.0</td><td className="px-4 py-2.5 text-center">27.3/26.1</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">198 to 242 @ 220 / 207 to 253 @ 230</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Frequenza nominale (Hz)</td><td colSpan={5} className="px-4 py-2.5 text-center">50/60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza fattore</td><td colSpan={5} className="px-4 py-2.5 text-center">1 default (regolabile da 0,8 in anticipo a 0,8 in ritardo)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente THD (%)</td><td colSpan={5} className="px-4 py-2.5 text-center">&lt; 3</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">AC in uscita</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max Corrente (A)</td><td className="px-4 py-2.5 text-center">19.0</td><td className="px-4 py-2.5 text-center">22.0</td><td className="px-4 py-2.5 text-center">23.0</td><td className="px-4 py-2.5 text-center">26.0</td><td className="px-4 py-2.5 text-center">28.0</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max potenza continua (kVA)</td><td className="px-4 py-2.5 text-center">4.0</td><td className="px-4 py-2.5 text-center">4.6</td><td className="px-4 py-2.5 text-center">5.0</td><td className="px-4 py-2.5 text-center">5.5</td><td className="px-4 py-2.5 text-center">6.0</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max Picco di corrente (A) (10min)</td><td className="px-4 py-2.5 text-center">27.3/26.1</td><td className="px-4 py-2.5 text-center">31.4/30</td><td className="px-4 py-2.5 text-center">34.1/32.7</td><td className="px-4 py-2.5 text-center">37.8/36.1</td><td className="px-4 py-2.5 text-center">41.0/39.2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max Picco potenza (kVA) (10min)</td><td className="px-4 py-2.5 text-center">6.0</td><td className="px-4 py-2.5 text-center">6.9</td><td className="px-4 py-2.5 text-center">7.5</td><td className="px-4 py-2.5 text-center">8.3</td><td className="px-4 py-2.5 text-center">9.0</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale L-N (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">220/230</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">AC Frequenza (Hz)</td><td colSpan={5} className="px-4 py-2.5 text-center">50/60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Switching Tempo (s)</td><td colSpan={5} className="px-4 py-2.5 text-center">immediata</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione THD (%)</td><td colSpan={5} className="px-4 py-2.5 text-center">&lt; 3</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Efficenza</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">CEC Efficenza (%)</td><td colSpan={5} className="px-4 py-2.5 text-center">97.0</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Efficenza (%)</td><td colSpan={5} className="px-4 py-2.5 text-center">97.6</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">PV to Bat. Efficenza (%)</td><td colSpan={5} className="px-4 py-2.5 text-center">98.1</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Bat. AC Efficenza (%)</td><td colSpan={5} className="px-4 py-2.5 text-center">96.8</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Protezione</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione dall&apos;inversione di polarità FV</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da sovracorrente/tensione</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione A-Isola</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da cortocircuito CA</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento corrente residua</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Monitoraggio dei guasti a terra</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento del resistore di isolamento</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento dell&apos;arco FV</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Livello di protezione del contenitore</td><td colSpan={5} className="px-4 py-2.5 text-center">IP66 / NEMA4X</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione contro le sovratensioni AC/DC</td><td colSpan={5} className="px-4 py-2.5 text-center">Tipo II</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Generale</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Dimensioni (W x H x D, mm)</td><td colSpan={5} className="px-4 py-2.5 text-center">370 x 535 x 192</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Peso (kg)</td><td colSpan={5} className="px-4 py-2.5 text-center">20.5</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tipologia</td><td colSpan={5} className="px-4 py-2.5 text-center">Senza trasformatore</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Raffreddamento</td><td colSpan={5} className="px-4 py-2.5 text-center">Ventilatore intelligente</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Umidità</td><td colSpan={5} className="px-4 py-2.5 text-center">0-100%</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Temperatura di lavoro Range (°C)</td><td colSpan={5} className="px-4 py-2.5 text-center">-25 to 60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Altitudine di lavoro (m)</td><td colSpan={5} className="px-4 py-2.5 text-center">&lt; 4000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Consumo in Standby (W)</td><td colSpan={5} className="px-4 py-2.5 text-center">&lt; 10</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Montaggio</td><td colSpan={5} className="px-4 py-2.5 text-center">Supporto a parete</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Communicazione RSD</td><td colSpan={5} className="px-4 py-2.5 text-center">SUNSPEC</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Display &amp; Interfaccia</td><td colSpan={5} className="px-4 py-2.5 text-center">LCD, LED, RS485, CAN, Wi-Fi, GPRS, 4G, Sunspec</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Certificazioni</td><td colSpan={5} className="px-4 py-2.5 text-center">NRS097, G99, EN50549-1, C10/C11, AS4777.2, VDE-AR-N4105, IEC62109-1, IEC62109-2, IEC62477-1, CEI 0-21</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">EMC</td><td colSpan={5} className="px-4 py-2.5 text-center">EN61000-6-2, EN61000-6-3</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ibrido-trifase-3-15kw: Dati tecnici 8 modelli AF3K-MTH ~ AF15K-MTH (sticky prima colonna, scroll orizzontale) */}
      {p.id === "ibrido-trifase-3-15kw" && (
        <section id="specifiche" className="scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Dati tecnici</h2>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[1280px] text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="sticky left-0 z-10 min-w-[200px] px-4 py-2.5 font-medium text-slate-800 text-left bg-white whitespace-nowrap border-r border-slate-200">Modello</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF3K-MTH</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF4K-MTH</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF5K-MTH</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF6K-MTH</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF8K-MTH</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF10K-MTH</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF12K-MTH</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF15K-MTH</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">PV in ingresso</td><td colSpan={8}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. potenza (kW)</td><td className="px-4 py-2.5 text-center">6</td><td className="px-4 py-2.5 text-center">8</td><td className="px-4 py-2.5 text-center">10</td><td className="px-4 py-2.5 text-center">12</td><td className="px-4 py-2.5 text-center">16</td><td className="px-4 py-2.5 text-center">20</td><td className="px-4 py-2.5 text-center">24</td><td className="px-4 py-2.5 text-center">30</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. PV Tensione (V)</td><td colSpan={8} className="px-4 py-2.5 text-center">1000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione normale (V)</td><td colSpan={8} className="px-4 py-2.5 text-center">620</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di tensione di ingresso CC (V)</td><td colSpan={8} className="px-4 py-2.5 text-center">150-1000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">MPPT Voltage Range (V)</td><td colSpan={8} className="px-4 py-2.5 text-center">150-850</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di avvio (V)</td><td colSpan={8} className="px-4 py-2.5 text-center">160</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. corrente (A)</td><td colSpan={8} className="px-4 py-2.5 text-center">18.5x2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. corrente di corto circuito (A)</td><td colSpan={8} className="px-4 py-2.5 text-center">25x2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">No. of MPP Tracker / No. of PV Stringa</td><td colSpan={8} className="px-4 py-2.5 text-center">2/2</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Batteria</td><td colSpan={8}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Batteria Normale Tensione (V)</td><td className="px-4 py-2.5 text-center">350</td><td className="px-4 py-2.5 text-center">350</td><td className="px-4 py-2.5 text-center">350</td><td className="px-4 py-2.5 text-center">350</td><td className="px-4 py-2.5 text-center">350</td><td className="px-4 py-2.5 text-center">350</td><td className="px-4 py-2.5 text-center">450</td><td className="px-4 py-2.5 text-center">500</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Batteria Tensione Range (V)</td><td colSpan={8} className="px-4 py-2.5 text-center">80-600</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Carica/Scarica Corrente (A)</td><td colSpan={8} className="px-4 py-2.5 text-center">30</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Carica/Scarica potenza (kW)</td><td className="px-4 py-2.5 text-center">3</td><td className="px-4 py-2.5 text-center">4</td><td className="px-4 py-2.5 text-center">5</td><td className="px-4 py-2.5 text-center">6</td><td className="px-4 py-2.5 text-center">8</td><td className="px-4 py-2.5 text-center">10</td><td className="px-4 py-2.5 text-center">12</td><td className="px-4 py-2.5 text-center">15</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Curva di carica</td><td colSpan={8} className="px-4 py-2.5 text-center">3 Stages</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Batteria</td><td colSpan={8} className="px-4 py-2.5 text-center">Li-ion / Lead-acid / Batteria a ioni di sodio</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">AC Rete</td><td colSpan={8}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza nominale in uscita CA (kW)</td><td className="px-4 py-2.5 text-center">3</td><td className="px-4 py-2.5 text-center">4</td><td className="px-4 py-2.5 text-center">5</td><td className="px-4 py-2.5 text-center">6</td><td className="px-4 py-2.5 text-center">8</td><td className="px-4 py-2.5 text-center">10</td><td className="px-4 py-2.5 text-center">12</td><td className="px-4 py-2.5 text-center">15</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max potenza continua (kVA)</td><td className="px-4 py-2.5 text-center">4.5/3.3</td><td className="px-4 py-2.5 text-center">6/4.4</td><td className="px-4 py-2.5 text-center">7.5/5.5</td><td className="px-4 py-2.5 text-center">9/6.6</td><td className="px-4 py-2.5 text-center">12/8.8</td><td className="px-4 py-2.5 text-center">15/11</td><td className="px-4 py-2.5 text-center">18/13.2</td><td className="px-4 py-2.5 text-center">22.5/16.5</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Massimo. Corrente di uscita CA (A)</td><td className="px-4 py-2.5 text-center">5.3</td><td className="px-4 py-2.5 text-center">7</td><td className="px-4 py-2.5 text-center">8.5</td><td className="px-4 py-2.5 text-center">10.5</td><td className="px-4 py-2.5 text-center">13.5</td><td className="px-4 py-2.5 text-center">17</td><td className="px-4 py-2.5 text-center">21.5</td><td className="px-4 py-2.5 text-center">27</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale (V)</td><td colSpan={8} className="px-4 py-2.5 text-center">3P+N+PE/3P+PE 230/400</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Frequenza nominale (Hz)</td><td colSpan={8} className="px-4 py-2.5 text-center">50/60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza fattore</td><td colSpan={8} className="px-4 py-2.5 text-center">1 default (regolabile da 0,8 in anticipo a 0,8 in ritardo)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente THD (%)</td><td colSpan={8} className="px-4 py-2.5 text-center">&lt;3%</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">AC in uscita</td><td colSpan={8}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza di uscita nominale (kVA)</td><td className="px-4 py-2.5 text-center">3</td><td className="px-4 py-2.5 text-center">4</td><td className="px-4 py-2.5 text-center">5</td><td className="px-4 py-2.5 text-center">6</td><td className="px-4 py-2.5 text-center">8</td><td className="px-4 py-2.5 text-center">10</td><td className="px-4 py-2.5 text-center">12</td><td className="px-4 py-2.5 text-center">15</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale (V)</td><td colSpan={8} className="px-4 py-2.5 text-center">3P+N+PE/3P+PE 230/400</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">AC Frequenza (Hz)</td><td colSpan={8} className="px-4 py-2.5 text-center">50/60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente nominale AC (A)</td><td className="px-4 py-2.5 text-center">4.4</td><td className="px-4 py-2.5 text-center">5.8</td><td className="px-4 py-2.5 text-center">7.3</td><td className="px-4 py-2.5 text-center">8.7</td><td className="px-4 py-2.5 text-center">11.6</td><td className="px-4 py-2.5 text-center">14.5</td><td className="px-4 py-2.5 text-center">17.4</td><td className="px-4 py-2.5 text-center">21.8</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza di picco (kVA, 60s)</td><td className="px-4 py-2.5 text-center">3.3kVA, 60s</td><td className="px-4 py-2.5 text-center">4.4kVA, 60s</td><td className="px-4 py-2.5 text-center">5.5kVA, 60s</td><td className="px-4 py-2.5 text-center">6.6kVA, 60s</td><td className="px-4 py-2.5 text-center">8.8kVA, 60s</td><td className="px-4 py-2.5 text-center">11kVA, 60s</td><td className="px-4 py-2.5 text-center">13.2kVA, 60s</td><td className="px-4 py-2.5 text-center">16.5kVA, 60s</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione THD (%)</td><td colSpan={8} className="px-4 py-2.5 text-center">&lt;3%</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Switching Tempo</td><td colSpan={8} className="px-4 py-2.5 text-center">&lt;10 ms</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Efficienza</td><td colSpan={8}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Efficienza Europea (%)</td><td colSpan={8} className="px-4 py-2.5 text-center">97.50</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Efficienza (%)</td><td className="px-4 py-2.5 text-center">98.00</td><td className="px-4 py-2.5 text-center">98.00</td><td className="px-4 py-2.5 text-center">98.00</td><td className="px-4 py-2.5 text-center">98.00</td><td className="px-4 py-2.5 text-center">98.20</td><td className="px-4 py-2.5 text-center">98.20</td><td className="px-4 py-2.5 text-center">98.30</td><td className="px-4 py-2.5 text-center">98.30</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Efficienza di carica/scarica della batteria (%)</td><td colSpan={8} className="px-4 py-2.5 text-center">98.00</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Protection</td><td colSpan={8}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione dall&apos;inversione di polarità FV</td><td colSpan={8} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da sovracorrente/tensione</td><td colSpan={8} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione A-Isola</td><td colSpan={8} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da cortocircuito CA</td><td colSpan={8} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento corrente residua</td><td colSpan={8} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Monitoraggio dei guasti a terra</td><td colSpan={8} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento dell&apos;arco FV</td><td colSpan={8} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Livello di protezione del contenitore</td><td colSpan={8} className="px-4 py-2.5 text-center">IP66</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione contro le sovratensioni AC/DC</td><td colSpan={8} className="px-4 py-2.5 text-center">Tipo II</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Generale</td><td colSpan={8}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Dimensioni (W x H x D, mm)</td><td colSpan={8} className="px-4 py-2.5 text-center">370 x 598.5 x 192</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Peso (kg)</td><td colSpan={8} className="px-4 py-2.5 text-center">22</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tipologia</td><td colSpan={8} className="px-4 py-2.5 text-center">Senza trasformatore</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Raffreddamento</td><td colSpan={8} className="px-4 py-2.5 text-center">Ventilatore intelligente</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Umidità</td><td colSpan={8} className="px-4 py-2.5 text-center">0-100%</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Temperatura di lavoro Range (°C)</td><td colSpan={8} className="px-4 py-2.5 text-center">-25 to 60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Altitudine di lavoro (m)</td><td colSpan={8} className="px-4 py-2.5 text-center">&lt;4000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Consumo in Standby (W)</td><td colSpan={8} className="px-4 py-2.5 text-center">&lt;5</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Display &amp; Interfaccia</td><td colSpan={8} className="px-4 py-2.5 text-center">LCD, LED, RS485, CAN, Wi-Fi, GPRS, 4G, Sunspec</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Certificazioni</td><td colSpan={8} className="px-4 py-2.5 text-center">EN50549-1, C10/C11, AS4777.2, VDE-AR-N4105, IEC62109-1, IEC62109-2, IEC62477-1</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">EMC</td><td colSpan={8} className="px-4 py-2.5 text-center">EN61000-6-2, EN61000-6-3</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ibrido-trifase-plus-8-12kw: Dati tecnici 5 modelli AF8K-SLP ~ AF12K-SLP (sticky prima colonna, scroll orizzontale) */}
      {p.id === "ibrido-trifase-plus-8-12kw" && (
        <section id="specifiche" className="scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Dati tecnici</h2>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[900px] text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="sticky left-0 z-10 min-w-[200px] px-4 py-2.5 font-medium text-slate-800 text-left bg-white whitespace-nowrap border-r border-slate-200">Modello</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF8K-SLP</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF9K-SLP</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF10K-SLP</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF11K-SLP</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF12K-SLP</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">PV in ingresso</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza massima in ingresso (kW)</td><td className="px-4 py-2.5 text-center">12</td><td className="px-4 py-2.5 text-center">13.5</td><td className="px-4 py-2.5 text-center">15</td><td className="px-4 py-2.5 text-center">16.5</td><td className="px-4 py-2.5 text-center">18</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione massima in ingresso (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">550</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo tensione MPPT (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">80-500</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione MPPT alla massima efficienza (V)</td><td className="px-4 py-2.5 text-center">150-500</td><td className="px-4 py-2.5 text-center">170-500</td><td className="px-4 py-2.5 text-center">190-500</td><td className="px-4 py-2.5 text-center">210-500</td><td className="px-4 py-2.5 text-center">230-500</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale in ingresso (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">360</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di avviamento (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">100</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente massima in ingresso (A)</td><td colSpan={5} className="px-4 py-2.5 text-center">18.5 x 3</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente di corto circuito (A)</td><td colSpan={5} className="px-4 py-2.5 text-center">26 x 3</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">N. inseguitori MPPT / N. stringhe FV</td><td colSpan={5} className="px-4 py-2.5 text-center">3 / 1+1+2</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Batteria</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza max carica/scarica (kW)</td><td className="px-4 py-2.5 text-center">8.0</td><td className="px-4 py-2.5 text-center">9.0</td><td className="px-4 py-2.5 text-center">10</td><td className="px-4 py-2.5 text-center">11</td><td className="px-4 py-2.5 text-center">12</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente max carica/scarica (A)</td><td className="px-4 py-2.5 text-center">200</td><td className="px-4 py-2.5 text-center">240</td><td className="px-4 py-2.5 text-center">240</td><td className="px-4 py-2.5 text-center">240</td><td className="px-4 py-2.5 text-center">240</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale batteria (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">51.2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo tensione batteria (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">40-60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Batteria</td><td colSpan={5} className="px-4 py-2.5 text-center">Li-ion / Lead-acid etc.</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">AC Rete</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente massima in uscita (A)</td><td className="px-4 py-2.5 text-center">37</td><td className="px-4 py-2.5 text-center">41</td><td className="px-4 py-2.5 text-center">46</td><td className="px-4 py-2.5 text-center">50</td><td className="px-4 py-2.5 text-center">55</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza nominale in uscita (kVA)</td><td className="px-4 py-2.5 text-center">8.0</td><td className="px-4 py-2.5 text-center">9.0</td><td className="px-4 py-2.5 text-center">10</td><td className="px-4 py-2.5 text-center">11</td><td className="px-4 py-2.5 text-center">12</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente nominale in uscita (A)</td><td className="px-4 py-2.5 text-center">36.4/34.8</td><td className="px-4 py-2.5 text-center">41/39.2</td><td className="px-4 py-2.5 text-center">45.5/43.5</td><td className="px-4 py-2.5 text-center">50/47.9</td><td className="px-4 py-2.5 text-center">54.6/52.2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale di uscita (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">198 to 242 @ 220 / 207 to 253 @ 230</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo frequenza di rete (Hz)</td><td colSpan={5} className="px-4 py-2.5 text-center">50/60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Fattore di potenza</td><td colSpan={5} className="px-4 py-2.5 text-center">1 default (regolabile da 0,8 in anticipo a 0,8 in ritardo)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">THD della corrente (%)</td><td colSpan={5} className="px-4 py-2.5 text-center">&lt;3</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">AC in uscita</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente massima in uscita (A)</td><td className="px-4 py-2.5 text-center">37</td><td className="px-4 py-2.5 text-center">41</td><td className="px-4 py-2.5 text-center">46</td><td className="px-4 py-2.5 text-center">50</td><td className="px-4 py-2.5 text-center">55</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max potenza continua (kVA)</td><td className="px-4 py-2.5 text-center">8</td><td className="px-4 py-2.5 text-center">9</td><td className="px-4 py-2.5 text-center">10</td><td className="px-4 py-2.5 text-center">11</td><td className="px-4 py-2.5 text-center">12</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Picco corrente uscita (A) (10min)</td><td className="px-4 py-2.5 text-center">55.5</td><td className="px-4 py-2.5 text-center">61.5</td><td className="px-4 py-2.5 text-center">69</td><td className="px-4 py-2.5 text-center">75</td><td className="px-4 py-2.5 text-center">82.5</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Picco potenza uscita (kVA) (10min)</td><td className="px-4 py-2.5 text-center">12</td><td className="px-4 py-2.5 text-center">13.5</td><td className="px-4 py-2.5 text-center">15</td><td className="px-4 py-2.5 text-center">16.5</td><td className="px-4 py-2.5 text-center">18</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale L-N (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">220/230</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Frequenza uscita (Hz)</td><td colSpan={5} className="px-4 py-2.5 text-center">50/60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tempo di commutazione</td><td colSpan={5} className="px-4 py-2.5 text-center">immediata</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione THD (%)</td><td colSpan={5} className="px-4 py-2.5 text-center">&lt;3</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Efficienza</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rendimento CEC (%)</td><td colSpan={5} className="px-4 py-2.5 text-center">96.8</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rendimento massimo (%)</td><td colSpan={5} className="px-4 py-2.5 text-center">98.1</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Protezione</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione contro inversione polarità</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da sovracorrente/sovratensione</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione anti-isola</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da cortocircuito lato CA</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento corrente residua</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Monitoraggio guasti a terra</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento resistenza di isolamento</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento arco FV</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Grado di protezione del contenitore</td><td colSpan={5} className="px-4 py-2.5 text-center">IP66</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Generale</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Dimensioni (W x H x D, mm)</td><td colSpan={5} className="px-4 py-2.5 text-center">785 x 614 x 258</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Peso (kg)</td><td colSpan={5} className="px-4 py-2.5 text-center">51</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Topologia</td><td colSpan={5} className="px-4 py-2.5 text-center">Senza trasformatore</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Metodo di raffreddamento</td><td colSpan={5} className="px-4 py-2.5 text-center">Ventilatore intelligente</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Umidità</td><td colSpan={5} className="px-4 py-2.5 text-center">0-100%</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo temperatura ambiente (°C)</td><td colSpan={5} className="px-4 py-2.5 text-center">-25 to 60 (Derating 45)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Altitudine operativa (m)</td><td colSpan={5} className="px-4 py-2.5 text-center">&lt;4000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Consumo in modalità standby (W)</td><td colSpan={5} className="px-4 py-2.5 text-center">&lt;30</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Montaggio</td><td colSpan={5} className="px-4 py-2.5 text-center">Supporto a parete</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Communicazione RSD</td><td colSpan={5} className="px-4 py-2.5 text-center">SUNSPEC</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Interfaccia utente e display</td><td colSpan={5} className="px-4 py-2.5 text-center">LCD, LED, RS485, CAN, Wi-Fi, GPRS, 4G, Sunspec</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Certificazioni</td><td colSpan={5} className="px-4 py-2.5 text-center">CE, IEC62116, IEC61727, IEC61683, IEC60068</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Standard EMC</td><td colSpan={5} className="px-4 py-2.5 text-center">EN61000-6-2, EN61000-6-3</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ibrido-trifase-plus-3-12kw: Dati tecnici 7 modelli AF3K-THP ~ AF12K-THP (sticky prima colonna, scroll orizzontale) */}
      {p.id === "ibrido-trifase-plus-3-12kw" && (
        <section id="specifiche" className="scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Dati tecnici</h2>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[1120px] text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="sticky left-0 z-10 min-w-[200px] px-4 py-2.5 font-medium text-slate-800 text-left bg-white whitespace-nowrap border-r border-slate-200">Modello</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF3K-THP</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF4K-THP</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF5K-THP</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF6K-THP</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF8K-THP</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF10K-THP</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF12K-THP</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">PV in ingresso</td><td colSpan={7}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. potenza (kW)</td><td className="px-4 py-2.5 text-center">6</td><td className="px-4 py-2.5 text-center">8</td><td className="px-4 py-2.5 text-center">10</td><td className="px-4 py-2.5 text-center">12</td><td className="px-4 py-2.5 text-center">16</td><td className="px-4 py-2.5 text-center">20</td><td className="px-4 py-2.5 text-center">24</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. PV Tensione (V)</td><td colSpan={7} className="px-4 py-2.5 text-center">1000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione normale (V)</td><td colSpan={7} className="px-4 py-2.5 text-center">620</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di tensione di ingresso CC (V)</td><td colSpan={7} className="px-4 py-2.5 text-center">150-1000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">MPPT Voltage Range (V)</td><td colSpan={7} className="px-4 py-2.5 text-center">150-850</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di avvio (V)</td><td colSpan={7} className="px-4 py-2.5 text-center">160</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. corrente (A)</td><td colSpan={7} className="px-4 py-2.5 text-center">20x2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. corrente di corto circuito (A)</td><td colSpan={7} className="px-4 py-2.5 text-center">30x2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">No. of MPP Tracker / No. of PV Stringa</td><td colSpan={7} className="px-4 py-2.5 text-center">2/2</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Batteria</td><td colSpan={7}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Batteria Normale Tensione (V)</td><td className="px-4 py-2.5 text-center">100</td><td className="px-4 py-2.5 text-center">100</td><td className="px-4 py-2.5 text-center">100</td><td className="px-4 py-2.5 text-center">150</td><td className="px-4 py-2.5 text-center">200</td><td className="px-4 py-2.5 text-center">250</td><td className="px-4 py-2.5 text-center">300</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Batteria Tensione Range (V)</td><td colSpan={3} className="px-4 py-2.5 text-center">80-600</td><td colSpan={4} className="px-4 py-2.5 text-center">120-650</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Carica/Scarica Corrente (A)</td><td colSpan={7} className="px-4 py-2.5 text-center">50</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Carica/Scarica potenza (kW)</td><td className="px-4 py-2.5 text-center">3</td><td className="px-4 py-2.5 text-center">4</td><td className="px-4 py-2.5 text-center">5</td><td className="px-4 py-2.5 text-center">6</td><td className="px-4 py-2.5 text-center">8</td><td className="px-4 py-2.5 text-center">10</td><td className="px-4 py-2.5 text-center">12</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Curva di carica</td><td colSpan={7} className="px-4 py-2.5 text-center">3 Stages</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Batteria</td><td colSpan={7} className="px-4 py-2.5 text-center">Li-ion / Lead-acid / Sodium metal chloride battery</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">AC Rete</td><td colSpan={7}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza nominale in uscita CA (kW)</td><td className="px-4 py-2.5 text-center">3</td><td className="px-4 py-2.5 text-center">4</td><td className="px-4 py-2.5 text-center">5</td><td className="px-4 py-2.5 text-center">6</td><td className="px-4 py-2.5 text-center">8</td><td className="px-4 py-2.5 text-center">10</td><td className="px-4 py-2.5 text-center">12</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max potenza continua (kVA)</td><td className="px-4 py-2.5 text-center">4.5/3.3</td><td className="px-4 py-2.5 text-center">6/4.4</td><td className="px-4 py-2.5 text-center">7.5/5.5</td><td className="px-4 py-2.5 text-center">9/6.6</td><td className="px-4 py-2.5 text-center">12/8.8</td><td className="px-4 py-2.5 text-center">15/11</td><td className="px-4 py-2.5 text-center">18/13.2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Massimo. Corrente di uscita CA (A)</td><td className="px-4 py-2.5 text-center">5.3</td><td className="px-4 py-2.5 text-center">7</td><td className="px-4 py-2.5 text-center">8.5</td><td className="px-4 py-2.5 text-center">10.5</td><td className="px-4 py-2.5 text-center">13.5</td><td className="px-4 py-2.5 text-center">17</td><td className="px-4 py-2.5 text-center">21.5</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale (V)</td><td colSpan={7} className="px-4 py-2.5 text-center">230/400</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Frequenza nominale (Hz)</td><td colSpan={7} className="px-4 py-2.5 text-center">50/60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza fattore</td><td colSpan={7} className="px-4 py-2.5 text-center">1 (-0.8~0.8 adjustable)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente THD (%)</td><td colSpan={7} className="px-4 py-2.5 text-center">&lt;3%</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">AC in uscita</td><td colSpan={7}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza di uscita nominale (VA)</td><td className="px-4 py-2.5 text-center">3000</td><td className="px-4 py-2.5 text-center">4000</td><td className="px-4 py-2.5 text-center">5000</td><td className="px-4 py-2.5 text-center">6000</td><td className="px-4 py-2.5 text-center">8000</td><td className="px-4 py-2.5 text-center">10000</td><td className="px-4 py-2.5 text-center">12000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale (V)</td><td colSpan={7} className="px-4 py-2.5 text-center">230/400</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">AC Frequenza (Hz)</td><td colSpan={7} className="px-4 py-2.5 text-center">50/60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente nominale AC (A)</td><td className="px-4 py-2.5 text-center">4.4</td><td className="px-4 py-2.5 text-center">5.8</td><td className="px-4 py-2.5 text-center">7.3</td><td className="px-4 py-2.5 text-center">8.7</td><td className="px-4 py-2.5 text-center">11.6</td><td className="px-4 py-2.5 text-center">14.5</td><td className="px-4 py-2.5 text-center">17.4</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza di uscita di picco</td><td className="px-4 py-2.5 text-center">3.3kVA, 60s</td><td className="px-4 py-2.5 text-center">4.4kVA, 60s</td><td className="px-4 py-2.5 text-center">5.5kVA, 60s</td><td className="px-4 py-2.5 text-center">6.6kVA, 60s</td><td className="px-4 py-2.5 text-center">8.8kVA, 60s</td><td className="px-4 py-2.5 text-center">11kVA, 60s</td><td className="px-4 py-2.5 text-center">13.2kVA, 60s</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione THD (%)</td><td colSpan={7} className="px-4 py-2.5 text-center">&lt;3%</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Switching Tempo</td><td colSpan={7} className="px-4 py-2.5 text-center">&lt;10</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Efficenza</td><td colSpan={7}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Efficenza Europea (%)</td><td colSpan={7} className="px-4 py-2.5 text-center">97.50</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Efficenza (%)</td><td className="px-4 py-2.5 text-center">98.00</td><td className="px-4 py-2.5 text-center">98.00</td><td className="px-4 py-2.5 text-center">98.00</td><td className="px-4 py-2.5 text-center">98.00</td><td className="px-4 py-2.5 text-center">98.20</td><td className="px-4 py-2.5 text-center">98.30</td><td className="px-4 py-2.5 text-center">98.30</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Efficienza di carica/scarica della batteria (%)</td><td colSpan={7} className="px-4 py-2.5 text-center">98.00</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Protection</td><td colSpan={7}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione dall&apos;inversione di polarità FV</td><td colSpan={7} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da sovracorrente/tensione</td><td colSpan={7} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione A-Isola</td><td colSpan={7} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da cortocircuito CA</td><td colSpan={7} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento corrente residua</td><td colSpan={7} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Monitoraggio dei guasti a terra</td><td colSpan={7} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento dell&apos;arco FV</td><td colSpan={7} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Livello di protezione del contenitore</td><td colSpan={7} className="px-4 py-2.5 text-center">IP66</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">AC/DC surge protection</td><td colSpan={7} className="px-4 py-2.5 text-center">Tipo II</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Generale</td><td colSpan={7}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Dimensioni (W x H x D, mm)</td><td colSpan={7} className="px-4 py-2.5 text-center">558 x 535 x 260</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Peso (kg)</td><td colSpan={7} className="px-4 py-2.5 text-center">29</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tipologia</td><td colSpan={7} className="px-4 py-2.5 text-center">Senza trasformatore</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Raffreddamento</td><td colSpan={3} className="px-4 py-2.5 text-center">Convezione Naturale</td><td colSpan={4} className="px-4 py-2.5 text-center">Ventilatore intelligente</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Umidità</td><td colSpan={7} className="px-4 py-2.5 text-center">0-100%</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Temperatura di lavoro Range (°C)</td><td colSpan={7} className="px-4 py-2.5 text-center">-25 to 60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Altitudine di lavoro (m)</td><td colSpan={7} className="px-4 py-2.5 text-center">&lt;4000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Consumo in Standby (W)</td><td colSpan={7} className="px-4 py-2.5 text-center">&lt;5</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Display &amp; Interfaccia</td><td colSpan={7} className="px-4 py-2.5 text-center">LCD, LED, RS485, CAN, Wi-Fi, GPRS, 4G, Sunspec</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Certificazioni</td><td colSpan={7} className="px-4 py-2.5 text-center">NRS097, G98/G99, EN50549-1, C10/C11, AS4777.2, VDE-AR-N4105, IEC62109-1, IEC62109-2, IEC62477-1, CEI 0-21</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">EMC</td><td colSpan={7} className="px-4 py-2.5 text-center">EN61000-6-2, EN61000-6-3</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ibrido-trifase-3-30kw: Dati tecnici 12 modelli in un'unica tabella, scroll orizzontale (stile ibrido-monofase-1-3-6kw) */}
      {p.id === "ibrido-trifase-3-30kw" && (
        <section id="specifiche" className="scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Dati tecnici</h2>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[1920px] text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="sticky left-0 z-10 min-w-[200px] px-4 py-2.5 font-medium text-slate-800 text-left bg-white whitespace-nowrap border-r border-slate-200">Modello</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF3K-TH</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF4K-TH</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF5K-TH</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF6K-TH</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF8K-TH</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF10K-TH</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF12K-TH</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF15K-TH</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF17K-TH</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF20K-TH</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF25K-TH</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF30K-TH</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">PV in ingresso</td><td colSpan={12}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. potenza (kW)</td><td className="px-4 py-2.5 text-center">6</td><td className="px-4 py-2.5 text-center">8</td><td className="px-4 py-2.5 text-center">10</td><td className="px-4 py-2.5 text-center">12</td><td className="px-4 py-2.5 text-center">16</td><td className="px-4 py-2.5 text-center">20</td><td className="px-4 py-2.5 text-center">24</td><td className="px-4 py-2.5 text-center">30</td><td className="px-4 py-2.5 text-center">34</td><td className="px-4 py-2.5 text-center">40</td><td className="px-4 py-2.5 text-center">50</td><td className="px-4 py-2.5 text-center">51</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. PV Tensione (V)</td><td colSpan={12} className="px-4 py-2.5 text-center">1000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione normale (V)</td><td colSpan={12} className="px-4 py-2.5 text-center">620</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di tensione di ingresso CC (V)</td><td colSpan={12} className="px-4 py-2.5 text-center">150-1000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">MPPT Voltage Range (V)</td><td colSpan={12} className="px-4 py-2.5 text-center">150-850</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di avvio (V)</td><td colSpan={12} className="px-4 py-2.5 text-center">160</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. corrente (A)</td><td className="px-4 py-2.5 text-center">20x2</td><td className="px-4 py-2.5 text-center">20x2</td><td className="px-4 py-2.5 text-center">20x2</td><td className="px-4 py-2.5 text-center">20x2</td><td className="px-4 py-2.5 text-center">20x2</td><td className="px-4 py-2.5 text-center">20x2</td><td className="px-4 py-2.5 text-center">20x2</td><td className="px-4 py-2.5 text-center">20+32</td><td className="px-4 py-2.5 text-center">32x2</td><td className="px-4 py-2.5 text-center">32x2</td><td className="px-4 py-2.5 text-center">40x2</td><td className="px-4 py-2.5 text-center">40x2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. corrente di corto circuito (A)</td><td className="px-4 py-2.5 text-center">30x2</td><td className="px-4 py-2.5 text-center">30x2</td><td className="px-4 py-2.5 text-center">30x2</td><td className="px-4 py-2.5 text-center">30x2</td><td className="px-4 py-2.5 text-center">30x2</td><td className="px-4 py-2.5 text-center">30x2</td><td className="px-4 py-2.5 text-center">30x2</td><td className="px-4 py-2.5 text-center">30+48</td><td className="px-4 py-2.5 text-center">48x2</td><td className="px-4 py-2.5 text-center">48x2</td><td className="px-4 py-2.5 text-center">60x2</td><td className="px-4 py-2.5 text-center">60x2</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">No. of MPP Tracker / No. of PV Stringa</td><td className="px-4 py-2.5 text-center">2/2</td><td className="px-4 py-2.5 text-center">2/2</td><td className="px-4 py-2.5 text-center">2/2</td><td className="px-4 py-2.5 text-center">2/2</td><td className="px-4 py-2.5 text-center">2/2</td><td className="px-4 py-2.5 text-center">2/2</td><td className="px-4 py-2.5 text-center">2/2</td><td className="px-4 py-2.5 text-center">2/3</td><td className="px-4 py-2.5 text-center">2/4</td><td className="px-4 py-2.5 text-center">2/4</td><td className="px-4 py-2.5 text-center">2/4</td><td className="px-4 py-2.5 text-center">2/4</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Batteria</td><td colSpan={12}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Batteria Normale Tensione (V)</td><td className="px-4 py-2.5 text-center">200</td><td className="px-4 py-2.5 text-center">200</td><td className="px-4 py-2.5 text-center">200</td><td className="px-4 py-2.5 text-center">250</td><td className="px-4 py-2.5 text-center">300</td><td className="px-4 py-2.5 text-center">400</td><td className="px-4 py-2.5 text-center">450</td><td className="px-4 py-2.5 text-center">500</td><td className="px-4 py-2.5 text-center">400</td><td className="px-4 py-2.5 text-center">500</td><td className="px-4 py-2.5 text-center">500</td><td className="px-4 py-2.5 text-center">550</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Batteria Tensione Range (V)</td><td colSpan={12} className="px-4 py-2.5 text-center">150-800</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Carica/Scarica Corrente (A)</td><td className="px-4 py-2.5 text-center">30</td><td className="px-4 py-2.5 text-center">30</td><td className="px-4 py-2.5 text-center">30</td><td className="px-4 py-2.5 text-center">30</td><td className="px-4 py-2.5 text-center">30</td><td className="px-4 py-2.5 text-center">30</td><td className="px-4 py-2.5 text-center">30</td><td className="px-4 py-2.5 text-center">50</td><td className="px-4 py-2.5 text-center">50</td><td className="px-4 py-2.5 text-center">50</td><td className="px-4 py-2.5 text-center">60</td><td className="px-4 py-2.5 text-center">60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Carica/Scarica potenza (kW)</td><td className="px-4 py-2.5 text-center">3</td><td className="px-4 py-2.5 text-center">4</td><td className="px-4 py-2.5 text-center">5</td><td className="px-4 py-2.5 text-center">6</td><td className="px-4 py-2.5 text-center">8</td><td className="px-4 py-2.5 text-center">10</td><td className="px-4 py-2.5 text-center">12</td><td className="px-4 py-2.5 text-center">15</td><td className="px-4 py-2.5 text-center">17</td><td className="px-4 py-2.5 text-center">20</td><td className="px-4 py-2.5 text-center">25</td><td className="px-4 py-2.5 text-center">30</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Curva di carica</td><td colSpan={12} className="px-4 py-2.5 text-center">3 Stadi</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Batteria</td><td colSpan={12} className="px-4 py-2.5 text-center">Li-ion / Lead-acid / Batteria a ioni di sodio</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">AC Rete</td><td colSpan={12}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza nominale in uscita CA (kW)</td><td className="px-4 py-2.5 text-center">3</td><td className="px-4 py-2.5 text-center">4</td><td className="px-4 py-2.5 text-center">5</td><td className="px-4 py-2.5 text-center">6</td><td className="px-4 py-2.5 text-center">8</td><td className="px-4 py-2.5 text-center">10</td><td className="px-4 py-2.5 text-center">12</td><td className="px-4 py-2.5 text-center">15</td><td className="px-4 py-2.5 text-center">17</td><td className="px-4 py-2.5 text-center">20</td><td className="px-4 py-2.5 text-center">25</td><td className="px-4 py-2.5 text-center">30</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max potenza continua (kVA)</td><td className="px-4 py-2.5 text-center">4.5/3.3</td><td className="px-4 py-2.5 text-center">6/4.4</td><td className="px-4 py-2.5 text-center">7.5/5.5</td><td className="px-4 py-2.5 text-center">9/6.6</td><td className="px-4 py-2.5 text-center">12/8.8</td><td className="px-4 py-2.5 text-center">15/11</td><td className="px-4 py-2.5 text-center">18/13.2</td><td className="px-4 py-2.5 text-center">22.5/16.5</td><td className="px-4 py-2.5 text-center">25.5/18.7</td><td className="px-4 py-2.5 text-center">30/22</td><td className="px-4 py-2.5 text-center">37.5/27.5</td><td className="px-4 py-2.5 text-center">45/33</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Massimo. Corrente di uscita CA (A)</td><td className="px-4 py-2.5 text-center">5.3</td><td className="px-4 py-2.5 text-center">7</td><td className="px-4 py-2.5 text-center">8.5</td><td className="px-4 py-2.5 text-center">10.5</td><td className="px-4 py-2.5 text-center">13.5</td><td className="px-4 py-2.5 text-center">17</td><td className="px-4 py-2.5 text-center">21.5</td><td className="px-4 py-2.5 text-center">27</td><td className="px-4 py-2.5 text-center">30</td><td className="px-4 py-2.5 text-center">32</td><td className="px-4 py-2.5 text-center">40</td><td className="px-4 py-2.5 text-center">48</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale (V)</td><td colSpan={12} className="px-4 py-2.5 text-center">230/400</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Frequenza nominale (Hz)</td><td colSpan={12} className="px-4 py-2.5 text-center">50/60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza fattore</td><td colSpan={12} className="px-4 py-2.5 text-center">1 default (regolabile da 0,8 in anticipo a 0,8 in ritardo)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente THD (%)</td><td colSpan={12} className="px-4 py-2.5 text-center">&lt; 3%</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">AC in uscita</td><td colSpan={12}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza di uscita nominale (VA)</td><td className="px-4 py-2.5 text-center">3000</td><td className="px-4 py-2.5 text-center">4000</td><td className="px-4 py-2.5 text-center">5000</td><td className="px-4 py-2.5 text-center">6000</td><td className="px-4 py-2.5 text-center">8000</td><td className="px-4 py-2.5 text-center">10000</td><td className="px-4 py-2.5 text-center">12000</td><td className="px-4 py-2.5 text-center">15000</td><td className="px-4 py-2.5 text-center">17000</td><td className="px-4 py-2.5 text-center">20000</td><td className="px-4 py-2.5 text-center">25000</td><td className="px-4 py-2.5 text-center">30000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale (V)</td><td colSpan={12} className="px-4 py-2.5 text-center">230/400</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">AC Frequenza (Hz)</td><td colSpan={12} className="px-4 py-2.5 text-center">50/60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente nominale AC (A)</td><td className="px-4 py-2.5 text-center">4.4</td><td className="px-4 py-2.5 text-center">5.8</td><td className="px-4 py-2.5 text-center">7.3</td><td className="px-4 py-2.5 text-center">8.7</td><td className="px-4 py-2.5 text-center">11.6</td><td className="px-4 py-2.5 text-center">14.5</td><td className="px-4 py-2.5 text-center">17.4</td><td className="px-4 py-2.5 text-center">21.8</td><td className="px-4 py-2.5 text-center">24.7</td><td className="px-4 py-2.5 text-center">29</td><td className="px-4 py-2.5 text-center">36.3</td><td className="px-4 py-2.5 text-center">43.5</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza di uscita di picco</td><td className="px-4 py-2.5 text-center">3300VA, 60s</td><td className="px-4 py-2.5 text-center">4400VA, 60s</td><td className="px-4 py-2.5 text-center">5500VA, 60s</td><td className="px-4 py-2.5 text-center">6600VA, 60s</td><td className="px-4 py-2.5 text-center">8800VA, 60s</td><td className="px-4 py-2.5 text-center">11000VA, 60s</td><td className="px-4 py-2.5 text-center">13200VA, 60s</td><td className="px-4 py-2.5 text-center">16500VA, 60s</td><td className="px-4 py-2.5 text-center">18700VA, 60s</td><td className="px-4 py-2.5 text-center">22000VA, 60s</td><td className="px-4 py-2.5 text-center">27500VA, 60s</td><td className="px-4 py-2.5 text-center">33000VA, 60s</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione THD (%)</td><td colSpan={12} className="px-4 py-2.5 text-center">&lt; 3%</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Switching Tempo (s)</td><td colSpan={12} className="px-4 py-2.5 text-center">&lt; 10</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Efficenza</td><td colSpan={12}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Efficenza Europea (%)</td><td className="px-4 py-2.5 text-center">97.50</td><td className="px-4 py-2.5 text-center">97.50</td><td className="px-4 py-2.5 text-center">97.50</td><td className="px-4 py-2.5 text-center">97.50</td><td className="px-4 py-2.5 text-center">97.50</td><td className="px-4 py-2.5 text-center">97.50</td><td className="px-4 py-2.5 text-center">97.50</td><td className="px-4 py-2.5 text-center">97.50</td><td className="px-4 py-2.5 text-center">97.80</td><td className="px-4 py-2.5 text-center">97.80</td><td className="px-4 py-2.5 text-center">98.00</td><td className="px-4 py-2.5 text-center">98.10</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Efficenza (%)</td><td className="px-4 py-2.5 text-center">98.00</td><td className="px-4 py-2.5 text-center">98.00</td><td className="px-4 py-2.5 text-center">98.00</td><td className="px-4 py-2.5 text-center"></td><td className="px-4 py-2.5 text-center">98.20</td><td className="px-4 py-2.5 text-center">98.20</td><td className="px-4 py-2.5 text-center"></td><td className="px-4 py-2.5 text-center">98.30</td><td className="px-4 py-2.5 text-center">98.30</td><td className="px-4 py-2.5 text-center">98.30</td><td className="px-4 py-2.5 text-center">98.50</td><td className="px-4 py-2.5 text-center">98.50</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Efficienza di carica/scarica della batteria (%)</td><td colSpan={12} className="px-4 py-2.5 text-center">98.00</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Protezione</td><td colSpan={12}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione dall&apos;inversione di polarità FV</td><td colSpan={12} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da sovracorrente/tensione</td><td colSpan={12} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione A-Isola</td><td colSpan={12} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da cortocircuito CA</td><td colSpan={12} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento corrente residua</td><td colSpan={12} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Monitoraggio dei guasti a terra</td><td colSpan={12} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento dell&apos;arco FV</td><td colSpan={12} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Livello di protezione del contenitore</td><td colSpan={12} className="px-4 py-2.5 text-center">IP66</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione contro le sovratensioni AC/DC</td><td colSpan={12} className="px-4 py-2.5 text-center">Tipo II</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Generale</td><td colSpan={12}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Dimensioni (W x H x D, mm)</td><td colSpan={12} className="px-4 py-2.5 text-center">558 x 535 x 260</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Peso (kg)</td><td className="px-4 py-2.5 text-center">29</td><td className="px-4 py-2.5 text-center">29</td><td className="px-4 py-2.5 text-center">29</td><td className="px-4 py-2.5 text-center">29</td><td className="px-4 py-2.5 text-center">29</td><td className="px-4 py-2.5 text-center">29</td><td className="px-4 py-2.5 text-center">29</td><td className="px-4 py-2.5 text-center">29</td><td className="px-4 py-2.5 text-center">29</td><td className="px-4 py-2.5 text-center">29</td><td className="px-4 py-2.5 text-center">36</td><td className="px-4 py-2.5 text-center">36</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tipologia</td><td colSpan={12} className="px-4 py-2.5 text-center">Senza trasformatore</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Raffreddamento</td><td colSpan={3} className="px-4 py-2.5 text-center">Natural Convection</td><td colSpan={9} className="px-4 py-2.5 text-center">Ventilatore intelligente</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Umidità</td><td colSpan={12} className="px-4 py-2.5 text-center">0-100%</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Temperatura di lavoro Range (°C)</td><td colSpan={12} className="px-4 py-2.5 text-center">-25 to 60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Altitudine di lavoro (m)</td><td colSpan={12} className="px-4 py-2.5 text-center">&lt; 4000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Consumo in Standby (W)</td><td colSpan={12} className="px-4 py-2.5 text-center">&lt; 5</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Display &amp; Interfaccia</td><td colSpan={12} className="px-4 py-2.5 text-center">LCD, LED, RS485, CAN, Wi-Fi, GPRS, 4G, Sunspec</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Certificazioni</td><td colSpan={12} className="px-4 py-2.5 text-center">NRS097, G98, EN50549-1, C10/C11, AS4777.2, VDE-AR-N4105, IEC62109-1, IEC62109-2, IEC62477-1, CEI 0-21</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">EMC</td><td colSpan={12} className="px-4 py-2.5 text-center">EN61000-6-2, EN61000-6-3</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ibrido-trifase-36-60kw: Dati tecnici 5 modelli, sticky prima colonna, scroll orizzontale */}
      {p.id === "ibrido-trifase-36-60kw" && (
        <section id="specifiche" className="scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Dati tecnici</h2>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[900px] text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="sticky left-0 z-10 min-w-[200px] px-4 py-2.5 font-medium text-slate-800 text-left bg-white whitespace-nowrap border-r border-slate-200">Modello</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF36K-TH</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF40K-TH</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF45K-TH</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF50K-TH</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">AF60K-TH</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">PV in ingresso</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. potenza (kW)</td><td className="px-4 py-2.5 text-center">72</td><td className="px-4 py-2.5 text-center">80</td><td className="px-4 py-2.5 text-center">90</td><td className="px-4 py-2.5 text-center">100</td><td className="px-4 py-2.5 text-center">100</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. PV Tensione (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">1000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione normale (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">620</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di tensione di ingresso CC (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">150-1000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">MPPT Voltage Range (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">150-850</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di avvio (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">160</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. corrente (A)</td><td colSpan={5} className="px-4 py-2.5 text-center">40x4</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. corrente di corto circuito (A)</td><td colSpan={5} className="px-4 py-2.5 text-center">48x4</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">No. of MPP Tracker / No. of PV Stringa</td><td colSpan={5} className="px-4 py-2.5 text-center">4/8</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Batteria</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Batteria Normale Tensione (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">500</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Batteria Tensione Range (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">150-800</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Carica/Scarica Corrente (A)</td><td colSpan={5} className="px-4 py-2.5 text-center">120</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Carica/Scarica potenza (kW)</td><td className="px-4 py-2.5 text-center">36</td><td className="px-4 py-2.5 text-center">40</td><td className="px-4 py-2.5 text-center">45</td><td className="px-4 py-2.5 text-center">50</td><td className="px-4 py-2.5 text-center">60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Curva di carica</td><td colSpan={5} className="px-4 py-2.5 text-center">3 Stadi</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Batteria</td><td colSpan={5} className="px-4 py-2.5 text-center">Li-ion / Lead-acid / Batteria a ioni di sodio</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">AC Rete</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza nominale in uscita CA (kW)</td><td className="px-4 py-2.5 text-center">36</td><td className="px-4 py-2.5 text-center">40</td><td className="px-4 py-2.5 text-center">45</td><td className="px-4 py-2.5 text-center">50</td><td className="px-4 py-2.5 text-center">60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max potenza continua (kVA)</td><td className="px-4 py-2.5 text-center">54/39.6</td><td className="px-4 py-2.5 text-center">60/44</td><td className="px-4 py-2.5 text-center">67.5/49.5</td><td className="px-4 py-2.5 text-center">75/55</td><td className="px-4 py-2.5 text-center">90/66</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Massimo. Corrente di uscita CA (A)</td><td className="px-4 py-2.5 text-center">60.5</td><td className="px-4 py-2.5 text-center">67</td><td className="px-4 py-2.5 text-center">75.5</td><td className="px-4 py-2.5 text-center">83.5</td><td className="px-4 py-2.5 text-center">96</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">230/400</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Frequenza nominale (Hz)</td><td colSpan={5} className="px-4 py-2.5 text-center">50/60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza fattore</td><td colSpan={5} className="px-4 py-2.5 text-center">1 default (regolabile da 0,8 in anticipo a 0,8 in ritardo)</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente THD (%)</td><td colSpan={5} className="px-4 py-2.5 text-center">&lt; 3%</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">AC in uscita</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza di uscita nominale (kVA)</td><td className="px-4 py-2.5 text-center">36</td><td className="px-4 py-2.5 text-center">40</td><td className="px-4 py-2.5 text-center">45</td><td className="px-4 py-2.5 text-center">50</td><td className="px-4 py-2.5 text-center">60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale (V)</td><td colSpan={5} className="px-4 py-2.5 text-center">230/400</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">AC Frequenza (Hz)</td><td colSpan={5} className="px-4 py-2.5 text-center">50/60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente nominale AC (A)</td><td className="px-4 py-2.5 text-center">60.5</td><td className="px-4 py-2.5 text-center">67</td><td className="px-4 py-2.5 text-center">75.5</td><td className="px-4 py-2.5 text-center">83.5</td><td className="px-4 py-2.5 text-center">96</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Potenza di uscita di picco</td><td className="px-4 py-2.5 text-center">39.6kVA, 60s</td><td className="px-4 py-2.5 text-center">44kVA, 60s</td><td className="px-4 py-2.5 text-center">49.5kVA, 60s</td><td className="px-4 py-2.5 text-center">55kVA, 60s</td><td className="px-4 py-2.5 text-center">66kVA, 60s</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione THD (%)</td><td colSpan={5} className="px-4 py-2.5 text-center">&lt; 3%</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Switching Tempo (s)</td><td colSpan={5} className="px-4 py-2.5 text-center">&lt; 10</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Efficenza</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Efficenza Europea (%)</td><td className="px-4 py-2.5 text-center">98.20</td><td className="px-4 py-2.5 text-center">98.30</td><td className="px-4 py-2.5 text-center">98.30</td><td className="px-4 py-2.5 text-center">98.30</td><td className="px-4 py-2.5 text-center">98.30</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Max. Efficenza (%)</td><td colSpan={5} className="px-4 py-2.5 text-center">98.60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Efficienza di carica/scarica della batteria (%)</td><td colSpan={5} className="px-4 py-2.5 text-center">99.00</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Protezione</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione dall&apos;inversione di polarità FV</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da sovracorrente/tensione</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione A-Isola</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione da cortocircuito CA</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento corrente residua</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Monitoraggio dei guasti a terra</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Rilevamento dell&apos;arco FV</td><td colSpan={5} className="px-4 py-2.5 text-center">Sì</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Livello di protezione del contenitore</td><td colSpan={5} className="px-4 py-2.5 text-center">IP66</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Protezione contro le sovratensioni AC/DC</td><td colSpan={5} className="px-4 py-2.5 text-center">Tipo II</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 border-r border-slate-200">Generale</td><td colSpan={5}></td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Dimensioni (W x H x D, mm)</td><td colSpan={5} className="px-4 py-2.5 text-center">867 x 715 x 306</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Peso (kg)</td><td colSpan={5} className="px-4 py-2.5 text-center">81</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tipologia</td><td colSpan={5} className="px-4 py-2.5 text-center">Senza trasformatore</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Raffreddamento</td><td colSpan={5} className="px-4 py-2.5 text-center">Ventilatore intelligente</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Umidità</td><td colSpan={5} className="px-4 py-2.5 text-center">0-100%</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Temperatura di lavoro Range (°C)</td><td colSpan={5} className="px-4 py-2.5 text-center">-25 to 60</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Altitudine di lavoro (m)</td><td colSpan={5} className="px-4 py-2.5 text-center">&lt; 4000</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Consumo in Standby (W)</td><td colSpan={5} className="px-4 py-2.5 text-center">&lt; 100</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Display &amp; Interfaccia</td><td colSpan={5} className="px-4 py-2.5 text-center">LCD, LED, RS485, CAN, Wi-Fi, GPRS, 4G, Sunspec</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Certificazioni</td><td colSpan={5} className="px-4 py-2.5 text-center">EN50549-1, C10/C11, VDE-AR-N4105, IEC62109-1, IEC62109-2, IEC62477-1, CEI 0-21</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">EMC</td><td colSpan={5} className="px-4 py-2.5 text-center">EN61000-6-2, EN61000-6-4</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* atomwb512100 / atomwb512100-1: Dati tecnici (stessi parametri) */}
      {(p.id === "atomwb512100" || p.id === "atomwb512100-1") && (
        <section id="specifiche" className="scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Dati tecnici</h2>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[480px] text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="sticky left-0 z-10 min-w-[220px] px-4 py-2.5 font-medium text-slate-800 text-left bg-white whitespace-nowrap border-r border-slate-200">Modello</th>
                  <th className="px-4 py-2.5 font-medium text-slate-800 text-center bg-transparent">{p.id === "atomwb512100-1" ? "ATOM-WB512100-1" : "ATOM-WB512100"}</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="bg-slate-100 border-b border-slate-200"><td className="px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 text-left" colSpan={2}>Prestazioni</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tipo di batteria</td><td className="px-4 py-2.5 text-center">LiFePO4</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Capacità nominale</td><td className="px-4 py-2.5 text-center">100Ah</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Energia</td><td className="px-4 py-2.5 text-center">5120Wh</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione nominale</td><td className="px-4 py-2.5 text-center">51.2V</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di tensione operativa</td><td className="px-4 py-2.5 text-center">44.8~57.6V</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tensione di carica standard</td><td className="px-4 py-2.5 text-center">57.6V</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente di carica massima</td><td className="px-4 py-2.5 text-center">50A</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente di scarica standard</td><td className="px-4 py-2.5 text-center">100A</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Corrente di scarica continua massima</td><td className="px-4 py-2.5 text-center">50A</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Limite tensione di carica</td><td className="px-4 py-2.5 text-center">57.6V</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Profondità di scarica consigliata (DOD)</td><td className="px-4 py-2.5 text-center">80%</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Durata del ciclo</td><td className="px-4 py-2.5 text-center">6000/0.5C</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Durata di progetto</td><td className="px-4 py-2.5 text-center">10 Anni</td></tr>

                <tr className="bg-slate-100 border-b border-slate-200"><td className="px-4 py-2.5 font-semibold text-slate-800 bg-slate-100 text-left" colSpan={2}>Specifiche Generali</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Comunicazione</td><td className="px-4 py-2.5 text-center">CAN / RS485</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Efficienza</td><td className="px-4 py-2.5 text-center">96%</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Unità parallele massime</td><td className="px-4 py-2.5 text-center">≤15 Unità</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di temperatura di scarica</td><td className="px-4 py-2.5 text-center">-20°C~60°C</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di temperatura di carica</td><td className="px-4 py-2.5 text-center">0°C~55°C</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Intervallo di temperatura di stoccaggio</td><td className="px-4 py-2.5 text-center">0°C~35°C</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Tipo di terminale</td><td className="px-4 py-2.5 text-center">Connettore rapido</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Materiale dell&apos;involucro</td><td className="px-4 py-2.5 text-center">SPCC</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Grado di protezione</td><td className="px-4 py-2.5 text-center">IP65</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Grado di protezione dalla corrosione</td><td className="px-4 py-2.5 text-center">C4</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Funzione di riscaldamento ausiliario</td><td className="px-4 py-2.5 text-center">Opzionale</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Dimensioni (L×P×H)</td><td className="px-4 py-2.5 text-center">480×165×550 mm</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Peso netto / lordo</td><td className="px-4 py-2.5 text-center">56 kg</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Quantità di imballaggio</td><td className="px-4 py-2.5 text-center">480 pz / 40HQ</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Certificazioni</td><td className="px-4 py-2.5 text-center">CE / IEC62619 / CEI-021 / UN38.3 / MSDS</td></tr>
                <tr className="border-b border-slate-200"><td className="sticky left-0 z-10 px-4 py-2.5 font-medium bg-white border-r border-slate-200">Compatibilità inverter</td><td className="px-4 py-2.5 text-center">Afore</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 所有产品：移动端 Area Download 在上 | Video 在下；桌面端 左 Video | 右 Area Download。样式与 assistenza 一致 */}
      <section id="download-e-supporto" className="py-12 sm:py-16 lg:py-20 border-t border-slate-200 bg-slate-50/50 scroll-mt-24">
        <div className="grid gap-8 lg:gap-12 items-start grid-cols-1 lg:grid-cols-2">
          {/* Area Download 移动端在上（order-1），桌面端在右（order-2） */}
          <div className="order-1 lg:order-2 lg:pl-8 lg:border-l lg:border-slate-200">
            <DownloadSection items={productDownloadItems} />
          </div>
          {/* Video 移动端在下（order-2），桌面端在左（order-1）。标题来自 YouTube */}
          <div className="order-2 lg:order-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 sm:mb-8">{t("prodotti.video") || "Video"}</h2>
            {p.youtubeId ? (
              <YouTubeVideoWithTitle videoId={p.youtubeId} />
            ) : (
              <div className="relative w-full aspect-video overflow-hidden bg-slate-100 flex items-center justify-center">
                <p className="text-slate-500 font-medium">{t("prodotti.videoInCorso") || "In corso"}</p>
              </div>
            )}
          </div>
        </div>
      </section>
      </div>

      {/* Full viewport width: fuori da max-w-7xl così le immagini arrivano ai bordi finestra */}
      {p.id === "shenling-r290" && (
        <>
          <SplitCompareSection
            title="Installazione tradizionale"
            description="Sistema con più tubazioni e cablaggi visibili."
            leftImageSrc="/images/products/shenling-r290/compare/installazione-left.jpg"
            rightImageSrc="/images/products/shenling-r290/compare/installazione-right.jpg"
          />
          <SplitCompareSection
            title="Soluzione All-in-One"
            description="Impianto più pulito, ordinato e integrato."
            leftImageSrc="/images/products/shenling-r290/compare/temperatura-left.jpg"
            rightImageSrc="/images/products/shenling-r290/compare/temperatura-right.jpg"
            className="bg-slate-50/60"
          />
        </>
      )}
    </main>
  );
}
