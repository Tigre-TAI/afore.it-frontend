# Redirect Quick Reference

## Quick Deploy Commands

### 1. Create Lambda Package
```bash
cd redirects
zip cloudfront-lambda-edge.zip cloudfront-lambda-edge.js
```

### 2. Test Redirects (After Deployment)
```bash
# Root
curl -I https://www.afore.it/

# Language-less pages
curl -I https://www.afore.it/prodotti
curl -I https://www.afore.it/documentazione
curl -I https://www.afore.it/garanzia
```

## Redirect Rules Summary

| Pattern | Redirect To | Type |
|---------|-------------|------|
| `/` | `/it` | 301 |
| `/{page}` (no lang) | `/it/{page}` | 301 |
| `/{page}/` (trailing slash) | `/it/{page}` | 301 |
| `/{page}.html` | `/it/{page}` | 301 |

## All Explicit Redirects

```
/ → /it
/prodotti → /it/prodotti
/documentazione → /it/documentazione
/garanzia → /it/garanzia
/prodotti/allin1 → /it/prodotti/allin1
/prodotti/inverter-di-stringa → /it/prodotti/inverter-di-stringa
/prodotti/ibrido → /it/prodotti/ibrido
/prodotti/batteria-di-accumulo → /it/prodotti/batteria-di-accumulo
/prodotti/ev-charger → /it/prodotti/ev-charger
/prodotti/pv-inverter → /it/prodotti/pv-inverter
/prodotti/pv-inverter/inverter-di-stringa → /it/prodotti/pv-inverter/inverter-di-stringa
/prodotti/pv-inverter/inverter-ibrido → /it/prodotti/pv-inverter/inverter-ibrido
/prodotti/allin1/sistema-di-accumulo-afore → /it/prodotti/allin1/sistema-di-accumulo-afore
/prodotti/allin1/sistema-di-accumulo-hailei → /it/prodotti/allin1/sistema-di-accumulo-hailei
/prodotti/batteria-di-accumulo/serie-afore → /it/prodotti/batteria-di-accumulo/serie-afore
/prodotti/batteria-di-accumulo/serie-accumulo-hailei → /it/prodotti/batteria-di-accumulo/serie-accumulo-hailei
/documentazione/guida → /it/documentazione/guida
/documentazione/manuale → /it/documentazione/manuale
/documentazione/archivio → /it/documentazione/archivio
/documentazione/inverter-ibridi → /it/documentazione/inverter-ibridi
/documentazione/certificati-inverter-di-stringa → /it/documentazione/certificati-inverter-di-stringa
/documentazione/certificati-inverter-ibridi → /it/documentazione/certificati-inverter-ibridi
/documentazione/certificati-all-in-one → /it/documentazione/certificati-all-in-one
/documentazione/accumulo-afore → /it/documentazione/accumulo-afore
/documentazione/scheda-tecnica → /it/documentazione/scheda-tecnica
```

## AWS Lambda@Edge Configuration

- **Region**: us-east-1 (required)
- **Runtime**: Node.js 18.x or 20.x
- **Memory**: 128 MB
- **Timeout**: 3 seconds
- **Event**: Viewer Request
- **Architecture**: x86_64

## Files

- `cloudfront-lambda-edge.js` - Lambda function code
- `redirect-map.json` - Complete redirect map
- `DEPLOYMENT_GUIDE.md` - Full deployment instructions
- `QUICK_REFERENCE.md` - This file

