/**
 * Webinar item keys and their URL slugs.
 */
export const WEBINAR_ITEM_SLUGS = ["afore-hailei"] as const;
export type WebinarSlug = (typeof WEBINAR_ITEM_SLUGS)[number];

export const SLUG_TO_KEY: Record<WebinarSlug, string> = {
  "afore-hailei": "aforeHailei",
};

export const KEY_TO_SLUG: Record<string, WebinarSlug> = {
  aforeHailei: "afore-hailei",
};
