# Afore Italia — 全站 UI 诊断与改造计划

---

## Step B 完成状态（全局 Design System）

**已完成**：在 `src/app/globals.css` 中建立全局 tokens 与 utility classes；`layout.tsx` 字体保持 Geist 不变；build 通过。

**替换映射（Phase 2/3/4 使用）**：
- `rounded-xl` / `rounded-2xl` → `rounded-[var(--radius-md)]` 或 `.surface`
- `shadow-xl` / `shadow-2xl` → 移除，或用 `box-shadow: var(--shadow-subtle)`
- `ring-1 ring-black/5` → `border: var(--border-subtle)` 或 `.surface`
- `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` → `.container`
- `py-16 md:py-24` → `.section`
- `bg-white border rounded` 卡片 → `.surface`

---

---

## 一、全站使用最多的 UI 组件/模式

### 1. Card（卡片）

| 形态 | 出现位置 | 使用次数 |
|------|-----------|----------|
| **主内容卡片** | `bg-white` + `shadow-xl/2xl` + `rounded-xl/2xl` + `ring-1 ring-black/5` | 7+ 处 |
| **ProductCard** | 产品卡片，首页 + 8 个 prodotti 子页 | 复用于 10+ 页面 |
| **分类卡片** | documentazione 主页的 4 个分类块 | 4 块 |
| **列表容器** | `divide-y` + `border` + `rounded-lg/xl` + `bg-white` | 6+ 处 |
| **弹窗/Overlay** | CookieConsent、SearchOverlay、Cases 弹窗 | 5 处 |

**问题**：shadow-xl、rounded-2xl、ring 组合偏消费品牌，卡片感强。

---

### 2. Button（按钮）

| 类型 | 典型 class | 出现位置 |
|------|------------|-----------|
| **主 CTA（红底）** | `bg-brand-600` + `rounded-lg` + `hover:scale-105` | Hero、EventBooking、ProductCategories、FeaturedProducts、Cases、garanzia、eventi、prodotti |
| **次要** | `border border-slate-300` + `rounded-lg` | garanzia、EventBooking、Filters |
| **下载/深色** | `bg-slate-900` + `rounded-lg` | garanzia、documentazione 各页 |

**问题**：品牌红大面积用于主 CTA；`hover:scale-105` 过度。

---

### 3. Section（区块布局）

| 模式 | 典型 class | 使用处 |
|------|------------|--------|
| **主 section** | `py-8 md:py-16 lg:py-24` | EventBooking、ProductCategories、Cases、FeaturedProducts |
| **Hero 内容器** | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24` | 20+ 页面 |
| **文档 section** | `py-8 sm:py-10` / `py-12` / `py-16` | documentazione 各子页、Filters、DocumentList |

**问题**：`py-8/12/16/24` 混用，不统一。

---

### 4. Container（容器）

| 模式 | 典型 class | 使用处 |
|------|------------|--------|
| **主容器** | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` | 全站 50+ 处 |
| **变体** | `px-6 lg:px-8`（无 px-4 sm:px-6） | prodotti 部分页、Footer |

**问题**：prodotti 和 documentazione 部分页面少了 `px-4 sm:px-6` 的移动端适配。

---

### 5. Typography（字体层级）

| 层级 | 典型 class | 使用处 |
|------|------------|--------|
| **H1** | `text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight` | 20+ 页面 |
| **H2** | `text-xl sm:text-2xl font-bold` / `text-2xl md:text-3xl lg:text-4xl font-bold` | 各 section |
| **H3** | `text-lg font-bold` / `text-xl font-bold` | 卡片标题、列表分组 |

**问题**：`font-extrabold` 与 `font-bold` 混用；responsive 尺度不统一。

---

### 6. Nav（导航）

| 组件 | 文件 | 说明 |
|------|------|------|
| **Navbar** | `src/components/layout/Navbar.tsx` | 主导航，语言下拉 `rounded-lg shadow-lg` |
| **Topbar** | `src/components/layout/Topbar.tsx` | 二级导航，语言下拉 `rounded-md shadow-lg` |

**问题**：下拉菜单 shadow-lg 过重。

---

### 7. Footer

| 文件 | 说明 |
|------|------|
| `src/components/layout/Footer.tsx` | `bg-black text-gray-300`，容器 `max-w-7xl px-6 py-12` |

**说明**：结构较稳，主要是链接 hover 可统一。

---

### 8. Badge / 小标签

| 典型 class | 使用处 |
|------------|--------|
| `rounded-full` + `bg-brand-100 text-brand-700` | EventBooking、eventi 页 |
| `rounded-full` + `bg-white/90` | Hero |
| `rounded-full` + `bg-white/20` | Hero 社交按钮 |

