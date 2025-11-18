// src/data/product-data.ts

export type Category = { slug: string; label: string }

export type Product = {
  id: string
  title: string
  subtitle?: string
  image: string
  categories: Category[] // 支持多分类
  /** 用于链接到 scheda-tecnica 页面的键值，通常是产品 id 或特定的文档标识符 */
  schedaKey?: string
}

/** 统一的分类常量，避免手写出错 */
export const CATS = {
  residenziale: { slug: "residenziale", label: "Sistemi Residenziali" },
  commerciale: { slug: "commerciale", label: "Sistemi Commerciali" },
  inverter: { slug: "inverter", label: "Inverter" },
  inverterStringa: { slug: "inverter-di-stringa", label: "Inverter di Stringa" },
  ibrido: { slug: "ibrido", label: "Inverter Ibrido" },
  batteria: { slug: "batteria", label: "Batteria di Accumulo" },
  allinone: { slug: "all-in-one", label: "All in One" },
  monofase: { slug: "monofase", label: "Monofase" },
  trifase: { slug: "trifase", label: "Trifase" },
  ev: { slug: "ev-charger", label: "EV Charger" },
  afore: { slug: "afore", label: "Afore" },
  hailei: { slug: "hailei", label: "Hailei" },
} as const

export const PRODUCTS: Product[] = [
  /* ===== Inverter di Stringa ===== */
  {
    id: "stringa-1-3kw",
    title: "Inverter di Stringa Monofase 1–3kW",
    subtitle:
      "HNS1000TL-1, HNS1500TL-1, HNS2000TL-1, HNS2500TL-1, HNS3000TL-1",
    image: "/products/inverters/stringa_1_3kw_1.png",
    categories: [CATS.residenziale, CATS.monofase, CATS.inverter, CATS.inverterStringa, CATS.afore],
    schedaKey: "stringa-1-3kw",
  },
  {
    id: "stringa-3-6kw",
    title: "Inverter di Stringa Monofase 3–6kW",
    subtitle: "HNS3000TL, HNS3600TL, HNS4000TL, HNS5000TL, HNS6000TL",
    image: "/products/inverters/stringa_3_6kw_1.png",
    categories: [CATS.residenziale, CATS.monofase, CATS.inverter, CATS.inverterStringa, CATS.afore],
    schedaKey: "stringa-3-6kw",
  },
  {
    id: "stringa-7-10kw",
    title: "Inverter di Stringa Monofase 7–10kW",
    subtitle: "HNS7000TL, HNS8000TL, HNS9000TL, HNS10000TL",
    image: "/products/inverters/stringa_7_10kw_1.png",
    categories: [CATS.residenziale, CATS.monofase, CATS.inverter, CATS.inverterStringa, CATS.afore],
    schedaKey: "stringa-7-10kw",
  },
  {
    id: "stringa-trifase-3-25kw",
    title: "Inverter di Stringa Trifase 3–25kW",
    subtitle:
      "BNT003KTL, BNT004KTL, BNT005KTL, BNT006KTL, BNT010KTL, BNT012KTL, BNT013KTL, BNT015KTL, BNT017KTL, BNT020KTL, BNT025KTL",
    image: "/products/inverters/stringa_3_25kw_1.png",
    categories: [CATS.commerciale, CATS.trifase, CATS.inverter, CATS.inverterStringa, CATS.afore],
    schedaKey: "stringa-trifase-3-25kw",
  },
  {
    id: "stringa-trifase-30kw",
    title: "Inverter di Stringa Trifase 30kW",
    subtitle: "BNT030KTL",
    image: "/products/inverters/stringa_30kw_1.png",
    categories: [CATS.commerciale, CATS.trifase, CATS.inverter, CATS.inverterStringa, CATS.afore],
    schedaKey: "stringa-trifase-30kw",
  },
  {
    id: "stringa-trifase-36-60kw",
    title: "Inverter di Stringa Trifase 36–60kW",
    subtitle: "BNT036KTL, BNT040KTL, BNT050KTL, BNT060KTL",
    image: "/products/inverters/stringa_36_60kw_1.png",
    categories: [CATS.commerciale, CATS.trifase, CATS.inverter, CATS.inverterStringa, CATS.afore],
    schedaKey: "stringa-trifase-36-60kw",
  },
  {
    id: "stringa-trifase-70-110kw",
    title: "Inverter di Stringa Trifase 70–110kW",
    subtitle: "BNT070KTL, BNT075KTL, BNT080KTL, BNT090KTL, BNT100KTL, BNT110KTL",
    image: "/products/inverters/stringa_70_110kw_1.png",
    categories: [CATS.commerciale, CATS.trifase, CATS.inverter, CATS.inverterStringa, CATS.afore],
    schedaKey: "stringa-trifase-70-110kw",
  },

  /* ===== Inverter Ibrido ===== */
  {
    id: "ibrido-monofase-1-3-6kw",
    title: "Inverter Ibrido Monofase 1–3.6kW",
    subtitle:
      "AF1K-SL-1, AF1.5K-SL-1, AF2K-SL-1, AF2.5K-SL-1, AF3K-SL-1, AF3.6K-SL-1, AF3K-SL, AF3.6K-SL",
    image: "/products/inverters/ibrido_1_3.6kw_1.png",
    categories: [CATS.residenziale, CATS.monofase, CATS.inverter, CATS.ibrido, CATS.afore],
    schedaKey: "ibrido-monofase-1-3-6kw",
  },
  {
    id: "ibrido-monofase-plus-4-6kw",
    title: "Inverter Ibrido Monofase 4–6kW · Serie Plus",
    subtitle: "AF4K-SLP, AF4.6K-SLP, AF5K-SLP, AF5.5K-SLP, AF6K-SLP",
    image: "/products/inverters/ibrido_4_6kw_plus_1.png",
    categories: [CATS.residenziale, CATS.monofase, CATS.inverter, CATS.ibrido, CATS.afore],
    schedaKey: "ibrido-monofase-plus-4-6kw",
  },
  {
    id: "ibrido-trifase-plus-8-12kw",
    title: "Inverter Ibrido Trifase 8–12kW · Serie Plus",
    subtitle: "AF8K-SLP, AF9K-SLP, AF10K-SLP, AF11K-SLP, AF12K-SLP",
    image: "/products/inverters/ibrido_8_12kw_plus_1.png",
    categories: [CATS.commerciale, CATS.trifase, CATS.inverter, CATS.ibrido, CATS.afore],
    schedaKey: "ibrido-trifase-plus-8-12kw",
  },
  {
    id: "ibrido-trifase-3-15kw",
    title: "Inverter Ibrido Trifase 3–15kW",
    subtitle:
      "AF3K-MTH, AF4K-MTH, AF5K-MTH, AF6K-MTH, AF8K-MTH, AF10K-MTH, AF12K-MTH, AF15K-MTH",
    image: "/products/inverters/ibrido_3_15kw_1.png",
    categories: [CATS.commerciale, CATS.trifase, CATS.inverter, CATS.ibrido, CATS.afore],
    schedaKey: "ibrido-trifase-3-15kw",
  },
  {
    id: "ibrido-trifase-plus-3-12kw",
    title: "Inverter Ibrido Trifase 3–12kW · Serie Plus",
    subtitle: "AF3K-THP, AF4K-THP, AF5K-THP, AF6K-THP, AF8K-THP, AF10K-THP, AF12K-THP",
    image: "/products/inverters/ibrido_3_12kw_plus_1.png",
    categories: [CATS.commerciale, CATS.trifase, CATS.inverter, CATS.ibrido, CATS.afore],
    schedaKey: "ibrido-trifase-plus-3-12kw",
  },
  {
    id: "ibrido-trifase-3-30kw",
    title: "Inverter Ibrido Trifase 3–30kW",
    subtitle:
      "AF3K-TH-0, AF4K-TH-0, AF5K-TH-0, AF6K-TH-0, AF8K-TH-0, AF10K-TH-0, AF12K-TH-0, AF15K-TH-0, AF17K-TH-0, AF20K-TH-0, AF25K-TH-0, AF30K-TH-0",
    image: "/products/inverters/ibrido_3_30kw_1.png",
    categories: [CATS.commerciale, CATS.trifase, CATS.inverter, CATS.ibrido, CATS.afore],
    schedaKey: "ibrido-trifase-3-30kw",
  },
  {
    id: "ibrido-trifase-36-60kw",
    title: "Inverter Ibrido Trifase 36–60kW",
    subtitle: "AF36K-TH, AF40K-TH, AF50K-TH, AF60K-TH",
    image: "/products/inverters/ibrido_36_60kw_1.png",
    categories: [CATS.commerciale, CATS.trifase, CATS.inverter, CATS.ibrido, CATS.afore],
    schedaKey: "ibrido-trifase-36-60kw",
  },

  /* ===== Batteria di Accumulo · Afore ===== */
  {
    id: "bat-afore-wall-5-10kwh",
    title: "Batteria di accumulo montata a parete (5–10kWh)",
    subtitle: "AF5000W-LF, AF10000W-LG",
    image: "/products/batteries/batteria_afore_muro_5_10kw_1.png",
    categories: [CATS.residenziale, CATS.batteria, CATS.afore],
    schedaKey: "bat-afore-wall-5-10kwh",
  },
  {
    id: "bat-afore-stack-hv-5kwh",
    title: "Batteria di accumulo impilabile ad alta tensione",
    subtitle: "AF5000W-LE",
    image: "/products/batteries/batteria_afore_stack_hv_5kw_1.png",
    categories: [CATS.residenziale, CATS.batteria, CATS.afore],
    schedaKey: "bat-afore-stack-hv-5kwh",
  },
  {
    id: "bat-afore-stack-lv-2-5-5kwh",
    title: "Batteria di accumulo impilabile a bassa tensione",
    subtitle: "AF2500W-HB, AF5000W-HC",
    image: "/products/batteries/batteria_afore_stack_lv_2.5_5kw_1.png",
    categories: [CATS.residenziale, CATS.batteria, CATS.afore],
    schedaKey: "bat-afore-stack-lv-2-5-5kwh",
  },

  /* ===== Batteria di Accumulo · Hailei ===== */
  {
    id: "bat-hailei-atom-wb-5kwh-1",
    title: "ATOM WB 5kWh-1",
    subtitle: "ATOM WB-512100-1",
    image: "/products/batteries/batteria_hailei_atom_wb_5kw_1.png",
    categories: [CATS.residenziale, CATS.batteria, CATS.hailei],
    schedaKey: "bat-hailei-atom-wb-5kwh-1",
  },
  {
    id: "bat-hailei-atom-wb-5-10kwh",
    title: "ATOM WB 5kWh / 10kWh · Wall-mounted LiFePO4",
    subtitle: "ATOM WB-512100, ATOM WB MAX-512200",
    image: "/products/batteries/batteria_hailei_atom_wb_5_10kw_1.png",
    categories: [CATS.residenziale, CATS.batteria, CATS.hailei],
    schedaKey: "bat-hailei-atom-wb-5-10kwh",
  },
  {
    id: "bat-hailei-atom-ls-10-15kwh",
    title: "ATOM LS",
    subtitle: "ATOM LS-10.24, ATOM LS-15.36",
    image: "/products/batteries/batteria_hailei_atom_ls_10_15kw_1.png",
    categories: [CATS.commerciale, CATS.batteria, CATS.hailei],
    schedaKey: "bat-hailei-atom-ls-10-15kwh",
  },
  {
    id: "bat-hailei-atom-hs-15-41kwh",
    title: "ATOM HS",
    subtitle:
      "ATOM HS-15.36, ATOM HS-20.48, ATOM HS-25.6, ATOM HS-30.72, ATOM HS-35.84, ATOM HS-40.96",
    image: "/products/batteries/batteria_hailei_atom_hs_15_41kw_1.png",
    categories: [CATS.commerciale, CATS.batteria, CATS.hailei],
    schedaKey: "bat-hailei-atom-hs-15-41kwh",
  },

  /* ===== All in One ===== */
  {
    id: "aio-mono-lv-afore-3-6kw-af5000w-lh",
    title: "All in One · Monofase (LV)",
    subtitle: "Inverter: AF3K-ASL / AF6K-ASL · Accumulo: AF5000W-LH",
    image: "/products/all-in-one/allin1_afore_monofase_lv_3_6kw_1.png",
    categories: [CATS.residenziale, CATS.allinone, CATS.monofase, CATS.afore],
    schedaKey: "aio-mono-lv-afore-3-6kw-af5000w-lh",
  },
  {
    id: "aio-mono-lv-afore-3-6kw-atom-aes-5-12",
    title: "All in One · Monofase (LV)",
    subtitle: "Inverter: AF3K-ASL / AF6K-ASL · Accumulo: ATOM AES-5.12",
    image: "/products/all-in-one/allin1_afore_hailei_monofase_lv_3_6kw_1.png",
    categories: [CATS.residenziale, CATS.allinone, CATS.monofase, CATS.afore, CATS.hailei],
    schedaKey: "aio-mono-lv-afore-3-6kw-atom-aes-5-12",
  },
  {
    id: "aio-mono-lv-atom-aes-3-6kw-atom-aes-5-12",
    title: "All in One · Monofase (LV)",
    subtitle: "Inverter: ATOM AES 3–6kW · Accumulo: ATOM AES-5.12",
    image: "/products/all-in-one/allin1_hailei_monofase_lv_3_6kw_1.png",
    categories: [CATS.residenziale, CATS.allinone, CATS.monofase, CATS.hailei],
    schedaKey: "aio-mono-lv-atom-aes-3-6kw-atom-aes-5-12",
  },
  {
    id: "aio-trifase-hv-plus-4-6kw",
    title: "All in One · Trifase (HV) · Serie Plus",
    subtitle: "AF4K-SLP, AF4.6K-SLP, AF5K-SLP, AF5.5K-SLP, AF6K-SLP",
    image: "/products/all-in-one/allin1_afore_trifase_hv_4_6kw_1.png",
    categories: [CATS.commerciale, CATS.allinone, CATS.trifase, CATS.afore],
    schedaKey: "aio-trifase-hv-plus-4-6kw",
  },

  /* ===== EV Charger ===== */
  {
    id: "ev-diamond",
    title: "EV Charger · Forma a diamante",
    subtitle: "Serie personalizzata",
    image: "/products/chargers/ev_charger_diamond_1.png",
    categories: [CATS.ev],
    schedaKey: "ev-diamond",
  },
  {
    id: "ev-oval",
    title: "EV Charger · Forma ovale",
    subtitle: "Serie personalizzata",
    image: "/products/chargers/ev_charger_oval_1.png",
    categories: [CATS.ev],
    schedaKey: "ev-oval",
  },
  {
    id: "ev-square",
    title: "EV Charger · Forma quadrata",
    subtitle: "Serie personalizzata",
    image: "/products/chargers/ev_charger_square_1.png",
    categories: [CATS.ev],
    schedaKey: "ev-square",
  },
]

