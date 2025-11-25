// Structured Data (Schema.org) for SEO
interface StructuredDataProps {
  type: 'Organization' | 'WebPage' | 'BreadcrumbList' | 'WebSite';
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
      
      case 'WebPage':
        if (!data) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: data.title || data.name,
          description: data.description || data.subtitle || data.title || data.name,
          url: data.url || `${baseUrl}${data.path || ''}`,
          inLanguage: lang === 'it' ? 'it-IT' : lang === 'es' ? 'es-ES' : lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : 'en-US',
          isPartOf: {
            '@type': 'WebSite',
            name: 'Afore Italia',
            url: baseUrl,
          },
          about: {
            '@type': 'Organization',
            name: 'Afore Italia',
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

