// Structured Data (Schema.org) for SEO
import { PRODUCTS } from '@/data/product-data';

interface StructuredDataProps {
  type: 'Organization' | 'Product' | 'BreadcrumbList' | 'WebSite';
  data?: any;
  lang?: string;
}

export function StructuredData({ type, data, lang = 'it' }: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.afore.it';
  
  const getStructuredData = () => {
    switch (type) {
      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Afore Italia',
          alternateName: 'Afore',
          url: baseUrl,
          logo: `${baseUrl}/image/logos/logo_afore_light.png`,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+39-351-3399999',
            contactType: 'customer service',
            areaServed: 'IT',
            availableLanguage: ['Italian', 'English', 'Spanish'],
          },
          sameAs: [
            'https://www.facebook.com/profile.php?id=61570302226961',
            'https://www.instagram.com/afore.italia/',
            'https://www.youtube.com/@aforeitalia',
            'https://it.linkedin.com/company/afore-italia',
            'https://www.tiktok.com/@afore.italia',
          ],
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'IT',
          },
        };
      
      case 'WebSite':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Afore Italia',
          url: baseUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${baseUrl}/${lang}/prodotti?search={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
          inLanguage: lang === 'it' ? 'it-IT' : lang === 'es' ? 'es-ES' : 'en-US',
        };
      
      case 'BreadcrumbList':
        if (!data?.items) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data.items.map((item: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: item.href ? `${baseUrl}${item.href}` : undefined,
          })),
        };
      
      case 'Product':
        if (!data) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: data.title,
          description: data.subtitle || data.title,
          image: `${baseUrl}${data.image}`,
          brand: {
            '@type': 'Brand',
            name: 'Afore',
          },
          manufacturer: {
            '@type': 'Organization',
            name: 'Afore Italia',
          },
          category: data.categories?.map((c: any) => c.label).join(', ') || 'Inverter Fotovoltaico',
          offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            priceCurrency: 'EUR',
          },
        };
      
      default:
        return null;
    }
  };

  const structuredData = getStructuredData();
  
  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

