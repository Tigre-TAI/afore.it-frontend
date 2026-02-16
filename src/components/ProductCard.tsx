"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { getSchedaPdfUrl } from "@/data/scheda-pdf-map";

export type ProductCardProps = {
  href: string;
  image: string;
  title: string;
  subtitle?: string;
  /** 用于链接到 Scheda Tecnica PDF 的键值 */
  schedaKey?: string;
  /** 产品 id，用于构建 PDF 路径（通常与 schedaKey 相同） */
  productId?: string;
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
  productId,
  persistentBar = false,
  barVariant = "tricolor",
}: ProductCardProps) {
  const params = useParams();
  const lang = (params?.lang as string) || "it";
  const { t } = useTranslation();
  const schedaPdfUrl =
    schedaKey && getSchedaPdfUrl(schedaKey, productId || schedaKey, lang as "it" | "en" | "es" | "fr" | "de");
  
  // 切换底部条样式：默认三色条，也保留回退到橙色或隐藏的能力
  const barBgClass =
    barVariant === "none"
      ? "hidden"
      : barVariant === "orange"
      ? "bg-brand-600"
      : "italy-flag-bar"; // ★ 使用我们在 globals.css 里新增的三色条

  return (
    <div className="group relative flex flex-col h-full overflow-hidden">
      {/* 可点击区域：图片 + 标题 — 进入产品详情 */}
      <Link
        href={href}
        className="flex flex-col flex-1 min-h-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#C01C20]/50"
      >
        <div className="flex-shrink-0">
          <div className="w-full aspect-[4/3]">
            <Image
              src={image}
              alt={title}
              width={800}
              height={600}
              className="w-full h-full object-contain product-image-shadow"
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </div>
        <div className="flex flex-col flex-1 p-5 pt-4">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          {subtitle ? (
            <p className="mt-2 text-sm text-slate-600 line-clamp-2">{subtitle}</p>
          ) : (
            <div className="mt-2 h-5" />
          )}
        </div>
      </Link>

      {/* Scheda Tecnica — 在 Link 外部，避免嵌套链接导致点击无效 */}
      <div className="flex-shrink-0 p-5 pt-0">
        {schedaPdfUrl ? (
          <Button
            href={schedaPdfUrl}
            variant="secondary"
            download
            target="_blank"
            rel="noopener noreferrer"
            trailingChevron={false}
          >
            {t('prodotti.schedaTecnica')}
          </Button>
        ) : schedaKey ? (
          <span className="inline-block px-4 py-2 text-sm font-semibold text-slate-400">
            {t('prodotti.schedaTecnica')}
          </span>
        ) : null}
      </div>

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
