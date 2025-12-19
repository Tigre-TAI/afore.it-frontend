# Duplicate Content & Canonical Tag Analysis

## Executive Summary

This document identifies all duplicate content issues, missing canonical tags, trailing slash problems, and query parameter duplicates across the website.

---

## 1. Pages with Duplicate Content but Different URLs

### Issue 1.1: Root Page (`/`) vs Language Homepages (`/it`, `/en`, etc.)

**Problem:**
- `/` redirects to `/it` using client-side redirect
- Creates duplicate content issue in search engines
- Root page has canonical pointing to `/it` but uses client-side redirect

**Duplicate URLs:**
- `https://www.afore.it/` → redirects to `https://www.afore.it/it`
- `https://www.afore.it/it` (canonical: `https://www.afore.it/it`)

**Canonical URL:** `https://www.afore.it/it`

**Fix Required:**
- Since this is a static export, client-side redirect is necessary
- Ensure canonical tag is properly set before redirect
- Consider adding `<link rel="canonical">` in HTML head before redirect executes

---

### Issue 1.2: Product Category Pages - Multiple Routes to Same Content

**Problem:**
Some product categories are accessible via multiple URL patterns:

1. **PV Inverter Routes:**
   - `/it/prodotti/pv-inverter` (category page)
   - `/it/prodotti/pv-inverter/inverter-di-stringa` (sub-category)
   - `/it/prodotti/inverter-di-stringa` (direct category)
   - `/it/prodotti/pv-inverter/inverter-ibrido` (sub-category)
   - `/it/prodotti/ibrido` (direct category)

2. **All-in-One Routes:**
   - `/it/prodotti/allin1` (category page)
   - `/it/prodotti/allin1/sistema-di-accumulo-afore` (sub-category)
   - `/it/prodotti/allin1/sistema-di-accumulo-hailei` (sub-category)

3. **Battery Routes:**
   - `/it/prodotti/batteria-di-accumulo` (category page)
   - `/it/prodotti/batteria-di-accumulo/serie-afore` (sub-category)
   - `/it/prodotti/batteria-di-accumulo/serie-accumulo-hailei` (sub-category)

**Status:** These are intentional different pages with different content, so NOT duplicates. However, they need canonical tags.

---

## 2. Missing or Incorrect rel="canonical" Tags

### Issue 2.1: Client-Side Product Category Pages Missing Canonical Tags

**Problem:**
All product category pages are client components (`"use client"`) and cannot use `generateMetadata()`. They need canonical tags added via a different method.

**Pages Missing Canonical Tags:**

1. `/it/prodotti/allin1/page.tsx` - Client component, no canonical
   - **Canonical:** `https://www.afore.it/{lang}/prodotti/allin1`

2. `/it/prodotti/inverter-di-stringa/page.tsx` - Client component, no canonical
   - **Canonical:** `https://www.afore.it/{lang}/prodotti/inverter-di-stringa`

3. `/it/prodotti/ibrido/page.tsx` - Client component, no canonical
   - **Canonical:** `https://www.afore.it/{lang}/prodotti/ibrido`

4. `/it/prodotti/batteria-di-accumulo/page.tsx` - Client component, no canonical
   - **Canonical:** `https://www.afore.it/{lang}/prodotti/batteria-di-accumulo`

5. `/it/prodotti/ev-charger/page.tsx` - Client component, no canonical
   - **Canonical:** `https://www.afore.it/{lang}/prodotti/ev-charger`

6. `/it/prodotti/pv-inverter/page.tsx` - Client component, no canonical
   - **Canonical:** `https://www.afore.it/{lang}/prodotti/pv-inverter`

7. `/it/prodotti/pv-inverter/inverter-di-stringa/page.tsx` - Client component, no canonical
   - **Canonical:** `https://www.afore.it/{lang}/prodotti/pv-inverter/inverter-di-stringa`

8. `/it/prodotti/pv-inverter/inverter-ibrido/page.tsx` - Client component, no canonical
   - **Canonical:** `https://www.afore.it/{lang}/prodotti/pv-inverter/inverter-ibrido`

9. `/it/prodotti/allin1/sistema-di-accumulo-afore/page.tsx` - Client component, no canonical
   - **Canonical:** `https://www.afore.it/{lang}/prodotti/allin1/sistema-di-accumulo-afore`

10. `/it/prodotti/allin1/sistema-di-accumulo-hailei/page.tsx` - Client component, no canonical
    - **Canonical:** `https://www.afore.it/{lang}/prodotti/allin1/sistema-di-accumulo-hailei`

11. `/it/prodotti/batteria-di-accumulo/serie-afore/page.tsx` - Client component, no canonical
    - **Canonical:** `https://www.afore.it/{lang}/prodotti/batteria-di-accumulo/serie-afore`

