import Image from "next/image";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PRODUCTS, findProductBySlugs, resolvePath, labelOf } from "@/data/product-data";
import { readdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import Link from "next/link";
import { withLang } from "@/lib/lang-utils";

type Props = { 
  params: Promise<{ 
    lang: string;
    category: string; 
    id: string;
  }>;
};

/** 预渲染所有产品详情页（利于 SEO） */
export async function generateStaticParams() {
  const langs = ["it", "en", "es"];
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
  if (!p) return { title: "Prodotto non trovato" };
  return {
    title: `${p.title} | Afore Italia`,
    description: p.subtitle ?? p.title,
    alternates: {
      canonical: `/${lang}/prodotti/${category}/${id}`,
    },
    openGraph: {
      title: p.title,
      description: p.subtitle ?? p.title,
      images: [p.image],
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

  // 面包屑：统一从数据推导（可覆盖全局 Breadcrumbs 的默认行为）
  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/prodotti", label: "Prodotti" },
    { href: `/prodotti/${family}`, label: labelOf(family) },
    { label: p.title },
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 lg:px-8 py-10 space-y-10">
      {/* 面包屑（深色/浅色由父级控制；这里默认浅色） */}
      <Breadcrumbs items={crumbs} theme="light" />

      {/* Hero：左图右文 */}
      <section className="grid gap-8 md:grid-cols-2 items-center">
        <div>
          <Image
            src={meta?.hero?.product ?? p.image}
            alt={p.title}
            width={1200}
            height={900}
            className="w-full rounded-2xl bg-slate-50 object-contain"
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
        </div>
      </section>

      {/* 操作按钮：Scheda Tecnica 和下载 */}
      <section className="flex flex-wrap gap-4">
        {/* 如果有 PDF 文件，优先显示直接下载链接 */}
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
              <a
                key={idx}
                href={`/prodotti/${p.id}/downloads/${d.file}`}
                target="_blank"
                className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-500 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                Scheda Tecnica {d.lang ? `(${d.lang})` : ""} ↓
              </a>
            ))
        ) : p.schedaKey ? (
          <Link
            href={withLang(`/documentazione/scheda-tecnica?product=${p.schedaKey}`, lang)}
            className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-500 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            Scheda Tecnica
          </Link>
        ) : null}
      </section>

      {/* 下载（meta.json + 自动发现的文件） */}
      {allDownloads.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Download</h2>
          <div className="grid gap-3">
            {allDownloads.map((d: any, idx: number) => (
              <a
                key={idx}
                href={`/prodotti/${p.id}/downloads/${d.file}`}
                  target="_blank"
                className="flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                >
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-slate-900 font-medium">
                  {d.name} {d.lang ? `(${d.lang})` : ""}
                </span>
                </a>
            ))}
          </div>
        </section>
      )}

      {/* 结构化数据（SEO 丰富摘要） */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.title,
            description: p.subtitle ?? p.title,
            image: [p.image],
            category: p.categories.map((c) => c.label),
          }),
        }}
      />
    </main>
  );
}