**问题**：`rounded-full` 过圆，偏消费品牌。

---

## 二、最像「PPT 卡片风」的位置

### 1. 圆角过大

| 位置 | 当前值 | 文件 |
|------|--------|------|
| 主内容卡片 | `rounded-xl sm:rounded-2xl` (12–16px) | garanzia, eventi, contatti |
| 产品卡片 | `rounded-2xl` (16px) | ProductCard.tsx |
| 文档分类卡片 | `rounded-xl sm:rounded-2xl` | documentazione/page.tsx |
| 弹窗 | `rounded-2xl` | CookieConsent, SearchOverlay, Cases |
| 视频容器 | `rounded-2xl` | eventi/page.tsx |
| EventBooking 卡片 | `rounded-2xl` | EventBooking.tsx |
| 产品分类图片 | `sm:rounded-xl md:rounded-2xl` | ProductCategories.tsx |

### 2. 阴影过重

| 位置 | 当前值 | 文件 |
|------|--------|------|
| Cookie 弹窗 | `shadow-2xl` | CookieConsent.tsx |
| Cookie 设置弹窗 | `shadow-2xl` | CookieConsent.tsx |
| 搜索 Overlay | `shadow-2xl` | SearchOverlay.tsx |
| Cases 弹窗 | `shadow-2xl` | Cases.tsx |
| 主内容卡片 | `shadow-xl` | garanzia, eventi, contatti |
| EventBooking | `shadow-lg` | EventBooking.tsx |
| 视频容器 | `shadow-xl` | eventi/page.tsx |
| ProductCard | `shadow-sm hover:shadow-md` | ProductCard.tsx |
| 语言下拉 | `shadow-lg` | Navbar, Topbar |

### 3. 卡片泛滥

- **首页**：EventBooking 大卡片 + ProductCategories 4 张「卡片式」区块 + FeaturedProducts 的 ProductCard 网格 + Cases 案例卡片
- **documentazione**：4 个分类块，每个都是 `rounded-xl/2xl` + `shadow-sm` + `hover:-translate-y-1 hover:shadow-lg`
- **garanzia / eventi / contatti**：主内容区统一为「大白卡」
- **prodotti**：ProductCard 在 10+ 页重复出现

### 4. 信息密度不均

- **documentazione 分类块**：图标 + 标题 + 描述 + bullets，视觉层级多
- **EventBooking**：左右两栏，左文右图，信息量适中
- **garanzia**：表单 + 多个下载区块，垂直堆叠偏密
- **Cases**：grid 中每项信息量差异大，展开弹窗后信息更集中

---

## 三、建议优先改的 10 个文件（含路径与原因）

| 优先级 | 文件路径 | 改动原因 | 影响面 |
|--------|----------|----------|--------|
| 1 | `src/components/ProductCard.tsx` | 全站复用的产品卡片，`rounded-2xl` + `shadow-sm/hover:shadow-md` 是最典型的 PPT 感来源 | 首页 + 8 个 prodotti 子页 |
| 2 | `src/app/globals.css` | 定义全局 tokens（圆角、阴影、容器、按钮基类），为后续改造打底 | 全站 |
| 3 | `src/components/EventBooking.tsx` | 首页大区块，`rounded-2xl shadow-lg` + `hover:scale-105` | 首页 |
| 4 | `src/app/[lang]/documentazione/page.tsx` | 4 个分类块，`rounded-xl/2xl` + `shadow-sm` + `hover:-translate-y-1 hover:shadow-lg` | 文档首页 |
| 5 | `src/app/[lang]/eventi/page.tsx` | 主卡片 + 视频容器均为 `shadow-xl rounded-2xl` | 活动页 |
| 6 | `src/app/[lang]/garanzia/page.tsx` | 主卡片 `shadow-xl rounded-xl/2xl`，多处按钮 | 保修页 |
| 7 | `src/components/CookieConsent.tsx` | 弹窗 `rounded-2xl shadow-2xl`，用户首屏必见 | 全站 |
| 8 | `src/components/ProductCategories.tsx` | 分类图片 `rounded-xl/2xl`，CTA 按钮 `hover:scale-105` | 首页 |
| 9 | `src/components/Cases.tsx` | 案例卡片 + 弹窗 `rounded-2xl shadow-2xl` | 首页 |
| 10 | `src/components/SearchOverlay.tsx` | 搜索框 `rounded-xl shadow-2xl` | 全站 |

---

## 四、改造计划（按影响面从大到小排序）

### Phase 1：全局 Design Tokens（影响全站）

