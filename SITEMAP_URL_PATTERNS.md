# Sitemap URL Patterns - Complete List

## Summary

**Total URLs in Sitemap**: ~50-60  
**Canonical Language**: Italian (`/it`)  
**Base URL**: `https://www.afore.it`

---

## URL Patterns by Category

### 1. Homepage (1 URL)

```
https://www.afore.it/it
```
- Priority: 1.0
- Change Frequency: daily
- Status: ✅ Included

---

### 2. Main Category Pages (3 URLs)

```
https://www.afore.it/it/prodotti
https://www.afore.it/it/documentazione
https://www.afore.it/it/garanzia
```
- Priority: 0.8-0.9
- Change Frequency: weekly/monthly
- Status: ✅ Included

---

### 3. Product Category Pages (12 URLs)

#### Top-Level Categories
```
https://www.afore.it/it/prodotti/allin1
https://www.afore.it/it/prodotti/inverter-di-stringa
https://www.afore.it/it/prodotti/ibrido
https://www.afore.it/it/prodotti/batteria-di-accumulo
https://www.afore.it/it/prodotti/ev-charger
https://www.afore.it/it/prodotti/pv-inverter
```

#### Sub-Categories
```
https://www.afore.it/it/prodotti/pv-inverter/inverter-di-stringa
https://www.afore.it/it/prodotti/pv-inverter/inverter-ibrido
https://www.afore.it/it/prodotti/allin1/sistema-di-accumulo-afore
https://www.afore.it/it/prodotti/allin1/sistema-di-accumulo-hailei
https://www.afore.it/it/prodotti/batteria-di-accumulo/serie-afore
https://www.afore.it/it/prodotti/batteria-di-accumulo/serie-accumulo-hailei
```
- Priority: 0.75-0.85
- Change Frequency: monthly
- Status: ✅ Included

---

### 4. Product Detail Pages (~27 URLs)

#### Pattern
```
https://www.afore.it/it/prodotti/{family}/{product-id}
```

#### Product Families
- `inverter-di-stringa` - String inverters
- `ibrido` - Hybrid inverters
- `batteria` - Battery storage
- `all-in-one` - All-in-one systems
- `ev-charger` - EV chargers

#### Example URLs
```
https://www.afore.it/it/prodotti/inverter-di-stringa/stringa-1-3kw
https://www.afore.it/it/prodotti/inverter-di-stringa/stringa-3-6kw
https://www.afore.it/it/prodotti/inverter-di-stringa/stringa-7-10kw
https://www.afore.it/it/prodotti/inverter-di-stringa/stringa-trifase-3-25kw
https://www.afore.it/it/prodotti/inverter-di-stringa/stringa-trifase-30kw
https://www.afore.it/it/prodotti/inverter-di-stringa/stringa-trifase-36-60kw
https://www.afore.it/it/prodotti/inverter-di-stringa/stringa-trifase-70-110kw

https://www.afore.it/it/prodotti/ibrido/ibrido-monofase-1-3-6kw
https://www.afore.it/it/prodotti/ibrido/ibrido-monofase-plus-4-6kw
https://www.afore.it/it/prodotti/ibrido/ibrido-trifase-plus-8-12kw
https://www.afore.it/it/prodotti/ibrido/ibrido-trifase-3-15kw
https://www.afore.it/it/prodotti/ibrido/ibrido-trifase-plus-3-12kw
https://www.afore.it/it/prodotti/ibrido/ibrido-trifase-3-30kw
https://www.afore.it/it/prodotti/ibrido/ibrido-trifase-36-60kw

https://www.afore.it/it/prodotti/batteria/bat-afore-wall-5-10kwh
https://www.afore.it/it/prodotti/batteria/bat-afore-stack-hv-5kwh
https://www.afore.it/it/prodotti/batteria/bat-afore-stack-lv-2-5-5kwh
https://www.afore.it/it/prodotti/batteria/bat-hailei-atom-wb-5kwh-1
https://www.afore.it/it/prodotti/batteria/bat-hailei-atom-wb-5-10kwh
https://www.afore.it/it/prodotti/batteria/bat-hailei-atom-ls-10-15kwh
https://www.afore.it/it/prodotti/batteria/bat-hailei-atom-hs-15-41kwh

https://www.afore.it/it/prodotti/all-in-one/aio-mono-lv-afore-3-6kw-af5000w-lh
https://www.afore.it/it/prodotti/all-in-one/aio-mono-lv-afore-3-6kw-atom-aes-5-12
https://www.afore.it/it/prodotti/all-in-one/aio-mono-lv-atom-aes-3-6kw-atom-aes-5-12
https://www.afore.it/it/prodotti/all-in-one/aio-trifase-hv-plus-4-6kw

https://www.afore.it/it/prodotti/ev-charger/ev-diamond
https://www.afore.it/it/prodotti/ev-charger/ev-oval
https://www.afore.it/it/prodotti/ev-charger/ev-square
```
- Priority: 0.7
- Change Frequency: monthly
- Status: ✅ Included (all products from PRODUCTS array)

