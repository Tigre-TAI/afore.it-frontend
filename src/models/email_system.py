"""
Cold Email Lead Generation System - Database Models
针对欧洲市场（德国、波兰、丹麦）的 B2B 自动化邮件获客系统
"""

from datetime import datetime
from enum import Enum
from typing import Optional, List
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Float, Text, JSON, ForeignKey, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from pydantic import BaseModel, EmailStr, validator
import pytz

Base = declarative_base()

# ==================== Enums ====================
class CountryEnum(str, Enum):
    """目标国家枚举"""
    GERMANY = "DE"
    POLAND = "PL"
    DENMARK = "DK"

class IndustryTypeEnum(str, Enum):
    """行业分类"""
    SOLAR_INSTALLER = "solar_installer"  # 太阳能安装商
    DISTRIBUTOR = "distributor"          # 分销商
    ENERGY_COMPANY = "energy_company"     # 能源公司
    PROPERTY_DEVELOPER = "property_dev"   # 房产开发商

class EmailStatusEnum(str, Enum):
    """邮箱验证状态"""
    PENDING = "pending"           # 待验证
    VALID = "valid"               # 有效
    INVALID = "invalid"           # 无效
    RISKY = "risky"              # 风险（可能有效但不安全）
    UNVERIFIED = "unverified"     # 未验证

class CampaignStatusEnum(str, Enum):
    """活动状态"""
    DRAFT = "draft"               # 草稿
    SCHEDULED = "scheduled"       # 已排期
    RUNNING = "running"           # 运行中
    COMPLETED = "completed"       # 已完成
    PAUSED = "paused"            # 暂停

class EmailSendStatusEnum(str, Enum):
    """邮件发送状态"""
    PENDING = "pending"           # 待发送
    SENT = "sent"                # 已发送
    BOUNCED = "bounced"          # 退信
    OPENED = "opened"            # 已打开
    CLICKED = "clicked"          # 已点击
    REPLIED = "replied"          # 已回复
    UNSUBSCRIBED = "unsubscribed" # 已退订


# ==================== Models ====================

class Company(Base):
    """公司信息表"""
    __tablename__ = "companies"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, index=True)
    country = Column(String(2), nullable=False)  # DE, PL, DK
    city = Column(String(100))
    industry_type = Column(String(50), nullable=False)  # solar_installer, distributor, etc.
    
    # 联系方式
    phone = Column(String(20))
    website = Column(String(255), unique=True, index=True)
    
    # Google Maps & SEO 信息
    google_maps_url = Column(String(500))
    business_id = Column(String(100), unique=True, index=True)  # Google Place ID
    
    # 地理位置
    latitude = Column(Float)
    longitude = Column(Float)
    
    # 业务描述（用于 AI 个性化）
    description = Column(Text)  # 从 Google Maps 抓取的描述
    business_hours = Column(JSON)  # 营业时间
    rating = Column(Float)  # Google 评分
    
    # 元数据
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    contacts = relationship("Contact", back_populates="company", cascade="all, delete-orphan")
    leads = relationship("Lead", back_populates="company", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('idx_country_industry', 'country', 'industry_type'),
    )


class Contact(Base):
    """公司联系人表"""
    __tablename__ = "contacts"
    
    id = Column(Integer, primary_key=True)
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False, index=True)
    
    # 联系人信息
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    title = Column(String(100))  # CEO, Manager, Owner, etc.
    department = Column(String(100))  # Sales, Operations, Management
    
    # 邮箱（可能有多个）
    email = Column(String(255), unique=True, nullable=False, index=True)
    email_status = Column(String(50), default=EmailStatusEnum.PENDING.value, index=True)
    email_verified_at = Column(DateTime)  # 邮箱验证时间
    
    # ZeroBounce 验证结果
    zeroBounce_score = Column(Integer)  # 0-100, 越高越有效
    is_catch_all = Column(Boolean, default=False)  # 是否为通用邮箱
    
    # LinkedIn 信息（用于个性化）
    linkedin_url = Column(String(255))
    linkedin_title = Column(String(100))
    
    # 决策权级别（用于优先级）
    seniority_level = Column(String(50))  # C-level, Manager, Staff, etc.
    decision_maker = Column(Boolean, default=False)  # 是否为决策者
    
    # 黑名单管理
    is_blacklisted = Column(Boolean, default=False, index=True)
    blacklist_reason = Column(String(255))
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    company = relationship("Company", back_populates="contacts")
    leads = relationship("Lead", back_populates="contact")
    email_activities = relationship("EmailActivity", back_populates="contact", cascade="all, delete-orphan")


