/**
 * Site-wide search index.
 * All page content is indexed for search across the whole website.
 */

import { PRODUCTS, getProductTitle, getProductSubtitle, resolvePath } from "./product-data";
import itLocale from "@/locales/it.json";
import enLocale from "@/locales/en.json";
import esLocale from "@/locales/es.json";
import frLocale from "@/locales/fr.json";
import deLocale from "@/locales/de.json";

type Lang = "it" | "en" | "es" | "fr" | "de";
const LANGS: Lang[] = ["it", "en", "es", "fr", "de"];

export type SearchEntryType =
  | "product"
  | "documentazione"
  | "eventi"
  | "webinar"
  | "comunicati-stampa"
  | "video"
  | "assistenza"
  | "contatti"
  | "prodotti"
  | "home";

export type SearchEntry = {
  type: SearchEntryType;
  path: string; // path without lang, e.g. /prodotti/inverter-di-stringa/stringa-3-6kw
  title: Record<Lang, string>;
  keywords: Record<Lang, string>;
};

const locales: Record<Lang, any> = {
  it: itLocale,
  en: enLocale,
  es: esLocale,
  fr: frLocale,
  de: deLocale,
};

function t(localeKey: string, lang: Lang): string {
  const keys = localeKey.split(".");
  let v: any = locales[lang];
  for (const k of keys) {
    v = v?.[k];
  }
  return typeof v === "string" ? v : "";
}

function buildSearchable(entry: SearchEntry, lang: Lang): string {
  const title = entry.title[lang] || entry.title.it || "";
  const keywords = entry.keywords[lang] || entry.keywords.it || "";
  return `${title} ${keywords}`.toLowerCase();
}

