"use client";

import { useMemo, Suspense } from "react";
import { PRODUCTS } from "@/data/product-data";
import { useParams, useSearchParams } from "next/navigation";
import type { DocumentFile } from "@/lib/document-utils";

type DocItem = {
  title: string;
  href: string;
  lang?: string;
};

type DocSection = {
  heading: string;
  items: DocItem[];
};

type DocumentListProps = {
  documents: DocumentFile[];
  productFilter?: string;
  seriesFilter?: string;
  powerFilter?: string;
  docTypeFilter?: string;
  langFilter?: string;
  regionFilter?: string;
  highlightProduct?: string;
};

// 分类显示顺序
const CATEGORY_ORDER = [
  'CEI 0-21',
  'TEST REPORT',
  'Guida alla compilazione del regolamento di esercizio',
  'Guida alla compilazione dell\'addendum tecnico',
  'TEST VERIFICATION OF CONFORMITY'
];

/**
 * 从文件名生成友好的标题
 */
function generateTitle(fileName: string): string {
  // 移除语言前缀和扩展名
  let title = fileName
    .replace(/^(IT_|EN_|ES_|FR_|DE_)/, '')
    .replace(/\.pdf$/i, '')
    .replace(/_/g, ' ')
    .replace(/-/g, ' ');
  
  // 美化标题
  title = title
    .replace(/\bCEI-021\b/gi, 'CEI-021')
    .replace(/\bCEI-0-21\b/gi, 'CEI-0-21')
    .replace(/\bTestReport\b/gi, 'Test Report')
    .replace(/\bVerificationOfConformity\b/gi, 'Verification of Conformity');
  
  return title;
}

/**
 * 文档列表组件 - 按产品分组显示文档，从上往下
 * 参考 inverter-ibridi/page.tsx 的结构
 */
