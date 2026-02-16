/**
 * Site-wide search logic
 */

import { SEARCH_INDEX, type SearchEntry, type SearchEntryType } from "@/data/search-index";

type Lang = "it" | "en" | "es" | "fr" | "de";

function buildSearchable(entry: SearchEntry, lang: Lang): string {
  const title = entry.title[lang] || entry.title.it || "";
  const keywords = entry.keywords[lang] || entry.keywords.it || "";
  return `${title} ${keywords}`.toLowerCase();
}

export type SearchResult = {
  type: SearchEntryType;
  path: string;
  title: string;
  snippet?: string;
};

export function search(query: string, lang: Lang): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const normalizedLang = ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";
  const results: SearchResult[] = [];

  for (const entry of SEARCH_INDEX) {
    const searchable = buildSearchable(entry, normalizedLang as Lang);
    if (searchable.includes(q)) {
      const title = entry.title[normalizedLang as Lang] || entry.title.it || "";
      const keywords = entry.keywords[normalizedLang as Lang] || "";
      const snippet = keywords ? keywords.slice(0, 120) + (keywords.length > 120 ? "…" : "") : undefined;
      results.push({
        type: entry.type,
        path: entry.path,
        title,
        snippet,
      });
    }
  }

  return results;
}

/** Group results by type for display */
export const TYPE_ORDER: SearchEntryType[] = [
  "product",
  "documentazione",
  "prodotti",
  "eventi",
  "webinar",
  "comunicati-stampa",
  "video",
  "assistenza",
  "contatti",
  "home",
];