type LangCode = "it" | "en" | "es";

type ProductCopy = {
  title?: Partial<Record<LangCode, string>>;
  subtitle?: Partial<Record<LangCode, string>>;
};

const PRODUCT_COPY: Record<string, ProductCopy> = {
  "stringa-1-3kw": {
    title: {
      en: "Single-phase String Inverter 1–3kW",
      es: "Inversor de cadena monofásico 1–3kW",
    },
  },
  "stringa-3-6kw": {
    title: {
      en: "Single-phase String Inverter 3–6kW",
      es: "Inversor de cadena monofásico 3–6kW",
    },
  },
  "stringa-7-10kw": {
    title: {
      en: "Single-phase String Inverter 7–10kW",
      es: "Inversor de cadena monofásico 7–10kW",
    },
  },
  "stringa-trifase-3-25kw": {
    title: {
      en: "Three-phase String Inverter 3–25kW",
      es: "Inversor de cadena trifásico 3–25kW",
    },
  },
  "stringa-trifase-30kw": {
    title: {
      en: "Three-phase String Inverter 30kW",
      es: "Inversor de cadena trifásico 30kW",
    },
  },
  "stringa-trifase-36-60kw": {
    title: {
      en: "Three-phase String Inverter 36–60kW",
      es: "Inversor de cadena trifásico 36–60kW",
    },
  },
  "stringa-trifase-70-110kw": {
    title: {
      en: "Three-phase String Inverter 70–110kW",
      es: "Inversor de cadena trifásico 70–110kW",
    },
  },
  "ibrido-monofase-1-3-6kw": {
    title: {
      en: "Single-phase Hybrid Inverter 1–3.6kW",
      es: "Inversor híbrido monofásico 1–3.6kW",
    },
  },
  "ibrido-monofase-plus-4-6kw": {
    title: {
      en: "Single-phase Hybrid Inverter 4–6kW · Plus Series",
      es: "Inversor híbrido monofásico 4–6kW · Serie Plus",
    },
  },
  "ibrido-trifase-plus-8-12kw": {
    title: {
      en: "Three-phase Hybrid Inverter 8–12kW · Plus Series",
      es: "Inversor híbrido trifásico 8–12kW · Serie Plus",
    },
  },
  "ibrido-trifase-3-15kw": {
    title: {
      en: "Three-phase Hybrid Inverter 3–15kW",
      es: "Inversor híbrido trifásico 3–15kW",
    },
  },
  "ibrido-trifase-plus-3-12kw": {
    title: {
      en: "Three-phase Hybrid Inverter 3–12kW · Plus Series",
      es: "Inversor híbrido trifásico 3–12kW · Serie Plus",
    },
  },
  "ibrido-trifase-3-30kw": {
    title: {
      en: "Three-phase Hybrid Inverter 3–30kW",
      es: "Inversor híbrido trifásico 3–30kW",
    },
  },
  "ibrido-trifase-36-60kw": {
    title: {
      en: "Three-phase Hybrid Inverter 36–60kW",
      es: "Inversor híbrido trifásico 36–60kW",
    },
  },
  "bat-afore-wall-5-10kwh": {
    title: {
      en: "Wall-mounted Storage Battery (5–10kWh)",
      es: "Batería de almacenamiento mural (5–10kWh)",
    },
  },
  "bat-afore-stack-hv-5kwh": {
    title: {
      en: "Stackable High-voltage Storage Battery",
      es: "Batería de almacenamiento apilable de alta tensión",
    },
  },
  "bat-afore-stack-lv-2-5-5kwh": {
    title: {
      en: "Stackable Low-voltage Storage Battery",
      es: "Batería de almacenamiento apilable de baja tensión",
    },
  },
  "bat-hailei-atom-wb-5-10kwh": {
    title: {
      es: "ATOM WB 5kWh / 10kWh · LiFePO4 de pared",
    },
  },
  "aio-mono-lv-afore-3-6kw-af5000w-lh": {
    title: {
      en: "All in One · Single-phase (LV)",
      es: "All in One · Monofásico (LV)",
    },
    subtitle: {
      en: "Inverter: AF3K-ASL / AF6K-ASL · Storage: AF5000W-LH",
      es: "Inversor: AF3K-ASL / AF6K-ASL · Almacenamiento: AF5000W-LH",
    },
  },
  "aio-mono-lv-afore-3-6kw-atom-aes-5-12": {
    title: {
      en: "All in One · Single-phase (LV)",
      es: "All in One · Monofásico (LV)",
    },
    subtitle: {
      en: "Inverter: AF3K-ASL / AF6K-ASL · Storage: ATOM AES-5.12",
      es: "Inversor: AF3K-ASL / AF6K-ASL · Almacenamiento: ATOM AES-5.12",
    },
  },
  "aio-mono-lv-atom-aes-3-6kw-atom-aes-5-12": {
    title: {
      en: "All in One · Single-phase (LV)",
      es: "All in One · Monofásico (LV)",
    },
    subtitle: {
      en: "Inverter: ATOM AES 3–6kW · Storage: ATOM AES-5.12",
      es: "Inversor: ATOM AES 3–6kW · Almacenamiento: ATOM AES-5.12",
    },
  },
  "aio-trifase-hv-plus-4-6kw": {
    title: {
      en: "All in One · Three-phase (HV) · Plus Series",
      es: "All in One · Trifásico (HV) · Serie Plus",
    },
    subtitle: {
      en: "AF4K-SLP, AF4.6K-SLP, AF5K-SLP, AF5.5K-SLP, AF6K-SLP",
      es: "AF4K-SLP, AF4.6K-SLP, AF5K-SLP, AF5.5K-SLP, AF6K-SLP",
    },
  },
  "ev-diamond": {
    title: {
      en: "EV Charger · Diamond Shape",
      es: "Cargador EV · Forma de diamante",
    },
    subtitle: {
      en: "Custom series",
      es: "Serie personalizada",
    },
  },
  "ev-oval": {
    title: {
      en: "EV Charger · Oval Shape",
      es: "Cargador EV · Forma ovalada",
    },
    subtitle: {
      en: "Custom series",
      es: "Serie personalizada",
    },
  },
  "ev-square": {
    title: {
      en: "EV Charger · Square Shape",
      es: "Cargador EV · Forma cuadrada",
    },
    subtitle: {
      en: "Custom series",
      es: "Serie personalizada",
    },
  },
};

