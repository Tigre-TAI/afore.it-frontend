# 产品分类图标文件夹

这个文件夹包含prodotti页面每个分类前面的图标。

## 📁 文件命名规范

### 产品分类图标
- `icon_pv_inverter.svg` - PV Inverter (逆变器) 图标
- `icon_battery_storage.svg` - Battery Storage (电池存储) 图标  
- `icon_all_in_one.svg` - All-in-One (一体化系统) 图标
- `icon_ev_charger.svg` - EV Charger (电动车充电器) 图标

## 📐 SVG规格

### 尺寸规格
- **尺寸**: 64x64px (1:1 正方形)
- **颜色**: 红色 (#DC2626 或 #EF4444)
- **格式**: SVG (矢量格式)
- **背景**: 透明

### 设计规范
- **线条粗细**: 2px
- **圆角**: 4px (如果需要)
- **风格**: 简洁的线条艺术风格
- **品牌**: 包含"Aforé"文字标识

## 🎨 图标描述

### 1. PV Inverter 图标
- **形状**: 矩形设备，圆角
- **特征**: 顶部有红色矩形，底部有3个水滴/出口形状
- **文字**: "Aforé" 在顶部矩形内

### 2. Battery Storage 图标  
- **形状**: 高矩形柜子
- **特征**: 顶部有红色圆点，内部有3条水平分隔线
- **文字**: 无文字标识

### 3. All-in-One 图标
- **形状**: 高矩形，圆角顶部
- **特征**: 内部有3条水平分隔线
- **文字**: "Aforé" 在顶部区域

### 4. EV Charger 图标
- **形状**: 矩形设备，圆角
- **特征**: 右侧延伸出软管，向下弯曲后向上
- **文字**: "Aforé" 在顶部区域

## 🔧 使用说明

图标通过 `src/data/category-icons.ts` 配置文件管理：

```typescript
export const CATEGORY_ICONS: Record<string, string> = {
  'pv_inverter': '/images/icons/categories/icon_pv_inverter.svg',
  'battery_storage': '/images/icons/categories/icon_battery_storage.svg',
  'all_in_one': '/images/icons/categories/icon_all_in_one.svg',
  'ev_charger': '/images/icons/categories/icon_ev_charger.svg'
};
```

## 🔄 更新流程

1. 将SVG文件放入此文件夹
2. 按照命名规范命名文件
3. 确保SVG规格符合要求
4. 在 `category-icons.ts` 中配置路径
5. 测试在不同屏幕尺寸下的显示效果
