# 301 Redirect Implementation Guide

## Overview

This guide explains how to implement 301 redirects for SEO consolidation. Since the site uses **static export** (`output: "export"`) and is deployed to **AWS S3 + CloudFront**, we need to use **CloudFront Lambda@Edge** for server-side redirects.

---

## Current Setup

- **Deployment**: AWS S3 + CloudFront
- **Next.js Config**: Static export (`output: "export"`)
- **Canonical Language**: Italian (`/it`)

---

## Option 1: CloudFront Lambda@Edge (Recommended for Static Export)

### Step 1: Create Lambda Function

1. **Go to AWS Lambda Console**
   - Region: **us-east-1** (required for CloudFront)
   - Click "Create function"

2. **Function Configuration**
   - Function name: `afore-redirects-lambda-edge`
   - Runtime: **Node.js 18.x** or **Node.js 20.x**
   - Architecture: **x86_64**
   - Click "Create function"

3. **Upload Code**
   - Copy code from `redirects/cloudfront-lambda-edge.js`
   - Paste into Lambda function code editor
   - Click "Deploy"

4. **Configure Function**
   - Memory: **128 MB**
   - Timeout: **3 seconds**
   - Click "Save"

### Step 2: Publish Lambda Version

1. Click **"Actions"** → **"Publish new version"**
2. Version description: `Initial redirect implementation`
3. Click **"Publish"**
4. **Copy the ARN** (you'll need it for CloudFront)

### Step 3: Attach to CloudFront Distribution

1. **Go to CloudFront Console**
   - Select your distribution
   - Go to **"Behaviors"** tab
   - Edit the default behavior (or create new)

2. **Configure Lambda@Edge**
   - Scroll to **"Function associations"**
   - **Viewer Request**: Select **"Lambda@Edge"**
   - Function ARN: Paste the Lambda ARN (with version, e.g., `arn:aws:lambda:us-east-1:123456789:function:afore-redirects-lambda-edge:1`)
   - Click **"Save changes"**

3. **Wait for Deployment**
   - CloudFront will deploy the changes (5-15 minutes)
   - Status will show "Deploying" → "Deployed"

### Step 4: Test Redirects

Test these URLs (should all redirect to `/it` versions):

```bash
# Root redirect
curl -I https://www.afore.it/
# Should return: Location: https://www.afore.it/it

# Language-less pages
curl -I https://www.afore.it/prodotti
# Should return: Location: https://www.afore.it/it/prodotti

curl -I https://www.afore.it/documentazione
# Should return: Location: https://www.afore.it/it/documentazione
```

---

## Option 2: Next.js Middleware (If Switching from Static Export)

If you want to switch from static export to server-side rendering:

### Step 1: Update next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove or comment out: output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  // Add redirects (optional, middleware handles it)
  async redirects() {
    return [
      {
        source: '/',
        destination: '/it',
        permanent: true, // 301
      },
    ];
  },
};

export default nextConfig;
```

### Step 2: Deploy Middleware

The `src/middleware.ts` file will automatically be used by Next.js.

### Step 3: Deploy to Vercel or AWS with Server Support

- **Vercel**: Automatic middleware support
- **AWS**: Use AWS Amplify or EC2 with Node.js

---

## Option 3: S3 Website Redirect Rules (Limited)

S3 supports basic redirect rules, but they're limited:

### Create `_redirects` file in S3 bucket root:

```
/ /it 301
/prodotti /it/prodotti 301
/documentazione /it/documentazione 301
```

**Limitations:**
- Only works with S3 website hosting (not CloudFront)
- Limited pattern matching
- Not recommended for complex redirects

---

## Redirect Rules Summary

### All Redirects (301 Permanent)

| From | To | Reason |
|------|-----|--------|
| `/` | `/it` | Root page → Italian homepage |
| `/prodotti` | `/it/prodotti` | Language-less prodotti |
| `/documentazione` | `/it/documentazione` | Language-less documentazione |
| `/garanzia` | `/it/garanzia` | Language-less garanzia |
| `/prodotti/*` | `/it/prodotti/*` | All language-less product pages |
| `/documentazione/*` | `/it/documentazione/*` | All language-less doc pages |

### Pattern Rules

1. **Root `/`** → Always redirects to `/it`
2. **Language-less URLs** → Redirect to `/it` version
3. **Query parameters** → Preserved in redirects
4. **Trailing slashes** → Removed before redirect
5. **HTML extensions** → Removed before redirect

---

## Testing Checklist

- [ ] Root `/` redirects to `/it` (301)
- [ ] `/prodotti` redirects to `/it/prodotti` (301)
- [ ] `/documentazione` redirects to `/it/documentazione` (301)
- [ ] Query parameters are preserved: `/prodotti?test=1` → `/it/prodotti?test=1`
- [ ] Trailing slashes handled: `/prodotti/` → `/it/prodotti`
- [ ] No redirect chains (redirect doesn't redirect to another redirect)
- [ ] All redirects return 301 status code
- [ ] Cache-Control headers set correctly

---

## Monitoring

### Check Redirects in Browser

1. Open browser DevTools → Network tab
2. Navigate to a redirect URL
3. Check:
   - Status code: **301**
   - Location header: Correct redirect URL
   - No redirect chains

### Check in Search Console

1. Go to Google Search Console
2. Check **"Coverage"** report
3. Monitor for redirect errors
4. Verify redirects are working correctly

### AWS CloudWatch Logs

1. Go to CloudWatch → Log groups
2. Find Lambda@Edge function logs
3. Check for errors or issues

---

## Troubleshooting

### Redirect Not Working

1. **Check Lambda@Edge deployment**
   - Verify function is attached to CloudFront
   - Check function version is correct
   - Wait for CloudFront deployment (can take 15 minutes)

2. **Check CloudFront Cache**
   - Invalidate CloudFront cache
   - Wait for cache to clear

3. **Check Lambda Logs**
   - CloudWatch logs for Lambda@Edge
   - Check for errors

### Redirect Chains

If you see redirect chains:
1. Check redirect map doesn't redirect to another redirect
2. Verify Lambda function logic prevents chains
3. Test each redirect individually

### Performance Issues

If Lambda@Edge is slow:
1. Increase memory allocation (128MB → 256MB)
2. Optimize function code
3. Check CloudWatch metrics

---

## Cost Considerations

**Lambda@Edge Pricing:**
- First 1M requests/month: Free
- Additional requests: $0.60 per 1M requests
- Very cost-effective for most sites

**CloudFront:**
- No additional cost for Lambda@Edge
- Standard CloudFront pricing applies

---

## Alternative: CloudFront Functions (Lighter Weight)

For simpler redirects, you can use CloudFront Functions instead of Lambda@Edge:

**Pros:**
- Faster (runs at edge locations)
- Lower cost
- Simpler code

**Cons:**
- Limited execution time (1ms)
- Limited memory
- Less flexible

See AWS documentation for CloudFront Functions implementation.

---

## Next Steps

1. ✅ Deploy Lambda@Edge function
2. ✅ Attach to CloudFront distribution
3. ✅ Test all redirects
4. ✅ Monitor in Search Console
5. ✅ Update sitemap if needed

---

## Support

For issues or questions:
- Check AWS Lambda@Edge documentation
- Review CloudFront documentation
- Check Next.js middleware documentation (if using Option 2)




