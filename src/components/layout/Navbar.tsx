"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import SearchOverlay from "@/components/SearchOverlay";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [langDropdownPosition, setLangDropdownPosition] = useState({ top: 0, right: 0 });
  const langButtonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (langDropdownOpen && langButtonRef.current) {
      const rect = langButtonRef.current.getBoundingClientRect();
      setLangDropdownPosition({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
  }, [langDropdownOpen]);

  // Debounced scroll handler to reduce INP
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setSolid(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Click outside handler - exclude both trigger container AND portaled dropdown panel
  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.language-switcher-container') && !target.closest('.language-dropdown-panel')) {
      setLangDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!langDropdownOpen) return;
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langDropdownOpen, handleClickOutside]);

  // Memoize language and path extraction (pathname can be null during SSG/hydration)
  const safePathname = pathname ?? "";
  const { lang: currentLang, restPath } = useMemo(() => {
    const segments = safePathname.split("/").filter(Boolean);
    const firstSegment = segments[0];
    if (["it", "en", "es", "fr", "de"].includes(firstSegment)) {
      const remainingSegments = segments.slice(1);
      return {
        lang: firstSegment,
        restPath: remainingSegments.length > 0 ? "/" + remainingSegments.join("/") : "",
      };
    }
    return { lang: "it", restPath: safePathname === "/" ? "" : safePathname };
  }, [safePathname]);

  // Memoize nav link generation
  const navLink = useCallback((path: string) => {
    if (path.startsWith("/") && ["/it", "/en", "/es", "/fr", "/de"].some(l => path.startsWith(l + "/") || path === l)) {
      return path;
    }
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `/${currentLang}${cleanPath === "/" ? "" : cleanPath}`;
  }, [currentLang]);

  // Memoize nav link class calculation
  const navLinkClass = useCallback((matcher: (p: string) => boolean) => {
    const isActive = matcher(safePathname);
    const defaultText = solid ? "text-slate-800" : "text-white";
    const baseClasses = "px-2.5 py-1.5 rounded transition-colors hover:text-[#C01C20]";
    if (isActive) {
      return `${defaultText} font-extrabold ${baseClasses}`;
    }
    return `${defaultText} ${baseClasses}`;
  }, [safePathname, solid]);

  // Language switcher component - memoized
  const languages = useMemo(
    () => [
      { code: "it", label: "IT" },
      { code: "en", label: "EN" },
      { code: "es", label: "ES" },
      { code: "fr", label: "FR" },
      { code: "de", label: "DE" },
    ],
    []
  );
  const currentLangLabel = languages.find((l) => l.code === currentLang)?.label || "IT";

  const LanguageSwitcher = (
    <div className="relative flex-shrink-0 language-switcher-container">
      <button
        ref={langButtonRef}
        onClick={() => setLangDropdownOpen(!langDropdownOpen)}
        className={`px-2 py-1 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1 ${
          solid ? "text-slate-800 hover:text-slate-900" : "text-white hover:text-white/90"
        }`}
      >
        <span>{currentLangLabel}</span>
        <svg
          className={`w-3 h-3 transition-transform ${langDropdownOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {langDropdownOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[199]"
              onClick={() => setLangDropdownOpen(false)}
              aria-hidden
            />
            <div
              className={`language-dropdown-panel fixed min-w-[80px] rounded-md border z-[200] ${
                solid
                  ? "bg-white border-slate-200"
                  : "bg-black/95 backdrop-blur-md border-white/20"
              }`}
              style={{
                top: langDropdownPosition.top,
                right: langDropdownPosition.right,
              }}
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLangDropdownOpen(false);
                    router.push(`/${lang.code}${restPath}`, { scroll: false });
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm font-semibold transition-colors first:rounded-t-md last:rounded-b-md ${
                    lang.code === currentLang
                      ? solid
                        ? "text-slate-900 bg-slate-100"
                        : "text-white bg-white/20"
                      : solid
                      ? "text-slate-700 hover:bg-slate-50"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </>,
          document.body
        )}
    </div>
  );

  return (
    <header className="relative z-40 h-14 transition-all duration-200">
      <div
        className={`absolute inset-0 transition-all duration-200 ${
          solid
            ? "bg-white border-b border-slate-100"
            : "bg-black/20"
        }`}
      />

      <div className="container relative z-10 h-full flex items-center justify-between">
        <div className="flex items-end flex-shrink-0">
          <Link href={navLink("/")} className="flex items-end">
            <Image
              src={solid ? "/logos/logo_afore_dark.png" : "/logos/logo_afore_light.png"}
              alt="Afore Logo"
              width={132}
              height={40}
              priority
              className="h-7 sm:h-8 w-auto"
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm">
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
            className={navLinkClass((p) => p.includes("/assistenza"))}
            href={navLink("/assistenza")}
          >
            {t('nav.garanzia')}
          </Link>
        </nav>

        {/* Mobile: Search, Lang, Hamburger - right aligned */}
        <div className="md:hidden ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label={t("topbar.search")}
            className={`p-1.5 rounded transition-colors ${
              solid ? "text-slate-800 hover:text-slate-900" : "text-white hover:text-white/90"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          {LanguageSwitcher}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className={`p-1.5 text-2xl transition-colors ${
              solid ? "text-slate-800" : "text-white"
            }`}
          >
            ☰
          </button>
        </div>
      </div>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {mobileOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <div
              className="fixed top-14 left-0 right-0 bottom-0 bg-black/40 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <div
              className="fixed top-14 left-0 right-0 bottom-0 md:hidden border-t border-slate-100 overflow-y-auto z-40 bg-white"
            >
              <nav className="flex flex-col px-4 sm:px-6 py-6 gap-0.5 text-sm">
                {/* Nav links - on top */}
                <Link
                  href={navLink("/")}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 px-3 block text-slate-600 hover:text-slate-900 transition-colors font-medium"
                >
                  {t("nav.home")}
                </Link>
                <Link
                  href={navLink("/prodotti")}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 px-3 block text-slate-600 hover:text-slate-900 transition-colors font-medium"
                >
                  {t("nav.prodotti")}
                </Link>
                <Link
                  href={navLink("/documentazione")}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 px-3 block text-slate-600 hover:text-slate-900 transition-colors font-medium"
                >
                  {t("nav.documentazione")}
                </Link>
                <Link
                  href={navLink("/assistenza")}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 px-3 block text-slate-600 hover:text-slate-900 transition-colors font-medium"
                >
                  {t("nav.garanzia")}
                </Link>
                {/* Topbar-style links - on bottom */}
                <div className="pt-4 mt-2 border-t border-slate-100">
                  <Link
                    href={navLink("/documentazione/archivio")}
                    onClick={() => setMobileOpen(false)}
                    className="py-3 px-3 block text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    {t("topbar.comunicatiStampa")}
                  </Link>
                  <Link
                    href={navLink("/eventi")}
                    onClick={() => setMobileOpen(false)}
                    className="py-3 px-3 block text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    {t("topbar.video")}
                  </Link>
                  <Link
                    href={navLink("/contatti")}
                    onClick={() => setMobileOpen(false)}
                    className="py-3 px-3 block text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    {t("topbar.contatti")}
                  </Link>
                  <Link
                    href={navLink("/eventi")}
                    onClick={() => setMobileOpen(false)}
                    className="py-3 px-3 block text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    {t("topbar.webinar")}
                  </Link>
                  <Link
                    href={navLink("/eventi")}
                    onClick={() => setMobileOpen(false)}
                    className="py-3 px-3 block text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    {t("topbar.eventi")}
                  </Link>
                </div>
              </nav>
            </div>
          </>,
          document.body
        )}
    </header>
  );
}

