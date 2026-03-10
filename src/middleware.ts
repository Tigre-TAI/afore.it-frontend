/**
 * Next.js Middleware for 301 Redirects
 * 
 * NOTE: This only works if you remove `output: "export"` from next.config.ts
 * For static exports on AWS S3 + CloudFront, use the Lambda@Edge function instead.
 * 
 * This middleware handles:
 * - Root / redirects to /it (301)
 * - Language-less URLs redirect to /it equivalents (301)
 * - Prevents redirect chains
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Valid languages
const VALID_LANGUAGES = ['it', 'en', 'es', 'fr', 'de'];

// Redirect map: non-canonical URL -> canonical URL
const REDIRECT_MAP: Record<string, string> = {
  // Root redirect
  '/': '/it',
  
  // Language-less main pages -> /it versions
  '/prodotti': '/it/prodotti',
  '/documentazione': '/it/documentazione',
  '/garanzia': '/it/assistenza',
  '/it/garanzia': '/it/assistenza',
  '/en/garanzia': '/en/assistenza',
  '/es/garanzia': '/es/assistenza',
  '/fr/garanzia': '/fr/assistenza',
  '/de/garanzia': '/de/assistenza',
  
  // Language-less product categories -> /it versions
  '/prodotti/allin1': '/it/prodotti/allin1',
  '/prodotti/inverter-di-stringa': '/it/prodotti/inverter-di-stringa',
  '/prodotti/ibrido': '/it/prodotti/ibrido',
  '/prodotti/batteria-di-accumulo': '/it/prodotti/batteria-di-accumulo',
  '/prodotti/ev-charger': '/it/prodotti/ev-charger',
  '/prodotti/pv-inverter': '/it/prodotti/pv-inverter',
  
  // Language-less sub-categories -> /it versions
  '/prodotti/pv-inverter/inverter-di-stringa': '/it/prodotti/pv-inverter/inverter-di-stringa',
  '/prodotti/pv-inverter/inverter-ibrido': '/it/prodotti/pv-inverter/inverter-ibrido',
  '/prodotti/allin1/sistema-di-accumulo-afore': '/it/prodotti/allin1/sistema-di-accumulo-afore',
  '/prodotti/allin1/sistema-di-accumulo-hailei': '/it/prodotti/allin1/sistema-di-accumulo-hailei',
  '/prodotti/batteria-di-accumulo/serie-afore': '/it/prodotti/batteria-di-accumulo/serie-afore',
  '/prodotti/batteria-di-accumulo/serie-accumulo-hailei': '/it/prodotti/batteria-di-accumulo/serie-accumulo-hailei',
  
  // Language-less documentation pages -> /it versions
  '/documentazione/guida': '/it/documentazione/guida',
  '/documentazione/manuale': '/it/documentazione/manuale',
  '/documentazione/archivio': '/it/documentazione/archivio',
  '/documentazione/inverter-ibridi': '/it/documentazione/inverter-ibridi',
  '/documentazione/certificati-inverter-di-stringa': '/it/documentazione/certificati-inverter-di-stringa',
  '/documentazione/certificati-inverter-ibridi': '/it/documentazione/certificati-inverter-ibridi',
  '/documentazione/certificati-all-in-one': '/it/documentazione/certificati-all-in-one',
  '/documentazione/accumulo-afore': '/it/documentazione/accumulo-afore',
  '/documentazione/scheda-tecnica': '/it/documentazione/scheda-tecnica',

  // Comunicati stampa: old slug -> new slug (Key Energy 2026 Afore Italia)
  '/it/comunicati-stampa/webinar-afore-hailei-24-marzo-2026': '/it/comunicati-stampa/key-energy-2026-afore-italia',
  '/en/comunicati-stampa/webinar-afore-hailei-24-marzo-2026': '/en/comunicati-stampa/key-energy-2026-afore-italia',
  '/es/comunicati-stampa/webinar-afore-hailei-24-marzo-2026': '/es/comunicati-stampa/key-energy-2026-afore-italia',
  '/fr/comunicati-stampa/webinar-afore-hailei-24-marzo-2026': '/fr/comunicati-stampa/key-energy-2026-afore-italia',
  '/de/comunicati-stampa/webinar-afore-hailei-24-marzo-2026': '/de/comunicati-stampa/key-energy-2026-afore-italia',
};

/**
 * Extract language from path
 */
function getLangFromPath(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && VALID_LANGUAGES.includes(segments[0])) {
    return segments[0];
  }
  return null;
}

/**
 * Normalize path (remove trailing slash, handle edge cases)
 */
function normalizePath(pathname: string): string {
  // Remove trailing slash (except root)
  if (pathname !== '/' && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }
  return pathname;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  
  // Normalize path
  const normalizedPath = normalizePath(pathname);
  
  // Check exact redirect map first
  if (REDIRECT_MAP[normalizedPath]) {
    const redirectUrl = new URL(REDIRECT_MAP[normalizedPath] + search, request.url);
    return NextResponse.redirect(redirectUrl, 301);
  }
  
  // Check if path is language-less (doesn't start with /it, /en, etc.)
  const lang = getLangFromPath(normalizedPath);
  
  if (!lang && normalizedPath !== '/') {
    // Language-less URL - redirect to /it version
    const redirectUrl = new URL('/it' + normalizedPath + search, request.url);
    return NextResponse.redirect(redirectUrl, 301);
  }
  
  // No redirect needed - pass through
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf)).*)',
  ],
};




