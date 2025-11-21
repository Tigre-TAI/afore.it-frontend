import { MetadataRoute } from 'next';
import { PRODUCTS } from '@/data/product-data';
import { resolvePath } from '@/data/product-data';

// Force static generation for sitemap
export const dynamic = 'force-static';
export const revalidate = false;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.afore.it';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = ['it', 'en', 'es'];
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add homepage for each language
  languages.forEach(lang => {
    sitemapEntries.push({
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          it: `${baseUrl}/it`,
          en: `${baseUrl}/en`,
          es: `${baseUrl}/es`,
        },
      },
    });
  });

  // Add main category pages
  const mainPages = [
    { path: 'prodotti', priority: 0.9 },
    { path: 'documentazione', priority: 0.8 },
    { path: 'garanzia', priority: 0.8 },
  ];

  mainPages.forEach(({ path, priority }) => {
    languages.forEach(lang => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}/${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority,
        alternates: {
          languages: {
            it: `${baseUrl}/it/${path}`,
            en: `${baseUrl}/en/${path}`,
            es: `${baseUrl}/es/${path}`,
          },
        },
      });
    });
  });

  // Add product pages
  PRODUCTS.forEach(product => {
    const { family } = resolvePath(product);
    languages.forEach(lang => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}/prodotti/${family}/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            it: `${baseUrl}/it/prodotti/${family}/${product.id}`,
            en: `${baseUrl}/en/prodotti/${family}/${product.id}`,
            es: `${baseUrl}/es/prodotti/${family}/${product.id}`,
          },
        },
      });
    });
  });

  // Add documentation sub-pages
  const docPages = [
    'archivio',
    'guida',
    'manuale',
    'scheda-tecnica',
    'inverter-ibridi',
    'certificati-inverter-di-stringa',
    'certificati-inverter-ibridi',
    'certificati-all-in-one',
    'accumulo-afore',
  ];

  docPages.forEach(docPage => {
    languages.forEach(lang => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}/documentazione/${docPage}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: {
            it: `${baseUrl}/it/documentazione/${docPage}`,
            en: `${baseUrl}/en/documentazione/${docPage}`,
            es: `${baseUrl}/es/documentazione/${docPage}`,
          },
        },
      });
    });
  });

  return sitemapEntries;
}

