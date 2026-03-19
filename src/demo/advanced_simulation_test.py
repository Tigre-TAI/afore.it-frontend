"""
进阶模拟测试 - 模拟真实API集成后的场景
Run: python3 src/demo/advanced_simulation_test.py
"""

import asyncio
import json
import random
from datetime import datetime, timedelta
from typing import List, Dict
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class RealisticEmailBehaviorSimulator:
    """模拟真实的邮件行为（打开率、点击率、回复率）"""
    
    @staticmethod
    def simulate_email_metrics(
        total_emails: int,
        open_rate: float = 0.25,  # 25% 打开率
        click_rate: float = 0.08,  # 8% 点击率 (相对打开)
        reply_rate: float = 0.05,  # 5% 回复率 (相对打开)
        bounce_rate: float = 0.02  # 2% 反弹率
    ) -> Dict:
        """模拟邮件发送后的真实行为"""
        
        sent = total_emails
        bounced = int(sent * bounce_rate)
        delivered = sent - bounced
        opened = int(delivered * open_rate)
        clicked = int(opened * click_rate)
        replied = int(opened * reply_rate)
        
        return {
            'sent': sent,
            'bounced': bounced,
            'delivered': delivered,
            'opened': opened,
            'clicked': clicked,
            'replied': replied,
            'open_rate': (opened / delivered * 100) if delivered > 0 else 0,
            'click_rate': (clicked / opened * 100) if opened > 0 else 0,
            'reply_rate': (replied / opened * 100) if opened > 0 else 0,
            'conversion_rate': (replied / delivered * 100) if delivered > 0 else 0,
        }
    
    @staticmethod
    def simulate_reply_emails(
        original_emails: List[Dict],
        reply_count: int
    ) -> List[Dict]:
        """模拟回复邮件"""
        
        replies = []
        reply_templates = {
            'de': [
                "Vielen Dank für Ihre Anfrage. Wir sind sehr interessiert.",
                "Das klingt interessant. Können Sie uns ein Angebot machen?",
                "Wir möchten gerne mehr erfahren. Bitte senden Sie Unterlagen.",
            ],
            'pl': [
                "Dziękuję za wiadomość. Jesteśmy zainteresowani.",
                "To brzmi interesująco. Czy możesz nam złożyć ofertę?",
                "Chcielibyśmy wiedzieć więcej. Proszę przesłać dokumenty.",
            ],
            'en': [
                "Thank you for reaching out. We are interested.",
                "This sounds interesting. Can you send us an offer?",
                "We'd like to learn more. Please send us the details.",
            ]
        }
        
        for email in original_emails[:reply_count]:
            reply = {
                'from_email': email['to_email'],
                'from_name': email['recipient_name'],
                'to_email': email['from_email'],
                'to_name': 'Afore Sales',
                'subject': f"RE: {email['subject']}",
                'body': random.choice(reply_templates.get(email.get('language', 'en'), reply_templates['en'])),
                'replied_at': (datetime.now() + timedelta(hours=random.randint(1, 24))).isoformat(),
                'company': email['company_name'],
                'country': email.get('country'),
            }
            replies.append(reply)
        
        return replies