class Lead(Base):
    """潜在客户记录表"""
    __tablename__ = "leads"
    
    id = Column(Integer, primary_key=True)
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False, index=True)
    contact_id = Column(Integer, ForeignKey('contacts.id'), nullable=True, index=True)
    
    # 来源信息
    source = Column(String(50), nullable=False)  # "google_maps", "hunter.io", "website_subscription"
    source_metadata = Column(JSON)  # 额外的来源信息
    
    # IP 地址（来自前台订阅）
    ip_address = Column(String(45))  # 支持 IPv6
    ip_country = Column(String(2))
    ip_geolocation = Column(JSON)  # {'city': 'Berlin', 'region': 'Berlin', 'country': 'DE'}
    
    # 采集时间
    collected_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # 质量评分（用于排序和优先级）
    quality_score = Column(Float, default=0.0)  # 0-100
    quality_reason = Column(Text)  # 评分原因
    
    # 活动记录
    campaign_id = Column(Integer, ForeignKey('campaigns.id'), nullable=True, index=True)
    
    # 状态跟踪
    is_active = Column(Boolean, default=True, index=True)
    converted_at = Column(DateTime)  # 转化时间
    
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    company = relationship("Company", back_populates="leads")
    contact = relationship("Contact", back_populates="leads")
    campaign = relationship("Campaign", back_populates="leads")
    email_activities = relationship("EmailActivity", back_populates="lead", cascade="all, delete-orphan")


class Campaign(Base):
    """邮件活动表"""
    __tablename__ = "campaigns"
    
    id = Column(Integer, primary_key=True)
    
    # 活动信息
    name = Column(String(255), nullable=False)
    description = Column(Text)
    
    # 目标国家和行业
    target_countries = Column(JSON, default=['DE', 'PL', 'DK'])  # 列表
    target_industries = Column(JSON, default=[])  # 列表
    
    # 邮件模板相关
    subject_template = Column(String(255), nullable=False)
    body_template = Column(Text, nullable=False)
    ai_personalization_enabled = Column(Boolean, default=True)
    
    # 发送配置
    sending_schedule = Column(JSON)  # {'start_time': '09:00', 'timezone': 'Europe/Berlin', 'daily_limit': 50}
    domain_rotation = Column(JSON)  # ['mail1.afore.it', 'mail2.afore.it', 'mail3.afore.it']
    current_domain_index = Column(Integer, default=0)
    
    # 多语言支持
    languages = Column(JSON, default=['de', 'pl', 'en'])  # 德语、波兰语、英语
    
    # 状态
    status = Column(String(50), default=CampaignStatusEnum.DRAFT.value, index=True)
    
    # 统计数据
    total_leads = Column(Integer, default=0)
    sent_count = Column(Integer, default=0)
    opened_count = Column(Integer, default=0)
    clicked_count = Column(Integer, default=0)
    replied_count = Column(Integer, default=0)
    bounced_count = Column(Integer, default=0)
    
    # 时间
    created_at = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    scheduled_for = Column(DateTime)
    
    leads = relationship("Lead", back_populates="campaign")
    email_activities = relationship("EmailActivity", back_populates="campaign")


class EmailActivity(Base):
    """邮件活动跟踪表"""
    __tablename__ = "email_activities"
    
    id = Column(Integer, primary_key=True)
    
    # 关联
    campaign_id = Column(Integer, ForeignKey('campaigns.id'), nullable=False, index=True)
    contact_id = Column(Integer, ForeignKey('contacts.id'), nullable=False, index=True)
    lead_id = Column(Integer, ForeignKey('leads.id'), nullable=False, index=True)
    
    # 邮件内容
    personalized_subject = Column(String(255), nullable=False)
    personalized_body = Column(Text, nullable=False)
    from_email = Column(String(255), nullable=False)  # 轮换的发送域名
    to_email = Column(String(255), nullable=False)
    
    # 语言和本地化
    language = Column(String(10), default='en')  # de, pl, en
    sent_timezone = Column(String(50))  # 发送时区
    local_sent_time = Column(DateTime)  # 本地发送时间
    
    # 状态
    status = Column(String(50), default=EmailSendStatusEnum.PENDING.value, index=True)
    
    # 发送信息
    sent_at = Column(DateTime)
    message_id = Column(String(255), unique=True, index=True)  # Email provider 的 message ID
    
    # 交互追踪
    opened_at = Column(DateTime)
    opened_count = Column(Integer, default=0)
    last_opened_at = Column(DateTime)
    
    clicked_at = Column(DateTime)
    clicked_count = Column(Integer, default=0)
    clicked_links = Column(JSON)  # [{'link': 'url', 'clicked_at': 'timestamp'}]
    
    replied_at = Column(DateTime)
    reply_content = Column(Text)
    
    # 错误跟踪
    error_message = Column(Text)
    retry_count = Column(Integer, default=0)
    
    # 退订管理
    unsubscribed_at = Column(DateTime)
    unsubscribe_reason = Column(String(255))
    
    # 元数据
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    contact = relationship("Contact", back_populates="email_activities")
    lead = relationship("Lead", back_populates="email_activities")
    campaign = relationship("Campaign", back_populates="email_activities")
    
    __table_args__ = (
        Index('idx_campaign_status', 'campaign_id', 'status'),
        Index('idx_contact_status', 'contact_id', 'status'),
    )


