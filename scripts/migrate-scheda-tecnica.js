#!/usr/bin/env node

/**
 * 迁移脚本：将 OLD repo 中的 SCHEDA_TECNICA PDF 文件
 * 复制到对应的产品目录下
 */

const fs = require('fs');
const path = require('path');

const OLD_REPO = '/Users/tai/Projects/web/afore-web/public/documentazione/SCHEDA_TECNICA';
const NEW_REPO = '/Users/tai/Projects/web/afore.it-frontend/public/prodotti';

// 从 product-data.ts 提取产品信息
const PRODUCTS = [
  // Inverter di Stringa
  { id: 'stringa-1-3kw', models: ['HNS1000TL-1', 'HNS1500TL-1', 'HNS2000TL-1', 'HNS2500TL-1', 'HNS3000TL-1'] },
  { id: 'stringa-3-6kw', models: ['HNS3000TL', 'HNS3600TL', 'HNS4000TL', 'HNS5000TL', 'HNS6000TL'] },
  { id: 'stringa-7-10kw', models: ['HNS7000TL', 'HNS8000TL', 'HNS9000TL', 'HNS10000TL'] },
  { id: 'stringa-trifase-3-25kw', models: ['BNT003KTL', 'BNT004KTL', 'BNT005KTL', 'BNT006KTL', 'BNT010KTL', 'BNT012KTL', 'BNT013KTL', 'BNT015KTL', 'BNT017KTL', 'BNT020KTL', 'BNT025KTL'] },
  { id: 'stringa-trifase-30kw', models: ['BNT030KTL'] },
  { id: 'stringa-trifase-36-60kw', models: ['BNT036KTL', 'BNT040KTL', 'BNT050KTL', 'BNT060KTL'] },
  { id: 'stringa-trifase-70-110kw', models: ['BNT070KTL', 'BNT075KTL', 'BNT080KTL', 'BNT090KTL', 'BNT100KTL', 'BNT110KTL'] },
  
  // Inverter Ibrido
  { id: 'ibrido-monofase-1-3-6kw', models: ['AF1K-SL-1', 'AF1.5K-SL-1', 'AF2K-SL-1', 'AF2.5K-SL-1', 'AF3K-SL-1', 'AF3.6K-SL-1', 'AF3K-SL', 'AF3.6K-SL'] },
  { id: 'ibrido-monofase-plus-4-6kw', models: ['AF4K-SLP', 'AF4.6K-SLP', 'AF5K-SLP', 'AF5.5K-SLP', 'AF6K-SLP'] },
  { id: 'ibrido-trifase-plus-8-12kw', models: ['AF8K-SLP', 'AF9K-SLP', 'AF10K-SLP', 'AF11K-SLP', 'AF12K-SLP'] },
  { id: 'ibrido-trifase-3-15kw', models: ['AF3K-MTH', 'AF4K-MTH', 'AF5K-MTH', 'AF6K-MTH', 'AF8K-MTH', 'AF10K-MTH', 'AF12K-MTH', 'AF15K-MTH'] },
  { id: 'ibrido-trifase-plus-3-12kw', models: ['AF3K-THP', 'AF4K-THP', 'AF5K-THP', 'AF6K-THP', 'AF8K-THP', 'AF10K-THP', 'AF12K-THP'] },
  { id: 'ibrido-trifase-3-30kw', models: ['AF3K-TH-0', 'AF4K-TH-0', 'AF5K-TH-0', 'AF6K-TH-0', 'AF8K-TH-0', 'AF10K-TH-0', 'AF12K-TH-0', 'AF15K-TH-0', 'AF17K-TH-0', 'AF20K-TH-0', 'AF25K-TH-0', 'AF30K-TH-0'] },
  { id: 'ibrido-trifase-36-60kw', models: ['AF36K-TH', 'AF40K-TH', 'AF50K-TH', 'AF60K-TH'] },
  
  // Batteria Afore
  { id: 'bat-afore-wall-5-10kwh', models: ['AF5000W-LF', 'AF10000W-LG'] },
  { id: 'bat-afore-stack-hv-5kwh', models: ['AF5000W-LE'] },
  { id: 'bat-afore-stack-lv-2-5-5kwh', models: ['AF2500W-HB', 'AF5000W-HC'] },
  
  // Batteria Hailei
  { id: 'bat-hailei-atom-wb-5kwh-1', models: ['ATOM WB-512100-1'] },
  { id: 'bat-hailei-atom-wb-5-10kwh', models: ['ATOM WB-512100', 'ATOM WB MAX-512200'] },
  { id: 'bat-hailei-atom-ls-10-15kwh', models: ['ATOM LS-10.24', 'ATOM LS-15.36'] },
  { id: 'bat-hailei-atom-hs-15-41kwh', models: ['ATOM HS-15.36', 'ATOM HS-20.48', 'ATOM HS-25.6', 'ATOM HS-30.72', 'ATOM HS-35.84', 'ATOM HS-40.96'] },
  
  // All in One
  { id: 'aio-mono-lv-afore-3-6kw-af5000w-lh', models: ['AF3K-ASL', 'AF6K-ASL', 'AF5000W-LH'] },
  { id: 'aio-mono-lv-afore-3-6kw-atom-aes-5-12', models: ['AF3K-ASL', 'AF6K-ASL', 'ATOM AES-5.12'] },
  { id: 'aio-mono-lv-atom-aes-3-6kw-atom-aes-5-12', models: ['ATOM AES', 'ATOM AES-5.12'] },
  { id: 'aio-trifase-hv-plus-4-6kw', models: ['AF4K-SLP', 'AF4.6K-SLP', 'AF5K-SLP', 'AF5.5K-SLP', 'AF6K-SLP'] },
  
  // EV Charger (没有具体型号，使用 slug 匹配)
  { id: 'ev-diamond', models: [] },
  { id: 'ev-oval', models: [] },
  { id: 'ev-square', models: [] },
];

