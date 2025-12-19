/**
 * CloudFront Lambda@Edge Function for 301 Redirects
 * 
 * This function handles all 301 redirects for SEO consolidation:
 * - Root / redirects to /it
 * - Language-less URLs redirect to /it equivalents
 * - Legacy URLs redirect to canonical versions
 * - Prevents redirect chains
 * 
 * Deployment:
 * 1. Zip this file: zip redirects.zip cloudfront-lambda-edge.js
 * 2. Create Lambda function in us-east-1 (required for CloudFront)
 * 3. Attach to CloudFront distribution as "Viewer Request" event
 * 4. Set memory: 128MB, timeout: 3s
 */

'use strict';

// Redirect map: non-canonical URL -> canonical URL
const REDIRECT_MAP = {
  // Root redirect
  '/': '/it',
  
  // Language-less main pages -> /it versions
  '/prodotti': '/it/prodotti',
  '/documentazione': '/it/documentazione',
  '/garanzia': '/it/garanzia',
  
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
};

// Valid languages
const VALID_LANGUAGES = ['it', 'en', 'es', 'fr', 'de'];

/**
 * Extract language from path
 */
function getLangFromPath(path) {
  const segments = path.split('/').filter(Boolean);
  if (segments.length > 0 && VALID_LANGUAGES.includes(segments[0])) {
    return segments[0];
  }
  return null;
}

/**
 * Remove language prefix from path
 */
function removeLangPrefix(path) {
  const segments = path.split('/').filter(Boolean);
  if (segments.length > 0 && VALID_LANGUAGES.includes(segments[0])) {
    return '/' + segments.slice(1).join('/');
  }
  return path;
}

/**
 * Check if URL has query parameters that should be preserved
 */
function hasQueryParams(uri) {
  return uri.includes('?');
}

/**
 * Get query string from URI
 */
function getQueryString(uri) {
  const queryIndex = uri.indexOf('?');
  return queryIndex !== -1 ? uri.substring(queryIndex) : '';
}

/**
 * Main handler
 */
exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request;
  const uri = request.uri;
  const querystring = request.querystring;
  
  // Normalize URI (remove trailing slash, handle index.html)
  let normalizedUri = uri;
  
  // Remove trailing slash (except root)
  if (normalizedUri !== '/' && normalizedUri.endsWith('/')) {
    normalizedUri = normalizedUri.slice(0, -1);
  }
  
  // Remove index.html
  if (normalizedUri.endsWith('/index.html')) {
    normalizedUri = normalizedUri.replace('/index.html', '') || '/';
  }
  
  // Remove .html extension
  if (normalizedUri.endsWith('.html')) {
    normalizedUri = normalizedUri.replace(/\.html$/, '');
  }
  
  // Check exact redirect map first
  if (REDIRECT_MAP[normalizedUri]) {
    const redirectUrl = REDIRECT_MAP[normalizedUri] + (querystring ? '?' + querystring : '');
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        'location': [{
          key: 'Location',
          value: redirectUrl
        }],
        'cache-control': [{
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }]
      }
    };
    callback(null, response);
    return;
  }
  
  // Check if path is language-less (doesn't start with /it, /en, etc.)
  const lang = getLangFromPath(normalizedUri);
  
  if (!lang && normalizedUri !== '/') {
    // Language-less URL - redirect to /it version
    const pathWithoutLang = normalizedUri;
    const redirectUrl = '/it' + pathWithoutLang + (querystring ? '?' + querystring : '');
    
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        'location': [{
          key: 'Location',
          value: redirectUrl
        }],
        'cache-control': [{
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }]
      }
    };
    callback(null, response);
    return;
  }
  
  // No redirect needed - pass through
  request.uri = normalizedUri;
  callback(null, request);
};

