# Figma PDF模板转换指南

## 📋 概述

本指南将帮您将Figma设计的PDF证书模板转换为可以在系统中使用的代码格式。

## 🎯 第一步：Figma设计要求

### 📐 **页面设置**
- **尺寸**: A4 (210mm × 297mm)
- **分辨率**: 300 DPI
- **颜色模式**: RGB (网页显示) 
- **背景**: 白色或透明

### 🎨 **设计元素**
```
📄 典型PDF证书布局：
┌─────────────────────────────────┐
│ LOGO区域        公司信息        │ ← Header
├─────────────────────────────────┤
│        CERTIFICATO DI GARANZIA  │ ← Title
├─────────────────────────────────┤
│ 序列号: [PLACEHOLDER]           │ ← 动态内容区
│ 开始日期: [PLACEHOLDER]         │
│ 结束日期: [PLACEHOLDER]         │
│ 生成日期: [PLACEHOLDER]         │
├─────────────────────────────────┤
│ 条款和联系信息                  │ ← Footer
└─────────────────────────────────┘
```

## 🔧 第二步：Figma插件导出

### **方法1: 使用Figma to HTML插件**

1. **安装插件**: 
   - 在Figma中搜索 "Figma to HTML" 或 "HTML CSS Generator"
   - 推荐插件: "Figma to HTML", "Anima", "Builder.io"

2. **选择框架**: 
   - 选择整个A4设计框架
   - 确保包含所有元素

3. **导出设置**:
   ```
   ✅ Export HTML + CSS
   ✅ Include responsive design
   ✅ Optimize for web
   ❌ Don't include JavaScript
   ```

4. **获取代码**:
   - 复制HTML代码
   - 复制CSS代码

### **方法2: 手动Code Inspector**

1. **选择元素**: 在Figma中选择任意元素
2. **查看代码**: 右侧面板 → Code → CSS
3. **复制样式**: 逐一复制每个元素的CSS

## 📝 第三步：代码格式要求

### **HTML结构示例**:
```html
<div class="certificate-container">
  <!-- Header -->
  <div class="header">
    <div class="logo">AFORE</div>
    <div class="company-info">
      <div>AFORE ITALIA S.R.L.</div>
      <div>Commercity, MODULO L43</div>
    </div>
  </div>
  
  <!-- Title -->
  <div class="title">
    <h1>CERTIFICATO DI GARANZIA</h1>
  </div>
  
  <!-- 动态内容区 - 使用特殊类名 -->
  <div class="content">
    <div class="field">
      <span>Numero di Serie:</span>
      <span class="serial-number-placeholder"></span>
    </div>
    
    <div class="field">
      <span>Data Inizio Garanzia:</span>
      <span class="start-date-placeholder"></span>
    </div>
    
    <div class="field">
      <span>Data Scadenza Garanzia:</span>
      <span class="end-date-placeholder"></span>
    </div>
    
    <div class="field">
      <span>Certificato generato il:</span>
      <span class="generated-date-placeholder"></span>
    </div>
  </div>
  
  <!-- Footer -->
  <div class="footer">
    <div class="contact-info">
      <div>Email: afore@aforeitaly.com</div>
      <div>Sito Web: www.afore.it</div>
    </div>
  </div>
</div>
```

### **CSS样式示例**:
```css
@page {
  size: A4;
  margin: 0;
}

body {
  font-family: 'Inter', 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background: #ffffff;
}

.certificate-container {
  width: 210mm;
  height: 297mm;
  position: relative;
  background: white;
  padding: 20mm;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #C01C20;
}

.title h1 {
  font-size: 28px;
  color: #C01C20;
  text-align: center;
  margin: 40px 0;
}

.field {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

/* 动态内容占位符 - 重要！ */
.serial-number-placeholder::after {
  content: '${data.sn}';
  font-weight: bold;
  color: #C01C20;
}

.start-date-placeholder::after {
  content: '${data.startDate}';
}

.end-date-placeholder::after {
  content: '${data.endDate}';
}

.generated-date-placeholder::after {
  content: '${data.generatedDate}';
}
```

## 🔑 第四步：关键占位符类名

### **必需的占位符类名**:
```css
.serial-number-placeholder    ← 序列号
.start-date-placeholder      ← 开始日期  
.end-date-placeholder        ← 结束日期
.generated-date-placeholder  ← 生成日期
```

这些类名会被系统自动替换为实际数据。

## 📤 第五步：提供给我的格式

### **方式1: 分别提供**
```
1. HTML代码:
<div class="certificate-container">
  <!-- 您的HTML代码 -->
</div>

2. CSS代码: 
.certificate-container {
  /* 您的CSS样式 */
}
```

### **方式2: 完整文件**
您可以将HTML和CSS组合成一个完整的代码块提供给我。

## 🎨 第六步：设计建议

### **颜色方案**:
- **品牌红**: `#C01C20`
- **深灰**: `#333333`
- **浅灰**: `#666666`
- **背景**: `#FFFFFF`

### **字体**:
- **主字体**: Inter, Arial, sans-serif
- **标题**: 24-32px, 粗体
- **正文**: 14-16px, 常规
- **小字**: 12px

### **布局**:
- **页边距**: 20-30mm
- **行间距**: 1.4-1.6
- **元素间距**: 15-20px

## 🚀 第七步：系统集成

提供代码后，我会：

1. **整合到模板管理器**
2. **测试PDF生成**
3. **确保动态数据正确替换**
4. **验证打印效果**

## 💡 提示

1. **保持简洁**: PDF生成对复杂CSS支持有限
2. **避免使用**: 
   - CSS Grid (有限支持)
   - 复杂动画
   - 外部字体文件
3. **推荐使用**:
   - Flexbox布局
   - 绝对定位
   - 内联字体

## 📞 需要帮助？

如果您在转换过程中遇到问题，请提供：
1. Figma设计截图
2. 导出的HTML代码
3. 导出的CSS代码
4. 遇到的具体问题

我会帮您完成集成！
