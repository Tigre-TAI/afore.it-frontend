# 产品徽章文件夹

这个文件夹包含所有产品卡片上显示的徽章图片。

## 📁 文件命名规范

### EUPD Research 徽章
- `eupd_top_innovation_italy_2025.png` - EUPD Research Top Innovation Inverters Italy 2025
- `eupd_top_brand_pv_poland_2025.png` - EUPD Research Top Brand PV Inverters Poland 2025

## 📐 徽章规格

### 尺寸建议
- **宽度**: 80px (小屏幕) / 100px (大屏幕)
- **高度**: 60px (小屏幕) / 75px (大屏幕)
- **比例**: 4:3 (盾牌形状)

### 格式要求
- **格式**: PNG
- **背景**: 透明
- **质量**: 高分辨率，适合Retina显示

## 🎨 设计规范

### 位置
- 显示在产品卡片图片的左上角
- 垂直排列，间距4px
- 最多显示2个徽章

### 样式
- 带轻微阴影效果 (`drop-shadow-sm`)
- 响应式尺寸调整
- 保持原始比例不变形

## 📝 使用说明

徽章通过 `src/data/product-badges.ts` 配置文件管理：

```typescript
// 添加新徽章
export const BADGES: Record<string, ProductBadge> = {
  'new-badge-id': {
    id: 'new-badge-id',
    name: 'New Badge Name',
    image: '/images/badges/new_badge.png',
    description: 'Badge description'
  }
};

// 为产品分配徽章
export const PRODUCT_BADGES: Record<string, string[]> = {
  'product-id': ['badge-id-1', 'badge-id-2']
};
```

## 🔄 更新流程

1. 将新徽章PNG文件放入此文件夹
2. 按照命名规范命名文件
3. 在 `product-badges.ts` 中添加徽章定义
4. 在 `PRODUCT_BADGES` 中为产品分配徽章
5. 测试显示效果
