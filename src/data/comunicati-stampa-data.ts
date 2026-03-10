/**
 * Comunicati stampa item keys and their URL slugs.
 * Used for static generation and routing.
 */
export const PRESS_ITEM_SLUGS = ["key-energy-2026", "spazio-900", "key-energy-2026-afore-italia"] as const;
export type PressSlug = (typeof PRESS_ITEM_SLUGS)[number];

/** Map slug -> item key */
export const SLUG_TO_KEY: Record<PressSlug, string> = {
  "key-energy-2026": "keyEnergy2026",
  "spazio-900": "spazio900",
  "key-energy-2026-afore-italia": "webinarHailei24Marzo2026",
};

/** Map item key -> slug */
export const KEY_TO_SLUG: Record<string, PressSlug> = {
  keyEnergy2026: "key-energy-2026",
  spazio900: "spazio-900",
  webinarHailei24Marzo2026: "key-energy-2026-afore-italia",
};
