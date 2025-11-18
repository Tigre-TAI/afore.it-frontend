"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { withLang } from "@/lib/lang-utils";
import { useTranslation } from "@/hooks/useTranslation";

export type ProductCardProps = {
  href: string;
  image: string;
  title: string;
  subtitle?: string;
  /** 用于链接到 scheda-tecnica 页面的键值 */
  schedaKey?: string;
  /** 为 true 时，底部条常亮；否则 hover/focus 时展开 */
  persistentBar?: boolean;
  /** 可切换样式：'tricolor' | 'orange' | 'none'（默认 'tricolor'） */
  barVariant?: "tricolor" | "orange" | "none";
};

export default function ProductCard({
  href,
  image,
  title,
  subtitle,
  schedaKey,
  persistentBar = false,
  barVariant = "tricolor",
}: ProductCardProps) {
  const params = useParams();
  const lang = (params?.lang as string) || "it";
  const { t } = useTranslation();
  
  // 切换底部条样式：默认三色条，也保留回退到橙色或隐藏的能力
  const barBgClass =
    barVariant === "none"
      ? "hidden"
      : barVariant === "orange"
      ? "bg-brand-600"
      : "italy-flag-bar"; // ★ 使用我们在 globals.css 里新增的三色条

  return (
    <div className="group relative flex flex-col h-full overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <Link
      href={href}
        className="flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
    >
      {/* 封面图 */}
      <div className="bg-slate-50 flex-shrink-0">
        <div className="w-full aspect-[4/3]">
          <Image
            src={image}
            alt={title}
            width={800}
            height={600}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* 文本区 - 使用 flex-1 让内容区域填充剩余空间 */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        {subtitle ? (
          <p className="mt-2 text-sm text-slate-600 line-clamp-2">{subtitle}</p>
        ) : (
          <div className="mt-2 h-5"></div>
        )}
        {/* 底部占位，确保按钮区域对齐 */}
        <div className="mt-auto pt-4 min-h-[44px]">
          {schedaKey ? (
            <Link
              href={withLang(`/documentazione/scheda-tecnica?product=${schedaKey}`, lang)}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                window.location.href = withLang(`/documentazione/scheda-tecnica?product=${schedaKey}`, lang);
              }}
              className="inline-block px-4 py-2 text-sm font-semibold text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
            >
              {t('prodotti.schedaTecnica')} →
            </Link>
          ) : (
            <span className="inline-block px-4 py-2 text-sm font-semibold text-slate-400">
              {t('prodotti.schedaTecnica')}
            </span>
          )}
        </div>
      </div>
      </Link>

      {/* 底部彩条：默认宽 0，hover/聚焦时铺满；persistentBar=true 时常亮 */}
      <div
        className={[
          "absolute left-0 bottom-0 h-1",
          "transition-[width] duration-300",
          persistentBar ? "w-full" : "w-0 group-hover:w-full group-focus-visible:w-full",
          barBgClass, // ★ 替换原来的 bg-brand-600
        ].join(" ")}
      />
    </div>
  );
}
