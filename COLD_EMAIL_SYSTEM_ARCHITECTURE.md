"""
Cold Email Lead Generation System - Architecture Guide
完整的 B2B SaaS 冷邮件获客系统架构说明
"""

# ==================== 系统架构总览 ====================

"""
┌─────────────────────────────────────────────────────────────────────┐
│                      COLD EMAIL SYSTEM ARCHITECTURE                   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ FRONTEND (Next.js)                                                    │
│ ├─ Newsletter subscription form  (前台订阅)                         │
│ ├─ Campaign dashboard             (后台管理)                         │
│ └─ Analytics & reporting          (数据展示)                         │
└──────────────────┬──────────────────────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│ FASTAPI BACKEND (API Layer)                                           │
│ ├─ /api/subscribe/newsletter     (前台集成)                         │
│ ├─ /api/campaigns/create         (活动创建)                         │
│ ├─ /api/campaigns/{id}/start     (活动启动)                         │
│ ├─ /api/webhooks/email-*         (邮件追踪)                         │
│ └─ /api/campaigns/{id}/stats     (统计数据)                         │
└──────────────────┬──────────────────────────────────────────────────┘
                   │
         ┌─────────┴──────────┬──────────────┬────────────┐
         ↓                    ↓              ↓            ↓
    ┌─────────────┐  ┌──────────────┐  ┌────────────┐  ┌──────────────┐
    │  CELERY     │  │  REDIS       │  │ POSTGRES   │  │  EXTERNAL    │
    │  (Task      │  │  (Cache &    │  │ (Database) │  │  APIs        │
    │  Queue)     │  │  Message     │  └────────────┘  ├─ SerpAPI     │
    │             │  │  Broker)     │                   ├─ Hunter.io   │
    ├─ Scraping  │  └──────────────┘                   ├─ ZeroBounce  │
    ├─ Email      │                                     ├─ OpenAI      │
    │  verification                                     ├─ Resend      │
    ├─ AI content │                                     └─ GeoIP DB    │
    │  generation  │                                     │
    └─ Email      │                                     │
      sending     │                                     │
    └─────────────┘                                     │
                                                        │
                                                        └──────────┐
                                                                   │
    ┌──────────────────────────────────────────────────────────────┘
    │
    ├─ EXTERNAL DATA SOURCES
    │  ├─ Google Maps  (安装商数据)
    │  ├─ Hunter.io    (邮箱发现)
    │  ├─ ZeroBounce   (邮箱验证)
    │  ├─ OpenAI API   (邮件生成)
    │  └─ Resend       (邮件发送)
    │
    └─ DATA FLOW
       ├─ 1. Scrape: Google Maps → Companies
       ├─ 2. Enrich: Hunter.io → Emails
       ├─ 3. Validate: ZeroBounce → Valid Emails
       ├─ 4. Personalize: OpenAI → Email Content
       ├─ 5. Send: Resend → Inbox (with rotation)
       ├─ 6. Track: Webhooks → Activity Log
       └─ 7. Analyze: Dashboard → KPIs


# ==================== 数据流详解 ====================

┌──────────────────────────────────────────────────────────────────┐
│ STEP 1: LEAD SCRAPING (从 Google Maps 抓取)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Input:  Countries ['DE', 'PL', 'DK']                           │
│          Keywords ['solar installer', 'distributor']            │
│                                                                  │
│  Process:                                                        │
│  ├─ SerpAPI → Search Google Maps with location                 │
│  ├─ Parse results → Extract company metadata                    │
│  └─ Store in DB → Companies table                              │
│                                                                  │
│  Output: Company {                                              │
│    name, country, city,                                         │
│    phone, website, google_maps_url,                             │
│    latitude, longitude,                                         │
│    rating, description,                                         │
│    industry_type                                                │
│  }                                                              │
└──────────────────────────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────────────────────────┐
│ STEP 2: EMAIL DISCOVERY (从网站域名发现邮箱)                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Input:  Company.website (e.g., www.solar-company.de)          │
│                                                                  │
│  Process:                                                        │
│  ├─ Extract domain                                              │
│  ├─ Hunter.io API → Find emails for domain                     │
│  ├─ Extract: first_name, last_name, title, confidence         │
│  └─ Store in DB → Contacts table                              │
│                                                                  │
│  Output: Contact {                                              │
│    email, first_name, last_name, title,                        │
│    department, confidence_score,                                │
│    linkedin_url,                                                │
│    is_catch_all                                                │
│  }                                                              │
└──────────────────────────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────────────────────────┐
│ STEP 3: EMAIL VERIFICATION (ZeroBounce 验证)                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Input:  List of emails to verify                              │
│                                                                  │
│  Process:                                                        │
│  ├─ ZeroBounce API → Validate email deliverability             │
│  ├─ Check: valid, invalid, catch-all, spamtrap, abuse         │
│  └─ FILTER: Only "valid" status proceed                        │
│                                                                  │
│  Output: Contact updated with {                                │
│    email_status: 'valid',                                       │
│    zeroBounce_confidence: 95,                                   │
│    is_catch_all: false                                         │
│  }                                                              │
│                                                                  │
│  IMPORTANT: 这一步是保护域名信誉的关键！                          │
│             只有验证过的邮箱才进入发送序列                        │
└──────────────────────────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────────────────────────┐
│ STEP 4: AI PERSONALIZATION (GPT-4o 个性化)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Input:  Contact + Company metadata                             │
│          Language (de, pl, en)                                  │
│          Context (urgency, offer, etc.)                        │
│                                                                  │
│  Process:                                                        │
│  ├─ Build system prompt → Expert B2B copywriter                │
│  ├─ Create user prompt → Company + contact info                │
│  ├─ Call GPT-4o API → Generate email                           │
│  └─ Parse JSON response → Extract subject + body               │
│                                                                  │
│  Prompt Example (German context):                               │
│  ┌────────────────────────────────────────────────┐             │
│  │ Du bist ein B2B-Verkaufsexperte.              │             │
│  │ Schreibe eine personalisierte Cold-Email      │             │
│  │ für den Solar-Installateur "SolarTech GmbH"   │             │
│  │ Adressat: Max Müller, Geschäftsführer         │             │
│  │ Dringlichkeit: Begrenzte Zeit (2 Wochen)     │             │
│  │ Angebot: 20% Rabatt + kostenlose Beratung    │             │
│  └────────────────────────────────────────────────┘             │
│                                                                  │
│  Output: Email {                                                │
│    subject: "Maximieren Sie Ihre Solaranlagen...",             │
│    body: "Hallo Max, ich bin...",                              │
│    language: 'de',                                              │
│    generated_at: timestamp                                      │
│  }                                                              │
└──────────────────────────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────────────────────────┐
│ STEP 5: EMAIL SENDING WITH ROTATION (邮箱轮换发送)                │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Domain Rotation Pool:                                          │
│  ├─ mail1.afore.it                                             │
│  ├─ mail2.afore.it                                             │
│  ├─ mail3.afore.it                                             │
│  └─ mail4.afore.it                                             │
│                                                                  │
│  Process:                                                        │
│  ├─ Rotate domain for each email (避免单个域被标记为垃圾)        │
│  ├─ Add GDPR unsubscribe link                                  │
│  ├─ Set timezone-aware sending time (本地时间 09:00)            │
│  ├─ Resend API → Send email                                     │
│  └─ Store message_id for tracking                              │
│                                                                  │
│  Output: EmailActivity {                                        │
│    from_email: 'mail1@afore.it',                               │
│    to_email: 'max@solartech.de',                               │
│    message_id: 'msg_12345',                                    │
│    status: 'sent',                                              │
│    sent_at: timestamp,                                          │
│    sent_timezone: 'Europe/Berlin'                              │
│  }                                                              │
└──────────────────────────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────────────────────────┐
│ STEP 6: TRACKING & ANALYTICS (追踪和分析)                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Webhook Events:                                                │
│  ├─ email-opened    → Track open rate                          │
│  ├─ email-clicked   → Track click rate + which links           │
│  ├─ email-bounced   → Add to blacklist                         │
│  └─ email-replied   → Mark lead as converted                   │
│                                                                  │
│  KPIs Tracked:                                                  │
│  ├─ Delivery rate (邮件送达率)                                  │
│  ├─ Open rate (打开率)                                          │
│  ├─ Click rate (点击率)                                         │
│  ├─ Reply rate (回复率)                                         │
│  ├─ Conversion rate (转化率)                                    │
│  └─ Bounce rate (退信率)                                        │
└──────────────────────────────────────────────────────────────────┘


# ==================== 前台订阅集成 ====================

网站前台有用户订阅时的流程：

1. 用户在网站上填写邮件地址
   ↓
2. 前端发送 POST /api/subscribe/newsletter
   {
     "email": "subscriber@example.com",
     "first_name": "John",
     "ip_address": "extracted from request",
     "source_page": "/products/solar",
     "utm_source": "google",
     "utm_campaign": "summer_2026"
   }
   ↓
3. 后端处理：
   - 获取客户端 IP 地址
   - 查询 GeoIP 数据库 → 获取国家、城市、时区
   - 检查重复订阅
   - 存储到 website_subscribers 表
   ↓
4. 数据用途：
   - 邮件列表管理（发送定期营销邮件）
   - 地域分析（了解受众分布）
   - 时区感知（本地时间发送）
   - 归因追踪（utm_source, utm_campaign）


# ==================== 部署架构 ====================

Production Setup:

┌─────────────────────────────────────────────────────────────┐
│ DOCKER COMPOSE                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Services:                                                   │
│ ├─ fastapi (uvicorn, 4 workers)                            │
│ ├─ celery-worker (4 workers)                               │
│ ├─ celery-beat (scheduler)                                 │
│ ├─ postgres (primary database)                             │
│ ├─ redis (cache + message broker)                          │
│ └─ nginx (reverse proxy)                                   │
│                                                             │
│ Environment Variables:                                      │
│ ├─ SERP_API_KEY=...                                        │
│ ├─ HUNTER_API_KEY=...                                      │
│ ├─ ZEROBOUNCE_API_KEY=...                                  │
│ ├─ OPENAI_API_KEY=...                                      │
│ ├─ RESEND_API_KEY=...                                      │
│ ├─ DATABASE_URL=postgresql://...                           │
│ └─ REDIS_URL=redis://...                                   │
│                                                             │
│ Volumes:                                                    │
│ ├─ postgres_data:/var/lib/postgresql/data                  │
│ ├─ redis_data:/data                                        │
│ └─ geoip_db:/app/data/geoip                                │
└─────────────────────────────────────────────────────────────┘


# ==================== 性能优化策略 ====================

1. PARALLEL PROCESSING (并行处理)
   - 国家级并行抓取 (DE, PL, DK)
   - 批量邮箱验证 (并发数: 10-20)
   - 并行 AI 生成 (GPT 批处理)
   - 分批邮件发送 (每小时 100-200 封)

2. RATE LIMITING (限速)
   - SerpAPI: 100 req/month (free tier)
   - Hunter.io: 会根据 API plan 限制
   - ZeroBounce: 根据 subscription
   - OpenAI: token/min limits
   - Resend: 邮箱域名信誉保护

3. DATABASE OPTIMIZATION
   - 索引: country + industry_type, email_status
   - 分区: EmailActivity 按 created_at 分月
   - 定期清理黑名单

4. CACHING
   - Redis 缓存 GeoIP 查询
   - 缓存 Hunter.io 已查询的域名
   - Campaign 统计数据缓存


# ==================== 关键配置 ====================

smtp_config = {
    # Domain rotation for sending
    'sending_domains': [
        'mail1.afore.it',
        'mail2.afore.it',
        'mail3.afore.it',
        'mail4.afore.it'
    ],
    
    # Rate limits (per domain per hour)
    'daily_limits': {
        'mail1.afore.it': 100,
        'mail2.afore.it': 100,
        'mail3.afore.it': 100,
        'mail4.afore.it': 100
    },
    
    # Timezone-aware scheduling
    'optimal_send_times': {
        'DE': '09:00',  # Berlin time
        'PL': '09:00',  # Warsaw time
        'DK': '09:00'   # Copenhagen time
    },
    
    # GDPR settings
    'include_unsubscribe_link': True,
    'privacy_policy_url': 'https://afore.it/privacy',
    'gdpr_compliant': True
}


# ==================== 关键指标 ====================

TARGET KPIs (for European market):

1. ACQUISITION
   - Leads discovered: 5,000+ per month
   - Email discovery rate: 70%+ (companies with email found)
   - Valid email rate: 60%+ (after ZeroBounce validation)

2. ENGAGEMENT
   - Delivery rate: 95%+ (邮件送达)
   - Open rate: 25-35% (行业基准)
   - Click rate: 5-8%
   - Reply rate: 2-5% (cold email industry average)

3. CONVERSION
   - Meeting rate: 15-25% of replies
   - Close rate: 5-10% (依赖销售流程)

4. COMPLIANCE
   - Bounce rate: <3%
   - Spam complaints: <0.1%
   - Unsubscribe rate: <0.5%


# ==================== 成本估算 (Monthly) ====================

Service                    | Free Tier      | Paid Tier        | Cost/Month
---------------------------|----------------|------------------|----------
SerpAPI (Google Maps)      | 100 queries    | 100k queries     | ~$50-100
Hunter.io                  | Limited        | 50k/month        | $100-300
ZeroBounce                 | Limited        | 100k/month       | $100-200
OpenAI (GPT-4o)            | $5 credit      | Pay-as-you-go    | $50-200
Resend (Email sending)     | 100 emails     | Unlimited        | $20-100
PostgreSQL (hosting)       | Free (AWS)     | Small instance   | $15-50
Redis (AWS)                | Free (AWS)     | Small instance   | $10-30
AWS Compute (Fargate)      | Free tier      | Small instance   | $20-50

TOTAL (Monthly): ~$365-930


# ==================== 最后的思路确认 ====================

这套系统可以帮助你：

✅ 自动化地发现德国、波兰、丹麦的安装商和分销商

✅ 验证邮箱有效性，保护域名信誉

✅ 用 AI 生成多语言、个性化的冷邮件

✅ 通过邮箱轮换避免被标记为垃圾邮件

✅ 前台订阅系统收集自有数据

✅ 完整的追踪和分析系统

✅ GDPR 合规的退订机制

✅ Celery 异步处理，支持大规模运营


你有什么问题或想调整的地方吗？
比如：
- 是否要添加人工审核步骤？
- 邮件发送频率应该怎么设？
- 想要怎样的 UI 界面管理活动？
"""

print(__doc__)