// 构建模型到产品 ID 的映射
const modelToProduct = {};
PRODUCTS.forEach(p => {
  p.models.forEach(model => {
    modelToProduct[model.toUpperCase()] = p.id;
    modelToProduct[model] = p.id;
  });
  // 也添加产品 ID 本身作为匹配项
  modelToProduct[p.id] = p.id;
});

/**
 * 从文件名中提取产品 ID
 */
function findProductId(filename) {
  const filenameUpper = filename.toUpperCase();
  const filenameLower = filename.toLowerCase();
  
  // 1. 匹配产品型号（最精确）
  for (const [model, productId] of Object.entries(modelToProduct)) {
    if (model && filenameUpper.includes(model.toUpperCase())) {
      return productId;
    }
  }
  
  // 2. 基于文件名关键词匹配产品
  // Inverter di Stringa
  if (filenameLower.includes('inverter_di_stringa') || filenameLower.includes('inverter di stringa')) {
    // 先检查 trifase 3-25kW（需要先于 30-60kW 检查）
    if ((filenameLower.includes('3-25kw') || filenameLower.includes('3_25kw'))) return 'stringa-trifase-3-25kw';
    
    if (filenameLower.includes('monofase')) {
      if (filenameLower.includes('1-3kw') || filenameLower.includes('1_3kw')) return 'stringa-1-3kw';
      if (filenameLower.includes('3-6kw') || filenameLower.includes('3_6kw')) return 'stringa-3-6kw';
      if (filenameLower.includes('7-10kw') || filenameLower.includes('7_10kw')) return 'stringa-7-10kw';
    }
    if (filenameLower.includes('trifase')) {
      if (filenameLower.includes('30kw') && !filenameLower.includes('36') && !filenameLower.includes('60') && !filenameLower.includes('3-25')) return 'stringa-trifase-30kw';
      if (filenameLower.includes('36-60kw') || filenameLower.includes('36_60kw') || (filenameLower.includes('36') && filenameLower.includes('60'))) return 'stringa-trifase-36-60kw';
      if (filenameLower.includes('70-110kw') || filenameLower.includes('70_110kw') || (filenameLower.includes('70') && filenameLower.includes('110'))) return 'stringa-trifase-70-110kw';
      if (filenameLower.includes('30-60kw') || filenameLower.includes('30_60kw')) return 'stringa-trifase-36-60kw'; // 可能是同一个
    }
    // 如果没有明确 monofase/trifase，但包含功率范围，尝试匹配
    if (filenameLower.includes('3-25kw') || filenameLower.includes('3_25kw')) return 'stringa-trifase-3-25kw';
  }
  
  // Inverter Ibrido
  if (filenameLower.includes('inverter_ibrido') || filenameLower.includes('inverter ibrido')) {
    // 8-12kW Plus 根据产品数据是 trifase，即使文件名说 monofase（文件名可能有误）
    if ((filenameLower.includes('8-12kw') || filenameLower.includes('8_12kw'))) {
      if (filenameLower.includes('plus')) return 'ibrido-trifase-plus-8-12kw';
      // 如果没有 plus，但文件名说 monofase 8-12kW，根据产品数据应该是 trifase plus
      return 'ibrido-trifase-plus-8-12kw';
    }
    
    if (filenameLower.includes('monofase')) {
      if ((filenameLower.includes('1-3.6kw') || filenameLower.includes('1_3.6kw')) && !filenameLower.includes('plus')) return 'ibrido-monofase-1-3-6kw';
      if ((filenameLower.includes('4-6kw') || filenameLower.includes('4_6kw')) && filenameLower.includes('plus')) return 'ibrido-monofase-plus-4-6kw';
    }
    if (filenameLower.includes('trifase')) {
      if ((filenameLower.includes('3-15kw') || filenameLower.includes('3_15kw')) && !filenameLower.includes('plus')) return 'ibrido-trifase-3-15kw';
      if ((filenameLower.includes('3-12kw') || filenameLower.includes('3_12kw')) && filenameLower.includes('plus')) return 'ibrido-trifase-plus-3-12kw';
      if ((filenameLower.includes('3-30kw') || filenameLower.includes('3_30kw')) && !filenameLower.includes('plus')) return 'ibrido-trifase-3-30kw';
      if ((filenameLower.includes('36-60kw') || filenameLower.includes('36_60kw'))) return 'ibrido-trifase-36-60kw';
      if (filenameLower.includes('20kw')) return 'ibrido-trifase-3-30kw'; // 可能是 3-30kw 系列的一部分
    }
  }
  
  // Batteria
  if (filenameLower.includes('batteria')) {
    if (filenameLower.includes('atom_wb') || filenameLower.includes('atom wb')) {
      if (filenameLower.includes('5kwh') && !filenameLower.includes('10')) return 'bat-hailei-atom-wb-5kwh-1';
      return 'bat-hailei-atom-wb-5-10kwh';
    }
    if (filenameLower.includes('atom_ls') || filenameLower.includes('atom ls')) return 'bat-hailei-atom-ls-10-15kwh';
    if (filenameLower.includes('atom_hs') || filenameLower.includes('atom hs')) return 'bat-hailei-atom-hs-15-41kwh';
    if (filenameLower.includes('montaggio_a_parete') || filenameLower.includes('montaggio a parete') || filenameLower.includes('a_parete')) return 'bat-afore-wall-5-10kwh';
    if (filenameLower.includes('trifase') && filenameLower.includes('5kwh')) return 'bat-afore-stack-hv-5kwh';
  }
  
  // All in One
  if (filenameLower.includes('all-in-one') || filenameLower.includes('allin1') || filenameLower.includes('all_in_one')) {
    if (filenameLower.includes('trifase')) return 'aio-trifase-hv-plus-4-6kw';
    if (filenameLower.includes('monofase')) {
      if (filenameLower.includes('afore') && !filenameLower.includes('hailei')) return 'aio-mono-lv-afore-3-6kw-af5000w-lh';
      if (filenameLower.includes('hailei') || filenameLower.includes('atom')) {
        if (filenameLower.includes('afore')) return 'aio-mono-lv-afore-3-6kw-atom-aes-5-12';
        return 'aio-mono-lv-atom-aes-3-6kw-atom-aes-5-12';
      }
    }
  }
  
  // EV Charger
  if (filenameLower.includes('ev_charger') || filenameLower.includes('ev charger')) {
    if (filenameLower.includes('oval')) return 'ev-oval';
    if (filenameLower.includes('square')) return 'ev-square';
    if (filenameLower.includes('diamond')) return 'ev-diamond';
  }
  
  // 3. 直接匹配产品 ID（slug）
  for (const productId of Object.keys(modelToProduct)) {
    const normalizedId = productId.toLowerCase().replace(/-/g, '[-_]');
    const regex = new RegExp(normalizedId, 'i');
    if (regex.test(filenameLower)) {
      return modelToProduct[productId] || productId;
    }
  }
  
  return null;
}