---

### 5. Documentation Sub-Pages (8 URLs)

```
https://www.afore.it/it/documentazione/archivio
https://www.afore.it/it/documentazione/guida
https://www.afore.it/it/documentazione/manuale
https://www.afore.it/it/documentazione/inverter-ibridi
https://www.afore.it/it/documentazione/certificati-inverter-di-stringa
https://www.afore.it/it/documentazione/certificati-inverter-ibridi
https://www.afore.it/it/documentazione/certificati-all-in-one
https://www.afore.it/it/documentazione/accumulo-afore
```
- Priority: 0.6
- Change Frequency: monthly
- Status: ✅ Included

---

## Excluded URL Patterns

### Redirects (301/302)
```
/                                    → Redirects to /it
/prodotti                            → Redirects to /it/prodotti
/documentazione                      → Redirects to /it/documentazione
/garanzia                            → Redirects to /it/garanzia
/{any-language-less-url}             → Redirects to /it/{url}
```
**Status**: ❌ Excluded (redirects, not final destinations)

### Noindex Pages
```
/                                    → robots.index = false
```
**Status**: ❌ Excluded (noindex)

### Non-Canonical Language Versions
```
/en/*                                → Not canonical
/es/*                                → Not canonical
/fr/*                                → Not canonical
/de/*                                → Not canonical
```
**Status**: ❌ Excluded (not canonical)

### Query Parameters
```
/it/documentazione?prodotto=...      → Filtered pages
/it/documentazione?modello=...      → Filtered pages
```
**Status**: ❌ Excluded (canonical is base URL without params)

### Dynamic Pages
```
/it/documentazione/scheda-tecnica   → Dynamic page (if exists)
```
**Status**: ❌ Excluded (dynamic content)

---

## URL Count Summary

| Category | Count | Pattern |
|----------|-------|---------|
| Homepage | 1 | `/it` |
| Main Categories | 3 | `/it/{category}` |
| Product Categories | 12 | `/it/prodotti/{category}` |
| Product Details | ~27 | `/it/prodotti/{family}/{id}` |
| Documentation | 8 | `/it/documentazione/{page}` |
| **Total** | **~51** | All `/it/*` |

---

## Validation Rules

✅ **All URLs:**
- Start with `/it/` (canonical language)
- Return 200 status code
- Have `robots.index = true`
- Are not redirects
- Have proper `lastModified` date
- Have priority and changeFrequency

❌ **No URLs:**
- With query parameters
- That redirect (301/302)
- With `robots.noindex`
- From non-canonical languages
- Dynamic/generated pages

---

## Sitemap Location

**URL**: `https://www.afore.it/sitemap.xml`

**Generated by**: `src/app/sitemap.ts`

**Format**: XML Sitemap 0.9

**Size**: Single sitemap (no index needed)

---

## Maintenance

### Adding New URLs

1. **New Product**: Automatically included via `PRODUCTS` array
2. **New Category Page**: Add to `productCategoryPages` array in `sitemap.ts`
3. **New Doc Page**: Add to `docPages` array in `sitemap.ts`
4. **New Main Page**: Add to `mainPages` array in `sitemap.ts`

### Removing URLs

1. Remove from appropriate array in `sitemap.ts`
2. Update this document
3. Rebuild and redeploy

---

## Testing

### Validate Sitemap

```bash
# Check sitemap exists
curl -I https://www.afore.it/sitemap.xml

# View sitemap content
curl https://www.afore.it/sitemap.xml

# Validate XML
xmllint --noout https://www.afore.it/sitemap.xml
```

### Verify URLs

```bash
# Check all URLs return 200
for url in $(curl -s https://www.afore.it/sitemap.xml | grep -oP '<loc>\K[^<]+'); do
  echo "Checking $url"
  curl -I "$url" | head -1
done
```

---

## Notes

- All URLs use HTTPS
- All URLs are absolute (full domain)
- No trailing slashes
- No query parameters
- All have lastModified dates
- Sorted by priority (highest first)




