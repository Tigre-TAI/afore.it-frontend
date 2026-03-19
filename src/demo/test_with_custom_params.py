"""
自定义参数测试 - 展示系统灵活性
Run: python3 src/demo/test_with_custom_params.py
"""

import asyncio
import json
from datetime import datetime
from src.demo.mock_pipeline_demo import MockDataGenerator, MockLeadGenPipeline
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)


class CustomTestScenarios:
    """测试不同场景"""

    @staticmethod
    async def test_single_country(country_code: str):
        """只测试单个国家"""
        logger.info(f"\n🎯 TEST 1: 单国家测试 - {country_code}")
        logger.info("=" * 70)
        
        pipeline = MockLeadGenPipeline()
        
        # 只获取该国家的公司
        generator = MockDataGenerator()
        all_companies = generator.get_all_companies()
        companies = [c for c in all_companies if c['country'] == country_code]
        
        logger.info(f"📍 {country_code} 公司数: {len(companies)}")
        
        # 发现邮箱
        logger.info(f"🔍 发现 {len(companies)} 家公司的邮箱...")
        contacts = await pipeline.discover_emails(companies)
        logger.info(f"✅ 发现 {len(contacts)} 个邮箱")
        
        # 验证
        logger.info("✔️  验证邮箱...")
        verified = await pipeline.verify_emails(contacts)
        valid_count = len([c for c in verified if c.get('valid_status') == 'valid'])
        logger.info(f"✅ 有效邮箱: {valid_count}/{len(verified)}")
        
        # 生成邮件
        logger.info("✉️  生成邮件...")
        emails = await pipeline.generate_emails(verified[:5])  # 只生成前5个
        logger.info(f"✅ 生成 {len(emails)} 封邮件")
        
        # 显示样例
        if emails:
            sample = emails[0]
            logger.info(f"\n📧 【{country_code}语言样例】")
            logger.info(f"发件人: {sample.get('from_email')}")
            logger.info(f"收件人: {sample.get('to_email')}")
            logger.info(f"【主题】{sample.get('subject')}")
            logger.info(f"【内容】{sample.get('body')[:100]}...")

    @staticmethod
    async def test_different_languages():
        """测试多语言生成"""
        logger.info(f"\n🌐 TEST 2: 多语言邮件生成")
        logger.info("=" * 70)
        
        pipeline = MockLeadGenPipeline()
        generator = MockDataGenerator()
        
        # 各语言各挑1个
        companies = generator.get_all_companies()
        de_companies = [c for c in companies if c['country'] == 'DE'][:1]
        pl_companies = [c for c in companies if c['country'] == 'PL'][:1]
        dk_companies = [c for c in companies if c['country'] == 'DK'][:1]
        
        test_companies = de_companies + pl_companies + dk_companies
        
        contacts = await pipeline.discover_emails(test_companies)
        verified = await pipeline.verify_emails(contacts)
        emails = await pipeline.generate_emails(verified)
        
        logger.info(f"✅ 生成 {len(emails)} 封多语言邮件")
        
        # 按语言分组显示
        by_lang = {}
        for email in emails:
            lang = email.get('language', 'unknown')
            if lang not in by_lang:
                by_lang[lang] = []
            by_lang[lang].append(email)
        
        for lang, lang_emails in by_lang.items():
            logger.info(f"\n📧 【{lang.upper()}语言】- {len(lang_emails)}封")
            for email in lang_emails:
                logger.info(f"  收件人: {email.get('recipient_name')} ({email.get('to_email')})")
                logger.info(f"  主题: {email.get('subject')[:50]}...")

    @staticmethod
    async def test_email_validation_rates():
        """测试邮箱验证率"""
        logger.info(f"\n🔍 TEST 3: 邮箱验证率分析")
        logger.info("=" * 70)
        
        pipeline = MockLeadGenPipeline()
        generator = MockDataGenerator()
        
        companies = generator.get_all_companies()
        contacts = await pipeline.discover_emails(companies)
        
        logger.info(f"📊 总发现邮箱: {len(contacts)}")
        
        verified = await pipeline.verify_emails(contacts)
        
        # 统计验证结果
        by_status = {}
        by_country = {}
        
        for contact in verified:
            status = contact.get('valid_status', 'unknown')
            country = contact.get('country', 'unknown')
            
            if status not in by_status:
                by_status[status] = 0
            by_status[status] += 1
            
            if country not in by_country:
                by_country[country] = {'total': 0, 'valid': 0}
            by_country[country]['total'] += 1
            if status == 'valid':
                by_country[country]['valid'] += 1
        
        logger.info(f"\n📈 验证结果统计:")
        for status, count in by_status.items():
            pct = (count / len(verified)) * 100
            logger.info(f"  {status}: {count} ({pct:.1f}%)")
        
        logger.info(f"\n🌍 按国家的有效率:")
        for country in ['DE', 'PL', 'DK']:
            if country in by_country:
                data = by_country[country]
                rate = (data['valid'] / data['total']) * 100
                logger.info(f"  {country}: {data['valid']}/{data['total']} ({rate:.1f}%)")

    @staticmethod
    async def test_email_content_quality():
        """测试邮件内容质量"""
        logger.info(f"\n✍️  TEST 4: 邮件内容质量检查")
        logger.info("=" * 70)
        
        pipeline = MockLeadGenPipeline()
        generator = MockDataGenerator()
        
        companies = generator.get_all_companies()[:3]  # 只取3家
        contacts = await pipeline.discover_emails(companies)
        verified = await pipeline.verify_emails(contacts)
        emails = await pipeline.generate_emails(verified[:5])
        
        logger.info(f"📊 检查 {len(emails)} 封邮件内容质量")
        
        for i, email in enumerate(emails, 1):
            subject = email.get('subject', '')
            body = email.get('body', '')
            company = email.get('company_name', '')
            recipient = email.get('recipient_name', '')
            
            # 质量检查
            checks = {
                '✓ 包含公司名': company.lower() in body.lower(),
                '✓ 包含收件人名': recipient.lower() in body.lower(),
                '✓ 主题非空': len(subject) > 0,
                '✓ 内容长度合理': 100 < len(body) < 500,
                '✓ 包含行动号召': any(cta in body for cta in ['Gespräch', 'rozmowa', 'chat', 'call']),
            }
            
            passed = sum(1 for v in checks.values() if v)
            logger.info(f"\n  邮件 #{i}: {recipient} ({passed}/5 通过)")
            for check, result in checks.items():
                status = "✅" if result else "❌"
                logger.info(f"    {status} {check}")

    @staticmethod
    async def test_performance():
        """性能测试"""
        logger.info(f"\n⚡ TEST 5: 性能基准测试")
        logger.info("=" * 70)
        
        import time
        pipeline = MockLeadGenPipeline()
        generator = MockDataGenerator()
        
        companies = generator.get_all_companies()
        
        # 测试各步骤耗时
        tests = [
            ("发现邮箱", lambda: pipeline.discover_emails(companies)),
            ("验证邮箱", lambda: pipeline.verify_emails(
                asyncio.run(pipeline.discover_emails(companies))
            )),
        ]
        
        for name, test_func in tests:
            start = time.time()
            result = await test_func() if asyncio.iscoroutine(test_func()) else test_func()
            elapsed = time.time() - start
            
            if isinstance(result, list):
                per_item = (elapsed / len(result)) * 1000
                logger.info(f"  {name}: {elapsed:.2f}s ({per_item:.1f}ms/项目)")
            else:
                logger.info(f"  {name}: {elapsed:.2f}s")