class CampaignSimulation:
    """完整的营销活动模拟"""
    
    @staticmethod
    async def run_full_campaign_simulation(
        campaign_name: str,
        target_countries: List[str],
        daily_send_limit: int = 50
    ):
        """模拟完整的营销活动执行流程"""
        
        logger.info(f"\n🎯 CAMPAIGN SIMULATION: {campaign_name}")
        logger.info("=" * 70)
        
        from src.demo.mock_pipeline_demo import MockDataGenerator, MockLeadGenPipeline
        
        generator = MockDataGenerator()
        pipeline = MockLeadGenPipeline()
        
        # 步骤 1: 获取目标公司
        logger.info(f"\n[DAY 1-2] 发现目标客户")
        all_companies = generator.get_all_companies()
        target_companies = [c for c in all_companies if c['country'] in target_countries]
        logger.info(f"  ✅ 找到 {len(target_companies)} 家目标公司")
        
        # 步骤 2: 发现邮箱
        logger.info(f"\n[DAY 2-3] 发现决策人邮箱")
        contacts = await pipeline.discover_emails(target_companies)
        logger.info(f"  ✅ 发现 {len(contacts)} 个邮箱地址")
        
        # 步骤 3: 验证邮箱
        logger.info(f"\n[DAY 3-4] 验证邮箱有效性")
        verified = await pipeline.verify_emails(contacts)
        valid_emails = [c for c in verified if c.get('valid_status') == 'valid']
        logger.info(f"  ✅ 有效邮箱: {len(valid_emails)}/{len(verified)} ({len(valid_emails)/len(verified)*100:.1f}%)")
        
        # 步骤 4: 生成邮件
        logger.info(f"\n[DAY 4-5] 生成个性化邮件")
        emails = await pipeline.generate_emails(valid_emails)
        logger.info(f"  ✅ 生成 {len(emails)} 封个性化邮件")
        
        # 步骤 5: 模拟发送日程
        logger.info(f"\n[DAY 5+] 执行邮件发送日程")
        total_days = (len(emails) + daily_send_limit - 1) // daily_send_limit
        logger.info(f"  📅 计划耗时: {total_days} 天 (日均 {daily_send_limit} 封)")
        
        for day in range(1, total_days + 1):
            start_idx = (day - 1) * daily_send_limit
            end_idx = min(day * daily_send_limit, len(emails))
            day_emails = emails[start_idx:end_idx]
            logger.info(f"  📧 第{day}天: 发送 {len(day_emails)} 封邮件")
        
        # 步骤 6: 模拟打开率和点击
        logger.info(f"\n[DAY 5+7天] 监测邮件性能")
        metrics = RealisticEmailBehaviorSimulator.simulate_email_metrics(len(emails))
        logger.info(f"  📊 统计数据:")
        logger.info(f"    - 已发送: {metrics['sent']}")
        logger.info(f"    - 反弹: {metrics['bounced']} ({metrics['sent'] - metrics['delivered']}/{metrics['sent']})")
        logger.info(f"    - 打开: {metrics['opened']} ({metrics['open_rate']:.1f}%)")
        logger.info(f"    - 点击: {metrics['clicked']} ({metrics['click_rate']:.1f}% of opens)")
        logger.info(f"    - 回复: {metrics['replied']} ({metrics['reply_rate']:.1f}% of opens)")
        logger.info(f"    - 转化率: {metrics['conversion_rate']:.2f}%")
        
        # 步骤 7: 模拟回复
        logger.info(f"\n[DAY 7-10] 处理客户回复")
        replies = RealisticEmailBehaviorSimulator.simulate_reply_emails(emails, metrics['replied'])
        
        if replies:
            logger.info(f"  💬 收到 {len(replies)} 条回复:")
            for reply in replies[:3]:  # 显示前3个
                logger.info(f"\n    FROM: {reply['from_name']} ({reply['from_email']})")
                logger.info(f"    COMPANY: {reply['company']} ({reply['country']})")
                logger.info(f"    REPLY: {reply['body']}")
            if len(replies) > 3:
                logger.info(f"    ... 还有 {len(replies) - 3} 条回复")
        
        # 步骤 8: ROI 计算
        logger.info(f"\n[分析] 投资回报率 (ROI) 预估")
        
        # 假设成本
        email_discovery_cost = len(target_companies) * 2  # $2 per company
        email_verification_cost = len(verified) * 0.05  # $0.05 per email
        ai_generation_cost = len(emails) * 0.01  # $0.01 per email
        sending_cost = len(emails) * 0.002  # $0.002 per email
        
        total_cost = email_discovery_cost + email_verification_cost + ai_generation_cost + sending_cost
        
        # 假设每个回复价值 $500 (咨询价值)
        revenue = metrics['replied'] * 500
        roi = ((revenue - total_cost) / total_cost * 100) if total_cost > 0 else 0
        
        logger.info(f"  💰 成本分解:")
        logger.info(f"    - 公司发现: ${email_discovery_cost:.2f}")
        logger.info(f"    - 邮箱验证: ${email_verification_cost:.2f}")
        logger.info(f"    - AI生成: ${ai_generation_cost:.2f}")
        logger.info(f"    - 邮件发送: ${sending_cost:.2f}")
        logger.info(f"    - 总成本: ${total_cost:.2f}")
        logger.info(f"\n  📈 收益预估:")
        logger.info(f"    - 预期回复: {metrics['replied']} 条")
        logger.info(f"    - 单位价值: $500/条 (咨询价值)")
        logger.info(f"    - 总收益: ${revenue:.2f}")
        logger.info(f"    - ROI: {roi:.1f}%")
        
        # 返回活动数据
        return {
            'campaign_name': campaign_name,
            'target_countries': target_countries,
            'metrics': metrics,
            'replies': replies,
            'cost': total_cost,
            'revenue': revenue,
            'roi': roi,
            'emails': emails,
        }