/**
 * 主函数
 */
function main() {
  if (!fs.existsSync(OLD_REPO)) {
    console.error(`❌ OLD repo directory not found: ${OLD_REPO}`);
    console.log('Please check the path and try again.');
    process.exit(1);
  }
  
  const files = fs.readdirSync(OLD_REPO).filter(f => f.toLowerCase().endsWith('.pdf'));
  
  if (files.length === 0) {
    console.log('No PDF files found in OLD repo.');
    return;
  }
  
  console.log(`\n📋 Found ${files.length} PDF files in OLD repo\n`);
  
  const fileToProductMap = {};
  const unmappedFiles = [];
  
  // 构建映射
  files.forEach(file => {
    const productId = findProductId(file);
    if (productId) {
      fileToProductMap[file] = productId;
    } else {
      unmappedFiles.push(file);
    }
  });
  
  // 显示映射结果
  console.log('📊 File to Product Mapping:');
  console.log('='.repeat(80));
  Object.entries(fileToProductMap).forEach(([file, productId]) => {
    console.log(`  ${file.padEnd(60)} → ${productId}`);
  });
  
  if (unmappedFiles.length > 0) {
    console.log('\n⚠️  Unmapped Files:');
    console.log('='.repeat(80));
    unmappedFiles.forEach(file => {
      console.log(`  ${file}`);
    });
  }
  
  // 复制文件
  console.log('\n📦 Copying files...');
  let copiedCount = 0;
  
  Object.entries(fileToProductMap).forEach(([file, productId]) => {
    const sourcePath = path.join(OLD_REPO, file);
    const targetDir = path.join(NEW_REPO, productId, 'downloads');
    const targetPath = path.join(targetDir, file);
    
    try {
      // 创建目标目录
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // 复制文件
      fs.copyFileSync(sourcePath, targetPath);
      copiedCount++;
      console.log(`  ✓ ${file} → prodotti/${productId}/downloads/`);
    } catch (error) {
      console.error(`  ✗ Failed to copy ${file}: ${error.message}`);
    }
  });
  
  // 处理未映射的文件
  if (unmappedFiles.length > 0) {
    const unmappedDir = path.join(NEW_REPO, '_unmapped', 'downloads');
    if (!fs.existsSync(unmappedDir)) {
      fs.mkdirSync(unmappedDir, { recursive: true });
    }
    
    unmappedFiles.forEach(file => {
      const sourcePath = path.join(OLD_REPO, file);
      const targetPath = path.join(unmappedDir, file);
      try {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`  ⚠ ${file} → prodotti/_unmapped/downloads/ (unmapped)`);
      } catch (error) {
        console.error(`  ✗ Failed to copy unmapped ${file}: ${error.message}`);
      }
    });
  }
  
  console.log(`\n✅ Migration complete!`);
  console.log(`   - Mapped files: ${Object.keys(fileToProductMap).length}`);
  console.log(`   - Unmapped files: ${unmappedFiles.length}`);
  console.log(`   - Total copied: ${copiedCount + unmappedFiles.length}`);
}

main();

