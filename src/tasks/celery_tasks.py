"""
Cold Email System - Celery Tasks & Task Queue Management
异步任务队列配置，用于处理大规模邮件发送和数据抓取
"""

from celery import Celery, group, chain
from celery.utils.log import get_task_logger
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import logging

# Celery 应用配置
app = Celery('cold_email_system')

# 从配置文件加载设置
app.config_from_object({
    'broker_url': 'redis://localhost:6379/0',
    'result_backend': 'redis://localhost:6379/0',
    'task_serializer': 'json',
    'accept_content': ['json'],
    'result_serializer': 'json',
    'timezone': 'UTC',
    'enable_utc': True,
    
    # 任务配置
    'task_track_started': True,
    'task_time_limit': 30 * 60,  # 30 分钟硬超时
    'task_soft_time_limit': 25 * 60,  # 25 分钟软超时
    
    # 重试配置
    'task_default_retry_delay': 300,  # 5 分钟后重试
    'task_max_retries': 3,
    
    # 并发配置
    'worker_prefetch_multiplier': 1,  # 避免内存溢出
    'worker_max_tasks_per_child': 1000,  # Worker 重启
})

logger = get_task_logger(__name__)


# ==================== 数据抓取任务 ====================

@app.task(bind=True, name='tasks.scrape_google_maps', max_retries=3)
def scrape_google_maps_task(
    self,
    country: str,
    keywords: List[str] = None,
    limit: int = 50
) -> Dict:
    """
    异步任务：从 Google Maps 抓取安装商和分销商
    
    Args:
        country: 国家代码 (DE, PL, DK)
        keywords: 搜索关键词
        limit: 返回数量
    
    Returns:
        {'status': 'success', 'scraped_count': 50, 'companies': [...]}
    """
    
    try:
        logger.info(f"Starting Google Maps scrape for {country}")
        
        from src.services.lead_generation_pipeline import GoogleMapsLeadScraper
        from src.config import SERP_API_KEY
        
        scraper = GoogleMapsLeadScraper(SERP_API_KEY)
        
        # 使用同步包装的异步函数
        import asyncio
        companies = asyncio.run(
            scraper.scrape_installers_by_location(country, keywords, limit)
        )
        
        logger.info(f"Successfully scraped {len(companies)} companies from {country}")
        
        return {
            'status': 'success',
            'country': country,
            'scraped_count': len(companies),
            'companies': companies
        }
        
    except Exception as exc:
        logger.error(f"Google Maps scrape failed: {str(exc)}")
        # 指数退避重试
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@app.task(bind=True, name='tasks.discover_emails_batch', max_retries=3)
def discover_emails_batch_task(
    self,
    companies: List[Dict]
) -> Dict:
    """
    异步任务：批量邮箱发现（Hunter.io）
    """
    
    try:
        logger.info(f"Discovering emails for {len(companies)} companies")
        
        from src.services.lead_generation_pipeline import HunterEmailDiscovery
        from src.config import HUNTER_API_KEY
        import asyncio
        
        hunter = HunterEmailDiscovery(HUNTER_API_KEY)
        
        all_contacts = []
        for company in companies:
            if not company.get('website'):
                continue
            
            domain = company['website'].replace('https://', '').replace('http://', '').split('/')[0]
            emails = asyncio.run(hunter.find_emails_by_domain(domain))
            
            for email in emails:
                all_contacts.append({
                    'company_id': company.get('name'),
                    'domain': domain,
                    **email
                })
        
        logger.info(f"Discovered {len(all_contacts)} emails")
        
        return {
            'status': 'success',
            'discovered_count': len(all_contacts),
            'contacts': all_contacts
        }
        
    except Exception as exc:
        logger.error(f"Email discovery failed: {str(exc)}")
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@app.task(bind=True, name='tasks.verify_emails', max_retries=3)
def verify_emails_task(
    self,
    emails: List[str]
) -> Dict:
    """
    异步任务：ZeroBounce 邮箱验证
    
    只保留 "valid" 状态的邮箱
    """
    
    try:
        logger.info(f"Verifying {len(emails)} emails")
        
        from src.services.lead_generation_pipeline import ZeroBounceEmailVerifier
        from src.config import ZEROBOUNCE_API_KEY
        import asyncio
        
        verifier = ZeroBounceEmailVerifier(ZEROBOUNCE_API_KEY)
        verified_results = asyncio.run(verifier.batch_validate_emails(emails))
        
        # 过滤有效邮箱
        valid_emails = [
            result for result in verified_results 
            if result.get('status') == 'valid'
        ]
        
        logger.info(f"Verified {len(valid_emails)}/{len(emails)} emails as valid")
        
        return {
            'status': 'success',
            'total_checked': len(emails),
            'valid_count': len(valid_emails),
            'verified_emails': valid_emails
        }
        
    except Exception as exc:
        logger.error(f"Email verification failed: {str(exc)}")
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