function normalizeLang(lang: string): LangCode {
  return (["it", "en", "es"].includes(lang) ? lang : "it") as LangCode;
}

function translateField(
  product: Product,
  field: "title" | "subtitle",
  lang: string
): string | undefined {
  const normalizedLang = normalizeLang(lang);
  const entry = PRODUCT_COPY[product.id];
  const fallback = field === "title" ? product.title : product.subtitle;
  if (!entry) return fallback;
  const dictionary = entry[field];
  return dictionary?.[normalizedLang] ?? fallback;
}

export function getProductTitle(product: Product, lang: string) {
  return translateField(product, "title", lang) ?? product.title;
}

export function getProductSubtitle(product: Product, lang: string) {
  return translateField(product, "subtitle", lang);
}

/** 方便按 id 查找 */
export const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));

/** 通过 category 和 id 查找产品 */
export function findProductBySlugs(category: string, id: string): Product | undefined {
  return PRODUCTS.find(p => {
    const { family } = resolvePath(p);
    return family === category && p.id === id;
  });
}

/** 通过 schedaKey 查找产品 */
export const bySchedaKey = Object.fromEntries(
  PRODUCTS.filter(p => p.schedaKey).map(p => [p.schedaKey!, p])
);

/** 根据 slug 取显示名（用于面包屑/UI） */
export const labelOf = (slug: string) =>
  (Object.values(CATS).find(c => c.slug === slug)?.label) ?? slug;

