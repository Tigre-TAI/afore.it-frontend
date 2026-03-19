#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
WhatsApp 聊天记录解析器
将多个WhatsApp导出的TXT文件解析为结构化的QA对
支持自动去重、智能分类、产品识别和语言检测
"""

import re
from datetime import datetime
from typing import List, Dict, Optional, Set
from pathlib import Path
import json
from collections import defaultdict
import sys

# 产品识别正则表达式
PRODUCT_PATTERNS = {
    "ATOM HS": r"\bATOM\s+HS\b",
    "ATOM WB": r"\bATOM\s+WB\b",
    "ATOM LS": r"\bATOM\s+LS\b",
    "ATOM AES": r"\bATOM\s+AES\b",
    "Inverter": r"\b(inverter|inverter)\b",
    "Batterie": r"\b(batterie|battery|batteries)\b",
    "Meter": r"\b(meter|contatore)\b",
    "Antenna": r"\b(antenna)\b",
    "App Solarman": r"\b(Solarman|solarman|app)\b",
    "Afore Can": r"\bAfore\s+Can\b",
}

# 分类关键词映射
CATEGORY_KEYWORDS = {
    "configurazione": ["configurare", "configurazione", "settare", "setup", "impostare"],
    "installazione": ["installare", "installazione", "montare", "cablaggio", "collegare"],
    "troubleshooting": ["errore", "problema", "non funziona", "non riesco", "problema", "issue", "error"],
    "online": ["online", "app", "solarman", "connessione", "wifi"],
    "batterie": ["batterie", "battery", "caricare", "scaricare", "carico"],
    "test": ["test", "prova di carico", "autotest", "controllo"],
    "tecnico": ["tecnico", "parameter", "parametro", "tensione", "stringhe"],
    "generale": [],
}

# 语言检测关键词
ITALIAN_KEYWORDS = [
    "grazie", "buongiorno", "buonasera", "ok", "ciao", "allora", "però", "cosicché",
    "scusami", "batterie", "inverter", "antenna", "configurare", "contattami",
    "ok grazie", "a domani", "perfetto", "okok", "tranquillo"
]

class WhatsAppParser:
    """WhatsApp TXT导出文件解析器"""
    
    def __init__(self):
        self.messages = []
        self.qa_pairs = []
        self.all_products = set()
        
    def parse_file(self, file_path: str) -> List[Dict]:
        """
        解析单个WhatsApp导出的TXT文件
        支持多种日期格式：
        - 02/12/25, 16:27
        - 03/12/25, 11:41
        """
        messages = []
        
        # WhatsApp时间戳正则：支持 DD/MM/YY, HH:MM(:SS)?
        timestamp_pattern = r'^(\d{1,2})/(\d{1,2})/(\d{2}),\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s+-\s+'
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
        except UnicodeDecodeError:
            with open(file_path, 'r', encoding='latin-1') as f:
                lines = f.readlines()
        
        i = 0
        while i < len(lines):
            line = lines[i].rstrip('\n')
            match = re.match(timestamp_pattern, line)
            
            if match:
                day, month, year, hour, minute, second = match.groups()
                # 补全年份 (25 -> 2025)
                full_year = 2000 + int(year) if int(year) < 50 else 1900 + int(year)
                
                try:
                    timestamp = datetime(
                        full_year, int(month), int(day),
                        int(hour), int(minute),
                        int(second) if second else 0
                    )
                except ValueError:
                    i += 1
                    continue
                
                # 提取消息内容部分（时间戳之后）
                rest = line[match.end():]
                
                # 处理多行消息
                message_content = rest
                i += 1
                while i < len(lines) and not re.match(timestamp_pattern, lines[i]):
                    message_content += '\n' + lines[i].rstrip('\n')
                    i += 1
                
                # 分离发送者和内容
                if ':' in message_content:
                    parts = message_content.split(':', 1)
                    sender = parts[0].strip()
                    content = parts[1].strip()
                    
                    # 过滤系统消息
                    if not any(system_msg in content for system_msg in [
                        "è stato aggiunto", "ha creato il gruppo", "crittografati",
                        "è tra i tuoi contatti", "Per saperne di più", "Media omessi"
                    ]):
                        messages.append({
                            'timestamp': timestamp.isoformat(),
                            'sender': sender,
                            'content': content,
                            'is_agent': self._is_agent(sender),  # 判断是否为Afore员工
                            'raw_timestamp': timestamp
                        })
            else:
                i += 1
        
        self.messages = messages
        return messages
    
    def _is_agent(self, sender: str) -> bool:
        """判断是否为Afore客服"""
        agent_keywords = [
            "Assistenza", "Emanuele", "Fabrizio", "Angelo Afore",
            "assistenza", "support", "afore"
        ]
        return any(kw.lower() in sender.lower() for kw in agent_keywords)
    
    def extract_qa_pairs(self) -> List[Dict]:
        """
        从消息列表中提取QA对
        策略：寻找客户消息后紧跟的客服回复
        """
        qa_pairs = []
        i = 0
        
        while i < len(self.messages):
            current_msg = self.messages[i]
            
            # 寻找客户消息（非客服）
            if not current_msg['is_agent'] and current_msg['content'].strip():
                customer_question = current_msg['content']
                customer_name = current_msg['sender']
                timestamp = current_msg['raw_timestamp']
                
                # 寻找下一个客服回复
                j = i + 1
                agent_responses = []
                
                while j < len(self.messages):
                    msg = self.messages[j]
                    
                    # 跳过其他客户消息
                    if not msg['is_agent'] and msg['content'].strip():
                        break
                    
                    # 收集客服回复
                    if msg['is_agent'] and msg['content'].strip():
                        agent_responses.append(msg['content'])
                        j += 1
                    else:
                        j += 1
                
                # 如果有对应的客服回复，保存QA对
                if agent_responses:
                    # 合并多条回复
                    full_answer = '\n'.join(agent_responses)
                    
                    qa_pairs.append({
                        'customer_name': customer_name,
                        'question': customer_question,
                        'answer': full_answer,
                        'timestamp': timestamp.isoformat(),
                        'source': 'whatsapp',
                        'agent_names': [msg['sender'] for msg in self.messages[i+1:j] if msg['is_agent']],
                    })
                
                i = j if j > i + 1 else i + 1
            else:
                i += 1
        
        self.qa_pairs = qa_pairs
        return qa_pairs
    
    def detect_language(self, text: str) -> str:
        """检测文本语言（意大利语或英语）"""
        text_lower = text.lower()
        
        italian_count = sum(1 for keyword in ITALIAN_KEYWORDS if keyword in text_lower)
        
        # 意大利语关键词出现 > 2次，判定为意大利语
        return "it" if italian_count >= 2 else "en"
    
    def identify_products(self, text: str) -> List[str]:
        """识别文本中提到的产品"""
        products = []
        for product, pattern in PRODUCT_PATTERNS.items():
            if re.search(pattern, text, re.IGNORECASE):
                products.append(product)
                self.all_products.add(product)
        return products
    
    def categorize_qa(self, question: str, answer: str) -> str:
        """自动分类QA对"""
        combined_text = (question + ' ' + answer).lower()
        
        category_scores = defaultdict(int)
        
        for category, keywords in CATEGORY_KEYWORDS.items():
            if category == "generale":
                continue
            for keyword in keywords:
                if keyword.lower() in combined_text:
                    category_scores[category] += 1
        
        # 返回分数最高的分类
        if category_scores:
            best_category = max(category_scores, key=category_scores.get)
            return best_category
        return "generale"
    
    def process_all_files(self, file_paths: List[str]) -> Dict:
        """处理多个WhatsApp文件，合并并去重"""
        all_qa_pairs = []
        
        for file_path in file_paths:
            print(f"📖 解析文件: {file_path}")
            self.parse_file(file_path)
            qa_pairs = self.extract_qa_pairs()
            print(f"   ✓ 提取 {len(qa_pairs)} 个QA对")
            all_qa_pairs.extend(qa_pairs)
        
        print(f"\n📊 总共提取 {len(all_qa_pairs)} 个QA对（去重前）")
        
        # 去重
        deduplicated = self._deduplicate_qa_pairs(all_qa_pairs)
        print(f"✓ 去重后 {len(deduplicated)} 个QA对")
        
        # 增强QA对（添加分类、语言、产品识别等）
        enhanced_qa_pairs = self._enhance_qa_pairs(deduplicated)
        
        return {
            'qa_pairs': enhanced_qa_pairs,
            'total_count': len(enhanced_qa_pairs),
            'products': list(self.all_products),
            'languages': ['it', 'en'],
            'categories': list(set(qa['category'] for qa in enhanced_qa_pairs))
        }
    
    def _deduplicate_qa_pairs(self, qa_pairs: List[Dict]) -> List[Dict]:
        """
        去重QA对
        策略：相同问题（相似度>0.85）保留最长的答案
        """
        if not qa_pairs:
            return []
        
        deduplicated = []
        seen_questions = {}
        
        for qa in qa_pairs:
            question = qa['question'].lower().strip()
            
            # 简单的完全匹配去重
            matched = False
            for seen_q, idx in seen_questions.items():
                if self._similarity(question, seen_q) > 0.85:
                    # 保留更长的答案
                    if len(qa['answer']) > len(deduplicated[idx]['answer']):
                        deduplicated[idx] = qa
                    matched = True
                    break
            
            if not matched:
                seen_questions[question] = len(deduplicated)
                deduplicated.append(qa)
        
        return deduplicated
    
    def _similarity(self, str1: str, str2: str) -> float:
        """简单相似度计算（Levenshtein距离的简化版）"""
        if str1 == str2:
            return 1.0
        
        shorter = str1 if len(str1) <= len(str2) else str2
        longer = str2 if len(str1) <= len(str2) else str1
        
        if len(longer) == 0:
            return 1.0
        
        # 计算公共子串
        common = sum(1 for c in shorter if c in longer)
        return common / len(longer)
    
    def _enhance_qa_pairs(self, qa_pairs: List[Dict]) -> List[Dict]:
        """为QA对添加元数据"""
        enhanced = []
        
        for idx, qa in enumerate(qa_pairs, 1):
            question = qa['question']
            answer = qa['answer']
            
            # 检测语言
            lang = self.detect_language(question + ' ' + answer)
            
            # 识别产品
            products = self.identify_products(question + ' ' + answer)
            
            # 分类
            category = self.categorize_qa(question, answer)
            
            enhanced_qa = {
                'id': f'whatsapp_{idx:03d}',
                'question': question,
                'answer': answer,
                'language': lang,
                'category': category,
                'products': products,
                'confidence': 0.95,  # WhatsApp真实对话
                'source': 'whatsapp',
                'keywords': self._extract_keywords(question),
                'timestamp': qa.get('timestamp'),
                'customer_name': qa.get('customer_name'),
                'agent_names': qa.get('agent_names', []),
            }
            
            enhanced.append(enhanced_qa)
        
        return enhanced
    
    def _extract_keywords(self, text: str) -> List[str]:
        """从文本中提取关键词"""
        # 移除常见词汇
        stop_words = {
            'il', 'la', 'i', 'le', 'di', 'da', 'a', 'per', 'su', 'con',
            'che', 'e', 'è', 'non', 'mi', 'ti', 'si', 'ha', 'ho', 'hai',
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to',
            'ok', 'grazie', 'grazie mille'
        }
        
        # 按长度和频率提取关键词
        words = text.lower().split()
        keywords = [
            w.rstrip('.,!?;:') for w in words
            if w.rstrip('.,!?;:') not in stop_words and len(w) > 2
        ]
        
        # 返回前5个关键词
        return list(dict.fromkeys(keywords))[:5]  # 去重并限制为5个


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("使用方法: python parse_whatsapp_exports.py <file1.txt> <file2.txt> ...")
        print("\n示例:")
        print("  python parse_whatsapp_exports.py ~/Desktop/Chat*.txt")
        sys.exit(1)
    
    # 收集所有输入文件
    file_paths = []
    for arg in sys.argv[1:]:
        paths = Path(arg).glob('*') if '*' in arg else [Path(arg)]
        file_paths.extend([str(p) for p in paths if p.is_file() and p.suffix == '.txt'])
    
    if not file_paths:
        print("❌ 没有找到TXT文件")
        sys.exit(1)
    
    print(f"🔍 找到 {len(file_paths)} 个文件:\n")
    for fp in file_paths:
        print(f"  - {fp}")
    
    # 解析文件
    parser = WhatsAppParser()
    result = parser.process_all_files(file_paths)
    
    # 输出结果
    print(f"\n" + "="*60)
    print("📋 解析结果摘要")
    print("="*60)
    print(f"✓ 总QA对: {result['total_count']}")
    print(f"✓ 支持语言: {', '.join(result['languages'])}")
    print(f"✓ 分类: {', '.join(result['categories'])}")
    print(f"✓ 识别产品: {len(result['products'])} 种")
    for product in sorted(result['products']):
        print(f"  - {product}")
    
    # 保存为JSON
    output_file = 'whatsapp_qa_pairs.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print(f"\n💾 数据已保存到: {output_file}")
    
    # 打印前3个QA对示例
    print(f"\n📝 QA对示例 (前3个):")
    print("="*60)
    for qa in result['qa_pairs'][:3]:
        print(f"\n【{qa['category'].upper()}】ID: {qa['id']}")
        print(f"Q: {qa['question'][:100]}...")
        print(f"A: {qa['answer'][:150]}...")
        print(f"语言: {qa['language']} | 产品: {', '.join(qa['products']) or '无'}")
        print(f"置信度: {qa['confidence']}")


if __name__ == '__main__':
    main()