class SubscriberFromWebsite(Base):
    """前台网站订阅者表"""
    __tablename__ = "website_subscribers"
    
    id = Column(Integer, primary_key=True)
    
    # 联系方式
    email = Column(String(255), unique=True, nullable=False, index=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    
    # IP 信息
    ip_address = Column(String(45), nullable=False)
    ip_country = Column(String(2))
    ip_geolocation = Column(JSON)
    
    # 订阅信息
    subscribed_at = Column(DateTime, default=datetime.utcnow, index=True)
    is_active = Column(Boolean, default=True)
    unsubscribed_at = Column(DateTime)
    
    # 偏好设置
    preferred_language = Column(String(10), default='en')
    newsletter_frequency = Column(String(50), default='weekly')  # daily, weekly, monthly
    
    # 来源页面
    source_page = Column(String(255))
    utm_source = Column(String(100))
    utm_campaign = Column(String(100))
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class EmailBlacklist(Base):
    """邮箱黑名单表"""
    __tablename__ = "email_blacklist"
    
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    reason = Column(String(255))  # bounced, unsubscribed, spam_complaint, invalid
    added_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)  # 黑名单过期时间（可选）


# ==================== Pydantic Schemas ====================

class ContactSchema(BaseModel):
    """Contact Pydantic Schema"""
    first_name: str
    last_name: str
    email: EmailStr
    title: Optional[str] = None
    department: Optional[str] = None
    linkedin_url: Optional[str] = None
    decision_maker: bool = False
    
    class Config:
        from_attributes = True


class CompanySchema(BaseModel):
    """Company Pydantic Schema"""
    name: str
    country: CountryEnum
    city: Optional[str] = None
    industry_type: IndustryTypeEnum
    phone: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    
    class Config:
        from_attributes = True


class LeadSchema(BaseModel):
    """Lead Pydantic Schema"""
    company_id: int
    contact_id: Optional[int] = None
    source: str
    ip_address: Optional[str] = None
    ip_country: Optional[str] = None
    quality_score: float = 0.0
    
    class Config:
        from_attributes = True


class WebsiteSubscriberSchema(BaseModel):
    """前台订阅者 Schema"""
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    ip_address: str
    ip_country: Optional[str] = None
    preferred_language: str = 'en'
    source_page: Optional[str] = None
    utm_source: Optional[str] = None
    utm_campaign: Optional[str] = None
    
    @validator('ip_address')
    def validate_ip(cls, v):
        import ipaddress
        try:
            ipaddress.ip_address(v)
            return v
        except ValueError:
            raise ValueError('Invalid IP address')
    
    class Config:
        from_attributes = True


class CampaignSchema(BaseModel):
    """Campaign Pydantic Schema"""
    name: str
    target_countries: List[str] = ['DE', 'PL', 'DK']
    target_industries: List[str] = []
    subject_template: str
    body_template: str
    ai_personalization_enabled: bool = True
    languages: List[str] = ['de', 'pl', 'en']
    domain_rotation: List[str]
    
    class Config:
        from_attributes = True


class TimezoneHelper:
    """欧洲时区处理工具"""
    EUROPEAN_TIMEZONES = {
        'DE': 'Europe/Berlin',
        'PL': 'Europe/Warsaw',
        'DK': 'Europe/Copenhagen',
    }
    
    @staticmethod
    def get_timezone(country_code: str):
        return pytz.timezone(TimezoneHelper.EUROPEAN_TIMEZONES.get(country_code, 'UTC'))
    
    @staticmethod
    def get_local_time(country_code: str, utc_time: datetime = None):
        if utc_time is None:
            utc_time = datetime.utcnow()
        tz = TimezoneHelper.get_timezone(country_code)
        return pytz.UTC.localize(utc_time).astimezone(tz)
