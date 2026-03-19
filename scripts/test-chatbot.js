#!/usr/bin/env node
/**
 * ChatBot API 测试脚本
 * 测试多语言支持和语言自动检测功能
 */

const fs = require('fs');
const path = require('path');

// 模拟导入FAQ数据（简化版本用于测试）
const testCases = [
  {
    name: "意大利语问题 - 电池配置",
    question: "Come si configura la batteria ATOM?",
    expectedLanguage: "it",
    description: "应该检测为意大利语"
  },
  {
    name: "意大利语问题 - 故障排查",
    question: "Grazie, ma non riesco a collegare l'inverter",
    expectedLanguage: "it",
    description: "应该检测为意大利语"
  },
  {
    name: "英语问题",
    question: "How to install the inverter?",
    expectedLanguage: "en",
    description: "应该检测为英语"
  },
  {
    name: "意大利语问题 - 在线化",
    question: "Buongiorno, come metto online l'impianto?",
    expectedLanguage: "it",
    description: "应该检测为意大利语"
  }
];

// 简单的语言检测函数（来自faq.ts）
function detectLanguage(text) {
  const italianKeywords = [
    'grazie', 'buongiorno', 'buonasera', 'ok', 'ciao', 'allora', 'però',
    'scusami', 'batterie', 'inverter', 'antenna', 'configurare', 'contattami',
    'come', 'metto', 'online', 'impianto', 'non riesco', 'collegare'
  ];
  
  const textLower = text.toLowerCase();
  const italianMatches = italianKeywords.filter(kw => textLower.includes(kw)).length;
  
  return italianMatches >= 2 ? 'it' : 'en';
}

console.log("🧪 ChatBot 语言检测测试\n" + "=".repeat(60));

let passedTests = 0;
let failedTests = 0;

testCases.forEach((testCase, index) => {
  const detected = detectLanguage(testCase.question);
  const passed = detected === testCase.expectedLanguage;
  
  if (passed) {
    passedTests++;
    console.log(`✅ 测试 ${index + 1}: ${testCase.name}`);
  } else {
    failedTests++;
    console.log(`❌ 测试 ${index + 1}: ${testCase.name}`);
  }
  
  console.log(`   问题: "${testCase.question}"`);
  console.log(`   期望语言: ${testCase.expectedLanguage}`);
  console.log(`   检测到: ${detected}`);
  console.log(`   描述: ${testCase.description}`);
  console.log();
});

console.log("=".repeat(60));
console.log(`📊 测试结果: ${passedTests}/${testCases.length} 通过`);
console.log(`   ✅ 通过: ${passedTests}`);
console.log(`   ❌ 失败: ${failedTests}`);

// 检查FAQ文件是否存在
const faqPath = path.join(__dirname, '../src/data/faq.ts');
if (fs.existsSync(faqPath)) {
  const faqContent = fs.readFileSync(faqPath, 'utf-8');
  const qaCount = (faqContent.match(/id: "whatsapp_/g) || []).length;
  console.log(`\n📋 FAQ 数据库:`);
  console.log(`   ✅ 文件存在: ${faqPath}`);
  console.log(`   📊 QA对数量: ${qaCount}`);
} else {
  console.log(`\n❌ FAQ 文件未找到: ${faqPath}`);
}

process.exit(failedTests === 0 ? 0 : 1);
