// src/app/documentazione/page.tsx
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/ui/Breadcrumbs";
import { withLang } from "@/lib/lang-utils";
import { getTranslations } from "@/lib/i18n";
import itTranslations from "@/locales/it.json";
import enTranslations from "@/locales/en.json";
import esTranslations from "@/locales/es.json";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function DocumentazionePage({ params }: Props) {
  const { lang } = await params;
  const validLang = ["it", "en", "es"].includes(lang) ? lang : "it";
  const t = getTranslations(validLang);
  
  const translations: Record<string, any> = {
    it: itTranslations,
    en: enTranslations,
    es: esTranslations,
  };
  const translationsObj = translations[validLang] || translations.it;

  const categories = [
    {
      key: "pvInverter",
      icon: "/image/landing/products/category_pv_inverter.png",
      href: withLang("/documentazione/certificati-inverter-di-stringa", lang),
    },
    {
      key: "inverterIbridi",
      icon: "/products/inverters/ibrido_3_12kw_plus_1.png",
      icon2: "/image/landing/products/category_battery_storage.png",
      href: withLang("/documentazione/certificati-inverter-ibridi", lang),
      descriptionWithHighlight: true,
    },
    {
      key: "accumuloAfore",
      icon: "/products/batteries/batteria_afore_muro_5_10kw_1.png",
      href: withLang("/documentazione/accumulo-afore", lang),
    },
    {
      key: "allInOne",
      icon: "/image/landing/products/category_all_in_one.png",
      href: withLang("/documentazione/certificati-all-in-one", lang),
    },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="relative -mt-16 pt-16">
        <div className="absolute inset-0">
          <img
            src="/image/documentazione_hero.jpg"
            alt="Documentazione"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 text-white">
          {/* [CHANGED] 新版面包屑：深色背景 -> 白色主题 */}
          <Breadcrumb
            theme="dark"
            items={[
              { label: t("common.breadcrumb.home"), href: withLang("/", lang) },
              { label: t("documentazione.title") },
            ]}
          />

          <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight break-words">
            {t("documentazione.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/85">
            {t("documentazione.subtitle")}
          </p>
        </div>
      </section>

      {/* Vertical category blocks */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          {categories.map((item) => {
            const category = translationsObj.documentazione?.categories?.[item.key] || {};
            const title = category.title || "";
            const description = category.description || "";
            const bullets = category.bullets || [];

            return (
              <div
                key={item.key}
                className="group flex flex-col gap-4 sm:gap-6 rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg sm:flex-row sm:items-start sm:gap-8"
              >
                <div className="flex items-center justify-center shrink-0">
                  {(item as any).icon2 ? (
                    <div className="flex flex-col gap-2 items-center justify-center">
                      <div className="relative h-20 w-24">
                        <Image
                          src={item.icon}
                          alt={title}
                          fill
                          className="object-contain"
                          sizes="96px"
                        />
                      </div>
                      <div className="relative h-20 w-24">
                        <Image
                          src={(item as any).icon2}
                          alt={title}
                          fill
                          className="object-contain"
                          sizes="96px"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-20 w-24">
                      <Image
                        src={item.icon}
                        alt={title}
                        fill
                        className="object-contain"
                        sizes="96px"
                      />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {title}
                    </h3>
                    <p className="mt-2 text-slate-600">
                      {item.descriptionWithHighlight ? (
                        <>
                          {description.split("Hailei")[0]}
                          <span className="font-bold text-red-600">Hailei</span>
                          {description.includes("Hailei") && description.split("Hailei")[1]?.split("Afore")[0]}
                          {description.includes("Afore") && (
                            <>
                              <span className="font-bold text-red-600">Afore</span>
                              {description.split("Afore")[1]}
                            </>
                          )}
                          {!description.includes("Afore") && description.split("Hailei")[1]}
                        </>
                      ) : (
                        description
                      )}
                    </p>
                  </div>

                  <ul className="space-y-1 text-sm text-slate-700">
                    {bullets.map((bullet: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-2 h-0.5 w-4 bg-slate-600 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="sm:self-end sm:ml-auto">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                  >
                    {t("documentazione.scopriDiPiu")}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="transition-transform group-hover:translate-x-1"
                    >
                      <path
                        d="M5 12h14M12 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
