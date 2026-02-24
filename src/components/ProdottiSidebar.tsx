"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { GROUPS } from "@/data/prodotti-nav-data";

/** Quando non passato, i link dei gruppi sono anchor sulla stessa pagina (#group-X). Quando passato (es. /it/prodotti), linkano alla pagina prodotti. */
type ProdottiSidebarProps = { linkBase?: string };

export default function ProdottiSidebar({ linkBase }: ProdottiSidebarProps = {}) {
  const params = useParams();
  const pathname = usePathname();
  const lang = (params?.lang as string) || "it";
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true });

  const isResidenziale = pathname?.includes("/sistema-residenziale") ?? false;
  const isCommerciale = pathname?.includes("/sistema-commerciale") ?? false;

  const groupHref = (gi: number) => (linkBase ? `${linkBase}#group-${gi}` : `#group-${gi}`);
  const lineHref = (gi: number, lineIndex: number) =>
    linkBase ? `${linkBase}#group-${gi}-line-${lineIndex}` : `#group-${gi}-line-${lineIndex}`;

  return (
    <aside className="lg:w-44 xl:w-52 shrink-0 mb-8 lg:mb-0">
      <nav className="sticky top-24 space-y-0.5">
        {GROUPS.map((g, gi) => {
          const isExpanded = expanded[gi] ?? false;
          const hasSub = "subItems" in g && g.subItems && g.subItems.length > 0;

          return (
            <div key={gi}>
              <div className="flex items-center gap-0.5">
                {hasSub && (
                  <button
                    type="button"
                    onClick={() => setExpanded((s) => ({ ...s, [gi]: !s[gi] }))}
                    className="p-0.5 -ml-0.5 text-slate-500 hover:text-slate-700 transition-colors"
                    aria-expanded={isExpanded}
                  >
                    <svg
                      className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
                {linkBase ? (
                  <Link
                    href={groupHref(gi)}
                    className="block text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 py-1.5 border-l-2 border-transparent hover:border-slate-300 pl-2 -ml-px transition-colors flex-1"
                  >
                    {g.bigTitle}
                  </Link>
                ) : (
                  <a
                    href={groupHref(gi)}
                    className="block text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 py-1.5 border-l-2 border-transparent hover:border-slate-300 pl-2 -ml-px transition-colors flex-1"
                  >
                    {g.bigTitle}
                  </a>
                )}
              </div>
              {hasSub && isExpanded && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-200 pl-3">
                  {g.subItems!.map((sub, si) =>
                    linkBase ? (
                      <Link
                        key={si}
                        href={lineHref(gi, sub.lineIndex)}
                        className="block text-[11px] sm:text-xs font-medium text-slate-500 hover:text-slate-800 py-1 transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ) : (
                      <a
                        key={si}
                        href={lineHref(gi, sub.lineIndex)}
                        className="block text-[11px] sm:text-xs font-medium text-slate-500 hover:text-slate-800 py-1 transition-colors"
                      >
                        {sub.label}
                      </a>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div className="pt-4 mt-4 border-t border-slate-200 space-y-0.5">
          <Link
            href={`/${lang}/prodotti/sistema-residenziale`}
            className={`block text-xs sm:text-sm py-1.5 border-l-2 pl-2 -ml-px transition-colors ${
              isResidenziale
                ? "font-semibold text-slate-900 border-slate-400"
                : "font-medium text-slate-600 hover:text-slate-900 border-transparent hover:border-slate-300"
            }`}
          >
            Sistema Residenziale
          </Link>
          <Link
            href={`/${lang}/prodotti/sistema-commerciale`}
            className={`block text-xs sm:text-sm py-1.5 border-l-2 pl-2 -ml-px transition-colors ${
              isCommerciale
                ? "font-semibold text-slate-900 border-slate-400"
                : "font-medium text-slate-600 hover:text-slate-900 border-transparent hover:border-slate-300"
            }`}
          >
            Sistema Commerciale
          </Link>
        </div>
      </nav>
    </aside>
  );
}
