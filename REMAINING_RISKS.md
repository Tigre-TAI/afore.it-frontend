# Remaining LCP / INP Risks on Homepage

## High Priority Risks

### 1. Hero Component Still Client-Side ⚠️
**File:** `src/components/Hero.tsx`
**Issue:** Entire Hero component is `"use client"`, causing hydration overhead on initial load
**Impact:** ~100-200ms LCP delay from hydration
**Fix:**
```typescript
// Split into server component wrapper + client component for interactivity
// Create src/components/Hero/HeroServer.tsx (server component)
// Move interactive parts (video, mute button) to HeroClient.tsx
```
**Priority:** Medium (complex refactor, but high impact)

---

### 2. Hero Social Icons Load Immediately ⚠️
**File:** `src/components/Hero.tsx` (lines 230-256)
**Issue:** WhatsApp and LinkedIn icons load with `priority` (implicit), competing with hero image
**Impact:** ~50-100ms LCP delay
**Fix:**
```typescript
// Add loading="lazy" to social icons
<Image
  src="/image/social/social_whatsapp.svg"
  alt="WhatsApp"
  width={20}
  height={20}
  className="opacity-90 hover:opacity-100 transition-opacity"
  unoptimized
  loading="lazy"  // ← Add this
/>
```
**Priority:** Low (easy fix, small impact)

---

### 3. Footer Images Not Lazy Loaded ⚠️
**File:** `src/components/layout/Footer.tsx` (line 21-28)
**Issue:** Footer logo loads immediately, but footer is below fold
**Impact:** ~20-50ms bandwidth competition
**Fix:**
```typescript
<Image
  src="/logos/logo_afore_light.png"
  alt="Afore Logo"
  width={120}
  height={36}
  className="opacity-95"
  unoptimized
  loading="lazy"  // ← Add this
/>
```
**Priority:** Low (easy fix, small impact)

---

## Medium Priority Risks

### 4. Hero Image Could Use Preload Link
**File:** `src/app/[lang]/layout.tsx` (in `<head>`)
**Issue:** Hero image loads via Next.js Image, but could benefit from explicit preload
**Impact:** ~50-100ms LCP improvement
**Fix:**
```typescript
<head>
  {/* ... existing hreflang tags ... */}
  <link 
    rel="preload" 
    as="image" 
    href="/image/heroes/hero_universal.jpg"
    fetchPriority="high"
  />
  {/* ... rest of head ... */}
</head>
```
**Priority:** Medium (easy fix, good impact)

---

### 5. ScrollingBanner is Client Component
**File:** `src/components/ScrollingBanner.tsx`
**Issue:** Entire component is `"use client"` but has no interactivity (just CSS animation)
**Impact:** ~20-50ms hydration overhead
**Fix:**
```typescript
// Remove "use client" - CSS animations work without client component
// Move animation to CSS-only (already using animate-scroll class)
```
**Priority:** Low (easy fix, small impact)

---

## Low Priority / Future Optimizations

### 6. Image Format Optimization
**Issue:** All images are JPG/PNG, could be WebP/AVIF
**Impact:** ~200-300ms LCP improvement
**Fix:** Convert images to WebP with fallback (requires build-time conversion)
**Priority:** Low (requires image processing pipeline)

---

### 7. Hero Image Responsive Sizes
**File:** `src/components/Hero.tsx`
**Issue:** Hero image uses `sizes="100vw"` but could use smaller image on mobile
**Impact:** ~100-200ms LCP improvement on mobile
**Fix:**
```typescript
sizes="(max-width: 768px) 100vw, 100vw"  // Could add mobile-specific size
// Or use srcset with different image sizes
```
**Priority:** Low (requires multiple image sizes)

---

## Summary by Impact

| Risk | Impact | Effort | Priority |
|------|--------|--------|----------|
| Hero preload link | 50-100ms LCP | Easy | ⭐⭐⭐ |
| Hero social icons lazy | 50-100ms LCP | Easy | ⭐⭐ |
| Footer logo lazy | 20-50ms LCP | Easy | ⭐ |
| ScrollingBanner server | 20-50ms INP | Easy | ⭐ |
| Hero component split | 100-200ms LCP | Hard | ⭐⭐⭐ |
| Image format (WebP) | 200-300ms LCP | Medium | ⭐⭐ |

## Recommended Next Steps

1. **Quick wins (do now):**
   - Add hero image preload link
   - Add `loading="lazy"` to hero social icons
   - Add `loading="lazy"` to footer logo
   - Remove `"use client"` from ScrollingBanner

2. **Medium effort (next sprint):**
   - Convert images to WebP format
   - Consider hero component split (if LCP still > 2.5s)

3. **Monitor first:**
   - Deploy current optimizations
   - Measure actual LCP/INP in production
   - Prioritize based on real user data


