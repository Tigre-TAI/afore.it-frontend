"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, startTransition, useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

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
    
    // Initial check
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Click outside handler - memoized to reduce re-renders
  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.language-switcher-container')) {
      setLangDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!langDropdownOpen) return;
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langDropdownOpen, handleClickOutside]);

  // Memoize language and path extraction
  const { lang: currentLang, restPath } = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const firstSegment = segments[0];
    if (["it", "en", "es", "fr", "de"].includes(firstSegment)) {
      const remainingSegments = segments.slice(1);
      return {
        lang: firstSegment,
        restPath: remainingSegments.length > 0 ? "/" + remainingSegments.join("/") : "",
      };
    }
    return { lang: "it", restPath: pathname === "/" ? "" : pathname };
  }, [pathname]);

  // Optimized switch language function
  const switchLanguage = useCallback((newLang: string) => {
    if (newLang === currentLang) return;
    const newPath = `/${newLang}${restPath}`;
    startTransition(() => {
      router.push(newPath, { scroll: false });
    });
  }, [currentLang, restPath, router]);

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
    const isActive = matcher(pathname);
    if (isActive) {
      return solid ? "text-white bg-slate-800 px-3 py-1 rounded font-extrabold" : "text-slate-900 bg-white/90 px-3 py-1 rounded font-extrabold";
    }
    if (solid) {
      return "text-slate-800 hover:text-slate-900 hover:font-extrabold transition-colors";
    } else {
      return "text-white hover:text-white hover:font-extrabold transition-colors";
    }
  }, [pathname, solid]);

  // Language switcher component - memoized
  const LanguageSwitcher = useMemo(() => {
    const languages = [
      { code: 'it', label: 'IT' },
      { code: 'en', label: 'EN' },
      { code: 'es', label: 'ES' },
      { code: 'fr', label: 'FR' },
      { code: 'de', label: 'DE' },
    ];

    const currentLangLabel = languages.find(l => l.code === currentLang)?.label || 'IT';

    return (
      <div className="relative flex-shrink-0 language-switcher-container">
        <button
          onClick={() => setLangDropdownOpen(!langDropdownOpen)}
          className={`px-2 py-1 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1 ${
            solid
              ? "text-slate-800 hover:text-slate-900"
              : "text-white hover:text-white/90"
          }`}
        >
          <span>{currentLangLabel}</span>
          <svg
            className={`w-3 h-3 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {langDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setLangDropdownOpen(false)}
            />
            <div
              className={`absolute right-0 top-full mt-2 min-w-[80px] rounded-lg border shadow-lg z-20 ${
                solid
                  ? "bg-white border-slate-200"
                  : "bg-black/95 backdrop-blur-md border-white/20"
              }`}
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    switchLanguage(lang.code);
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors first:rounded-t-lg last:rounded-b-lg ${
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
          </>
        )}
      </div>
    );
  }, [currentLang, solid, langDropdownOpen, switchLanguage]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 transition-all duration-300">
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            solid
              ? "bg-white/95 backdrop-blur-md shadow-sm"
              : "bg-gradient-to-b from-black/60 via-black/30 to-transparent backdrop-blur-[2px]"
          }`}
        />
        <div
          className={`absolute bottom-0 left-0 right-0 h-px transition-colors ${
            solid ? "bg-black/10" : "bg-white/25"
          }`}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        <Link href={navLink("/")} className="flex items-center gap-2 flex-shrink-0">
          <Image
            src={solid ? "/logos/logo_afore_dark.png" : "/logos/logo_afore_light.png"}
            alt="Afore Logo"
            width={132}
            height={40}
            priority
            className="h-8 sm:h-10 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-4 lg:gap-8 text-sm tracking-wide">
          <Link 
            className={navLinkClass((p) => p === `/${currentLang}` || p === `/${currentLang}/`)} 
            href={navLink("/")}
          >
            HOME
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
          
          {LanguageSwitcher}
        </nav>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          className={`md:hidden text-2xl transition-colors flex-shrink-0 ml-2 ${
            solid ? "text-slate-800" : "text-white"
          }`}
        >
          ☰
        </button>
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className={`fixed top-16 left-0 right-0 bottom-0 md:hidden border-t overflow-y-auto z-50 ${
              solid ? "bg-white text-slate-800" : "bg-black/95 backdrop-blur-md text-white"
            }`}
          >
            <nav className="flex flex-col px-4 sm:px-6 py-4 gap-3 text-base font-medium">
              <Link 
                href={navLink("/")} 
                onClick={() => setMobileOpen(false)}
                className="py-2 px-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                HOME
              </Link>
              <Link 
                href={navLink("/prodotti")} 
                onClick={() => setMobileOpen(false)}
                className="py-2 px-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {t('nav.prodotti')}
              </Link>
              <Link 
                href={navLink("/documentazione")} 
                onClick={() => setMobileOpen(false)}
                className="py-2 px-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {t('nav.documentazione')}
              </Link>
              <Link 
                href={navLink("/garanzia")} 
                onClick={() => setMobileOpen(false)}
                className="py-2 px-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {t('nav.garanzia')}
              </Link>
              <div className="pt-4 mt-2 border-t border-white/20">
                <p className="text-xs font-semibold uppercase tracking-wider mb-3 opacity-70">
                  {t('common.language') || 'Language'}
                </p>
                {LanguageSwitcher}
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}





