#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
将WhatsApp解析的JSON转换为TypeScript FAQ格式
并生成TypeScript代码文件
"""

import json
import sys
from pathlib import Path
from typing import Dict, List


def escape_ts_string(s: str) -> str:
    """转义TypeScript字符串"""
    # 移除多余的换行和特殊字符
    s = s.replace('\\', '\\\\')
    s = s.replace('"', '\\"')
    s = s.replace('\n', ' ')  # 将换行替换为空格
    s = s.replace('\r', '')
    s = ' '.join(s.split())  # 规范化空格
    return s


def json_to_typescript_faq(json_file: str, output_file: str = None) -> str:
    """
    将JSON转换为TypeScript FAQ代码
    """
    
    if output_file is None:
        output_file = json_file.replace('.json', '_faq.ts')
    
    # 读取JSON
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    qa_pairs = data['qa_pairs']
    
    # 生成TypeScript代码
    ts_code = '''/**
 * FAQ 数据库 - WhatsApp客户服务真实对话导入
 * 自动生成于 {timestamp}
 * 总QA对数: {total_count}
 * 来源: WhatsApp真实客户交互
 * 
 * 置信度说明:
 * - 0.95: WhatsApp真实客户对话（最可靠）
 * - 0.85: 人工验证的FAQ
 * - 0.6-0.7: AI生成的回复
 */

export interface FAQItem {{
  id: string;
  category: string;
  question: string;
  keywords: string[];
  answer: string;
  relatedProducts?: string[];
  language: string;
  confidence: number;
  source: string;
}}

export const FAQ_DATA: FAQItem[] = [
'''.format(
        timestamp=Path(json_file).stat().st_mtime,
        total_count=len(qa_pairs)
    )
    
    # 添加每个QA对
    for qa in qa_pairs:
        # 生成关键词数组
        keywords_list = qa.get('keywords', [])
        if qa.get('products'):
            keywords_list.extend([p.lower() for p in qa['products']])
        
        keywords_str = ', '.join([f'"{kw}"' for kw in keywords_list[:10]])
        
        # 生成相关产品
        products = qa.get('products', [])
        products_str = ', '.join([f'"{p.lower().replace(" ", "-")}"' for p in products])
        
        qa_entry = f'''  {{
    id: "{qa['id']}",
    category: "{qa['category']}",
    question: "{escape_ts_string(qa['question'])}",
    keywords: [{keywords_str}],
    answer: "{escape_ts_string(qa['answer'])}",
    language: "{qa['language']}",
    confidence: {qa['confidence']},
    source: "{qa['source']}",
    relatedProducts: [{products_str}]
  }},
'''
        ts_code += qa_entry
    
    # 闭合数组
    ts_code = ts_code.rstrip(',\n') + '\n];\n\n'
    
    # 添加搜索函数
    ts_code += '''/**
 * 根据用户问题找到最匹配的 FAQ
 * 使用关键词匹配和相似度算法
 * 支持多语言：意大利语 (it) 和英语 (en)
 */
export function findBestFAQ(userQuestion: string, language: string = 'it', threshold = 0.4): FAQItem | null {
  const question = userQuestion.toLowerCase();
  
  // 关键词匹配评分，优先同语言的FAQ
  let bestMatch: { item: FAQItem; score: number } | null = null;
  
  for (const faq of FAQ_DATA) {
    // 语言匹配加权：同语言的FAQ得分提升20%
    const languageBoost = faq.language === language ? 0.2 : 0;
    
    let score = 0;
    
    // 检查关键词匹配
    const matchedKeywords = faq.keywords.filter(keyword => 
      question.includes(keyword.toLowerCase())
    ).length;
    
    if (matchedKeywords > 0) {
      score = (matchedKeywords / faq.keywords.length) + languageBoost;
    } else {
      // 简单的字符相似度（编辑距离）
      score = calculateSimilarity(question, faq.question.toLowerCase()) + languageBoost;
    }
    
    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { item: faq, score };
    }
  }
  
  // 如果相似度高于阈值，返回结果
  if (bestMatch && bestMatch.score >= threshold) {
    return bestMatch.item;
  }
  
  return null;
}

/**
 * 自动检测语言（意大利语或英语）
 */
export function detectLanguage(text: string): 'it' | 'en' {
  const italianKeywords = [
    'grazie', 'buongiorno', 'buonasera', 'ok', 'ciao', 'allora', 'però',
    'scusami', 'batterie', 'inverter', 'antenna', 'configurare', 'contattami'
  ];
  
  const textLower = text.toLowerCase();
  const italianMatches = italianKeywords.filter(kw => textLower.includes(kw)).length;
  
  return italianMatches >= 2 ? 'it' : 'en';
}

/**
 * 计算两个字符串的相似度（简单版本）
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) {
    return 1.0;
  }
  
  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * 编辑距离算法（Levenshtein distance）
 */
function getEditDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}
'''
    
    # 写入文件
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(ts_code)
    
    print(f"✅ TypeScript FAQ文件已生成: {output_file}")
    print(f"📊 统计信息:")
    print(f"   - 总QA对: {len(qa_pairs)}")
    print(f"   - 代码行数: {len(ts_code.splitlines())}")
    
    return output_file


def main():
    if len(sys.argv) < 2:
        print("使用方法: python json_to_typescript_faq.py <whatsapp_qa_pairs.json>")
        sys.exit(1)
    
    json_file = sys.argv[1]
    
    if not Path(json_file).exists():
        print(f"❌ 文件不存在: {json_file}")
        sys.exit(1)
    
    output_file = json_to_typescript_faq(json_file)
    
    # 显示前几行作为预览
    with open(output_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        print(f"\n📝 文件预览 (前30行):")
        print(''.join(lines[:30]))


if __name__ == '__main__':
    main()
