/**
 * Scheda Tecnica PDF 映射：schedaKey -> 直接 PDF URL
 * ProductCard 和产品详情页使用，替代已废弃的 /documentazione/scheda-tecnica 路由
 */

type LangCode = "it" | "en" | "es" | "fr" | "de";

/** schedaKey -> 各语言 PDF 文件名 (prodotti/{id}/downloads/ 或 documentazione/SCHEDA_TECNICA/) */
const SCHEDA_PDF_MAP: Record<
  string,
  {
    base: "prodotti" | "documentazione";
    /** 当 PDF 所在目录与 schedaKey 不同时指定 */
    productIdForPath?: string;
    file: Record<LangCode, string>;
  }
> = {
  "stringa-1-3kw": {
    base: "prodotti",
    file: {
      it: "IT_Inverter_di_Stringa_Monofase_1-3kW_Scheda_Tecnica.pdf",
      en: "IT_Inverter_di_Stringa_Monofase_1-3kW_Scheda_Tecnica.pdf",
      es: "IT_Inverter_di_Stringa_Monofase_1-3kW_Scheda_Tecnica.pdf",
      fr: "IT_Inverter_di_Stringa_Monofase_1-3kW_Scheda_Tecnica.pdf",
      de: "IT_Inverter_di_Stringa_Monofase_1-3kW_Scheda_Tecnica.pdf",
    },
  },
  "stringa-3-6kw": {
    base: "prodotti",
    file: {
      it: "IT_Inverter_di_Stringa_Monofase_3-6kW_Scheda_Tecnica.pdf",
      en: "IT_Inverter_di_Stringa_Monofase_3-6kW_Scheda_Tecnica.pdf",
      es: "IT_Inverter_di_Stringa_Monofase_3-6kW_Scheda_Tecnica.pdf",
      fr: "IT_Inverter_di_Stringa_Monofase_3-6kW_Scheda_Tecnica.pdf",
      de: "IT_Inverter_di_Stringa_Monofase_3-6kW_Scheda_Tecnica.pdf",
    },
  },
  "stringa-7-10kw": {
    base: "prodotti",
    file: {
      it: "IT_Inverter_di_Stringa_Monofase_7-10kW_Scheda_Tecnica.pdf",
      en: "IT_Inverter_di_Stringa_Monofase_7-10kW_Scheda_Tecnica.pdf",
      es: "IT_Inverter_di_Stringa_Monofase_7-10kW_Scheda_Tecnica.pdf",
      fr: "IT_Inverter_di_Stringa_Monofase_7-10kW_Scheda_Tecnica.pdf",
      de: "IT_Inverter_di_Stringa_Monofase_7-10kW_Scheda_Tecnica.pdf",
    },
  },
  "stringa-trifase-3-25kw": {
    base: "prodotti",
    file: {
      it: "IT_Inverter_di_Stringa_3-25kW_Scheda_Tecnica.pdf",
      en: "IT_Inverter_di_Stringa_3-25kW_Scheda_Tecnica.pdf",
      es: "IT_Inverter_di_Stringa_3-25kW_Scheda_Tecnica.pdf",
      fr: "IT_Inverter_di_Stringa_3-25kW_Scheda_Tecnica.pdf",
      de: "IT_Inverter_di_Stringa_3-25kW_Scheda_Tecnica.pdf",
    },
  },
  "stringa-trifase-30kw": {
    base: "documentazione",
    file: {
      it: "IT_Inverter_di_Stringa_Trifase_30-60kW_Scheda_Tecnica.pdf",
      en: "IT_Inverter_di_Stringa_Trifase_30-60kW_Scheda_Tecnica.pdf",
      es: "IT_Inverter_di_Stringa_Trifase_30-60kW_Scheda_Tecnica.pdf",
      fr: "IT_Inverter_di_Stringa_Trifase_30-60kW_Scheda_Tecnica.pdf",
      de: "IT_Inverter_di_Stringa_Trifase_30-60kW_Scheda_Tecnica.pdf",
    },
  },
  "stringa-trifase-36-60kw": {
    base: "prodotti",
    file: {
      it: "IT_Inverter_di_Stringa_Trifase_30-60kW_Scheda_Tecnica.pdf",
      en: "IT_Inverter_di_Stringa_Trifase_30-60kW_Scheda_Tecnica.pdf",
      es: "IT_Inverter_di_Stringa_Trifase_30-60kW_Scheda_Tecnica.pdf",
      fr: "IT_Inverter_di_Stringa_Trifase_30-60kW_Scheda_Tecnica.pdf",
      de: "IT_Inverter_di_Stringa_Trifase_30-60kW_Scheda_Tecnica.pdf",
    },
  },
  "stringa-trifase-70-110kw": {
    base: "documentazione",
    file: {
      it: "IT_Inverter_di_Stringa_Trifase_70-110kW_Scheda_Tecnica 70-110kW.pdf",
      en: "IT_Inverter_di_Stringa_Trifase_70-110kW_Scheda_Tecnica 70-110kW.pdf",
      es: "IT_Inverter_di_Stringa_Trifase_70-110kW_Scheda_Tecnica 70-110kW.pdf",
      fr: "IT_Inverter_di_Stringa_Trifase_70-110kW_Scheda_Tecnica 70-110kW.pdf",
      de: "IT_Inverter_di_Stringa_Trifase_70-110kW_Scheda_Tecnica 70-110kW.pdf",
    },
  },
  "ibrido-monofase-1-3-6kw": {
    base: "prodotti",
    file: {
      it: "IT_Inverter_Ibrido_Monofase_1-3.6kW_Scheda_Tecnica.pdf",
      en: "IT_Inverter_Ibrido_Monofase_1-3.6kW_Scheda_Tecnica.pdf",
      es: "IT_Inverter_Ibrido_Monofase_1-3.6kW_Scheda_Tecnica.pdf",
      fr: "IT_Inverter_Ibrido_Monofase_1-3.6kW_Scheda_Tecnica.pdf",
      de: "IT_Inverter_Ibrido_Monofase_1-3.6kW_Scheda_Tecnica.pdf",
    },
  },
  "ibrido-monofase-plus-4-6kw": {
    base: "prodotti",
    file: {
      it: "IT_Inverter_Ibrido_Monofase_4-6kW_Plus_Scheda_Tecnica.pdf",
      en: "IT_Inverter_Ibrido_Monofase_4-6kW_Plus_Scheda_Tecnica.pdf",
      es: "IT_Inverter_Ibrido_Monofase_4-6kW_Plus_Scheda_Tecnica.pdf",
      fr: "IT_Inverter_Ibrido_Monofase_4-6kW_Plus_Scheda_Tecnica.pdf",
      de: "IT_Inverter_Ibrido_Monofase_4-6kW_Plus_Scheda_Tecnica.pdf",
    },
  },
  "ibrido-trifase-plus-8-12kw": {
    base: "prodotti",
    file: {
      it: "IT_Inverter_Ibrido_Monofase_8-12kW_Scheda_Tecnica.pdf",
      en: "IT_Inverter_Ibrido_Monofase_8-12kW_Scheda_Tecnica.pdf",
      es: "IT_Inverter_Ibrido_Monofase_8-12kW_Scheda_Tecnica.pdf",
      fr: "IT_Inverter_Ibrido_Monofase_8-12kW_Scheda_Tecnica.pdf",
      de: "IT_Inverter_Ibrido_Monofase_8-12kW_Scheda_Tecnica.pdf",
    },
  },
  "ibrido-trifase-3-15kw": {
    base: "prodotti",
    file: {
      it: "IT_Inverter_Ibrido_Trifase_3-15kW_Scheda_Tecnica.pdf",
      en: "IT_Inverter_Ibrido_Trifase_3-15kW_Scheda_Tecnica.pdf",
      es: "IT_Inverter_Ibrido_Trifase_3-15kW_Scheda_Tecnica.pdf",
      fr: "IT_Inverter_Ibrido_Trifase_3-15kW_Scheda_Tecnica.pdf",
      de: "IT_Inverter_Ibrido_Trifase_3-15kW_Scheda_Tecnica.pdf",
    },
  },
  "ibrido-trifase-plus-3-12kw": {
    base: "prodotti",
    file: {
      it: "IT_Inverter_Ibrido_Trifase__3-12kW_Plus_Scheda_Tecnica.pdf",
      en: "IT_Inverter_Ibrido_Trifase__3-12kW_Plus_Scheda_Tecnica.pdf",
      es: "IT_Inverter_Ibrido_Trifase__3-12kW_Plus_Scheda_Tecnica.pdf",
      fr: "IT_Inverter_Ibrido_Trifase__3-12kW_Plus_Scheda_Tecnica.pdf",
      de: "IT_Inverter_Ibrido_Trifase__3-12kW_Plus_Scheda_Tecnica.pdf",
    },
  },
  "ibrido-trifase-3-30kw": {
    base: "prodotti",
    file: {
      it: "IT_Inverter_Ibrido_Trifase_3-30kW_Scheda_Tecnica.pdf",
      en: "IT_Inverter_Ibrido_Trifase_3-30kW_Scheda_Tecnica.pdf",
      es: "IT_Inverter_Ibrido_Trifase_3-30kW_Scheda_Tecnica.pdf",
      fr: "IT_Inverter_Ibrido_Trifase_3-30kW_Scheda_Tecnica.pdf",
      de: "IT_Inverter_Ibrido_Trifase_3-30kW_Scheda_Tecnica.pdf",
    },
  },
  "ibrido-trifase-36-60kw": {
    base: "prodotti",
    file: {
      it: "IT_Inverter_Ibrido_Trifase_36-60kW_Scheda_Tecnica.pdf",
      en: "IT_Inverter_Ibrido_Trifase_36-60kW_Scheda_Tecnica.pdf",
      es: "IT_Inverter_Ibrido_Trifase_36-60kW_Scheda_Tecnica.pdf",
      fr: "IT_Inverter_Ibrido_Trifase_36-60kW_Scheda_Tecnica.pdf",
      de: "IT_Inverter_Ibrido_Trifase_36-60kW_Scheda_Tecnica.pdf",
    },
  },
  "bat-afore-wall-5-10kwh": {
    base: "prodotti",
    file: {
      it: "IT_Batteria_Montaggio_a_parete_Scheda_Tecnica.pdf",
      en: "IT_Batteria_Montaggio_a_parete_Scheda_Tecnica.pdf",
      es: "IT_Batteria_Montaggio_a_parete_Scheda_Tecnica.pdf",
      fr: "IT_Batteria_Montaggio_a_parete_Scheda_Tecnica.pdf",
      de: "IT_Batteria_Montaggio_a_parete_Scheda_Tecnica.pdf",
    },
  },
  "bat-afore-stack-hv-5kwh": {
    base: "prodotti",
    file: {
      it: "IT_batteria_afore_trifase_5kWh.pdf",
      en: "IT_batteria_afore_trifase_5kWh.pdf",
      es: "IT_batteria_afore_trifase_5kWh.pdf",
      fr: "IT_batteria_afore_trifase_5kWh.pdf",
      de: "IT_batteria_afore_trifase_5kWh.pdf",
    },
  },
  "atomwb512100-1": {
    base: "prodotti",
    productIdForPath: "atomwb512100-1",
    file: {
      it: "IT_Batteria_ATOM_WB_Scheda_Tecnica.pdf",
      en: "IT_Batteria_ATOM_WB_Scheda_Tecnica.pdf",
      es: "IT_Batteria_ATOM_WB_Scheda_Tecnica.pdf",
      fr: "IT_Batteria_ATOM_WB_Scheda_Tecnica.pdf",
      de: "IT_Batteria_ATOM_WB_Scheda_Tecnica.pdf",
    },
  },
  "atomwb512100": {
    base: "prodotti",
    file: {
      it: "IT_Batteria_ATOM_WB_Scheda_Tecnica.pdf",
      en: "IT_Batteria_ATOM_WB_Scheda_Tecnica.pdf",
      es: "IT_Batteria_ATOM_WB_Scheda_Tecnica.pdf",
      fr: "IT_Batteria_ATOM_WB_Scheda_Tecnica.pdf",
      de: "IT_Batteria_ATOM_WB_Scheda_Tecnica.pdf",
    },
  },
  "bat-hailei-atom-ls-10-15kwh": {
    base: "prodotti",
    file: {
      it: "IT_Batteria_ATOM_LS_Scheda_Tecnica.pdf",
      en: "IT_Batteria_ATOM_LS_Scheda_Tecnica.pdf",
      es: "IT_Batteria_ATOM_LS_Scheda_Tecnica.pdf",
      fr: "IT_Batteria_ATOM_LS_Scheda_Tecnica.pdf",
      de: "IT_Batteria_ATOM_LS_Scheda_Tecnica.pdf",
    },
  },
  "bat-hailei-atom-hs-15-41kwh": {
    base: "prodotti",
    file: {
      it: "IT_Batteria_ATOM_HS_Scheda_Tecnica.pdf",
      en: "IT_Batteria_ATOM_HS_Scheda_Tecnica.pdf",
      es: "IT_Batteria_ATOM_HS_Scheda_Tecnica.pdf",
      fr: "IT_Batteria_ATOM_HS_Scheda_Tecnica.pdf",
      de: "IT_Batteria_ATOM_HS_Scheda_Tecnica.pdf",
    },
  },
  "aio-mono-lv-afore-3-6kw-af5000w-lh": {
    base: "prodotti",
    file: {
      it: "IT_allin1_afore_Monofase.pdf",
      en: "IT_allin1_afore_Monofase.pdf",
      es: "IT_allin1_afore_Monofase.pdf",
      fr: "IT_allin1_afore_Monofase.pdf",
      de: "IT_allin1_afore_Monofase.pdf",
    },
  },
  "aio-mono-lv-afore-3-6kw-atom-aes-5-12": {
    base: "prodotti",
    file: {
      it: "IT_allin1_afore_hailei_Monofase.pdf",
      en: "IT_allin1_afore_hailei_Monofase.pdf",
      es: "IT_allin1_afore_hailei_Monofase.pdf",
      fr: "IT_allin1_afore_hailei_Monofase.pdf",
      de: "IT_allin1_afore_hailei_Monofase.pdf",
    },
  },
  "aio-trifase-hv-plus-4-6kw": {
    base: "prodotti",
    file: {
      it: "IT_All-in-One_AFORE_Trifase_Scheda_Tecnica.pdf",
      en: "IT_All-in-One_AFORE_Trifase_Scheda_Tecnica.pdf",
      es: "IT_All-in-One_AFORE_Trifase_Scheda_Tecnica.pdf",
      fr: "IT_All-in-One_AFORE_Trifase_Scheda_Tecnica.pdf",
      de: "IT_All-in-One_AFORE_Trifase_Scheda_Tecnica.pdf",
    },
  },
  "ev-oval": {
    base: "prodotti",
    file: {
      it: "EN_EV_Charger_Oval_Scheda_Tecnica.pdf",
      en: "EN_EV_Charger_Oval_Scheda_Tecnica.pdf",
      es: "EN_EV_Charger_Oval_Scheda_Tecnica.pdf",
      fr: "EN_EV_Charger_Oval_Scheda_Tecnica.pdf",
      de: "EN_EV_Charger_Oval_Scheda_Tecnica.pdf",
    },
  },
  "ev-square": {
    base: "prodotti",
    file: {
      it: "EN_EV_Charger_Square_Scheda_Tecnica.pdf",
      en: "EN_EV_Charger_Square_Scheda_Tecnica.pdf",
      es: "EN_EV_Charger_Square_Scheda_Tecnica.pdf",
      fr: "EN_EV_Charger_Square_Scheda_Tecnica.pdf",
      de: "EN_EV_Charger_Square_Scheda_Tecnica.pdf",
    },
  },
  "shenling-r290": {
    base: "documentazione",
    file: {
      it: "IT_Pompa_di_Calore_Shenling_R290_Scheda_Tecnica.pdf",
      en: "IT_Pompa_di_Calore_Shenling_R290_Scheda_Tecnica.pdf",
      es: "IT_Pompa_di_Calore_Shenling_R290_Scheda_Tecnica.pdf",
      fr: "IT_Pompa_di_Calore_Shenling_R290_Scheda_Tecnica.pdf",
      de: "IT_Pompa_di_Calore_Shenling_R290_Scheda_Tecnica.pdf",
    },
  },
  "shenling-r290-2": {
    base: "documentazione",
    file: {
      it: "IT_Pompa_di_Calore_Shenling_R290_con_Hydro_Box_Scheda_Tecnica.pdf",
      en: "IT_Pompa_di_Calore_Shenling_R290_con_Hydro_Box_Scheda_Tecnica.pdf",
      es: "IT_Pompa_di_Calore_Shenling_R290_con_Hydro_Box_Scheda_Tecnica.pdf",
      fr: "IT_Pompa_di_Calore_Shenling_R290_con_Hydro_Box_Scheda_Tecnica.pdf",
      de: "IT_Pompa_di_Calore_Shenling_R290_con_Hydro_Box_Scheda_Tecnica.pdf",
    },
  },
  "shenling-r290-all-in-one": {
    base: "documentazione",
    file: {
      it: "IT_Pompa_di_Calore_Shenling_R290_All_in_One_Scheda_Tecnica.pdf",
      en: "IT_Pompa_di_Calore_Shenling_R290_All_in_One_Scheda_Tecnica.pdf",
      es: "IT_Pompa_di_Calore_Shenling_R290_All_in_One_Scheda_Tecnica.pdf",
      fr: "IT_Pompa_di_Calore_Shenling_R290_All_in_One_Scheda_Tecnica.pdf",
      de: "IT_Pompa_di_Calore_Shenling_R290_All_in_One_Scheda_Tecnica.pdf",
    },
  },
  "shenling-r32": {
    base: "documentazione",
    file: {
      it: "IT_Pompa_di_Calore_Shenling_R32_Scheda_Tecnica.pdf",
      en: "IT_Pompa_di_Calore_Shenling_R32_Scheda_Tecnica.pdf",
      es: "IT_Pompa_di_Calore_Shenling_R32_Scheda_Tecnica.pdf",
      fr: "IT_Pompa_di_Calore_Shenling_R32_Scheda_Tecnica.pdf",
      de: "IT_Pompa_di_Calore_Shenling_R32_Scheda_Tecnica.pdf",
    },
  },
};

