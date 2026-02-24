/** 分类判断，用于左侧导航分组过滤 */
export const has = (p: { categories?: { slug: string }[] }, slug: string) =>
  p?.categories?.some((c) => c.slug === slug);

/** 页面分组（左侧目录 + 主列表用） */
export const GROUPS = [
  {
    bigTitle: "PV Inverter",
    subItems: [
      { label: "Ottimizzatori", lineIndex: 0 },
      { label: "Inverter di Stringa", lineIndex: 1 },
      { label: "Inverter Ibrido", lineIndex: 2 },
    ],
    lines: [
      { title: "Ottimizzatori", subtitle: "", filter: (_p: any) => false },
      { title: "Inverter di Stringa", subtitle: "Monofase · Trifase", filter: (p: any) => has(p, "inverter") && has(p, "inverter-di-stringa") },
      { title: "Inverter Ibrido", subtitle: "Monofase · Trifase", filter: (p: any) => has(p, "inverter") && has(p, "ibrido") },
    ],
  },
  {
    bigTitle: "Batteria di Accumulo",
    lines: [
      { title: "Sistema di accumulo Afore", subtitle: "AFORE Serie", filter: (p: any) => has(p, "batteria") && has(p, "afore") },
      { title: "Sistema di accumulo Hailei", subtitle: "AFORE Serie", filter: (p: any) => has(p, "batteria") && has(p, "hailei") },
    ],
  },
  {
    bigTitle: "All in One",
    lines: [
      { title: "Sistema di accumulo Afore", subtitle: "Monofase · Trifase", filter: (p: any) => has(p, "all-in-one") && has(p, "afore") },
      { title: "Sistema di accumulo Hailei", subtitle: "Monofase", filter: (p: any) => has(p, "all-in-one") && has(p, "hailei") },
    ],
  },
  {
    bigTitle: "EV CHARGER",
    lines: [
      { title: "Forma a diamante · Forma ovale · Forma quadrata", subtitle: "Serie personalizzata", filter: (p: any) => has(p, "ev-charger") },
    ],
  },
] as const;
