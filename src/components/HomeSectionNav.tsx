"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "brand-short-video", label: "Video" },
  { id: "products", label: "Products" },
  { id: "data-viz", label: "Data" },
] as const;

export default function HomeSectionNav() {
  const [activeId, setActiveId] = useState<string>("hero");

  useEffect(() => {
    const updateActive = () => {
      const viewportThird = window.innerHeight / 3;
      let best = "hero";
      let bestDist = Infinity;

      for (const { id } of SECTIONS) {
        const el = id === "hero" ? document.getElementById("hero") : document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        const dist = Math.abs(mid - viewportThird);
        if (dist < bestDist) {
          bestDist = dist;
          best = id;
        }
      }
      setActiveId(best);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, []);

  const scrollTo = (id: string) => {
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed right-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-2"
      aria-label="Page sections"
    >
      {SECTIONS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => scrollTo(id)}
          className={`
            w-2.5 h-2.5 rounded-full border-2 transition-all duration-300
            ${activeId === id ? "bg-[#C01C20] border-[#C01C20] scale-125" : "bg-transparent border-slate-300 hover:border-slate-500 opacity-70 hover:opacity-100"}
          `}
          aria-label={`Go to ${label}`}
          aria-current={activeId === id ? "true" : undefined}
        />
      ))}
    </nav>
  );
}