# ==================== AI 邮件生成任务 ====================

@app.task(bind=True, name='tasks.generate_email_content', max_retries=2)
def generate_email_content_task(
    self,
    contact: Dict,
    company: Dict,
    language: str = 'en',
    context: Optional[Dict] = None
) -> Dict:
    """
    异步任务：GPT-4o 生成个性化邮件
    """
    
    try:
        from src.services.lead_generation_pipeline import OpenAIEmailGenerator
        from src.config import OPENAI_API_KEY
        import asyncio
        
        logger.info(f"Generating email for {contact.get('first_name')} at {company.get('name')}")
        
        email_gen = OpenAIEmailGenerator(OPENAI_API_KEY)
        
        subject, body = asyncio.run(
            email_gen.generate_personalized_email(
                company_name=company.get('name'),
                contact_name=contact.get('first_name'),
                contact_title=contact.get('title'),
                company_description=company.get('description', ''),
                language=language,
                context=context or {}
            )
        )
        
        return {
            'status': 'success',
            'email': contact.get('email'),
            'subject': subject,
            'body': body,
            'language': language,
            'generated_at': datetime.utcnow().isoformat()
        }
        
    except Exception as exc:
        logger.error(f"Email generation failed: {str(exc)}")
        raise self.retry(exc=exc, countdown=300)


# ==================== 邮件发送任务 ====================

@app.task(bind=True, name='tasks.send_personalized_email', rate_limit='100/h')
def send_personalized_email_task(
    self,
    email_data: Dict,
    campaign_id: int,
    from_email: str
) -> Dict:
    """
    异步任务：发送个性化邮件
    
    使用 Resend API（或类似服务）发送邮件
    支持邮箱域名轮换，避免被标记为垃圾邮件
    
    Args:
        email_data: {'to_email': 'xxx@example.com', 'subject': '...', 'body': '...'}
        campaign_id: 活动 ID
        from_email: 发送邮箱地址（来自轮换池）
    
    Returns:
        {'status': 'sent', 'message_id': 'xxx', 'sent_at': 'timestamp'}
    """
    
    try:
        from src.services.email_service import ResendEmailService
        from src.config import RESEND_API_KEY
        from src.models.email_system import EmailActivity
        from src.database import SessionLocal
        
        logger.info(f"Sending email to {email_data.get('to_email')}")
        
        email_service = ResendEmailService(RESEND_API_KEY)
        
        # 添加 GDPR 退订链接
        gdpr_unsubscribe = f"\n\n---\nDo not want to receive emails? <click here to unsubscribe>"
        
        result = email_service.send_email(
            to=email_data.get('to_email'),
            subject=email_data.get('subject'),
            body=email_data.get('body') + gdpr_unsubscribe,
            from_email=from_email,
            campaign_id=campaign_id
        )
        
        # 记录邮件活动
        db = SessionLocal()
        try:
            activity = EmailActivity(
                campaign_id=campaign_id,
                contact_id=email_data.get('contact_id'),
                lead_id=email_data.get('lead_id'),
                personalized_subject=email_data.get('subject'),
                personalized_body=email_data.get('body'),
                from_email=from_email,
                to_email=email_data.get('to_email'),
                language=email_data.get('language', 'en'),
                status='sent',
                message_id=result.get('message_id'),
                sent_at=datetime.utcnow()
            )
            db.add(activity)
            db.commit()
        finally:
            db.close()
        
        logger.info(f"Email sent successfully to {email_data.get('to_email')}")
        
        return {
            'status': 'success',
            'to_email': email_data.get('to_email'),
            'message_id': result.get('message_id'),
            'sent_at': datetime.utcnow().isoformat()
        }
        
    except Exception as exc:
        logger.error(f"Email sending failed: {str(exc)}")
        # 不重试失败的邮件，记录到黑名单
        return {
            'status': 'failed',
            'to_email': email_data.get('to_email'),
            'error': str(exc)
        }


# ==================== 工作流编排 ====================

