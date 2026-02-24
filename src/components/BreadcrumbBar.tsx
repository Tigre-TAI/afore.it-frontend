"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBreadcrumb } from "@/components/BreadcrumbContext";
import { breadcrumbNameMap } from "@/data/breadcrumbs";
import { getLangFromPath, withLang } from "@/lib/lang-utils";

type Crumb = { href?: string; label: string };

function humanize(segment: string) {
  const s = segment.replace(/^\//, "").replace(/-/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function dedupe(items: Crumb[]): Crumb[] {
  const out: Crumb[] = [];
  const seen = new Set<string>();
  for (const c of items) {
    if (!c) continue;
    const key = `${c.label}::${c.href ?? ""}`;
    if (seen.has(key)) continue;
    const last = out[out.length - 1];
    if (last && last.label === c.label && last.href === c.href) continue;
    seen.add(key);
    out.push(c);
  }
  return out;
}

/** 显示在 footer 上方的全局 breadcrumbs 条 */
export default function BreadcrumbBar() {
  const pathname = usePathname();
  const safePathname = pathname ?? "";
  const { items: overrideItems } = useBreadcrumb();
  const lang = getLangFromPath(safePathname);

  const baseColor = "text-slate-600";
  const activeColor = "text-slate-900";

  let list: Crumb[];

  if (overrideItems && overrideItems.length > 0) {
    list = dedupe(
      overrideItems.map((item) => ({
        ...item,
        href: item.href ? withLang(item.href, lang) : undefined,
      }))
    );
  } else {
    let parts = safePathname === "/" ? [] : safePathname.split("/").filter(Boolean);
    if (parts.length > 0 && ["it", "en", "es", "fr", "de"].includes(parts[0])) {
      parts = parts.slice(1);
    }
    const idxProdotti = parts.indexOf("prodotti");
    const idxSoluzioni = parts.indexOf("soluzioni");
    if (idxProdotti !== -1 && idxSoluzioni !== -1 && idxSoluzioni < idxProdotti) {
      parts = parts.slice(idxProdotti);
    }
    const paths: string[] = ["/", ...parts.map((_, i) => "/" + parts.slice(0, i + 1).join("/"))];
    list = dedupe(
      paths.map((p, i) => {
        const isLast = i === paths.length - 1;
        const mapped = (breadcrumbNameMap as Record<string, string | undefined>)?.[p];
        const label = mapped ?? (p === "/" ? "Home" : humanize(p));
        return { label, href: isLast ? undefined : withLang(p, lang) };
      })
    );
  }

  if (list.length <= 1) return null;

  return (
    <div className="border-t border-slate-200 bg-slate-50/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav aria-label="Breadcrumb" className={`text-sm ${baseColor}`}>
          <ol className="flex items-center gap-2 flex-wrap">
            {list.map((c, idx) => {
              const isLast = idx === list.length - 1;
              return (
                <li key={`${c.href ?? c.label}-${idx}`} className="flex items-center gap-2">
                  {isLast || !c.href ? (
                    <span className={`font-medium ${activeColor}`}>{c.label}</span>
                  ) : (
                    <Link href={c.href} className="hover:text-brand-600 transition-colors">
                      {c.label}
                    </Link>
                  )}
                  {!isLast && <span className="opacity-50">›</span>}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
