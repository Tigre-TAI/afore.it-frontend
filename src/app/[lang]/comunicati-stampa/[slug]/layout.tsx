import { PRESS_ITEM_SLUGS } from "@/data/comunicati-stampa-data";

const LANGS = ["it", "en", "es", "fr", "de"] as const;

export async function generateStaticParams() {
  const params: Array<{ lang: string; slug: string }> = [];
  for (const lang of LANGS) {
    for (const slug of PRESS_ITEM_SLUGS) {
      params.push({ lang, slug });
    }
  }
  return params;
}

export default function ComunicatiStampaSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
