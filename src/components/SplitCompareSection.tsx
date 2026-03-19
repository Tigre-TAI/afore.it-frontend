"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
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
 * - Mobile: due immagini in colonna (su / giù)
 * - Desktop (md+): before/after con slider verticale trascinabile
 * - Area immagine full-bleed (larghezza viewport), angoli retti
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
  const trackRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const draggingRef = useRef(false);
  const activePointerId = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const pendingClientXRef = useRef<number | null>(null);

  const [posPct, setPosPct] = useState(50);
  const posPctRef = useRef(50);
  const [trackPx, setTrackPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const syncPosToDom = useCallback((pct: number) => {
    posPctRef.current = pct;
    const clip = clipRef.current;
    const div = dividerRef.current;
    const h = handleRef.current;
    if (clip) clip.style.width = `${pct}%`;
    if (div) div.style.left = `${pct}%`;
    if (h) h.style.left = `${pct}%`;
  }, []);

  const applyPctFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = Math.min(Math.max(clientX - r.left, 0), r.width);
      const pct = r.width > 0 ? (x / r.width) * 100 : 50;
      syncPosToDom(pct);
      return pct;
    },
    [syncPosToDom]
  );

  const flushPendingMove = useCallback(() => {
    rafRef.current = 0;
    const x = pendingClientXRef.current;
    if (x == null) return;
    pendingClientXRef.current = null;
    applyPctFromClientX(x);
  }, [applyPctFromClientX]);

  const scheduleMove = useCallback(
    (clientX: number) => {
      pendingClientXRef.current = clientX;
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(flushPendingMove);
    },
    [flushPendingMove]
  );

  const endDrag = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    const pending = pendingClientXRef.current;
    pendingClientXRef.current = null;
    if (pending != null) {
      applyPctFromClientX(pending);
    }

    const el = trackRef.current;
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
    setPosPct(posPctRef.current);
  }, [applyPctFromClientX]);

  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setTrackPx(el.offsetWidth);
    });
    ro.observe(el);
    setTrackPx(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    syncPosToDom(posPct);
  }, [posPct, trackPx, syncPosToDom]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return;
      scheduleMove(e.clientX);
    };
    const onUp = (e: PointerEvent) => {
      if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return;
      endDrag();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [endDrag, scheduleMove]);

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
    const pct = applyPctFromClientX(e.clientX);
    if (pct != null) setPosPct(pct);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let next = posPctRef.current;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      next = Math.max(0, next - 2);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next = Math.min(100, next + 2);
    } else if (e.key === "Home") {
      e.preventDefault();
      next = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      next = 100;
    } else {
      return;
    }
    syncPosToDom(next);
    setPosPct(next);
  };

  const sizes =
    "(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 100vw";

  return (
    <section
      className={`scroll-mt-24 border-t border-slate-200/90 py-12 sm:py-16 lg:py-20 ${className} overflow-x-clip`.trim()}
      aria-labelledby={headingId}
    >
      {/* Titolo allineato al layout pagina */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
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
      </div>

      {/* Full-bleed: larghezza viewport, angoli retti */}
      <div
        className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 border-y border-slate-200/80 bg-slate-100"
        data-compare-bleed
      >
        {/* Mobile: impilate */}
        <div className="md:hidden">
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

        {/* Desktop: slider — overflow + width invece di clip-path (più fluido) */}
        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(posPct)}
          aria-label={`Confronto immagini: ${title}`}
          aria-valuetext={`${Math.round(posPct)} percento`}
          onPointerDown={onTrackPointerDown}
          onKeyDown={onKeyDown}
          className={`relative hidden aspect-[16/10] w-full cursor-ew-resize overflow-hidden bg-slate-100 outline-none ring-slate-900/10 focus-visible:ring-2 focus-visible:ring-offset-2 md:block ${
            isDragging ? "touch-none select-none" : "select-none"
          }`}
          style={{
            touchAction: isDragging ? "none" : "pan-y",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <Image
            src={rightImageSrc}
            alt={rightAlt ?? `${title} — ${rightCaption}`}
            fill
            className="object-cover"
            sizes={sizes}
            priority={false}
            unoptimized
            draggable={false}
          />

          <div
            ref={clipRef}
            className="absolute inset-y-0 left-0 z-[1] overflow-hidden will-change-[width]"
          >
            <div
              className="absolute inset-y-0 left-0"
              style={{
                width: trackPx > 0 ? `${trackPx}px` : "100%",
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
                draggable={false}
              />
            </div>
          </div>

          <div
            ref={dividerRef}
            className="pointer-events-none absolute inset-y-0 z-[2] w-px bg-white [transform:translate3d(-50%,0,0)]"
            style={{
              boxShadow:
                "0 0 0 1px rgba(15,23,42,0.06), 0 0 24px rgba(0,0,0,0.08)",
            }}
            aria-hidden
          />

          <div
            ref={handleRef}
            className="pointer-events-none absolute top-1/2 z-[3] flex h-11 w-11 items-center justify-center rounded-full border border-white/90 bg-white text-slate-700 shadow-lg ring-1 ring-slate-900/10 [transform:translate3d(-50%,-50%,0)]"
            aria-hidden
          >
            <span className="flex gap-0.5" aria-hidden>
              <span className="h-3 w-0.5 rounded-full bg-slate-400" />
              <span className="h-3 w-0.5 rounded-full bg-slate-400" />
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="mt-3 hidden text-center text-xs text-slate-500 md:block">
          Trascina per confrontare · Tastiera: ← →
        </p>
      </div>
    </section>
  );
}