12. `/it/prodotti/batteria-di-accumulo/serie-accumulo-hailei/page.tsx` - Client component, no canonical
    - **Canonical:** `https://www.afore.it/{lang}/prodotti/batteria-di-accumulo/serie-accumulo-hailei`

**Solution:**
Since these are client components, we need to:
1. Convert them to server components with `generateMetadata()`, OR
2. Create layout files for each route with `generateMetadata()`, OR
3. Use a client-side component to inject canonical tags (not recommended for SEO)

**Recommended:** Create layout files for each category route with proper canonical tags.

---

### Issue 2.2: Documentazione Page - Query Parameters Not Excluded from Canonical

**Problem:**
The documentazione page (`/it/documentazione`) uses query parameters for filtering:
- `?prodotto=...`
- `?modello=...`
- `?potenza=...`
- `?tipo=...`
- `?lingua=...`
- `?regione=...`

**Current Canonical:** `https://www.afore.it/{lang}/documentazione` (correct, but need to verify it excludes query params)

**Duplicate URLs Created:**
- `https://www.afore.it/it/documentazione`
- `https://www.afore.it/it/documentazione?prodotto=inverter`
- `https://www.afore.it/it/documentazione?prodotto=inverter&modello=series1`
- `https://www.afore.it/it/documentazione?prodotto=inverter&modello=series1&potenza=5kw`
- ... (many combinations)

**Canonical URL:** `https://www.afore.it/{lang}/documentazione` (should always exclude query parameters)

**Fix Required:**
- Ensure `generateMetadata()` in `documentazione/page.tsx` always returns canonical without query parameters
- Verify Next.js metadata API handles this correctly (it should by default)

---

## 3. URLs with Trailing Slash / Non-Trailing Slash Duplication

### Issue 3.1: Trailing Slash Configuration

**Current Config:** `next.config.ts` has `trailingSlash: false`

**Status:** ✅ CORRECT - No trailing slashes should be generated

**Verification Needed:**
- Check all canonical URLs in codebase don't have trailing slashes
- Ensure sitemap doesn't include trailing slashes
- Verify all internal links don't use trailing slashes

**Canonical URLs Check:**
- ✅ `/it` (no trailing slash)
- ✅ `/it/prodotti` (no trailing slash)
- ✅ `/it/documentazione` (no trailing slash)
- ✅ `/it/garanzia` (no trailing slash)

**Action:** Verify all canonical URLs in the codebase follow this pattern.

---

## 4. URLs with Query Parameters Creating Duplicates

### Issue 4.1: Documentazione Page Query Parameters

**Problem:**
The documentazione page uses multiple query parameters for filtering, creating many URL variations with the same content.

**Query Parameters Used:**
- `prodotto` - Product filter
- `modello` - Series/model filter
- `potenza` - Power filter
- `tipo` - Document type filter
- `lingua` - Language filter
- `regione` - Region filter

**Example Duplicate URLs:**
1. `https://www.afore.it/it/documentazione`
2. `https://www.afore.it/it/documentazione?prodotto=inverter`
3. `https://www.afore.it/it/documentazione?prodotto=inverter&modello=series1`
4. `https://www.afore.it/it/documentazione?prodotto=inverter&modello=series1&potenza=5kw`
5. `https://www.afore.it/it/documentazione?tipo=manuale`
6. ... (hundreds of possible combinations)

**Canonical URL:** `https://www.afore.it/{lang}/documentazione` (base URL without query parameters)

**Fix Required:**
- ✅ Canonical tag already points to base URL (verified in code)
- ⚠️ Need to ensure robots meta tag allows indexing of filtered pages OR use `noindex` for filtered pages
- Consider: Should filtered pages be indexed? If not, add `noindex` to filtered URLs

**Recommendation:**
- Keep base `/documentazione` page indexed (with canonical)
- Add `noindex` to filtered pages (with query parameters) OR
- Keep filtered pages indexed but ensure canonical always points to base URL (current approach)

---

## Summary of Required Fixes

### High Priority

1. **Add canonical tags to all client-side product category pages**
   - Create layout files or convert to server components
   - 12 pages need canonical tags

2. **Verify documentazione page canonical excludes query parameters**
   - Already correct, but verify implementation

3. **Fix root page redirect canonical tag**
   - Ensure canonical is set before redirect

### Medium Priority

4. **Verify all canonical URLs don't have trailing slashes**
   - Audit all canonical URLs in codebase

5. **Consider robots meta for filtered documentazione pages**
   - Decide indexing strategy for filtered pages

### Low Priority

6. **Audit internal links for trailing slashes**
   - Ensure consistency across site

---

## Implementation Plan

1. Create layout files for product category routes with `generateMetadata()`
2. Verify documentazione canonical implementation
3. Update root page redirect
4. Audit all canonical URLs
5. Test all fixes