class A_BTestSimulation:
    """A/B 测试模拟"""
    
    @staticmethod
    async def run_ab_test():
        """模拟邮件主题和内容的 A/B 测试"""
        
        logger.info(f"\n🔬 A/B TEST SIMULATION")
        logger.info("=" * 70)
        
        # 测试变量
        test_variants = {
            'A': {
                'name': '标准主题',
                'subject_template': 'Solaranlage für {company} - Kostenlose Beratung',
                'open_rate': 0.22,
                'click_rate': 0.07,
            },
            'B': {
                'name': '紧迫感主题',
                'subject_template': 'Zeitlich begrenzt: 20% Rabatt für {company}',
                'open_rate': 0.28,
                'click_rate': 0.10,
            },
            'C': {
                'name': '个性化主题',
                'subject_template': 'Personalisiert für {company}: Solaranlage mit KI-Optimierung',
                'open_rate': 0.31,
                'click_rate': 0.12,
            },
        }
        
        from src.demo.mock_pipeline_demo import MockDataGenerator
        generator = MockDataGenerator()
        
        total_emails = 100  # 每个变量 100 封
        
        results = {}
        
        for variant_key, variant_config in test_variants.items():
            metrics = RealisticEmailBehaviorSimulator.simulate_email_metrics(
                total_emails,
                open_rate=variant_config['open_rate'],
                click_rate=variant_config['click_rate'],
            )
            results[variant_key] = {
                'config': variant_config,
                'metrics': metrics,
            }
            
            logger.info(f"\n【变量 {variant_key}】{variant_config['name']}")
            logger.info(f"  主题模板: {variant_config['subject_template'][:40]}...")
            logger.info(f"  打开率: {metrics['open_rate']:.1f}%")
            logger.info(f"  点击率: {metrics['click_rate']:.1f}%")
            logger.info(f"  回复: {metrics['replied']} 条")
        
        # 确定赢家
        logger.info(f"\n📊 A/B 测试结果:")
        best_variant = max(results.items(), key=lambda x: x[1]['metrics']['open_rate'])
        logger.info(f"  🏆 赢家: 变量 {best_variant[0]} ({best_variant[1]['config']['name']})")
        logger.info(f"  📈 打开率提升: {(best_variant[1]['metrics']['open_rate'] - results['A']['metrics']['open_rate']) / results['A']['metrics']['open_rate'] * 100:.1f}%")
        logger.info(f"  💡 建议: 采用变量 {best_variant[0]} 用于后续活动")
        
        return results


async def main():
    """运行所有模拟测试"""
    
    logger.info("\n")
    logger.info("╔" + "=" * 68 + "╗")
    logger.info("║" + " " * 10 + "🧪 AFORE COLD EMAIL - 进阶模拟测试" + " " * 15 + "║")
    logger.info("╚" + "=" * 68 + "╝")
    
    print("\n选择模拟测试:")
    print("1. 完整营销活动模拟 (德国)")
    print("2. 多国营销活动模拟 (德国 + 波兰)")
    print("3. A/B 测试对比")
    print("4. 运行全部")
    print("0. 退出")
    
    choice = input("\n请选择 (0-4): ").strip()
    
    if choice == '1':
        await CampaignSimulation.run_full_campaign_simulation(
            "德国市场初期活动",
            ["DE"],
            daily_send_limit=20
        )
    
    elif choice == '2':
        campaign1 = await CampaignSimulation.run_full_campaign_simulation(
            "欧洲拓展活动",
            ["DE", "PL", "DK"],
            daily_send_limit=50
        )
    
    elif choice == '3':
        await A_BTestSimulation.run_ab_test()
    
    elif choice == '4':
        await CampaignSimulation.run_full_campaign_simulation(
            "德国市场初期活动",
            ["DE"],
            daily_send_limit=20
        )
        logger.info("\n" + "=" * 70)
        await CampaignSimulation.run_full_campaign_simulation(
            "欧洲拓展活动",
            ["DE", "PL", "DK"],
            daily_send_limit=50
        )
        logger.info("\n" + "=" * 70)
        await A_BTestSimulation.run_ab_test()
    
    logger.info("\n✅ 模拟测试完成！")


if __name__ == '__main__':
    asyncio.run(main())