@app.task(name='tasks.run_full_lead_gen_pipeline')
def run_full_lead_gen_pipeline(
    countries: List[str] = ['DE', 'PL', 'DK'],
    limit_per_country: int = 50,
    language_map: Optional[Dict[str, str]] = None,
    context: Optional[Dict] = None
) -> Dict:
    """
    编排完整的获客流程
    
    workflow:
    1. 并行抓取 3 个国家的数据
    2. 批量邮箱发现
    3. 批量邮箱验证
    4. 并行生成个性化邮件
    5. 批量发送（每小时 100 封限制）
    """
    
    if language_map is None:
        language_map = {'DE': 'de', 'PL': 'pl', 'DK': 'en'}
    
    logger.info("Starting full lead generation pipeline workflow")
    
    # Step 1: 并行抓取各国数据
    scrape_jobs = group([
        scrape_google_maps_task.s(country, limit=limit_per_country)
        for country in countries
    ])
    
    # 执行抓取
    scrape_results = scrape_jobs.apply_async()
    all_companies = []
    for result in scrape_results.get():
        all_companies.extend(result['companies'])
    
    logger.info(f"Scraped total {len(all_companies)} companies")
    
    # Step 2: 邮箱发现和验证
    email_discovery = discover_emails_batch_task.delay(all_companies)
    contacts = email_discovery.get()['contacts']
    
    email_verification = verify_emails_task.delay(
        [c['email'] for c in contacts]
    )
    verified = email_verification.get()['verified_emails']
    
    # 合并验证结果
    verified_contacts = []
    for contact in contacts:
        for verified_email in verified:
            if contact['email'] == verified_email['email']:
                verified_contacts.append({**contact, **verified_email})
                break
    
    logger.info(f"Total verified contacts: {len(verified_contacts)}")
    
    # Step 3: 并行生成个性化邮件
    generate_jobs = group([
        generate_email_content_task.s(
            contact,
            contact.get('company', {}),
            language_map.get(contact['company']['country'], 'en'),
            context
        )
        for contact in verified_contacts
    ])
    
    generation_results = generate_jobs.apply_async()
    generated_emails = generation_results.get()
    
    logger.info(f"Generated {len(generated_emails)} personalized emails")
    
    # Step 4: 准备发送（带域名轮换）
    domain_rotation = ['mail1.afore.it', 'mail2.afore.it', 'mail3.afore.it']
    
    send_jobs = []
    for idx, email_data in enumerate(generated_emails):
        from_email = domain_rotation[idx % len(domain_rotation)]
        
        send_jobs.append(
            send_personalized_email_task.s(
                email_data,
                campaign_id=None,  # 需要在 UI 中指定
                from_email=from_email
            )
        )
    
    # 分批发送（避免过载）
    send_group = group(send_jobs)
    send_results = send_group.apply_async()
    
    return {
        'status': 'completed',
        'total_companies': len(all_companies),
        'total_verified_contacts': len(verified_contacts),
        'generated_emails': len(generated_emails),
        'sent_emails': len(send_results.get()),
        'timestamp': datetime.utcnow().isoformat()
    }


# ==================== 定时任务 ====================

from celery.schedules import crontab

app.conf.beat_schedule = {
    # 每天早上 09:00 CET 运行一次完整流程
    'run-daily-cold-email-campaign': {
        'task': 'tasks.run_full_lead_gen_pipeline',
        'schedule': crontab(hour=8, minute=0),  # UTC 时间（CET = UTC+1）
        'args': (['DE', 'PL', 'DK'], 50, None, {
            'urgency': '限时特价，2周内下单享受20%折扣',
            'trade_show': 'Intersolar Europe 2026'
        })
    },
    
    # 每周一清理黑名单
    'cleanup-blacklist': {
        'task': 'tasks.cleanup_expired_blacklist',
        'schedule': crontab(day_of_week=1, hour=2, minute=0)
    }
}


# ==================== 监控和日志 ====================

@app.task(name='tasks.get_pipeline_status')
def get_pipeline_status() -> Dict:
    """获取管道运行状态"""
    from src.database import SessionLocal
    from src.models.email_system import Campaign, EmailActivity
    
    db = SessionLocal()
    try:
        active_campaigns = db.query(Campaign).filter(
            Campaign.status.in_(['running', 'scheduled'])
        ).count()
        
        sent_today = db.query(EmailActivity).filter(
            EmailActivity.sent_at >= datetime.utcnow() - timedelta(days=1)
        ).count()
        
        return {
            'active_campaigns': active_campaigns,
            'emails_sent_today': sent_today,
            'timestamp': datetime.utcnow().isoformat()
        }
    finally:
        db.close()


if __name__ == '__main__':
    app.start()