/** ev-diamond 使用 Scheda Tecnica EV Charger SWG5（diamond 形态） */
const EV_DIAMOND_PDF = "/documentazione/SCHEDA_TECNICA/IT_EV_Charger_SWG5_Scheda_Tecnica.pdf";

/**
 * 获取 Scheda Tecnica PDF 的直接下载链接
 * @param schedaKey 产品 schedaKey
 * @param productId 产品 id（用于 prodotti 路径，通常与 schedaKey 相同）
 * @param lang 语言
 * @returns PDF URL 或 null（无可用 PDF）
 */
export function getSchedaPdfUrl(
  schedaKey: string,
  productId: string,
  lang: LangCode = "it"
): string | null {
  const validLang: LangCode =
    ["it", "en", "es", "fr", "de"].includes(lang) ? lang : "it";

  if (schedaKey === "ev-diamond") {
    return EV_DIAMOND_PDF;
  }

  const entry = SCHEDA_PDF_MAP[schedaKey];
  if (!entry) return null;

  const filename =
    entry.file[validLang] || entry.file.it || entry.file.en || entry.file.it;
  if (!filename) return null;

  if (entry.base === "prodotti") {
    const folderId = "productIdForPath" in entry && entry.productIdForPath
      ? entry.productIdForPath
      : productId;
    return `/prodotti/${folderId}/downloads/${filename}`;
  }
  return `/documentazione/SCHEDA_TECNICA/${filename}`;
}
