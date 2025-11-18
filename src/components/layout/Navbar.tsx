"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 从路径中提取当前语言和剩余路径
  const getLangAndPath = () => {
    const segments = pathname.split("/").filter(Boolean);
    const firstSegment = segments[0];
    if (["it", "en", "es"].includes(firstSegment)) {
      const remainingSegments = segments.slice(1);
      return {
        lang: firstSegment,
        restPath: remainingSegments.length > 0 ? "/" + remainingSegments.join("/") : "",
      };
    }
    // 如果路径不包含语言段，默认为 it
    return { lang: "it", restPath: pathname === "/" ? "" : pathname };
  };

  const { lang: currentLang, restPath } = getLangAndPath();

  // 切换语言的函数
  const switchLanguage = (newLang: string) => {
    // 如果已经是当前语言，不执行切换
    if (newLang === currentLang) return;
    
    // 构建新路径：语言 + 剩余路径
    const newPath = `/${newLang}${restPath}`;
    // 使用 scroll: false 保持当前滚动位置
    router.push(newPath, { scroll: false });
  };

  // 生成带语言的导航链接
  const navLink = (path: string) => {
    // 如果路径已经是绝对路径且包含语言，直接返回
    if (path.startsWith("/") && ["/it", "/en", "/es"].some(l => path.startsWith(l + "/") || path === l)) {
      return path;
    }
    // 否则添加当前语言前缀
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `/${currentLang}${cleanPath === "/" ? "" : cleanPath}`;
  };

  // 导航链接样式：当前路径根据背景色反色显示，否则根据透明/实底切换颜色
  const navLinkClass = (matcher: (p: string) => boolean) => {
    const isActive = matcher(pathname);
    // 选中状态：背景深（solid）时文字浅色，背景浅（透明）时文字深色
    if (isActive) {
      return solid ? "text-white bg-slate-800 px-3 py-1 rounded font-extrabold" : "text-slate-900 bg-white/90 px-3 py-1 rounded font-extrabold";
    }
    // 未选中状态：根据背景色设置文字颜色和 hover 效果
    if (solid) {
      // 白色背景：深色文字，hover 时更深
      return "text-slate-800 hover:text-slate-900 hover:font-extrabold transition-colors";
    } else {
      // 透明背景：白色文字，hover 时更亮
      return "text-white hover:text-white hover:font-extrabold transition-colors";
    }
  };

  // 语言切换器 - 三个按钮放在一起
  const LanguageSwitcher = () => (
    <div className="flex items-center gap-1 border rounded-lg overflow-hidden" style={{ borderColor: solid ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.3)' }}>
      <button
        onClick={() => switchLanguage("it")}
        className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
          currentLang === "it"
            ? solid
              ? "text-white bg-slate-800"
              : "text-slate-900 bg-white"
            : solid
            ? "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
            : "text-white/70 hover:text-white hover:bg-white/10"
        }`}
      >
        IT
      </button>
      <button
        onClick={() => switchLanguage("en")}
        className={`px-3 py-1.5 text-xs font-semibold transition-colors border-l ${
          currentLang === "en"
            ? solid
              ? "text-white bg-slate-800 border-slate-600"
              : "text-slate-900 bg-white border-slate-300"
            : solid
            ? "text-slate-600 hover:text-slate-800 hover:bg-slate-100 border-slate-200"
            : "text-white/70 hover:text-white hover:bg-white/10 border-white/20"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage("es")}
        className={`px-3 py-1.5 text-xs font-semibold transition-colors border-l ${
          currentLang === "es"
            ? solid
              ? "text-white bg-slate-800 border-slate-600"
              : "text-slate-900 bg-white border-slate-300"
            : solid
            ? "text-slate-600 hover:text-slate-800 hover:bg-slate-100 border-slate-200"
            : "text-white/70 hover:text-white hover:bg-white/10 border-white/20"
        }`}
      >
        ES
      </button>
    </div>
  );

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 transition-all duration-300">
      {/* 背景层 */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            solid
              ? "bg-white/95 backdrop-blur-md shadow-sm"
              : "bg-gradient-to-b from-black/60 via-black/30 to-transparent backdrop-blur-[2px]"
          }`}
        />
        {/* 底边线 */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-px transition-colors ${
            solid ? "bg-black/10" : "bg-white/25"
          }`}
        />
      </div>

      {/* 内容层 */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href={navLink("/")} className="flex items-center gap-2">
          <Image
            src={solid ? "/logos/logo_afore_dark.png" : "/logos/logo_afore_light.png"}
            alt="Afore Logo"
            width={132}
            height={40}
            priority
            className="h-10 w-auto"
          />
        </Link>

        {/* 桌面导航 */}
        <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide">
          <Link 
            className={navLinkClass((p) => p === `/${currentLang}` || p === `/${currentLang}/`)} 
            href={navLink("/")}
          >
            {t('nav.home')}
          </Link>
          <Link
            className={navLinkClass((p) => p.includes("/prodotti"))}
            href={navLink("/prodotti")}
          >
            {t('nav.prodotti')}
          </Link>
          <Link
            className={navLinkClass((p) => p.includes("/documentazione"))}
            href={navLink("/documentazione")}
          >
            {t('nav.documentazione')}
          </Link>
          <Link
            className={navLinkClass((p) => p.includes("/garanzia"))}
            href={navLink("/garanzia")}
          >
            {t('nav.garanzia')}
          </Link>
          
          {/* 语言切换器 */}
          <LanguageSwitcher />
        </nav>

        {/* 移动端菜单按钮 */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          className={`md:hidden text-2xl transition-colors ${
            solid ? "text-slate-800" : "text-white"
          }`}
        >
          ☰
        </button>
      </div>

      {/* 移动端菜单 */}
      {mobileOpen && (
        <div
          className={`md:hidden border-t ${
            solid ? "bg-white text-slate-800" : "bg-black/60 text-white"
          }`}
        >
          <nav className="flex flex-col px-6 py-4 gap-3 text-base font-medium">
            <Link href={navLink("/")} onClick={() => setMobileOpen(false)}>
              {t('nav.home')}
            </Link>
            <Link href={navLink("/prodotti")} onClick={() => setMobileOpen(false)}>
              {t('nav.prodotti')}
            </Link>
            <Link href={navLink("/documentazione")} onClick={() => setMobileOpen(false)}>
              {t('nav.documentazione')}
            </Link>
            <Link href={navLink("/garanzia")} onClick={() => setMobileOpen(false)}>
              {t('nav.garanzia')}
            </Link>
            <div className="pt-2 border-t border-white/20">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
