"use client";

import { useState, useMemo } from "react";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { EV_CHARGER_ITEMS } from "@/data/download-items";
import type { DownloadSectionItem } from "@/data/download-items";

/**
 * DownloadSection — 可复用的下载列表
 * 文件放到 public/downloads/ 后，可直接通过 /downloads/xxx.pdf 访问
 * 子文件夹命名遵循 documentazione 规范：UPPERCASE_UNDERSCORE
 * 支持两种类型：file（单文件）、folder（可展开目录，按实际目录结构嵌套）
 * 支持 Ricerca 搜索：按文件名过滤 Area download 全部文件
 */
const DISPENSA_BASE = "/downloads/DISPENSA_PER_LACCENSIONE_PROGRAMMAZIONE";
const INV_PARALLELO_BASE = `${DISPENSA_BASE}/Inverter in parallelo-METER-CABLAGGIO EPS-RIAVVIO`;
const GARANZIA_BASE = "/downloads/GARANZIA";

export { EV_CHARGER_ITEMS };
export type { DownloadSectionItem } from "@/data/download-items";

const DEFAULT_ITEMS: DownloadSectionItem[] = [
  {
    type: "folder",
    label: "Garanzia",
    items: [
      { type: "file", label: "AFORE - Garanzia 10 anni", href: `${GARANZIA_BASE}/EN_AFORE_Garanzia_10_anni.pdf` },
      { type: "file", label: "HAILEI - Garanzia 10 anni", href: `${GARANZIA_BASE}/EN_HAILEI_Garanzia_10_anni.pdf` },
      { type: "file", label: "HAILEI Card - Garanzia 10 anni", href: `${GARANZIA_BASE}/IT_HAILEI_Garanzia_Card_10_anni.pdf` },
    ],
  },
  {
    type: "folder",
    label: "Installazione",
    items: [
      { type: "file", label: "HAILEI ATOM 512100", href: `${DISPENSA_BASE}/Installazione HAILEI ATOM 512100.pdf` },
      { type: "file", label: "HAILEI LVA_LS", href: `${DISPENSA_BASE}/Installazione HAILEI LVA_LS  .pdf` },
      { type: "file", label: "Hybrid HAILEI PW512100", href: `${DISPENSA_BASE}/Installazione Hybrid HAILEI PW512100.pdf` },
      { type: "file", label: "Hybrid TRIFASE Hailei", href: `${DISPENSA_BASE}/Installazione Hybrid TRIFASE Hailei  .pdf` },
      { type: "file", label: "Hybrid TRIFASE MTH Hailei", href: `${DISPENSA_BASE}/Installazione Hybrid TRIFASE MTH Hailei.pdf` },
    ],
  },
  {
    type: "folder",
    label: "Antennina WiFi",
    items: [
      { type: "file", label: "App configurazione per cliente finale", href: `${DISPENSA_BASE}/Antennina WiFi/App configurazione per cliente finale.pdf` },
      { type: "file", label: "APP SOLARMAN BUSINESS", href: `${DISPENSA_BASE}/Antennina WiFi/APP SOLARMAN BUSINESS.pdf` },
      { type: "file", label: "Collegare la chiavetta WiFi in modalità AP", href: `${DISPENSA_BASE}/Antennina WiFi/Collegare la chiavetta WiFi in modalità AP(1).pdf` },
      { type: "file", label: "Come dissociare la chiavetta WiFi della batteria", href: `${DISPENSA_BASE}/Antennina WiFi/Come dissociare la chiavetta WiFi della batteria .pdf` },
      { type: "file", label: "HAILEI antennina Batteria", href: `${DISPENSA_BASE}/Antennina WiFi/HAILEI antennina Batteria .pdf` },
      { type: "file", label: "INTERFACCIA", href: `${DISPENSA_BASE}/Antennina WiFi/INTERFACCIA.pdf` },
    ],
  },
  {
    type: "folder",
    label: "Come fare AUTOTEST",
    items: [
      { type: "file", label: "AUTOTEST APP", href: `${DISPENSA_BASE}/Come fare AUTOTEST/AUTOTEST APP.pdf` },
      { type: "file", label: "AUTOTEST DA REMOTO", href: `${DISPENSA_BASE}/Come fare AUTOTEST/AUTOTEST DA REMOTO.pdf` },
    ],
  },
  {
    type: "folder",
    label: "Inverter in parallelo - Meter - Cablaggio EPS - Riavvio",
    items: [
      { type: "file", label: "CODICI ERRORI", href: `${INV_PARALLELO_BASE}/CODICI ERRORI.pdf` },
      { type: "file", label: "CREARE UN IMPIANTO IN RETROFIT", href: `${INV_PARALLELO_BASE}/CREARE UN IMPIANTO IN RETROFIT.pdf` },
      { type: "file", label: "LVA_LS PARALLEO", href: `${INV_PARALLELO_BASE}/LVA_LS PARALLEO.pdf` },
      { type: "file", label: "Meter trifase", href: `${INV_PARALLELO_BASE}/Meter trifase.pdf` },
      { type: "file", label: "Riavvio sistema", href: `${INV_PARALLELO_BASE}/Riavvio sistema.pdf` },
      {
        type: "folder",
        label: "INV PARALLELO",
        items: [
          { type: "file", label: "Monofase stringa in parallelo", href: `${INV_PARALLELO_BASE}/INV PARALLELO / MONOFASE STRIGA  IN PARALLELO.pdf` },
          { type: "file", label: "Impostazione per PARALLELO INV", href: `${INV_PARALLELO_BASE}/INV PARALLELO /Impostazione per PARALLELO  INV.pdf` },
          { type: "file", label: "Monofase ibrido in paralello", href: `${INV_PARALLELO_BASE}/INV PARALLELO /Monofase ibrido in paralello.pdf` },
          { type: "file", label: "TRIFASE 2 ibridi in Parallelo", href: `${INV_PARALLELO_BASE}/INV PARALLELO /TRIFASE 2 ibridi in_Parallelo_v1.1.pdf` },
          { type: "file", label: "Trifase Ibrido e stringa in parallelo", href: `${INV_PARALLELO_BASE}/INV PARALLELO /Trifase Ibrido e stringa in parallelo _v1.1.pdf.pdf` },
        ],
      },
      {
        type: "folder",
        label: "Quadro backup",
        items: [
          { type: "file", label: "EPS Monofase montaggio", href: `${INV_PARALLELO_BASE}/quadro backup/EPS Monofase montaggio.pdf` },
          {
            type: "folder",
            label: "Conformità",
            items: [
              { type: "file", label: "FASCICOLO QEI-ATS", href: `${INV_PARALLELO_BASE}/quadro backup/Conformita/___FASCICOLO_QEI-ATS.pdf` },
              { type: "file", label: "QEI-ATS SCHEMA EL", href: `${INV_PARALLELO_BASE}/quadro backup/Conformita/QEI-ATS_SCHEMA-EL.pdf` },
            ],
          },
        ],
      },
    ],
  },
  ...EV_CHARGER_ITEMS,
];

