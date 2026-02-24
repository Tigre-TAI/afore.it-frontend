"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import SearchOverlay from "@/components/SearchOverlay";

const TOPBAR_LINK_CLASS =
  "text-xs text-white/80 hover:text-white transition-colors px-2 py-1 rounded";

const SCROLL_THRESHOLD = 10;

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const [atTop, setAtTop] = useState(true);
  const langButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setAtTop(window.scrollY <= SCROLL_THRESHOLD);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    if (langDropdownOpen && langButtonRef.current) {
      const rect = langButtonRef.current.getBoundingClientRect();
      setDropdownPosition({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
  }, [langDropdownOpen]);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".topbar-language-switcher") && !target.closest(".language-dropdown-panel")) {
      setLangDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!langDropdownOpen) return;
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [langDropdownOpen, handleClickOutside]);

  const safePathname = pathname ?? "";
  const { lang: currentLang, restPath } = useMemo(() => {
    const segments = safePathname.split("/").filter(Boolean);
    const firstSegment = segments[0];
    if (["it", "en", "es", "fr", "de"].includes(firstSegment)) {
      return {
        lang: firstSegment,
        restPath: segments.length > 1 ? "/" + segments.slice(1).join("/") : "",
      };
    }
    return { lang: "it", restPath: safePathname === "/" ? "" : safePathname };
  }, [safePathname]);

  const navLink = useCallback(
    (path: string) => {
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      return `/${currentLang}${cleanPath === "/" ? "" : cleanPath}`;
    },
    [currentLang]
  );

  const languages = [
    { code: "it", label: "IT" },
    { code: "en", label: "EN" },
    { code: "es", label: "ES" },
    { code: "fr", label: "FR" },
    { code: "de", label: "DE" },
  ];
  const currentLangLabel = languages.find((l) => l.code === currentLang)?.label ?? "IT";

  return (
    <div
      className={`relative z-50 hidden md:flex w-full shrink-0 items-center overflow-hidden transition-[max-height,opacity] duration-200 ease-out ${
        atTop ? "max-h-8 opacity-100 bg-gradient-to-b from-black/20 to-transparent" : "max-h-0 opacity-0 pointer-events-none"
      }`}
    >
      <div className="container w-full h-8 flex flex-wrap items-center justify-end gap-x-3 sm:gap-x-4">
        <Link
          href={navLink("/comunicati-stampa")}
          className={TOPBAR_LINK_CLASS}
        >
          {t("topbar.comunicatiStampa")}
        </Link>
        <Link href={navLink("/video")} className={TOPBAR_LINK_CLASS}>
          {t("topbar.video")}
        </Link>
        <Link href={navLink("/webinar")} className={TOPBAR_LINK_CLASS}>
          {t("topbar.webinar")}
        </Link>
        <Link href={navLink("/eventi")} className={TOPBAR_LINK_CLASS}>
          {t("topbar.eventi")}
        </Link>
        <Link href={navLink("/contatti")} className={TOPBAR_LINK_CLASS}>
          {t("topbar.contatti")}
        </Link>

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className={`${TOPBAR_LINK_CLASS} flex items-center gap-1`}
          aria-label={t("topbar.search")}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

        <div className="relative topbar-language-switcher">
          <button
            ref={langButtonRef}
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className={`${TOPBAR_LINK_CLASS} flex items-center gap-0.5`}
          >
            <span>{currentLangLabel}</span>
            <svg
              className={`w-3 h-3 transition-transform ${langDropdownOpen ? "rotate-180" : ""}`}
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
                  className="language-dropdown-panel fixed min-w-[72px] rounded-md border border-white/20 bg-slate-800 z-[200]"
                  style={{ top: dropdownPosition.top, right: dropdownPosition.right }}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLangDropdownOpen(false);
                        router.push(`/${lang.code}${restPath}`, { scroll: false });
                      }}
                      className={`block w-full text-left px-3 py-1.5 text-xs font-medium transition-colors first:rounded-t-md last:rounded-b-md ${
                        lang.code === currentLang
                          ? "text-white bg-white/20"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
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
      </div>
    </div>
  );
}
