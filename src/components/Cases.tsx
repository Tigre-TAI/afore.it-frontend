"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { withLang } from "@/lib/lang-utils";
import { PRODUCTS, hrefOf } from "@/data/product-data";

type CaseStudy = {
  id: string;
  title: string;
  image: string;
  model?: string; // 产品型号，用于关联产品
  relatedImages?: string[]; // 相关图片
  productId?: string; // 关联的产品ID
};

export default function Cases() {
  const { t, lang } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);

  // Case studies data - 根据实际存在的图片文件
  // 图片位置: public/image/cases/
  // model字段用于关联产品，根据型号匹配产品
  const allCases: CaseStudy[] = [
    {
      id: "case-1",
      title: t("home.cases.case1.title"),
      image: "/image/cases/case_01.jpg",
      model: t("home.cases.case1.model"), // 从翻译中获取型号
      productId: "ibrido-monofase-1-3-6kw", // 示例：关联到某个产品
      relatedImages: ["/image/cases/case_01.jpg"],
    },
    {
      id: "case-2",
      title: t("home.cases.case2.title"),
      image: "/image/cases/case_02.jpg",
      model: t("home.cases.case2.model"),
      productId: "stringa-3-6kw",
      relatedImages: ["/image/cases/case_02.jpg"],
    },
    {
      id: "case-3",
      title: t("home.cases.case3.title"),
      image: "/image/cases/case_03.jpg",
      model: t("home.cases.case3.model"),
      productId: "bat-afore-wall-5-10kwh",
      relatedImages: ["/image/cases/case_03.jpg"],
    },
    {
      id: "case-4",
      title: t("home.cases.case4.title"),
      image: "/image/cases/case_04.jpg",
      model: t("home.cases.case4.model"),
      productId: "aio-mono-lv-afore-3-6kw-af5000w-lh",
      relatedImages: ["/image/cases/case_04.jpg"],
    },
    {
      id: "case-5",
      title: t("home.cases.case5.title"),
      image: "/image/cases/case_05.jpg",
      model: t("home.cases.case5.model"),
      productId: "ibrido-trifase-3-15kw",
      relatedImages: ["/image/cases/case_05.jpg"],
    },
    {
      id: "case-6",
      title: t("home.cases.case6.title"),
      image: "/image/cases/case_06.jpg",
      model: t("home.cases.case6.model"),
      productId: "stringa-trifase-3-25kw",
      relatedImages: ["/image/cases/case_06.jpg"],
    },
  ];

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

  // Get related product based on productId
  const getRelatedProduct = (productId?: string) => {
    if (!productId) return null;
    return PRODUCTS.find(p => p.id === productId);
  };

  const relatedProduct = selectedCase ? getRelatedProduct(selectedCase.productId) : null;

  return (
    <section className="py-8 md:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            {t("home.cases.title")}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            {t("home.cases.description")}
          </p>
        </div>

        {/* Image grid - flexible columns, tight spacing, no gaps, images maintain original aspect ratio */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-0">
          {displayedCases.map((caseStudy, index) => {
            // Only animate new items when expanding (items beyond initial 8)
            const isNewItem = isExpanding && index >= initialDisplayCount;
            const delay = isNewItem ? (index - initialDisplayCount) * 80 : 0;
            
            return (
            <div
              key={caseStudy.id}
              onClick={() => handleCaseClick(caseStudy)}
              className="group relative overflow-hidden bg-slate-100 cursor-pointer w-full aspect-square"
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
                className="object-contain group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
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

        {/* Show All button */}
        {hasMoreCases && (
          <div className="text-center mt-8 md:mt-12">
            <button
              onClick={handleToggleShowAll}
              className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-brand-600 text-white text-sm md:text-base font-semibold rounded-lg hover:bg-brand-700 transition-all duration-300 transform hover:scale-105"
            >
              {showAll ? t("home.cases.showLess") : t("home.cases.showAll")}
              <svg
                className={`ml-2 w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
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
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
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
                  <p className="text-lg text-brand-600 font-semibold">
                    {t("home.cases.model")}: {selectedCase.model}
                  </p>
                )}
              </div>

              {/* Main Image */}
              <div className="relative w-full aspect-video mb-6 rounded-lg overflow-hidden bg-slate-100">
                <Image
                  src={selectedCase.image}
                  alt={selectedCase.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Related Images */}
              {selectedCase.relatedImages && selectedCase.relatedImages.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {t("home.cases.relatedImages")}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedCase.relatedImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100">
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

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                {relatedProduct && (
                  <>
                    <Link
                      href={hrefOf(relatedProduct, lang)}
                      className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-brand-600 text-white text-base font-semibold rounded-lg hover:bg-brand-700 transition-all duration-300 transform hover:scale-105"
                    >
                      {t("home.cases.viewProduct")}
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                      </svg>
                    </Link>
                    {relatedProduct.schedaKey && (
                      <Link
                        href={withLang(`/documentazione/scheda-tecnica?product=${relatedProduct.schedaKey}`, lang)}
                        className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-white text-brand-600 border-2 border-brand-600 text-base font-semibold rounded-lg hover:bg-brand-50 transition-all duration-300"
                      >
                        {t("home.cases.viewSpecs")}
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </Link>
                    )}
                  </>
                )}
                {!relatedProduct && (
                  <Link
                    href={withLang("/prodotti", lang)}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-brand-600 text-white text-base font-semibold rounded-lg hover:bg-brand-700 transition-all duration-300 transform hover:scale-105"
                  >
                    {t("home.cases.viewProducts")}
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

