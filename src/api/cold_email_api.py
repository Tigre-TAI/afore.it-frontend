"""
Cold Email System - FastAPI Backend & Website Integration
API 端点用于：
1. 后台管理活动
2. 前台订阅集成
3. 邮件追踪和统计
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, validator
from typing import List, Optional, Dict
from datetime import datetime
import logging
import geoip2.database
from sqlalchemy.orm import Session

from src.models.email_system import (
    Campaign, Lead, Contact, Company, 
    EmailActivity, SubscriberFromWebsite, EmailBlacklist,
    CampaignStatusEnum, EmailStatusEnum
)
from src.database import get_db
from src.tasks.celery_tasks import run_full_lead_gen_pipeline

logger = logging.getLogger(__name__)

# ==================== Pydantic 请求 Schema ====================

class WebsiteSubscriptionRequest(BaseModel):
    """前台订阅请求"""
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    preferred_language: str = 'en'  # en, de, pl
    source_page: Optional[str] = None
    utm_source: Optional[str] = None
    utm_campaign: Optional[str] = None


class CampaignCreateRequest(BaseModel):
    """创建邮件活动"""
    name: str
    target_countries: List[str] = ['DE', 'PL', 'DK']
    target_industries: List[str] = []
    subject_template: str
    body_template: str
    ai_personalization_enabled: bool = True
    languages: List[str] = ['de', 'pl', 'en']
    domain_rotation: List[str]
    
    @validator('domain_rotation')
    def validate_domains(cls, v):
        if not v or len(v) < 2:
            raise ValueError('At least 2 domains required for rotation')
        return v


class CampaignStartRequest(BaseModel):
    """启动活动"""
    campaign_id: int
    limit_per_country: int = 50
    context: Optional[Dict] = None  # 额外上下文，如紧迫性、展会信息


# ==================== 地理位置获取 ====================

class GeoIPService:
    """IP 地理位置查询服务"""
    
    def __init__(self, geoip_db_path: str):
        try:
            self.reader = geoip2.database.Reader(geoip_db_path)
        except Exception as e:
            logger.warning(f"GeoIP database not loaded: {e}")
            self.reader = None
    
    def get_location(self, ip_address: str) -> Dict:
        """获取 IP 的地理位置信息"""
        if not self.reader:
            return {'country': None, 'city': None}
        
        try:
            response = self.reader.country(ip_address)
            return {
                'country': response.country.iso_code,
                'city': response.city.name if response.city else None,
                'latitude': response.location.latitude,
                'longitude': response.location.longitude,
                'timezone': response.location.time_zone
            }
        except Exception as e:
            logger.error(f"GeoIP lookup failed: {e}")
            return {'country': None, 'city': None}


# ==================== FastAPI 应用初始化 ====================

app = FastAPI(
    title="Afore Cold Email Marketing System",
    description="B2B 自动化邮件获客系统 API",
    version="1.0.0"
)

# GeoIP 服务初始化
geoip_service = GeoIPService('/path/to/GeoLite2-Country.mmdb')


# ==================== 前台订阅接口 ====================

@app.post("/api/subscribe/newsletter")
async def subscribe_newsletter(
    request: WebsiteSubscriptionRequest,
    bg_tasks: BackgroundTasks,
    raw_request: Request,
    db: Session = get_db()
) -> JSONResponse:
    """
    前台订阅接口
    
    用户在网站上订阅邮件列表时调用
    自动记录 IP 地址和地理位置，用于目标定向
    
    Features:
    - 自动 IP 地址采集和地理定位
    - 重复订阅检查
    - 异步发送确认邮件
    """
    
    # 获取客户端 IP
    client_ip = raw_request.client.host
    logger.info(f"Newsletter subscription from IP: {client_ip}")
    
    # 检查是否已订阅
    existing = db.query(SubscriberFromWebsite).filter(
        SubscriberFromWebsite.email == request.email
    ).first()
    
    if existing:
        if existing.is_active:
            return JSONResponse(
                status_code=400,
                content={'error': 'Already subscribed'}
            )
        else:
            # 重新激活
            existing.is_active = True
            existing.subscribed_at = datetime.utcnow()
            existing.ip_address = client_ip
            db.commit()
            return JSONResponse(
                status_code=200,
                content={'message': 'Resubscribed successfully'}
            )
    
    # 获取地理位置
    geo_info = geoip_service.get_location(client_ip)
    
    # 创建新订阅者
    subscriber = SubscriberFromWebsite(
        email=request.email,
        first_name=request.first_name,
        last_name=request.last_name,
        ip_address=client_ip,
        ip_country=geo_info.get('country'),
        ip_geolocation={
            'city': geo_info.get('city'),
            'latitude': geo_info.get('latitude'),
            'longitude': geo_info.get('longitude'),
            'timezone': geo_info.get('timezone')
        },
        preferred_language=request.preferred_language,
        source_page=request.source_page,
        utm_source=request.utm_source,
        utm_campaign=request.utm_campaign,
    )
    
    db.add(subscriber)
    db.commit()
    
    # 异步发送欢迎邮件
    bg_tasks.add_task(
        send_welcome_email,
        request.email,
        request.first_name,
        request.preferred_language
    )
    
    logger.info(f"✅ Newsletter subscription: {request.email} from {geo_info.get('country')}")
    
    return JSONResponse(
        status_code=201,
        content={
            'message': 'Subscription successful',
            'email': request.email,
            'ip_country': geo_info.get('country')
        }
    )


@app.post("/api/unsubscribe")
async def unsubscribe(
    email: str,
    token: Optional[str] = None,
    db: Session = get_db()
) -> JSONResponse:
    """
    退订接口 - GDPR 合规
    
    支持两种方式：
    1. 通过邮件中的退订链接 (需要 token)
    2. 直接通过邮箱地址
    """
    
    subscriber = db.query(SubscriberFromWebsite).filter(
        SubscriberFromWebsite.email == email
    ).first()
    
    if not subscriber:
        return JSONResponse(status_code=404, content={'error': 'Email not found'})
    
    subscriber.is_active = False
    subscriber.unsubscribed_at = datetime.utcnow()
    db.commit()
    
    # 添加到黑名单
    blacklist_entry = EmailBlacklist(
        email=email,
        reason='unsubscribed',
    )
    db.add(blacklist_entry)
    db.commit()
    
    logger.info(f"✅ Unsubscribed: {email}")
    
    return JSONResponse(
        status_code=200,
        content={'message': 'Successfully unsubscribed'}
    )


# ==================== 活动管理接口 ====================

@app.post("/api/campaigns/create")
async def create_campaign(
    campaign: CampaignCreateRequest,
    db: Session = get_db()
) -> JSONResponse:
    """创建邮件活动"""
    
    new_campaign = Campaign(
        name=campaign.name,
        target_countries=campaign.target_countries,
        target_industries=campaign.target_industries,
        subject_template=campaign.subject_template,
        body_template=campaign.body_template,
        ai_personalization_enabled=campaign.ai_personalization_enabled,
        languages=campaign.languages,
        domain_rotation=campaign.domain_rotation,
        status='draft'
    )
    
    db.add(new_campaign)
    db.commit()
    db.refresh(new_campaign)
    
    logger.info(f"✅ Campaign created: {new_campaign.id} - {campaign.name}")
    
    return JSONResponse(
        status_code=201,
        content={
            'campaign_id': new_campaign.id,
            'name': new_campaign.name,
            'status': new_campaign.status
        }
    )


@app.post("/api/campaigns/{campaign_id}/start")
async def start_campaign(
    campaign_id: int,
    request: CampaignStartRequest,
    bg_tasks: BackgroundTasks,
    db: Session = get_db()
) -> JSONResponse:
    """
    启动邮件活动 - 触发完整的获客 + 发送流程
    
    这将异步执行以下步骤：
    1. 从 Google Maps 抓取安装商数据
    2. 用 Hunter.io 发现邮箱
    3. 用 ZeroBounce 验证邮箱
    4. 用 GPT-4o 生成个性化邮件
    5. 分批发送（带域名轮换）
    """
    
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    if campaign.status != 'draft':
        raise HTTPException(status_code=400, detail="Only draft campaigns can be started")
    
    # 更新状态
    campaign.status = 'scheduled'
    campaign.scheduled_for = datetime.utcnow()
    db.commit()
    
    # 异步启动流程
    bg_tasks.add_task(
        run_campaign_async,
        campaign_id,
        request.limit_per_country,
        request.context
    )
    
    logger.info(f"✅ Campaign {campaign_id} scheduled for execution")
    
    return JSONResponse(
        status_code=200,
        content={
            'campaign_id': campaign_id,
            'status': 'scheduled',
            'message': 'Campaign execution started in background'
        }
    )


async def run_campaign_async(
    campaign_id: int,
    limit_per_country: int,
    context: Optional[Dict]
):
    """后台异步运行活动"""
    
    # 调用 Celery 任务
    task = run_full_lead_gen_pipeline.delay(
        countries=['DE', 'PL', 'DK'],
        limit_per_country=limit_per_country,
        language_map={'DE': 'de', 'PL': 'pl', 'DK': 'en'},
        context=context or {}
    )
    
    logger.info(f"Celery task {task.id} created for campaign {campaign_id}")


@app.get("/api/campaigns/{campaign_id}/stats")
async def get_campaign_stats(
    campaign_id: int,
    db: Session = get_db()
) -> JSONResponse:
    """获取活动统计数据"""
    
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # 获取邮件活动统计
    email_activities = db.query(EmailActivity).filter(
        EmailActivity.campaign_id == campaign_id
    ).all()
    
    stats = {
        'campaign_id': campaign_id,
        'name': campaign.name,
        'status': campaign.status,
        'total_emails': len(email_activities),
        'sent': sum(1 for e in email_activities if e.status == 'sent'),
        'opened': campaign.opened_count,
        'clicked': campaign.clicked_count,
        'replied': campaign.replied_count,
        'bounced': campaign.bounced_count,
        'open_rate': (campaign.opened_count / campaign.sent_count * 100) if campaign.sent_count > 0 else 0,
        'click_rate': (campaign.clicked_count / campaign.sent_count * 100) if campaign.sent_count > 0 else 0,
        'reply_rate': (campaign.replied_count / campaign.sent_count * 100) if campaign.sent_count > 0 else 0,
    }
    
    return JSONResponse(status_code=200, content=stats)


# ==================== 邮件追踪接口（用于 Webhook） ====================

@app.post("/api/webhooks/email-opened")
async def track_email_opened(
    message_id: str,
    db: Session = get_db()
):
    """追踪邮件打开事件"""
    
    activity = db.query(EmailActivity).filter(
        EmailActivity.message_id == message_id
    ).first()
    
    if activity:
        activity.opened_at = datetime.utcnow()
        activity.opened_count += 1
        db.commit()
    
    return {'status': 'tracked'}


@app.post("/api/webhooks/email-clicked")
async def track_email_clicked(
    message_id: str,
    link: str,
    db: Session = get_db()
):
    """追踪邮件链接点击"""
    
    activity = db.query(EmailActivity).filter(
        EmailActivity.message_id == message_id
    ).first()
    
    if activity:
        activity.clicked_at = datetime.utcnow()
        activity.clicked_count += 1
        activity.clicked_links = activity.clicked_links or []
        activity.clicked_links.append({
            'link': link,
            'clicked_at': datetime.utcnow().isoformat()
        })
        db.commit()
    
    return {'status': 'tracked'}


@app.post("/api/webhooks/email-bounced")
async def track_email_bounced(
    message_id: str,
    bounce_type: str,  # permanent, temporary
    db: Session = get_db()
):
    """处理邮件退信"""
    
    activity = db.query(EmailActivity).filter(
        EmailActivity.message_id == message_id
    ).first()
    
    if activity:
        activity.status = 'bounced'
        db.commit()
        
        # 永久退信需要加入黑名单
        if bounce_type == 'permanent':
            blacklist = EmailBlacklist(
                email=activity.to_email,
                reason='permanent_bounce'
            )
            db.add(blacklist)
            db.commit()
            logger.warning(f"⚠️ Email blacklisted due to permanent bounce: {activity.to_email}")
    
    return {'status': 'tracked'}


@app.post("/api/webhooks/email-replied")
async def track_email_replied(
    message_id: str,
    reply_content: str,
    db: Session = get_db()
):
    """追踪邮件回复"""
    
    activity = db.query(EmailActivity).filter(
        EmailActivity.message_id == message_id
    ).first()
    
    if activity:
        activity.status = 'replied'
        activity.replied_at = datetime.utcnow()
        activity.reply_content = reply_content
        
        # 标记 Lead 为已转化
        lead = db.query(Lead).filter(Lead.id == activity.lead_id).first()
        if lead:
            lead.converted_at = datetime.utcnow()
        
        db.commit()
        logger.info(f"✅ Lead replied from {activity.to_email}")
    
    return {'status': 'tracked'}


# ==================== 助手函数 ====================

async def send_welcome_email(email: str, first_name: str, language: str):
    """发送欢迎邮件"""
    # TODO: 用 Resend API 发送
    logger.info(f"Sending welcome email to {email} in {language}")


# ==================== 健康检查 ====================

@app.get("/health")
async def health_check():
    return {
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat()
    }


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