**文件**：`src/app/globals.css`

**改动**：
- 新增 `--radius-default: 6px`，`--radius-md: 8px`，`--radius-lg: 10px`（最大 10px）
- 新增 `--shadow-subtle`（极轻阴影，可选）
- 新增 `.container`、`.section` 等 utility，供后续替换内联 class

---

### Phase 2：核心复组件（影响 10+ 页）

**文件**：`src/components/ProductCard.tsx`

**改动**：
- `rounded-2xl` → `rounded-md`
- `shadow-sm hover:shadow-md` → 去掉 shadow，保留 `border border-slate-200`
- 可选：`hover` 仅做 `border-slate-300` 或 `bg-slate-50/50`

---

### Phase 3：首页高频组件（影响首页）

| 顺序 | 文件 | 改动要点 |
|------|------|----------|
| 3.1 | `EventBooking.tsx` | 卡片：`rounded-2xl shadow-lg` → `rounded-md border`；按钮去掉 `hover:scale-105` |
| 3.2 | `ProductCategories.tsx` | 图片：`rounded-xl/2xl` → `rounded-md`；CTA 去掉 `hover:scale-105` |
| 3.3 | `Cases.tsx` | 卡片、弹窗：`rounded-2xl shadow-2xl` → `rounded-lg border`；按钮同上 |
| 3.4 | `FeaturedProducts.tsx` | 按钮去掉 `hover:scale-105`（内部用 ProductCard，随 Phase 2 生效）|
| 3.5 | `Hero.tsx` | CTA 去掉 `hover:scale-105`；Badge 可 `rounded-full` → `rounded-md` |

---

### Phase 4：独立内容页（影响单页）

| 顺序 | 文件 | 改动要点 |
|------|------|----------|
| 4.1 | `documentazione/page.tsx` | 分类块：`rounded-xl/2xl` → `rounded-md`，去掉 `shadow-sm` 和 `hover:-translate-y-1 hover:shadow-lg` |
| 4.2 | `eventi/page.tsx` | 主卡片、视频容器：`shadow-xl rounded-2xl` → `border rounded-md` |
| 4.3 | `garanzia/page.tsx` | 主卡片同上；按钮保持语义，仅统一圆角 |
| 4.4 | `contatti/page.tsx` | 内容区：`shadow-xl rounded-xl/2xl` → `border rounded-md` |

---

### Phase 5：弹窗 / Overlay（影响全站触达）

| 顺序 | 文件 | 改动要点 |
|------|------|----------|
| 5.1 | `CookieConsent.tsx` | 主弹窗、设置弹窗：`rounded-2xl shadow-2xl` → `rounded-lg` + 轻 border；内部 cookie 区块 `rounded-lg` 可保持 |
| 5.2 | `SearchOverlay.tsx` | 搜索框：`rounded-xl shadow-2xl` → `rounded-lg` + 轻 border |

---

### Phase 6：导航与文档子页（影响面中等）

| 顺序 | 文件 | 改动要点 |
|------|------|----------|
| 6.1 | `Navbar.tsx` | 语言下拉：`rounded-lg shadow-lg` → `rounded-md` + border |
| 6.2 | `Topbar.tsx` | 语言下拉：`shadow-lg` → 去掉或极轻 shadow |
| 6.3 | documentazione 子页 | 列表容器：`rounded-lg/xl` → `rounded-md`；按钮统一圆角 |

---

### Phase 7：prodotti 子页与详情页（跟随 ProductCard）

| 顺序 | 文件 | 改动要点 |
|------|------|----------|
| 7.1 | `prodotti/page.tsx` | 分类卡片、按钮（若有）统一规范 |
| 7.2 | `prodotti/[category]/[id]/page.tsx` | 产品图 `rounded-2xl` → `rounded-md`；按钮统一 |
| 7.3 | 其他 prodotti 子页 | 多为 ProductCard 复用，随 Phase 2 自动生效 |

---

## 五、改造优先级汇总表

| 阶段 | 影响范围 | 文件数 | 预计工作量 |
|------|----------|--------|------------|
| Phase 1 | 全站基础 | 1 | 小 |
| Phase 2 | 10+ 页 | 1 | 小 |
| Phase 3 | 首页 | 5 | 中 |
| Phase 4 | 4 个独立页 | 4 | 中 |
| Phase 5 | 弹窗/Overlay | 2 | 小 |
| Phase 6 | 导航 + 文档 | 3+ | 中 |
| Phase 7 | prodotti | 2+ | 小 |

**建议执行顺序**：Phase 1 → Phase 2 → Phase 3 → Phase 5 → Phase 4 → Phase 6 → Phase 7。
