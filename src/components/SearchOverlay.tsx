"use client";

import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const currentLang = (() => {
    const segments = pathname.split("/").filter(Boolean);
    const first = segments[0];
    return ["it", "en", "es", "fr", "de"].includes(first) ? first : "it";
  })();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const value = inputRef.current?.value?.trim();
      if (value) {
        onClose();
        router.push(`/${currentLang}/prodotti?search=${encodeURIComponent(value)}`);
      }
    },
    [currentLang, onClose, router]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const overlay = (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-label={t("search.ariaLabel")}
    >
      {/* Full viewport backdrop - click to close */}
      <div
        className="absolute inset-0 bg-black/72 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />

      {/* Centered input container - flex centered, no hardcoded offsets */}
      <div
        className="relative z-10 w-full max-w-2xl bg-white p-6 sm:p-8 animate-[scaleIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close entry */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors text-sm"
          aria-label={t("search.close")}
        >
          <span>{t("search.close")}</span>
          <span className="text-lg font-semibold leading-none" aria-hidden>
            ×
          </span>
        </button>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label
            htmlFor="search-overlay-input"
            className="block text-sm text-gray-500"
          >
            {t("search.label")}
          </label>
          <div className="flex gap-2 sm:gap-3">
            <input
              ref={inputRef}
              id="search-overlay-input"
              type="search"
              name="q"
              placeholder={t("search.placeholder")}
              autoComplete="off"
              className="flex-1 px-4 py-3 sm:py-3.5 text-base border border-gray-300 rounded-lg outline-none transition-colors placeholder:text-gray-400 focus:border-[#C01C20] focus:ring-0"
            />
            <button
              type="submit"
              className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-slate-900 text-white transition-colors hover:bg-[#C01C20]"
              aria-label={t("search.submit")}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(overlay, document.body)
    : null;
}