function filterItems(items: DownloadSectionItem[], q: string): DownloadSectionItem[] {
  const qn = q.trim().toLowerCase();
  if (!qn) return items;
  const match = (s: string) => s.toLowerCase().includes(qn);

  function filter(list: DownloadSectionItem[]): DownloadSectionItem[] {
    const out: DownloadSectionItem[] = [];
    for (const item of list) {
      if (item.type === "file") {
        if (match(item.label)) out.push(item);
      } else {
        const filteredChildren = filter(item.items);
        if (filteredChildren.length > 0 || match(item.label)) {
          out.push({ ...item, items: filteredChildren.length > 0 ? filteredChildren : item.items });
        }
      }
    }
    return out;
  }
  return filter(items);
}

function DownloadRow({ label, href }: { label: string; href: string }) {
  return (
    <li className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 py-3">
      <span className="text-sm sm:text-base text-slate-700 truncate">{label}</span>
      <Button href={href} variant="primary" download target="_blank" rel="noopener noreferrer">
        Download
      </Button>
    </li>
  );
}

function FolderContent({ items, depth = 0 }: { items: DownloadSectionItem[]; depth?: number }) {
  return (
    <ul className={`divide-y divide-slate-200 pl-0 mt-1 ${depth > 0 ? "ml-2 pl-4" : ""}`}>
      {items.map((item, i) =>
        item.type === "file" ? (
          <DownloadRow key={i} label={item.label} href={item.href} />
        ) : (
          <li key={i}>
            <details className="group">
              <summary className="flex items-center justify-between gap-2 py-3 cursor-pointer list-none text-sm sm:text-base font-semibold text-slate-900 hover:text-slate-700 transition-colors [&::-webkit-details-marker]:hidden">
                <span>{item.label}</span>
                <svg
                  className="w-5 h-5 flex-shrink-0 transition-transform group-open:rotate-180"
                  width={20}
                  height={20}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <FolderContent items={item.items} depth={depth + 1} />
            </details>
          </li>
        )
      )}
    </ul>
  );
}

export default function DownloadSection({
  items = DEFAULT_ITEMS,
}: {
  items?: DownloadSectionItem[];
}) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => filterItems(items, searchQuery), [items, searchQuery]);

  return (
    <div className="p-0">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">
        {t("garanzia.areaDownload")}
      </h2>

      {/* Download (左) | Ricerca (右) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900">
          {t("garanzia.downloadLabel")}
        </h3>
        <div className="relative flex-1 sm:max-w-xs sm:ml-auto">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("garanzia.ricercaPlaceholder")}
            aria-label={t("garanzia.ricercaPlaceholder")}
            className="w-full pl-4 pr-10 py-2 text-sm border border-slate-200 rounded-lg focus:border-[#C01C20] focus:outline-none focus-visible:ring-0 transition-colors"
          />
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            width={16}
            height={16}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 全部文件列表 — 支持按文件名搜索 */}
      {filteredItems.length > 0 ? (
        <ul className="divide-y divide-slate-200">
          {filteredItems.map((item, i) =>
            item.type === "file" ? (
              <DownloadRow key={i} label={item.label} href={item.href} />
            ) : (
              <li key={i}>
                <details className="group">
                  <summary className="flex items-center justify-between gap-2 py-3 cursor-pointer list-none text-sm sm:text-base font-semibold text-slate-900 hover:text-slate-700 transition-colors [&::-webkit-details-marker]:hidden">
                    <span>{item.label}</span>
                    <svg
                      className="w-5 h-5 flex-shrink-0 transition-transform group-open:rotate-180"
                      width={20}
                      height={20}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <FolderContent items={item.items} depth={1} />
                </details>
              </li>
            )
          )}
        </ul>
      ) : (
        <p className="text-sm text-slate-500 py-4">{t("garanzia.ricercaNoResults")}</p>
      )}
    </div>
  );
}
