"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

export type SplitCompareSectionProps = {
  title: string;
  description: string;
  leftImageSrc: string;
  rightImageSrc: string;
  leftAlt?: string;
  rightAlt?: string;
  /** Etichette opzionali sul layout mobile impilate (se assenti, nessun badge) */
  leftCaption?: string;
  rightCaption?: string;
  className?: string;
};

/**
 * Sezione confronto immagini:
 * - Mobile: due immagini in colonna (su / giù) con separatore orizzontale
 * - Desktop (md+): before/after con slider verticale trascinabile e maniglia circolare
 */
export default function SplitCompareSection({
  title,
  description,
  leftImageSrc,
  rightImageSrc,
  leftAlt,
  rightAlt,
  leftCaption,
  rightCaption,
  className = "",
}: SplitCompareSectionProps) {
  const headingId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const activePointerId = useRef<number | null>(null);
  const [posPct, setPosPct] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - r.left, 0), r.width);
    const pct = r.width > 0 ? (x / r.width) * 100 : 50;
    setPosPct(pct);
  }, []);

  const endDrag = useCallback(() => {
    const el = containerRef.current;
    const pid = activePointerId.current;
    if (el && pid !== null) {
      try {
        el.releasePointerCapture(pid);
      } catch {
        /* già rilasciato o non catturato */
      }
    }
    draggingRef.current = false;
    activePointerId.current = null;
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return;
      setFromClientX(e.clientX);
    };
    const onUp = (e: PointerEvent) => {
      if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return;
      endDrag();
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [endDrag, setFromClientX]);

  const onTrackPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== undefined && e.button !== 0) return;
    draggingRef.current = true;
    activePointerId.current = e.pointerId;
    setIsDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    setFromClientX(e.clientX);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosPct((p) => Math.max(0, p - 2));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosPct((p) => Math.min(100, p + 2));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPosPct(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPosPct(100);
    }
  };

  const clipRight = `${100 - posPct}%`;
  const sizes =
    "(max-width: 768px) 100vw, (max-width: 1280px) min(100vw, 1280px), 1280px";

  return (
    <section
      className={`scroll-mt-24 border-t border-slate-200/90 py-12 sm:py-16 lg:py-20 ${className}`.trim()}
      aria-labelledby={headingId}
    >
      <header className="mb-8 sm:mb-10">
        <h2
          id={headingId}
          className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900"
        >
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
          {description}
        </p>
      </header>

      {/* Mobile: impilate (su / giù) */}
      <div className="md:hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <figure className="relative aspect-[4/3] w-full bg-slate-100">
          <Image
            src={leftImageSrc}
            alt={leftAlt ?? `${title} — ${leftCaption}`}
            fill
            className="object-cover"
            sizes="100vw"
            unoptimized
          />
          {leftCaption ? (
            <figcaption className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {leftCaption}
            </figcaption>
          ) : null}
        </figure>
        <div className="h-px w-full bg-slate-200" aria-hidden />
        <figure className="relative aspect-[4/3] w-full bg-slate-100">
          <Image
            src={rightImageSrc}
            alt={rightAlt ?? `${title} — ${rightCaption}`}
            fill
            className="object-cover"
            sizes="100vw"
            unoptimized
          />
          {rightCaption ? (
            <figcaption className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {rightCaption}
            </figcaption>
          ) : null}
        </figure>
      </div>

      {/* Desktop: slider before/after */}
      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(posPct)}
        aria-label={`Confronto immagini: ${title}`}
        aria-valuetext={`${Math.round(posPct)} percento`}
        onPointerDown={onTrackPointerDown}
        onKeyDown={onKeyDown}
        className={`relative hidden aspect-[16/10] w-full cursor-ew-resize overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-sm outline-none ring-slate-900/10 focus-visible:ring-2 focus-visible:ring-offset-2 md:block ${
          isDragging ? "touch-none select-none" : "select-none"
        }`}
        style={{ touchAction: isDragging ? "none" : "pan-y" }}
      >
        {/* Sotto: immagine destra */}
        <Image
          src={rightImageSrc}
          alt={rightAlt ?? `${title} — ${rightCaption}`}
          fill
          className="object-cover"
          sizes={sizes}
          priority={false}
          unoptimized
        />

        {/* Sopra: immagine sinistra, ritagliata */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            clipPath: `inset(0 ${clipRight} 0 0)`,
            WebkitClipPath: `inset(0 ${clipRight} 0 0)`,
          }}
        >
          <Image
            src={leftImageSrc}
            alt={leftAlt ?? `${title} — ${leftCaption}`}
            fill
            className="object-cover"
            sizes={sizes}
            priority={false}
            unoptimized
          />
        </div>

        {/* Linea divisoria verticale */}
        <div
          className="pointer-events-none absolute inset-y-0 z-[2] w-px bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.08)]"
          style={{
            left: `${posPct}%`,
            transform: "translateX(-50%)",
            boxShadow: "0 0 20px rgba(0,0,0,0.12)",
          }}
          aria-hidden
        />

        {/* Maniglia circolare */}
        <div
          className="pointer-events-none absolute top-1/2 z-[3] flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/90 bg-white text-slate-700 shadow-lg ring-1 ring-slate-900/10"
          style={{ left: `${posPct}%` }}
          aria-hidden
        >
          <span className="flex gap-0.5" aria-hidden>
            <span className="h-3 w-0.5 rounded-full bg-slate-400" />
            <span className="h-3 w-0.5 rounded-full bg-slate-400" />
          </span>
        </div>
      </div>

      <p className="mt-3 hidden text-center text-xs text-slate-500 md:block">
        Trascina per confrontare · Tastiera: ← →
      </p>
    </section>
  );
}