/** 推导产品所在层级：macro（大类）+ family（子类）
 * 仅用来生成面包屑 & 语义化链接
 */
export function resolvePath(p: Product): { macro: string; family: string } {
  const has = (s: string) => p.categories.some(c => c.slug === s);

  // 宏类
  let macro = "prodotti";
  if (has("inverter"))    macro = "inverter";
  else if (has("batteria"))   macro = "batteria";
  else if (has("all-in-one")) macro = "all-in-one";
  else if (has("ev-charger")) macro = "ev-charger";

  // 子类
  let family = macro;
  if (macro === "inverter") {
    if (has("inverter-di-stringa")) family = "inverter-di-stringa";
    else if (has("ibrido"))         family = "ibrido";
    else                            family = "inverter";
  } else if (macro === "batteria") {
    if (has("afore"))      family = "afore";
    else if (has("hailei"))family = "hailei";
    else                   family = "batteria";
  } else if (macro === "all-in-one") {
    family = "all-in-one";
  } else if (macro === "ev-charger") {
    family = "ev-charger";
  }

  return { macro, family };
}

/** 统一生成链接：沿用你的 /prodotti/[category]/[id]
 * 让 category 使用 family，更语义化
 * @param lang 语言代码 (it, en, es)，如果不提供则返回不带语言段的路径
 */
export const hrefOf = (p: Product, lang?: string) => {
  const { family } = resolvePath(p);
  const basePath = `/prodotti/${family}/${p.id}`;
  return lang ? `/${lang}${basePath}` : basePath;
};
