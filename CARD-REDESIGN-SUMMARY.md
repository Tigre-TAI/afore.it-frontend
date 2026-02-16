# Card 风格改造完成总结 — High-End Minimal

## 改动概览

全站 Card 已由「PPT 卡片风」改为「High-End Minimal（欧洲工业科技品牌）」：
- **Shadow**：移除 shadow-xl/2xl/lg，改用 border 或极轻 border
- **圆角**：统一为 rounded-md (8px)，最大 rounded-lg (10px) 仅弹窗
- **Hover**：去掉 hover:scale-105、hover:-translate-y-1、hover:shadow-lg；改为 hover:border-slate-300、hover:bg-slate-50/50
- **主 CTA**：bg-brand-600 → bg-slate-900（品牌红仅作点缀）

---

## 1. Home 首页

### 关键组件/类名改动

| 组件 | 文件 | 改动 |
|------|------|------|
| **ProductCard** | `src/components/ProductCard.tsx` | `rounded-2xl shadow-sm hover:shadow-md` → `rounded-md border hover:border-slate-300 hover:bg-slate-50/50` |
| **EventBooking** | `src/components/EventBooking.tsx` | 右列卡片 `rounded-2xl shadow-lg` → `rounded-md border`；主 CTA `bg-brand-600 hover:scale-105` → `bg-slate-900` 无 scale；Badge `rounded-full` → `rounded-md` |
| **ProductCategories** | `src/components/ProductCategories.tsx` | 图片 `rounded-xl/2xl` → `rounded-md`；CTA 同上 |
| **FeaturedProducts** | `src/components/FeaturedProducts.tsx` | CTA 同上（内部用 ProductCard 已更新） |
| **Cases** | `src/components/Cases.tsx` | 弹窗 `rounded-2xl shadow-2xl` → `rounded-lg border`；关闭按钮 `rounded-full shadow-lg` → `rounded-md border`；Show All 按钮去掉 scale；产品图容器加 `border` |
| **Hero** | `src/components/Hero.tsx` | CTA `bg-brand-600 hover:scale-105` → `bg-slate-900` |

**截图**：首页 `http://localhost:3000/it` — Hero、EventBooking、ProductCategories、FeaturedProducts、Cases 区块

---

## 2. Product 产品页

### 关键组件/类名改动

| 组件 | 文件 | 改动 |
|------|------|------|
| **ProductCard** | 复用上述 | 全站 ProductCard 已统一 |
| **prodotti/[category]/[id]** | `src/app/[lang]/prodotti/[category]/[id]/page.tsx` | 产品图 `rounded-2xl` → `rounded-md border`；Scheda/Download 按钮 `bg-brand-600 rounded-lg` → `bg-slate-900 rounded-md`；下载项 `rounded-lg` → `rounded-md` |

**截图**：`http://localhost:3000/it/prodotti`、`http://localhost:3000/it/prodotti/inverter-di-stringa/stringa-3-6kw`

---

## 3. Support / Download（文档 + 保修）

### 关键组件/类名改动

| 页面/组件 | 文件 | 改动 |
|----------|------|------|
| **documentazione 主页** | `src/app/[lang]/documentazione/page.tsx` | 分类块 `rounded-xl/2xl shadow-sm hover:-translate-y-1 hover:shadow-lg` → `rounded-md border hover:border-slate-300` |
| **DocumentList** | `src/app/[lang]/documentazione/_components/DocumentList.tsx` | 列表 `rounded-xl` → `rounded-md`；Download 按钮去掉 shadow-sm |
| **Filters** | `src/app/[lang]/documentazione/_components/Filters.tsx` | 表单控件 `rounded-lg` → `rounded-md` |
| **garanzia** | `src/app/[lang]/garanzia/page.tsx` | 主卡片 `shadow-xl rounded-xl/2xl ring-1` → `border rounded-md`；按钮统一 rounded-md、bg-slate-900 |
| **contatti** | `src/app/[lang]/contatti/page.tsx` | 内容区 `shadow-xl rounded-xl/2xl ring-1` → `border rounded-md` |
| **documentazione 子页** | inverter-ibridi, accumulo-afore, certificati-* | 列表 `rounded-xl/rounded-lg` → `rounded-md` |

**截图**：`http://localhost:3000/it/documentazione`、`http://localhost:3000/it/garanzia`

---

## 4. Eventi 活动页

### 关键组件/类名改动

| 元素 | 文件 | 改动 |
|------|------|------|
| **主卡片** | `src/app/[lang]/eventi/page.tsx` | `shadow-xl rounded-xl/2xl ring-1` → `border rounded-md` |
| **Badge** | 同上 | `rounded-full` → `rounded-md` |
| **地点/日期图标** | 同上 | `rounded-lg bg-gray-100` → `rounded-md bg-slate-100` |
| **CTA 按钮** | 同上 | `bg-brand-600 hover:scale-105` → `bg-slate-900` |
| **亮点图标** | 同上 | `rounded-lg shadow-sm` → `rounded-md border` |
| **视频容器** | 同上 | `rounded-2xl shadow-xl ring-1` → `rounded-md border` |

**截图**：`http://localhost:3000/it/eventi`

---

## 5. 全站共用组件

| 组件 | 文件 | 改动 |
|------|------|------|
| **CookieConsent** | `src/components/CookieConsent.tsx` | 主弹窗、设置弹窗 `rounded-2xl shadow-2xl` → `rounded-lg border` |
| **SearchOverlay** | `src/components/SearchOverlay.tsx` | 搜索框 `rounded-xl shadow-2xl` → `rounded-lg border` |
| **Navbar 语言下拉** | `src/components/layout/Navbar.tsx` | `rounded-lg shadow-lg` → `rounded-md` 无 shadow |
| **Topbar 语言下拉** | `src/components/layout/Topbar.tsx` | 去掉 shadow-lg |

---

## Build 状态

✅ `pnpm run build` 已通过
