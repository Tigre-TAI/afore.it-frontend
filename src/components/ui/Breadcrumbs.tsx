// src/components/ui/Breadcrumbs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { breadcrumbNameMap } from "@/data/breadcrumbs";
import { getLangFromPath, withLang } from "@/lib/lang-utils";

type Crumb = { href?: string; label: string };

type BreadcrumbProps = {
  theme?: "light" | "dark";
  /** 显式传入时只按此渲染，不做自动推断与拼接 */
  items?: Crumb[];
};

/** 人性化处理：去首斜杠、短横线转空格、首字母大写 */
function humanize(segment: string) {
  const s = segment.replace(/^\//, "").replace(/-/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** 去重：移除相邻重复项与完全重复项（同 label+href） */
function dedupe(items: Crumb[]): Crumb[] {
  const out: Crumb[] = [];
  const seen = new Set<string>();
  for (const c of items) {
    if (!c) continue;
    const key = `${c.label}::${c.href ?? ""}`;
    if (seen.has(key)) continue; // 完全重复
    const last = out[out.length - 1];
    if (last && last.label === c.label && last.href === c.href) continue; // 相邻重复
    seen.add(key);
    out.push(c);
  }
  return out;
}

export default function Breadcrumbs({ theme = "light", items }: BreadcrumbProps) {
  const pathname = usePathname();
  const lang = getLangFromPath(pathname);

  const baseColor = theme === "dark" ? "text-white/80" : "text-black/80";
  const activeColor = theme === "dark" ? "text-white" : "text-black";

  /** 1) 显式模式 —— 建议详情页使用 */
  if (items && items.length > 0) {
    const list = dedupe(items.map(item => ({
      ...item,
      href: item.href ? withLang(item.href, lang) : undefined,
    })));
    return (
      <nav aria-label="Breadcrumb" className={`text-sm ${baseColor}`}>
        <ol className="flex items-center gap-2">
          {list.map((c, idx) => {
            const isLast = idx === list.length - 1;
            return (
              <li key={`${c.href ?? c.label}-${idx}`} className="flex items-center gap-2">
                {isLast || !c.href ? (
                  <span className={`font-semibold ${activeColor}`}>{c.label}</span>
                ) : (
                  <Link href={c.href} className={`hover:text-brand-400 transition-colors ${baseColor}`}>
                    {c.label}
                  </Link>
                )}
                {!isLast && <span className="opacity-60">›</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  /** 2) 自动模式 —— 通用页备用 */
  // 移除语言段
  let parts = pathname === "/" ? [] : pathname.split("/").filter(Boolean);
  if (parts.length > 0 && ["it", "en", "es"].includes(parts[0])) {
    parts = parts.slice(1);
  }

  // ★ 关键规则：若路径中同时包含 soluzioni 与 prodotti，则从 prodotti 起截断
  // 例如 /soluzioni/xxx/prodotti/inverter/abc  => 仅保留 ["prodotti","inverter","abc"]
  const idxProdotti = parts.indexOf("prodotti");
  const idxSoluzioni = parts.indexOf("soluzioni");
  if (idxProdotti !== -1 && idxSoluzioni !== -1 && idxSoluzioni < idxProdotti) {
    parts = parts.slice(idxProdotti);
  }

  // 构造逐级路径：["/","/a","/a/b","/a/b/c"...]
  const paths: string[] = ["/", ...parts.map((_, i) => "/" + parts.slice(0, i + 1).join("/"))];

  // 映射为 Crumb，允许 breadcrumbNameMap 覆盖 label
  const autoItems: Crumb[] = paths.map((p, i) => {
    const isLast = i === paths.length - 1;
    const mapped = (breadcrumbNameMap as Record<string, string | undefined>)?.[p];
    const label = mapped ?? (p === "/" ? "Home" : humanize(p));
    return { label, href: isLast ? undefined : withLang(p, lang) };
  });

  const list = dedupe(autoItems);

  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${baseColor}`}>
      <ol className="flex items-center gap-2">
        {list.map((c, idx) => {
          const isLast = idx === list.length - 1;
          return (
            <li key={`${c.href ?? c.label}-${idx}`} className="flex items-center gap-2">
              {isLast || !c.href ? (
                <span className={`font-semibold ${activeColor}`}>{c.label}</span>
              ) : (
                <Link href={c.href} className={`hover:text-brand-400 transition-colors ${baseColor}`}>
                  {c.label}
                </Link>
              )}
              {!isLast && <span className="opacity-60">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
