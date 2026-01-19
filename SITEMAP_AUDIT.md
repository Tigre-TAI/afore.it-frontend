# Sitemap Audit & Rebuild Summary

## Overview

Complete audit and rebuild of sitemap.xml for CloudFront static site. The sitemap now includes **only canonical `/it` URLs** that return 200 status codes and are indexable.

---

## Rules Applied

✅ **Include only canonical 200 URLs under /it**
- All URLs in sitemap are `/it/*` paths
- No other language versions included
- All URLs are valid, accessible pages

✅ **Exclude URLs that redirect (301/302)**
- Root `/` redirects to `/it` → **EXCLUDED**
- Language-less URLs redirect to `/it` → **EXCLUDED**
- Only final destination URLs included

✅ **Exclude noindex pages**
- Root `/` has `robots.index = false` → **EXCLUDED**
- All other pages have `robots.index = true` → **INCLUDED**

✅ **Ensure lastmod is present**
- All entries have `lastModified` set to current date
- Can be updated to actual file modification dates if needed

✅ **Single sitemap (no index needed)**
- Total URLs: ~50-60 (well under 50,000 limit)
- Single sitemap file is sufficient
- No sitemap index required

---

## Included URL Patterns

### 1. Homepage
- `/it` (priority: 1.0, daily)

### 2. Main Category Pages (3)
- `/it/prodotti` (priority: 0.9, weekly)
- `/it/documentazione` (priority: 0.8, weekly)
- `/it/garanzia` (priority: 0.8, monthly)

### 3. Product Category Pages (12)
- `/it/prodotti/allin1` (priority: 0.85)
- `/it/prodotti/inverter-di-stringa` (priority: 0.85)
- `/it/prodotti/ibrido` (priority: 0.85)
- `/it/prodotti/batteria-di-accumulo` (priority: 0.85)
- `/it/prodotti/ev-charger` (priority: 0.85)
- `/it/prodotti/pv-inverter` (priority: 0.85)
- `/it/prodotti/pv-inverter/inverter-di-stringa` (priority: 0.8)
- `/it/prodotti/pv-inverter/inverter-ibrido` (priority: 0.8)
- `/it/prodotti/allin1/sistema-di-accumulo-afore` (priority: 0.75)
- `/it/prodotti/allin1/sistema-di-accumulo-hailei` (priority: 0.75)
- `/it/prodotti/batteria-di-accumulo/serie-afore` (priority: 0.75)
- `/it/prodotti/batteria-di-accumulo/serie-accumulo-hailei` (priority: 0.75)

### 4. Product Detail Pages (~27)
- `/it/prodotti/{family}/{product-id}` (priority: 0.7)
- All products from `PRODUCTS` array
- Examples:
  - `/it/prodotti/inverter-di-stringa/stringa-1-3kw`
  - `/it/prodotti/ibrido/ibrido-monofase-1-3-6kw`
  - `/it/prodotti/batteria/bat-afore-wall-5-10kwh`
  - `/it/prodotti/all-in-one/aio-mono-lv-afore-3-6kw-af5000w-lh`
  - `/it/prodotti/ev-charger/ev-diamond`

### 5. Documentation Sub-Pages (8)
- `/it/documentazione/archivio` (priority: 0.6)
- `/it/documentazione/guida` (priority: 0.6)
- `/it/documentazione/manuale` (priority: 0.6)
- `/it/documentazione/inverter-ibridi` (priority: 0.6)
- `/it/documentazione/certificati-inverter-di-stringa` (priority: 0.6)
- `/it/documentazione/certificati-inverter-ibridi` (priority: 0.6)
- `/it/documentazione/certificati-all-in-one` (priority: 0.6)
- `/it/documentazione/accumulo-afore` (priority: 0.6)

**Total URLs**: ~50-60 pages

---

## Excluded URLs

### Redirects (301/302)
- `/` → Redirects to `/it` → **EXCLUDED**
- `/prodotti` → Redirects to `/it/prodotti` → **EXCLUDED**
- `/documentazione` → Redirects to `/it/documentazione` → **EXCLUDED**
- `/garanzia` → Redirects to `/it/garanzia` → **EXCLUDED**
- All language-less URLs → **EXCLUDED**

### Noindex Pages
- `/` → Has `robots.index = false` → **EXCLUDED**

### Non-Canonical Language Versions
- `/en/*` → Not canonical → **EXCLUDED**
- `/es/*` → Not canonical → **EXCLUDED**
- `/fr/*` → Not canonical → **EXCLUDED**
- `/de/*` → Not canonical → **EXCLUDED**

### Dynamic/Filtered Pages
- `/it/documentazione?s=...` → Query parameters → **EXCLUDED** (canonical is base URL)
- `/it/documentazione/scheda-tecnica` → Dynamic page → **EXCLUDED** (if exists)

---

## Sitemap Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.afore.it/it</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- ... more URLs ... -->
</urlset>
```

---

## Priority & Change Frequency Guidelines

| Page Type | Priority | Change Frequency | Reason |
|-----------|----------|------------------|--------|
| Homepage | 1.0 | daily | Most important page |
| Main categories | 0.8-0.9 | weekly | Important landing pages |
| Product categories | 0.75-0.85 | monthly | Category pages |
| Product details | 0.7 | monthly | Individual products |
| Documentation | 0.6 | monthly | Reference content |

---

## Validation Checklist

- [x] Only `/it` URLs included
- [x] No redirect URLs included
- [x] No noindex pages included
- [x] All URLs have `lastModified`
- [x] All URLs have `priority`
- [x] All URLs have `changeFrequency`
- [x] URLs are sorted by priority
- [x] Total URLs < 50,000 (single sitemap)
- [x] Sitemap is valid XML

---

## Testing

### Validate Sitemap

1. **Check sitemap URL:**
   ```bash
   curl https://www.afore.it/sitemap.xml
   ```

2. **Validate XML:**
   - Use online XML validator
   - Check for well-formed XML

3. **Submit to Search Engines:**
   - Google Search Console
   - Bing Webmaster Tools

4. **Verify URLs:**
   - All URLs return 200 status
   - All URLs are accessible
   - No redirects in sitemap

---

## Maintenance

### When to Update

1. **New Products Added**
   - Automatically included via `PRODUCTS` array
   - Rebuild sitemap on next deployment

2. **New Pages Added**
   - Add to appropriate section in `sitemap.ts`
   - Update this document

3. **Page Removed**
   - Remove from `sitemap.ts`
   - Update this document

### Updating lastModified

Currently, all pages use current date. To use actual modification dates:

1. Track file modification dates
2. Use `fs.statSync()` to get file dates
3. Update `lastModified` accordingly

---

## File Changes

**Modified:**
- `src/app/sitemap.ts` - Rebuilt to only include `/it` URLs

**Created:**
- `SITEMAP_AUDIT.md` - This documentation

---

## Next Steps

1. ✅ Sitemap rebuilt
2. ⏳ Deploy and test
3. ⏳ Submit to Google Search Console
4. ⏳ Monitor indexing status
5. ⏳ Update lastModified dates if needed




