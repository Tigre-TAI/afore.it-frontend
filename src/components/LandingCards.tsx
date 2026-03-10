"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { withLang, getLangFromPath } from "@/lib/lang-utils";

const LEFT_SRC = "/image/landing/landing_card_left.jpg";
const RIGHT_SRC = "/image/landing/landing_card_right.jpg";
const THIRD_SRC = "/image/landing/landing_card_third.jpg";
const FOURTH_SRC = "/image/landing/landing_card_fourth.jpg";

const CARDS = [
  {
    src: LEFT_SRC,
    title: "Soluzioni Residenziale",
    cta: "Scopri di più",
    href: "/prodotti/sistema-residenziale",
  },
  {
    src: RIGHT_SRC,
    title: "Soluzioni Commerciale",
    cta: "Scopri di più",
    href: "/prodotti/sistema-commerciale",
  },
  {
    src: THIRD_SRC,
    title: "",
    cta: "Scopri di più",
    href: "/comunicati-stampa/key-energy-2026-afore-italia",
  },
  {
    src: FOURTH_SRC,
    title: "",
    cta: "Scopri di più",
    href: "/webinar/afore-hailei-24-mar",
  },
] as const;

export default function LandingCards() {
  const params = useParams();
  const pathname = usePathname();
  const lang = (params?.lang as string) || getLangFromPath(pathname) || "it";

  return (
    <section
      className="relative w-full pt-4 md:pt-6 pb-12 md:pb-16"
      aria-label="Landing cards"
    >
      <div className="container">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
          {CARDS.map((card) => (
            <Link
              key={card.src}
              href={withLang(card.href, lang)}
              className="group relative w-full overflow-hidden bg-slate-100 rounded-none aspect-[5/3] block"
            >
              <Image
                src={card.src}
                alt={card.title || card.cta}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 40vw"
                loading="lazy"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 md:p-6 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                {card.title ? (
                  <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2 drop-shadow-md">
                    {card.title}
                  </h3>
                ) : null}
                <span className="text-white/95 text-sm sm:text-base font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  {card.cta}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
