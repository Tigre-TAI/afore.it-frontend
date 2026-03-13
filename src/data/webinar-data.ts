/**
 * Webinar item keys and their URL slugs.
 */
export const WEBINAR_ITEM_SLUGS = [
  "afore-hailei",
  "afore-hailei-24-mar",
  "corso-commerciale-shenling",
] as const;
export type WebinarSlug = (typeof WEBINAR_ITEM_SLUGS)[number];

export const SLUG_TO_KEY: Record<WebinarSlug, string> = {
  "afore-hailei": "aforeHailei",
  "afore-hailei-24-mar": "aforeHailei24Mar",
  "corso-commerciale-shenling": "shenlingCorsoCommerciale",
};

export const KEY_TO_SLUG: Record<string, WebinarSlug> = {
  aforeHailei: "afore-hailei",
  aforeHailei24Mar: "afore-hailei-24-mar",
  shenlingCorsoCommerciale: "corso-commerciale-shenling",
};
