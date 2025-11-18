# AFORE 图片资源规范指南

## 📁 文件夹结构

```
public/images/
├── products/          # 产品图片
│   ├── inverters/     # 逆变器产品
│   ├── batteries/     # 电池产品
│   ├── chargers/      # 充电器产品
│   └── all-in-one/    # 一体机产品
├── heroes/            # Hero区域背景图
├── icons/             # 图标
│   ├── navbar/        # 导航栏图标
│   ├── footer/        # 页脚图标
│   ├── features/      # 功能特色图标
│   └── ui/            # UI界面图标
├── logos/             # LOGO文件
├── features/          # 功能特色图片
├── gallery/           # 画廊/展示图片
├── team/              # 团队照片
├── certifications/    # 认证证书
└── social/            # 社交媒体图片
```

## 🎯 图片命名规范做

### 产品图片 (products/)
**格式**: `{brand}_{model}_{variant}_{view}.{ext}`
- **示例**: `afore_inverter_5kw_front.jpg`
- **示例**: `hailei_battery_10kwh_side.png`

**视角标识**:
- `front` - 正面
- `side` - 侧面
- `back` - 背面
- `angle` - 斜角
- `detail` - 细节

### Hero背景图 (heroes/)
**格式**: `hero_{page}_{variant}.{ext}`
- **示例**: `hero_homepage_main.jpg`
- **示例**: `hero_products_background.jpg`
- **示例**: `hero_solutions_energy.jpg`

### 图标 (icons/)
**格式**: `icon_{category}_{name}.svg`
- **示例**: `icon_navbar_home.svg`
- **示例**: `icon_feature_solar.svg`
- **示例**: `icon_ui_arrow_down.svg`

### LOGO (logos/)
**格式**: `logo_afore_{variant}_{color}.{ext}`
- **示例**: `logo_afore_main_red.svg`
- **示例**: `logo_afore_horizontal_white.png`

## 📐 尺寸要求

### 产品图片
| 用途 | 尺寸 (px) | 格式 | 质量 |
|------|-----------|------|------|
| 产品详情主图 | 800x600 | JPG/PNG | 高 (90%) |
| 产品列表缩略图 | 400x300 | JPG/WebP | 中 (80%) |
| 产品对比图 | 600x450 | PNG | 高 (90%) |

### Hero背景图
| 用途 | 尺寸 (px) | 格式 | 质量 |
|------|-----------|------|------|
| 桌面端 | 1920x1080 | JPG/WebP | 高 (85%) |
| 移动端 | 768x1024 | JPG/WebP | 中 (75%) |
| 超宽屏 | 2560x1440 | JPG | 高 (90%) |

### 图标
| 用途 | 尺寸 (px) | 格式 | 特点 |
|------|-----------|------|------|
| 导航栏图标 | 24x24 | SVG | 矢量，可缩放 |
| 功能图标 | 48x48 | SVG | 简洁，单色 |
| UI图标 | 16x16, 24x24 | SVG | 像素完美 |
| 大型图标 | 64x64 | SVG/PNG | 详细设计 |

### LOGO
| 用途 | 尺寸 (px) | 格式 | 变体 |
|------|-----------|------|------|
| 主LOGO | 200x60 | SVG | 全彩 |
| 导航栏LOGO | 120x36 | SVG | 简化版 |
| 页脚LOGO | 100x30 | SVG | 单色 |
| 社交媒体 | 400x400 | PNG | 方形 |

## 🎨 颜色和品牌规范

### 主色调
- **品牌红**: `#C01C20`
- **深灰**: `#1E293B`
- **浅灰**: `#F8FAFC`
- **白色**: `#FFFFFF`

### 图标风格
- **线条粗细**: 2px
- **圆角**: 2px
- **风格**: 简约、现代、工业风

## 📱 响应式图片

### 现代格式支持
1. **WebP** - 现代浏览器，文件更小
2. **AVIF** - 最新格式，极小文件
3. **JPG/PNG** - 兼容性备选

### 命名约定
```
image_name.jpg        # 原始格式
image_name.webp       # WebP格式
image_name@2x.jpg     # 高分辨率版本
image_name_mobile.jpg # 移动端优化版本
```

## 🚀 优化建议

### 文件大小控制
- **Hero图片**: < 500KB
- **产品图片**: < 200KB
- **图标**: < 50KB
- **缩略图**: < 100KB

### 压缩工具推荐
- **在线**: TinyPNG, Squoosh
- **本地**: ImageOptim (Mac), RIOT (Windows)
- **命令行**: imagemin, mozjpeg

## 📋 当前需要的图片清单

### 🔥 高优先级
1. **主LOGO** - `logo_afore_main_red.svg`
2. **导航栏LOGO** - `logo_afore_navbar_white.svg`
3. **首页Hero背景** - `hero_homepage_main.jpg`
4. **产品页Hero背景** - `hero_products_background.jpg`

### ⚡ 产品图片
1. **逆变器系列** (inverters/)
   - AFORE 逆变器产品图
   - 不同功率规格图片
2. **电池系列** (batteries/)
   - AFORE电池系统图
   - Hailei电池系统图
3. **充电器系列** (chargers/)
   - EV充电器产品图
4. **一体机系列** (all-in-one/)
   - 一体化解决方案图

### 🎯 图标需求
1. **导航图标** (icons/navbar/)
   - 首页、产品、解决方案、事件、联系
2. **功能图标** (icons/features/)
   - 太阳能、储能、充电、智能
3. **UI图标** (icons/ui/)
   - 箭头、播放、暂停、下载

### 📸 其他图片
1. **团队照片** (team/) - 公司团队合影
2. **认证证书** (certifications/) - 产品认证
3. **工厂/办公室** (gallery/) - 企业展示

## 💡 使用示例

```jsx
// 在React组件中使用
<img 
  src="/images/products/inverters/afore_inverter_5kw_front.jpg"
  alt="AFORE 5kW 逆变器"
  className="w-full h-auto"
/>

// 响应式图片
<picture>
  <source srcSet="/images/heroes/hero_homepage_main.webp" type="image/webp" />
  <img src="/images/heroes/hero_homepage_main.jpg" alt="AFORE 首页" />
</picture>
```

---
**注意**: 所有图片都应该经过优化，遵循无障碍原则，包含适当的alt文本。
