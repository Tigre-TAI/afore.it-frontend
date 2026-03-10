"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { withLang } from "@/lib/lang-utils";
import {
  VISIBLE_PRODUCTS,
  hrefOf,
  getProductTitle,
  getProductSubtitle,
} from "@/data/product-data";
import { getSchedaPdfUrl } from "@/data/scheda-pdf-map";
import FlatSection from "@/components/ui/FlatSection";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import Button from "@/components/ui/Button";

type CaseStudy = {
  id: string;
  title: string;
  image: string;
  model?: string; // 产品型号，用于关联产品
  relatedImages?: string[]; // 相关图片
  productId?: string; // 关联的产品ID
  productIds?: string[]; // 支持多个产品
};

export default function Cases() {
  const { t, lang } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);

  // Case studies data - 根据实际存在的图片文件
  // 图片位置: public/image/cases/
  // model字段用于关联产品，根据型号匹配产品
  // 支持最多20个案例
  const generateCaseData = (caseNum: number): CaseStudy | null => {
    const caseKey = `case${caseNum}`;
    const titleKey = `home.cases.${caseKey}.title`;
    const modelKey = `home.cases.${caseKey}.model`;
    
    // 尝试获取翻译，如果不存在则返回 null
    const title = t(titleKey as any);
    const model = t(modelKey as any);
    
    // 如果翻译键不存在，t 函数会返回键本身，检查是否是有效的翻译
    if (title === titleKey || model === modelKey) {
      return null;
    }
    
    // 根据案例编号映射产品ID（可以根据实际需求调整）
    const productMapping: Record<number, { productIds: string[]; productId: string }> = {
      1: { productIds: ["ibrido-trifase-3-15kw", "atomwb512100-1"], productId: "ibrido-trifase-3-15kw" },
      2: { productIds: ["ibrido-trifase-3-30kw"], productId: "ibrido-trifase-3-30kw" },
      3: { productIds: ["ibrido-trifase-36-60kw", "bat-hailei-atom-hs-15-41kwh"], productId: "ibrido-trifase-36-60kw" },
      4: { productIds: ["ibrido-trifase-3-30kw", "bat-afore-wall-5-10kwh"], productId: "ibrido-trifase-3-30kw" },
      5: { productIds: ["ibrido-trifase-36-60kw", "bat-hailei-atom-hs-15-41kwh"], productId: "ibrido-trifase-36-60kw" },
      6: { productIds: ["stringa-trifase-70-110kw"], productId: "stringa-trifase-70-110kw" },
      7: { productIds: ["ibrido-monofase-plus-4-6kw", "atomwb512100"], productId: "ibrido-monofase-plus-4-6kw" },
      8: { productIds: ["ibrido-monofase-plus-4-6kw", "bat-hailei-atom-ls-10-15kwh"], productId: "ibrido-monofase-plus-4-6kw" },
      9: { productIds: ["stringa-3-6kw"], productId: "stringa-3-6kw" },
      10: { productIds: ["atomwb512100"], productId: "atomwb512100" },
      11: { productIds: ["stringa-trifase-3-25kw"], productId: "stringa-trifase-3-25kw" },
      12: { productIds: ["ibrido-monofase-1-3-6kw"], productId: "ibrido-monofase-1-3-6kw" },
      13: { productIds: ["ibrido-trifase-3-15kw"], productId: "ibrido-trifase-3-15kw" },
      14: { productIds: ["stringa-7-10kw"], productId: "stringa-7-10kw" },
      15: { productIds: ["bat-afore-stack-hv-5kwh"], productId: "bat-afore-stack-hv-5kwh" },
      16: { productIds: ["ibrido-monofase-plus-4-6kw"], productId: "ibrido-monofase-plus-4-6kw" },
      17: { productIds: ["stringa-trifase-36-60kw"], productId: "stringa-trifase-36-60kw" },
      18: { productIds: ["ibrido-trifase-36-60kw"], productId: "ibrido-trifase-36-60kw" },
      19: { productIds: ["bat-hailei-atom-ls-10-15kwh"], productId: "bat-hailei-atom-ls-10-15kwh" },
      20: { productIds: ["aio-mono-lv-afore-3-6kw-af5000w-lh"], productId: "aio-mono-lv-afore-3-6kw-af5000w-lh" },
    };

    const productInfo = productMapping[caseNum] || { productIds: [], productId: "" };
    const imageNum = String(caseNum).padStart(2, '0');
    
    return {
      id: `case-${caseNum}`,
      title,
      image: `/image/cases/case_${imageNum}.jpg`,
      model,
      ...productInfo,
      relatedImages: [`/image/cases/case_${imageNum}.jpg`],
    };
  };

  // 生成所有案例（最多20个）
  const allCases: CaseStudy[] = [];
  for (let i = 1; i <= 20; i++) {
    const caseData = generateCaseData(i);
    if (caseData) {
      allCases.push(caseData);
    }
  }

  // 如果图片数量 <= 8，全部显示；否则初始显示8张，可以展开显示更多
  const initialDisplayCount = 8;
  const displayedCases = showAll || allCases.length <= initialDisplayCount 
    ? allCases 
    : allCases.slice(0, initialDisplayCount);
  const hasMoreCases = allCases.length > initialDisplayCount;

  // Handle smooth expansion
  const handleToggleShowAll = () => {
    if (!showAll) {
      setShowAll(true);
      setIsExpanding(true);
      // Reset expanding state after animation completes
      setTimeout(() => setIsExpanding(false), 1000);
    } else {
      setShowAll(false);
      setIsExpanding(false);
    }
  };

  // Reset expanding state when showAll changes to false
  useEffect(() => {
    if (!showAll) {
      setIsExpanding(false);
    }
  }, [showAll]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!selectedCase) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCase(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedCase]);

  // Handle case click
  const handleCaseClick = (caseStudy: CaseStudy) => {
    setSelectedCase(caseStudy);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedCase(null);
  };

  const relatedProducts =
    selectedCase
      ? (selectedCase.productIds ?? (selectedCase.productId ? [selectedCase.productId] : []))
          .map(id => VISIBLE_PRODUCTS.find(p => p.id === id))
          .filter((p): p is NonNullable<typeof p> => Boolean(p))
      : [];

  return (
    <FlatSection bg="white" className="-mt-8">
      <div id="cases" className="container scroll-mt-24">
        <RevealOnScroll>
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              {t("home.cases.title")}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              {t("home.cases.description")}
            </p>
          </div>
        </RevealOnScroll>

        {/* Image grid - flexible columns, tight spacing, no gaps, images maintain original aspect ratio */}
        <RevealOnScroll>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-0">
          {displayedCases.map((caseStudy, index) => {
            // Only animate new items when expanding (items beyond initial 8)
            const isNewItem = isExpanding && index >= initialDisplayCount;
            const delay = isNewItem ? (index - initialDisplayCount) * 80 : 0;
            
            return (
            <div
              key={caseStudy.id}
              onClick={() => handleCaseClick(caseStudy)}
              className="group relative overflow-hidden bg-slate-100 cursor-pointer w-full aspect-square transition-shadow duration-300 hover:shadow-lg"
              style={{
                opacity: isNewItem ? 0 : 1,
                transform: isNewItem ? 'translateY(20px)' : 'translateY(0)',
                transition: isNewItem 
                  ? `opacity 600ms ease-out ${delay}ms, transform 600ms ease-out ${delay}ms`
                  : 'opacity 300ms ease-out, transform 300ms ease-out',
              }}
            >
              {/* Image - object-contain preserves original aspect ratio, shows full image */}
              <Image
                src={caseStudy.image}
                alt={caseStudy.title}
                fill
                className="object-contain group-hover:scale-[1.02] transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
                loading="lazy"
                unoptimized
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none" />
              
              {/* Title overlay - appears on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 pointer-events-none">
                <h3 className="text-white text-sm md:text-base lg:text-lg font-bold text-center drop-shadow-lg">
                  {caseStudy.title}
                </h3>
              </div>
            </div>
            );
          })}
          </div>
        </RevealOnScroll>

        {/* Show All button */}
        {hasMoreCases && (
          <div className="text-center mt-8 md:mt-12">
            <Button
              onClick={handleToggleShowAll}
              variant="primary"
              trailingChevron
              className={showAll ? "[&_.btn-chevron]:rotate-180" : ""}
            >
              {showAll ? t("home.cases.showLess") : t("home.cases.showAll")}
            </Button>
          </div>
        )}
      </div>

      {/* Case Detail Modal */}
      {selectedCase && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div 
            className="relative bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 p-2 hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 md:p-8">
              {/* Title and Model */}
              <div className="mb-6">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {selectedCase.title}
                </h3>
                {selectedCase.model && (
                  <p className="text-lg text-gray-600 font-medium">
                    {t("home.cases.model")}: {selectedCase.model}
                  </p>
                )}
              </div>

              {/* Product Images - Side by Side (max 2 products) */}
              {relatedProducts.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    {relatedProducts.slice(0, 2).map((product, idx) => {
                      const pdfPath = product.schedaKey
                        ? getSchedaPdfUrl(product.schedaKey, product.id, lang as "it" | "en" | "es" | "fr" | "de")
                        : null;

                      return (
                        <div key={product.id} className="flex flex-col">
                          {/* Product Image */}
                          <div className="relative w-full aspect-[4/3] overflow-hidden mb-3">
                            <Image
                              src={product.image}
                              alt={getProductTitle(product, lang) || product.title}
                              fill
                              className="object-contain p-4 product-image-shadow"
                              sizes="(max-width: 640px) 50vw, 50vw"
                              unoptimized
                            />
                          </div>
                          
                          {/* Scheda Tecnica Button - directly below the product */}
                          {pdfPath && (
                            <Button
                              href={pdfPath}
                              variant="secondary"
                              trailingChevron={false}
                              className="w-full justify-center"
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t("home.cases.viewSpecs")}
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Related Images */}
              {selectedCase.relatedImages && selectedCase.relatedImages.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {t("home.cases.relatedImages")}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedCase.relatedImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square overflow-hidden">
                        <Image
                          src={img}
                          alt={`${selectedCase.title} ${idx + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </FlatSection>
  );
}