function DocumentListContent({
  documents: allDocuments,
  productFilter,
  seriesFilter,
  powerFilter,
  docTypeFilter,
  langFilter,
  regionFilter,
  highlightProduct,
}: DocumentListProps) {
  const params = useParams();
  const lang = (params?.lang as string) || "it";
  const searchParams = useSearchParams();

  // 从 URL 参数获取筛选条件（如果 props 没有提供）
  const effectiveProductFilter = productFilter || searchParams.get("prodotto") || "";
  const effectiveSeriesFilter = seriesFilter || searchParams.get("modello") || "";
  const effectivePowerFilter = powerFilter || searchParams.get("potenza") || "";
  const effectiveDocTypeFilter = docTypeFilter || searchParams.get("tipo") || "";
  const effectiveLangFilter = langFilter || searchParams.get("lingua") || "";
  const effectiveRegionFilter = regionFilter || searchParams.get("regione") || "";

  // 根据筛选条件过滤产品
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // 产品类型筛选
      if (effectiveProductFilter) {
        const hasInverter = p.categories.some((c) => c.slug === "inverter");
        const hasBatteria = p.categories.some((c) => c.slug === "batteria");
        const hasAllInOne = p.categories.some((c) => c.slug === "all-in-one");
        const hasEv = p.categories.some((c) => c.slug === "ev-charger");

        if (effectiveProductFilter === "pv-inverter" && !hasInverter) return false;
        if (effectiveProductFilter === "batteria-accumulo" && !hasBatteria) return false;
        if (effectiveProductFilter === "all-in-one" && !hasAllInOne) return false;
        if (effectiveProductFilter === "ev-charger" && !hasEv) return false;
      }

      // Serie/Modello 筛选
      if (effectiveSeriesFilter) {
        const hasMonofase = p.categories.some((c) => c.slug === "monofase");
        const hasTrifase = p.categories.some((c) => c.slug === "trifase");
        const hasAfore = p.categories.some((c) => c.slug === "afore");
        const hasHailei = p.categories.some((c) => c.slug === "hailei");

        if (effectiveSeriesFilter === "monofase" && !hasMonofase) return false;
        if (effectiveSeriesFilter === "trifase" && !hasTrifase) return false;
        if (effectiveSeriesFilter === "afore" && !hasAfore) return false;
        if (effectiveSeriesFilter === "hailei" && !hasHailei) return false;
      }

      return true;
    });
  }, [effectiveProductFilter, effectiveSeriesFilter, effectivePowerFilter]);

  // 为每个产品组织文档
  const productDocuments = useMemo(() => {
    const result: Record<string, DocSection[]> = {};

    filteredProducts.forEach((product) => {
      // 根据产品类型匹配文档
      let productTypeMatch = '';
      const hasInverter = product.categories.some((c) => c.slug === "inverter");
      const hasBatteria = product.categories.some((c) => c.slug === "batteria");
      const hasAllInOne = product.categories.some((c) => c.slug === "all-in-one");
      const hasEv = product.categories.some((c) => c.slug === "ev-charger");

      if (hasInverter) productTypeMatch = 'PV_INVERTER';
      else if (hasBatteria) productTypeMatch = 'BATTERIA_DI_ACCUMULO';
      else if (hasAllInOne) productTypeMatch = 'ALL_IN_ONE';
      else if (hasEv) productTypeMatch = 'EV_CHARGER';

      // 筛选匹配的文档
      const matchedDocs = allDocuments.filter((doc) => {
        if (doc.productType !== productTypeMatch) return false;
        
        // 语言筛选
        if (effectiveLangFilter && doc.lang !== effectiveLangFilter.toUpperCase()) return false;
        
        // 文档类型筛选
        if (effectiveDocTypeFilter) {
          if (effectiveDocTypeFilter === 'cei' && doc.category !== 'CEI 0-21') return false;
          if (effectiveDocTypeFilter === 'guida-regolamento' && doc.category !== 'Guida alla compilazione del regolamento di esercizio') return false;
        }

        // 根据产品标题/型号匹配（简化：通过文件名关键词匹配）
        const fileName = doc.fileName.toLowerCase();
        const productTitle = product.title.toLowerCase();
        
        // 尝试匹配产品型号关键词
        const productKeywords = productTitle.split(/\s+/).filter(w => w.length > 2);
        return productKeywords.some(keyword => fileName.includes(keyword));
      });

      // 按分类组织文档
      const sectionsByCategory: Record<string, DocItem[]> = {};
      
      matchedDocs.forEach((doc) => {
        if (!doc.category) return;
        
        if (!sectionsByCategory[doc.category]) {
          sectionsByCategory[doc.category] = [];
        }
        
        sectionsByCategory[doc.category].push({
          title: generateTitle(doc.fileName),
          href: doc.filePath,
          lang: doc.lang,
        });
      });

      // 转换为按顺序的 sections
      const sections: DocSection[] = [];
      CATEGORY_ORDER.forEach((category) => {
        if (sectionsByCategory[category] && sectionsByCategory[category].length > 0) {
          sections.push({
            heading: category,
            items: sectionsByCategory[category],
          });
        }
      });

      if (sections.length > 0) {
        result[product.id] = sections;
      }
    });

    return result;
  }, [filteredProducts, allDocuments, effectiveLangFilter, effectiveDocTypeFilter]);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p>Nessun prodotto trovato con i filtri selezionati.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredProducts.map((product) => {
              const sections = productDocuments[product.id];
              
              if (!sections || sections.length === 0) return null;

              return (
                <div
                  key={product.id}
                  id={`product-${product.schedaKey || product.id}`}
                  className="border-b border-slate-200 pb-8 last:border-b-0 last:pb-0"
                >
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                    {product.title}
                  </h3>
                  {product.subtitle && (
                    <p className="text-sm text-slate-600 mb-6">{product.subtitle}</p>
                  )}

                  {/* 文档分类列表 - 参考 inverter-ibridi/page.tsx 的结构 */}
                  <div className="mt-6 space-y-8">
                    {sections.map((sec) => (
                      <div key={sec.heading}>
                        <h4 className="text-lg font-bold text-slate-800 mb-3">{sec.heading}</h4>
                        <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
                          {sec.items.map((item, idx) => (
                            <li
                              key={`${item.href}-${idx}`}
                              className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-slate-900 truncate">{item.title}</p>
                                {item.lang && (
                                  <p className="text-xs text-slate-500 mt-0.5">Lingua: {item.lang}</p>
                                )}
                              </div>
                              <a
                                href={item.href}
                                download
                                className="shrink-0 rounded-md bg-slate-900 px-4 py-2 text-white text-sm font-bold hover:bg-slate-800 transition-colors shadow-sm border border-slate-800 whitespace-nowrap inline-block"
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
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default function DocumentList(props: DocumentListProps) {
  return (
    <Suspense fallback={
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center py-12 text-slate-500">
            <p>Caricamento documenti...</p>
          </div>
        </div>
      </section>
    }>
      <DocumentListContent {...props} />
    </Suspense>
  );
}
