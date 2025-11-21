# 案例研究图片目录 (Case Studies)

## 📁 文件夹位置
```
public/image/cases/
```

## 📝 命名规范

### 推荐命名格式
**格式**: `case_{序号}_{项目名称}_{类型}.{ext}`

### 命名示例
```
case_01_residential_rimini.jpg
case_02_commercial_milan.jpg
case_03_industrial_rome.jpg
case_04_residential_turin.jpg
case_05_commercial_naples.jpg
case_06_hybrid_venice.jpg
case_07_storage_florence.jpg
case_08_allinone_bologna.jpg
case_09_residential_genoa.jpg
case_10_commercial_palermo.jpg
case_11_industrial_bari.jpg
case_12_residential_catania.jpg
```

### 简化命名格式（推荐）
如果项目名称较长，可以使用更简洁的命名：
```
case_01.jpg
case_02.jpg
case_03.jpg
case_04.jpg
case_05.jpg
case_06.jpg
case_07.jpg
case_08.jpg
case_09.jpg
case_10.jpg
case_11.jpg
case_12.jpg
```

### 描述性命名格式
```
case_residential_photovoltaic_rimini.jpg
case_commercial_solar_system_milan.jpg
case_industrial_energy_storage_rome.jpg
case_hybrid_inverter_turin.jpg
case_battery_storage_naples.jpg
case_all_in_one_venice.jpg
```

## 📐 图片要求

### 尺寸规格
- **推荐尺寸**: 1200×1200px (1:1 正方形)
- **最小尺寸**: 800×800px
- **最大尺寸**: 2000×2000px
- **比例**: 必须为 1:1 (正方形)，因为网格布局使用 `aspect-square`

### 格式和质量
- **格式**: JPG (推荐) 或 WebP
- **文件大小**: ≤ 500KB (建议 200-300KB)
- **质量**: 高清，专业拍摄
- **压缩**: 使用 TinyPNG 或 ImageOptim 优化

### 内容要求
- **主题**: 实际安装案例、项目现场、产品应用场景
- **风格**: 统一、专业、清晰
- **背景**: 简洁，不干扰主体
- **焦点**: 突出产品安装效果或应用场景
- **光线**: 充足、自然

## 🎯 图片类型建议

### 1. 住宅项目 (Residential)
- 屋顶光伏安装
- 家庭储能系统
- 一体化解决方案

### 2. 商业项目 (Commercial)
- 商业建筑光伏
- 大型储能系统
- 企业能源解决方案

### 3. 工业项目 (Industrial)
- 工业光伏电站
- 大型储能系统
- 企业级解决方案

### 4. 奖项/活动 (Awards/Events)
- 颁奖典礼
- 展会现场
- 产品发布会

## 📋 当前需要的图片

根据 Cases 组件配置，需要至少 **12 张图片**：

1. `case_01.jpg` - 案例1
2. `case_02.jpg` - 案例2
3. `case_03.jpg` - 案例3
4. `case_04.jpg` - 案例4
5. `case_05.jpg` - 案例5
6. `case_06.jpg` - 案例6
7. `case_07.jpg` - 案例7
8. `case_08.jpg` - 案例8
9. `case_09.jpg` - 案例9 (展开后显示)
10. `case_10.jpg` - 案例10 (展开后显示)
11. `case_11.jpg` - 案例11 (展开后显示)
12. `case_12.jpg` - 案例12 (展开后显示)

## 🔄 如何更新代码

将图片放入 `public/image/cases/` 后，需要更新 `src/components/Cases.tsx` 中的图片路径：

```typescript
const allCases: CaseStudy[] = [
  {
    id: "case-1",
    title: t("home.cases.case1.title"),
    image: "/image/cases/case_01.jpg",  // 更新路径
  },
  {
    id: "case-2",
    title: t("home.cases.case2.title"),
    image: "/image/cases/case_02.jpg",  // 更新路径
  },
  // ... 以此类推
];
```

## 💡 优化建议

1. **批量处理**: 使用 Photoshop 或 Lightroom 批量调整尺寸和压缩
2. **统一风格**: 确保所有图片色调、风格一致
3. **Alt文本**: 在代码中为每张图片提供有意义的 alt 文本
4. **懒加载**: Next.js Image 组件已自动处理图片优化
5. **响应式**: 图片会自动适配不同屏幕尺寸

## 🚀 快速开始

1. 准备 12 张正方形图片 (1200×1200px)
2. 将图片命名为 `case_01.jpg` 到 `case_12.jpg`
3. 放入 `public/image/cases/` 文件夹
4. 更新 `src/components/Cases.tsx` 中的图片路径
5. 运行 `npm run build` 验证

---

**注意**: 所有图片都应该经过优化，遵循无障碍原则，确保文件大小合理。

