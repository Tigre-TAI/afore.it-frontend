"use client";

import { useEffect, useState, useRef, RefObject } from "react";

const defaultOpts = { rootMargin: "0px 0px -8% 0px", threshold: 0.1 };

/**
 * Returns ref and whether the element is in view (Intersection Observer).
 * Set data-visible on the element for CSS-driven reveal animations.
 */
export function useInView(
  options?: Partial<IntersectionObserverInit>
): [RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const opts = { ...defaultOpts, ...options };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      opts
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [opts.rootMargin, opts.threshold]);

  return [ref, isInView];
}
