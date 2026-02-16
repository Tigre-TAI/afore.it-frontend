import Image from "next/image";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { PRODUCTS, findProductBySlugs, resolvePath, labelOf } from "@/data/product-data";
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
    for (const p of PRODUCTS) {
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
          <Breadcrumbs items={crumbs} theme="dark" />
          <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            {p.title}
          </h1>
          {p.subtitle && (
            <p className="mt-2 max-w-2xl text-sm text-white/85">
              {p.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Content Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10 space-y-10">
        {/* Hero：左图右文 */}
        <section className="grid gap-8 md:grid-cols-2 items-center">
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
          {/* Scheda Tecnica 下载按钮 — 统一放在右列文本下方 */}
          <div className="mt-6 flex flex-wrap gap-4">
            {allDownloads.length > 0 && allDownloads.some((d: any) =>
              d.name.toLowerCase().includes('scheda') ||
              d.file.toLowerCase().includes('scheda')
            ) ? (
              allDownloads
                .filter((d: any) =>
                  d.name.toLowerCase().includes('scheda') ||
                  d.file.toLowerCase().includes('scheda')
                )
                .map((d: any, idx: number) => (
                  <Button
                    key={idx}
                    href={`/prodotti/${p.id}/downloads/${d.file}`}
                    variant="primary"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("prodotti.schedaTecnica")}{d.lang ? ` (${d.lang})` : ""}
                  </Button>
                ))
            ) : (() => {
              const schedaUrl = p.schedaKey && getSchedaPdfUrl(p.schedaKey, p.id, lang as "it" | "en" | "es" | "fr" | "de");
              return schedaUrl ? (
                <Button
                  href={schedaUrl}
                  variant="primary"
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("prodotti.schedaTecnica")}
                </Button>
              ) : null;
            })()}
          </div>
        </div>
      </section>

      {/* 所有产品：移动端 Area Download 在上 | Video 在下；桌面端 左 Video | 右 Area Download。样式与 assistenza 一致 */}
      <section className="py-12 sm:py-16 lg:py-20 border-t border-slate-200 bg-slate-50/50">
        <div className="grid gap-8 lg:gap-12 items-start grid-cols-1 lg:grid-cols-2">
          {/* Area Download — 移动端在上（order-1），桌面端在右（order-2） */}
          <div className="order-1 lg:order-2 lg:pl-8 lg:border-l lg:border-slate-200">
            <DownloadSection items={productDownloadItems} />
          </div>
          {/* Video — 移动端在下（order-2），桌面端在左（order-1）。标题来自 YouTube */}
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
    </main>
  );
}
