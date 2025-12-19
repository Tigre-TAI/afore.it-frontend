import { MetadataRoute } from 'next';
import { PRODUCTS } from '@/data/product-data';
import { resolvePath } from '@/data/product-data';

// Force static generation for sitemap
export const dynamic = 'force-static';
export const revalidate = false;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.afore.it';
const canonicalLang = 'it'; // Only include canonical /it URLs

/**
 * Sitemap for CloudFront static site
 * 
 * Rules:
 * - Include only canonical 200 URLs under /it
 * - Exclude URLs that redirect (301/302) - root / is excluded
 * - Exclude noindex pages - root / has robots.index = false
 * - Ensure lastmod is present
 * - Single sitemap (no sitemap index needed for this size)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // 1. Homepage - /it (canonical)
  sitemapEntries.push({
    url: `${baseUrl}/${canonicalLang}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 1.0,
  });

  // 2. Main category pages - /it versions only
  const mainPages = [
    { path: 'prodotti', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: 'documentazione', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: 'garanzia', priority: 0.8, changeFrequency: 'monthly' as const },
  ];

  mainPages.forEach(({ path, priority, changeFrequency }) => {
    sitemapEntries.push({
      url: `${baseUrl}/${canonicalLang}/${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    });
  });

  // 3. Product category pages - /it versions only
  const productCategoryPages = [
    { path: 'prodotti/allin1', priority: 0.85 },
    { path: 'prodotti/inverter-di-stringa', priority: 0.85 },
    { path: 'prodotti/ibrido', priority: 0.85 },
    { path: 'prodotti/batteria-di-accumulo', priority: 0.85 },
    { path: 'prodotti/ev-charger', priority: 0.85 },
    { path: 'prodotti/pv-inverter', priority: 0.85 },
    { path: 'prodotti/pv-inverter/inverter-di-stringa', priority: 0.8 },
    { path: 'prodotti/pv-inverter/inverter-ibrido', priority: 0.8 },
    { path: 'prodotti/allin1/sistema-di-accumulo-afore', priority: 0.75 },
    { path: 'prodotti/allin1/sistema-di-accumulo-hailei', priority: 0.75 },
    { path: 'prodotti/batteria-di-accumulo/serie-afore', priority: 0.75 },
    { path: 'prodotti/batteria-di-accumulo/serie-accumulo-hailei', priority: 0.75 },
  ];

  productCategoryPages.forEach(({ path, priority }) => {
    sitemapEntries.push({
      url: `${baseUrl}/${canonicalLang}/${path}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority,
    });
  });

  // 4. Product detail pages - /it versions only
  PRODUCTS.forEach(product => {
    const { family } = resolvePath(product);
    sitemapEntries.push({
      url: `${baseUrl}/${canonicalLang}/prodotti/${family}/${product.id}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  // 5. Documentation sub-pages - /it versions only
  const docPages = [
    { path: 'documentazione/archivio', priority: 0.6 },
    { path: 'documentazione/guida', priority: 0.6 },
    { path: 'documentazione/manuale', priority: 0.6 },
    { path: 'documentazione/inverter-ibridi', priority: 0.6 },
    { path: 'documentazione/certificati-inverter-di-stringa', priority: 0.6 },
    { path: 'documentazione/certificati-inverter-ibridi', priority: 0.6 },
    { path: 'documentazione/certificati-all-in-one', priority: 0.6 },
    { path: 'documentazione/accumulo-afore', priority: 0.6 },
    // Note: scheda-tecnica is a dynamic page, not included in sitemap
  ];

  docPages.forEach(({ path, priority }) => {
    sitemapEntries.push({
      url: `${baseUrl}/${canonicalLang}/${path}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority,
    });
  });

  // Sort by priority (highest first), then by URL
  sitemapEntries.sort((a, b) => {
    if (a.priority !== b.priority) {
      return (b.priority || 0) - (a.priority || 0);
    }
    return a.url.localeCompare(b.url);
  });

  return sitemapEntries;
}
