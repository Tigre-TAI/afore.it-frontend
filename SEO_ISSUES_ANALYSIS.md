# SEO Issues Analysis - Redirects and Canonical Tags

## Detected Problems

### 1. Root Page Redirect (CRITICAL)
**Issue**: `/` uses client-side redirect (meta refresh + JavaScript) which causes "Redirected" pages in Google Search Console.

**Location**: `src/app/page.tsx`

**Problem**: 
- Uses `<meta httpEquiv="refresh">` and JavaScript redirect
- Google sees this as a redirect, not a canonical page
- Should use Next.js server-side redirect instead

**Fix**: Replace with Next.js `redirect()` function or middleware redirect.

---

### 2. Missing Canonical Tags (HIGH PRIORITY)

#### Documentazione Sub-pages Missing Metadata:
- `src/app/[lang]/documentazione/inverter-ibridi/page.tsx` - No `generateMetadata`
- `src/app/[lang]/documentazione/certificati-inverter-di-stringa/page.tsx` - No `generateMetadata`
- `src/app/[lang]/documentazione/accumulo-afore/page.tsx` - No `generateMetadata`
- `src/app/[lang]/documentazione/certificati-all-in-one/page.tsx` - Need to check
- `src/app/[lang]/documentazione/certificati-inverter-ibridi/page.tsx` - Need to check
- `src/app/[lang]/documentazione/archivio/page.tsx` - Need to check
- `src/app/[lang]/documentazione/manuale/page.tsx` - Need to check
- `src/app/[lang]/documentazione/guida/page.tsx` - Need to check

#### Prodotti Sub-pages Missing Metadata:
- `src/app/[lang]/prodotti/page.tsx` - Client component, no `generateMetadata`
- `src/app/[lang]/prodotti/allin1/page.tsx` - Client component, no `generateMetadata`
- `src/app/[lang]/prodotti/inverter-di-stringa/page.tsx` - Client component, no `generateMetadata`
- `src/app/[lang]/prodotti/ibrido/page.tsx` - Client component, no `generateMetadata`
- `src/app/[lang]/prodotti/batteria-di-accumulo/page.tsx` - Client component, no `generateMetadata`
- `src/app/[lang]/prodotti/ev-charger/page.tsx` - Need to check
- `src/app/[lang]/prodotti/pv-inverter/page.tsx` - Need to check
- `src/app/[lang]/prodotti/pv-inverter/inverter-di-stringa/page.tsx` - Need to check
- `src/app/[lang]/prodotti/pv-inverter/inverter-ibrido/page.tsx` - Need to check
- `src/app/[lang]/prodotti/allin1/sistema-di-accumulo-afore/page.tsx` - Need to check
- `src/app/[lang]/prodotti/allin1/sistema-di-accumulo-hailei/page.tsx` - Need to check
- `src/app/[lang]/prodotti/batteria-di-accumulo/serie-afore/page.tsx` - Need to check
- `src/app/[lang]/prodotti/batteria-di-accumulo/serie-accumulo-hailei/page.tsx` - Need to check

**Problem**: These pages don't have canonical tags, causing "Duplicate without user-selected canonical" issues.

---

### 3. Hreflang Tags Issue (MEDIUM PRIORITY)

**Location**: `src/app/[lang]/layout.tsx`

**Problem**: 
- Hreflang tags only point to homepages (`/it`, `/en`, etc.)
- They should point to the current page in all language variants
- Example: On `/it/documentazione`, hreflang should point to `/en/documentazione`, `/es/documentazione`, etc.

**Current Code** (lines 143-148):
```tsx
<link rel="alternate" hrefLang="it" href={`${baseUrl}/it`} />
<link rel="alternate" hrefLang="en" href={`${baseUrl}/en`} />
```

**Should be**: Dynamic based on current pathname

---

### 4. Inconsistent Language Routing (LOW PRIORITY)

**Issue**: Some pages might be accessible via both `/` and `/it/` routes, causing duplicates.

**Status**: Root page redirects to `/it`, so this should be handled, but need to verify no other routes are accessible without language prefix.

---

### 5. Sitemap Language Alternates (MEDIUM PRIORITY)

**Location**: `src/app/sitemap.ts`

**Problem**: 
- Some entries only include `it`, `en`, `es` in alternates
- Missing `fr` and `de` in some entries
- Should consistently include all 5 languages

---

## Fix Strategy

1. **Fix root redirect** - Use Next.js redirect() or middleware
2. **Add canonical tags** - Add `generateMetadata` to all pages missing it
3. **Fix hreflang** - Make hreflang tags dynamic based on current path
4. **Update sitemap** - Include all languages consistently
5. **Verify trailing slashes** - Ensure `trailingSlash: false` is working correctly