async def main():
    """运行所有测试"""
    logger.info("\n")
    logger.info("╔" + "=" * 68 + "╗")
    logger.info("║" + " " * 15 + "🧪 AFORE COLD EMAIL 系统 - 自定义测试" + " " * 15 + "║")
    logger.info("╚" + "=" * 68 + "╝")
    
    print("\n选择测试方案:")
    print("1. 单国家测试 (德国)")
    print("2. 多语言测试")
    print("3. 邮箱验证率分析")
    print("4. 邮件内容质量")
    print("5. 性能基准测试")
    print("6. 运行全部")
    print("0. 退出")
    
    choice = input("\n请选择 (0-6): ").strip()
    
    if choice == '1':
        await CustomTestScenarios.test_single_country('DE')
    elif choice == '2':
        await CustomTestScenarios.test_different_languages()
    elif choice == '3':
        await CustomTestScenarios.test_email_validation_rates()
    elif choice == '4':
        await CustomTestScenarios.test_email_content_quality()
    elif choice == '5':
        await CustomTestScenarios.test_performance()
    elif choice == '6':
        await CustomTestScenarios.test_single_country('DE')
        await CustomTestScenarios.test_different_languages()
        await CustomTestScenarios.test_email_validation_rates()
        await CustomTestScenarios.test_email_content_quality()
        await CustomTestScenarios.test_performance()
    
    logger.info("\n✅ 测试完成！")


if __name__ == '__main__':
    asyncio.run(main())
