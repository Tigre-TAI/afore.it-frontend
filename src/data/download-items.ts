/**
 * Download items data — shared between server (product page) and client (DownloadSection).
 * Kept in a separate module without "use client" so server can import a real array.
 */

const DISPENSA_BASE = "/downloads/DISPENSA_PER_LACCENSIONE_PROGRAMMAZIONE";
const EV_CHARGER_BASE = "/documentazione/EV_CHARGER";

export type DownloadSectionItem =
  | { type: "file"; label: string; href: string }
  | { type: "folder"; label: string; items: DownloadSectionItem[] };

/** EV Charger 相关文件 — 用于 assistenza 和 prodotti/ev-charger 页面 */
export const EV_CHARGER_ITEMS: DownloadSectionItem[] = [
  {
    type: "folder",
    label: "EV Charger",
    items: [
      {
        type: "file",
        label: "Installazione Afore EV Charger SWG5",
        href: `${DISPENSA_BASE}/Installazione Afore EV Charger SWG5.pdf`,
      },
      {
        type: "file",
        label: "EV Charger SGW CE-Wallbox",
        href: `${EV_CHARGER_BASE}/EN_EV_Charger_SGW_CE-Wallbox.pdf`,
      },
      {
        type: "file",
        label: "EV Charger SGW5E UKCA",
        href: `${EV_CHARGER_BASE}/EN_EV_Charger_SGW5E_UKCA.pdf`,
      },
    ],
  },
];
