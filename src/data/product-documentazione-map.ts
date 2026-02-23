/**
 * 产品 → Documentazione 过滤规则
 * 每个产品只展示与其对应的文档，避免混入无关文件
 */

/** 文件名包含以下任一 pattern（不区分大小写）则纳入 */
export const PRODUCT_DOC_PATTERNS: Record<
  string,
  { folder: string; include: string[] }
> = {
  /* ===== Inverter di Stringa ===== */
  "stringa-1-3kw": {
    folder: "PV_INVERTER",
    include: ["HNS_1-3kW", "HNS1000", "HNS1500", "HNS2000", "HNS2500", "HNS3000", "HNS1000-3000"],
  },
  "stringa-3-6kw": {
    folder: "PV_INVERTER",
    include: ["HNS_3-10kW", "HNS3000", "HNS3600", "HNS4000", "HNS5000", "HNS6000", "HNS3000-10000"],
  },
  "stringa-7-10kw": {
    folder: "PV_INVERTER",
    include: ["HNS_3-10kW", "HNS7000", "HNS8000", "HNS9000", "HNS10000", "HNS3000-10000"],
  },
  "stringa-trifase-3-25kw": {
    folder: "PV_INVERTER",
    include: ["BNT_3-25kW", "BNT003", "BNT004", "BNT005", "BNT006", "BNT010", "BNT012", "BNT013", "BNT015", "BNT017", "BNT020", "BNT025", "BNT003-025", "BNT003-25"],
  },
  "stringa-trifase-30kw": {
    folder: "PV_INVERTER",
    include: ["BNT_17-60kW", "BNT_30-60kW", "BNT030", "BNT036", "BNT040", "BNT050", "BNT060", "BNT030-60"],
  },
  "stringa-trifase-36-60kw": {
    folder: "PV_INVERTER",
    include: ["BNT_17-60kW", "BNT_30-60kW", "BNT036", "BNT040", "BNT050", "BNT060", "BNT030-60"],
  },
  "stringa-trifase-70-110kw": {
    folder: "PV_INVERTER",
    include: [], // PV_INVERTER 无 70-110 证书，不展示 Documentazione
  },

  /* ===== Inverter Ibrido ===== */
  "ibrido-monofase-1-3-6kw": {
    folder: "PV_INVERTER",
    include: ["AF-SL_1-6kW", "AF-SL", "AF3-6K-SL", "AF3-6K-SLP"],
  },
  "ibrido-monofase-plus-4-6kw": {
    folder: "PV_INVERTER",
    include: ["AF-SL_1-6kW", "AF-SL", "AF3-6K-SL", "AF3-6K-SLP"],
  },
  "ibrido-trifase-plus-8-12kw": {
    folder: "PV_INVERTER",
    include: ["AF-TH_3-17kW", "AF-TH_Guida", "Ibrido_Trifase"],
  },
  "ibrido-trifase-3-15kw": {
    folder: "PV_INVERTER",
    include: ["AF-TH_3-17kW", "AF-TH_Guida", "Ibrido_Trifase"],
  },
  "ibrido-trifase-plus-3-12kw": {
    folder: "PV_INVERTER",
    include: ["AF-TH_20-30kW", "AF-TH_3-30kW", "AF3-30K-THP", "AF-TH_Guida", "Ibrido_Trifase"],
  },
  "ibrido-trifase-3-30kw": {
    folder: "PV_INVERTER",
    include: ["AF-TH_20-30kW", "AF-TH_3-30kW", "AF3-30K-THP", "AF-TH_Guida", "Ibrido_Trifase"],
  },
  "ibrido-trifase-36-60kw": {
    folder: "PV_INVERTER",
    include: ["AF-TH_36-60kW", "AF-TH_Guida", "Ibrido_Trifase"],
  },

  /* ===== Batteria · 仅 Afore 有 documentazione，Hailei 无 ===== */
  "bat-afore-wall-5-10kwh": {
    folder: "BATTERIA_DI_ACCUMULO",
    include: ["BassaTensione", "AF5000W-LF", "AF10000W-LG"],
  },
  "bat-afore-stack-hv-5kwh": {
    folder: "BATTERIA_DI_ACCUMULO",
    include: ["AltaTensione"],
  },
  "bat-afore-stack-lv-2-5-5kwh": {
    folder: "BATTERIA_DI_ACCUMULO",
    include: ["AltaTensione", "AF2500W-HB", "AF5000W-HC"],
  },
  "atomwb512100-1": {
    folder: "BATTERIA_DI_ACCUMULO",
    include: [],
  },
  "atomwb512100": {
    folder: "BATTERIA_DI_ACCUMULO",
    include: [],
  },
  "bat-hailei-atom-ls-10-15kwh": {
    folder: "BATTERIA_DI_ACCUMULO",
    include: [],
  },
  "bat-hailei-atom-hs-15-41kwh": {
    folder: "BATTERIA_DI_ACCUMULO",
    include: [],
  },

  /* ===== All in One ===== */
  "aio-mono-lv-afore-3-6kw-af5000w-lh": {
    folder: "ALL_IN_ONE",
    include: ["BassaTensione", "Monofase", "AF6K-ASL", "AF6K-SL"],
  },
  "aio-mono-lv-afore-3-6kw-atom-aes-5-12": {
    folder: "ALL_IN_ONE",
    include: ["BassaTensione", "Monofase", "AFORE-HAILEI", "HAILEI"],
  },
  "aio-mono-lv-atom-aes-3-6kw-atom-aes-5-12": {
    folder: "ALL_IN_ONE",
    include: ["BassaTensione", "Monofase", "HAILEI"],
  },
  "aio-trifase-hv-plus-4-6kw": {
    folder: "ALL_IN_ONE",
    include: ["AltaTensione", "Trifase", "AF30K", "ATOM-HS"],
  },

  /* ===== EV Charger — 共用 EV_CHARGER，不按型号细分 ===== */
  "ev-diamond": {
    folder: "EV_CHARGER",
    include: [""], // 空串表示匹配全部
  },
  "ev-oval": {
    folder: "EV_CHARGER",
    include: [""],
  },
  "ev-square": {
    folder: "EV_CHARGER",
    include: [""],
  },
};

/**
 * 获取产品的 Documentazione 配置
 * 若未配置则按 family 回退到默认文件夹（旧逻辑，但会展示全文件夹）
 */
export function getProductDocConfig(
  productId: string,
  family: string
): { folder: string; include: string[] } | null {
  const cfg = PRODUCT_DOC_PATTERNS[productId];
  if (cfg) return cfg;

  // 回退：family → folder，展示全部（保持旧行为）
  const FAMILY_FOLDER: Record<string, string> = {
    inverter: "PV_INVERTER",
    "inverter-di-stringa": "PV_INVERTER",
    ibrido: "PV_INVERTER",
    afore: "BATTERIA_DI_ACCUMULO",
    hailei: "BATTERIA_DI_ACCUMULO",
    batteria: "BATTERIA_DI_ACCUMULO",
    "all-in-one": "ALL_IN_ONE",
    "ev-charger": "EV_CHARGER",
  };
  const folder = FAMILY_FOLDER[family];
  if (!folder) return null;

  return { folder, include: [""] };
}