/** Build the full search index */
export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  // --- Products ---
  for (const p of PRODUCTS) {
    const { family } = resolvePath(p);
    const path = `/prodotti/${family}/${p.id}`;
    const title: Record<Lang, string> = {} as any;
    const keywords: Record<Lang, string> = {} as any;
    for (const lang of LANGS) {
      title[lang] = getProductTitle(p, lang) || p.title;
      keywords[lang] = [getProductSubtitle(p, lang), p.subtitle, p.id].filter(Boolean).join(" ");
    }
    entries.push({ type: "product", path, title, keywords });
  }

  // --- Static pages from locales ---
  const pageEntries: Array<{
    path: string;
    type: SearchEntryType;
    titleKey: string;
    keywordKeys: string[];
  }> = [
    { path: "/", type: "home", titleKey: "home.title", keywordKeys: ["home.hero.title", "home.productsSection.description"] },
    { path: "/prodotti", type: "prodotti", titleKey: "prodotti.title", keywordKeys: ["prodotti.subtitle", "prodotti.pvInverter.title", "prodotti.batteriaDiAccumulo.title", "prodotti.allInOne.title", "prodotti.evCharger.title"] },
    { path: "/prodotti/pv-inverter", type: "prodotti", titleKey: "prodotti.pvInverter.title", keywordKeys: ["prodotti.pvInverter.subtitle", "prodotti.pvInverter.inverterDiStringa.title", "prodotti.pvInverter.inverterIbrido.title"] },
    { path: "/prodotti/batteria-di-accumulo", type: "prodotti", titleKey: "prodotti.batteriaDiAccumulo.title", keywordKeys: ["prodotti.batteriaDiAccumulo.subtitle"] },
    { path: "/prodotti/allin1", type: "prodotti", titleKey: "prodotti.allInOne.title", keywordKeys: ["prodotti.allInOne.subtitle"] },
    { path: "/prodotti/ev-charger", type: "prodotti", titleKey: "prodotti.evCharger.title", keywordKeys: ["prodotti.evCharger.subtitle"] },
    { path: "/documentazione", type: "documentazione", titleKey: "documentazione.title", keywordKeys: ["documentazione.subtitle", "documentazione.categories.pvInverter.title", "documentazione.categories.inverterIbridi.title", "documentazione.categories.accumuloAfore.title", "documentazione.categories.allInOne.title", "documentazione.categories.certificadosEspana.title"] },
    { path: "/documentazione/certificati-inverter-di-stringa", type: "documentazione", titleKey: "documentazione.certificatiInverterStringa.title", keywordKeys: ["documentazione.certificatiInverterStringa.subtitle", "documentazione.categories.pvInverter.description", "documentazione.categories.pvInverter.bullets"] },
    { path: "/documentazione/certificati-inverter-ibridi", type: "documentazione", titleKey: "documentazione.certificatiInverterIbridi.title", keywordKeys: ["documentazione.certificatiInverterIbridi.subtitle", "documentazione.categories.inverterIbridi.description", "CEI 0-21"] },
    { path: "/documentazione/certificati-all-in-one", type: "documentazione", titleKey: "documentazione.certificatiAllInOne.title", keywordKeys: ["documentazione.certificatiAllInOne.subtitle", "documentazione.categories.allInOne.description", "CEI 0-21"] },
    { path: "/documentazione/accumulo-afore", type: "documentazione", titleKey: "documentazione.accumuloAfore.title", keywordKeys: ["documentazione.accumuloAfore.subtitle", "documentazione.categories.accumuloAfore.description", "CEI 0-21"] },
    { path: "/documentazione/certificati-spagna", type: "documentazione", titleKey: "documentazione.categories.certificadosEspana.title", keywordKeys: ["documentazione.categories.certificadosEspana.description", "documentazione.categories.certificadosEspana.bullets", "Spagna", "UNE", "RD 647"] },
    { path: "/documentazione/guida", type: "documentazione", titleKey: "documentazione.cei.title", keywordKeys: ["documentazione.cei.subtitle", "CEI", "CEI-16", "CEI-021", "CEI 0-21", "regolamento di esercizio"] },
    { path: "/documentazione/manuale", type: "documentazione", titleKey: "documentazione.manuale.title", keywordKeys: ["documentazione.manuale.subtitle", "manuali", "installazione"] },
    { path: "/documentazione/archivio", type: "documentazione", titleKey: "documentazione.archivio.title", keywordKeys: ["documentazione.archivio.subtitle"] },
    { path: "/eventi", type: "eventi", titleKey: "eventi.title", keywordKeys: ["eventi.subtitle", "eventi.keyEnergy.title", "eventi.keyEnergy.subtitle", "eventi.keyEnergy.description", "KEY ENERGY", "Rimini", "B5-D5"] },
    { path: "/webinar", type: "webinar", titleKey: "webinar.title", keywordKeys: ["webinar.subtitle"] },
    { path: "/webinar/afore-hailei", type: "webinar", titleKey: "webinar.items.aforeHailei.title", keywordKeys: ["webinar.items.aforeHailei.excerpt", "webinar.items.aforeHailei.topics", "Hailei", "batteria", "BMS"] },
    { path: "/comunicati-stampa", type: "comunicati-stampa", titleKey: "comunicatiStampa.title", keywordKeys: ["comunicatiStampa.subtitle"] },
    { path: "/comunicati-stampa/key-energy-2026", type: "comunicati-stampa", titleKey: "comunicatiStampa.items.keyEnergy2026.title", keywordKeys: ["comunicatiStampa.items.keyEnergy2026.excerpt", "comunicatiStampa.items.keyEnergy2026.body", "Key Energy"] },
    { path: "/comunicati-stampa/spazio-900", type: "comunicati-stampa", titleKey: "comunicatiStampa.items.spazio900.title", keywordKeys: ["comunicatiStampa.items.spazio900.excerpt", "comunicatiStampa.items.spazio900.body", "Spazio 900"] },
    { path: "/video", type: "video", titleKey: "videoPage.title", keywordKeys: ["videoPage.subtitle", "videoPage.videoPromozionali", "videoPage.guidaInstallazione", "videoPage.panoramicaProdotto", "videoPage.fiereEventi"] },
    { path: "/assistenza", type: "assistenza", titleKey: "garanzia.title", keywordKeys: ["garanzia.subtitle", "garanzia.areaDownload", "garanzia.verificaGaranzia", "garanzia.garanzia10Anni.title", "garanzia.videoTitle1", "garanzia.videoTitle2"] },
    { path: "/contatti", type: "contatti", titleKey: "contatti.title", keywordKeys: ["contatti.subtitle", "contatti.form.title"] },
  ];

  for (const pe of pageEntries) {
    const title: Record<Lang, string> = {} as any;
    const keywords: Record<Lang, string> = {} as any;
    for (const lang of LANGS) {
      title[lang] = t(pe.titleKey, lang);
      const kws: string[] = [];
      for (const key of pe.keywordKeys) {
        if (key.includes("bullets")) {
          const parts = key.split(".");
          let val: any = locales[lang];
          for (const part of parts) val = val?.[part];
          if (Array.isArray(val)) kws.push(...val.map(String));
        } else {
          const v = t(key, lang);
          if (v) kws.push(v);
        }
      }
      keywords[lang] = kws.join(" ");
    }
    entries.push({ type: pe.type, path: pe.path, title, keywords });
  }

  return entries;
}

export const SEARCH_INDEX = buildSearchIndex();
