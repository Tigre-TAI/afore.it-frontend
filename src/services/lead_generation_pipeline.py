"""
Cold Email Lead Generation System - Core Business Logic
整合 API 的完整工作流：抓取 -> 验证 -> AI 撰写 -> 发送
"""

import asyncio
import aiohttp
import logging
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Tuple
from enum import Enum
import json
from abc import ABC, abstractmethod

import httpx
import openai
from pydantic import EmailStr

logger = logging.getLogger(__name__)


# ==================== API 客户端 ====================

class GoogleMapsLeadScraper:
    """Google Maps 数据抓取器 - 获取安装商和分销商"""
    
    def __init__(self, serp_api_key: str):
        self.serp_api_key = serp_api_key
        self.base_url = "https://serpapi.com/search"
    
    async def scrape_installers_by_location(
        self,
        country_code: str,
        keywords: List[str] = None,
        limit: int = 50
    ) -> List[Dict]:
        """
        抓取特定国家的太阳能安装商
        
        Args:
            country_code: 国家代码 (DE, PL, DK)
            keywords: 搜索关键词 ['solar installer', 'photovoltaic installer']
            limit: 返回结果数量
        
        Returns:
            安装商列表，包含 name, address, phone, website, coordinates
        """
        if keywords is None:
            keywords = ['solar installer', 'photovoltaic installer', 'Solaranlagen Installateur']
        
        # 国家映射
        location_map = {
            'DE': 'Germany',
            'PL': 'Poland',
            'DK': 'Denmark',
        }
        
        results = []
        
        try:
            async with httpx.AsyncClient() as client:
                for keyword in keywords:
                    query = f"{keyword} {location_map.get(country_code)}"
                    
                    params = {
                        'q': query,
                        'api_key': self.serp_api_key,
                        'type': 'places',
                        'num': limit,
                    }
                    
                    logger.info(f"Scraping Google Maps: {query}")
                    response = await client.get(self.base_url, params=params)
                    
                    if response.status_code == 200:
                        data = response.json()
                        
                        # 解析 Google Maps 结果
                        for place in data.get('places_results', []):
                            company_data = {
                                'name': place.get('title'),
                                'country': country_code,
                                'city': place.get('address', '').split(',')[-2].strip(),
                                'phone': place.get('phone'),
                                'website': place.get('website'),
                                'google_maps_url': place.get('link'),
                                'business_id': place.get('place_id'),
                                'latitude': place.get('coordinates', {}).get('latitude'),
                                'longitude': place.get('coordinates', {}).get('longitude'),
                                'rating': place.get('rating'),
                                'description': place.get('review_summary', ''),
                                'industry_type': 'solar_installer',  # 分类
                            }
                            results.append(company_data)
                    else:
                        logger.error(f"SerpAPI Error: {response.status_code}")
            
            return results
            
        except Exception as e:
            logger.error(f"Google Maps scraping error: {str(e)}")
            return []


class HunterEmailDiscovery:
    """Hunter.io 邮箱发现工具"""
    
    def __init__(self, hunter_api_key: str):
        self.hunter_api_key = hunter_api_key
        self.base_url = "https://api.hunter.io/v2"
    
    async def find_emails_by_domain(self, domain: str) -> List[Dict]:
        """
        根据公司域名查找公司内邮箱
        
        Returns:
            邮箱列表，包含 email, first_name, last_name, title, confidence
        """
        try:
            async with httpx.AsyncClient() as client:
                url = f"{self.base_url}/domain-search"
                params = {
                    'domain': domain,
                    'api_key': self.hunter_api_key,
                }
                
                logger.info(f"Discovering emails for domain: {domain}")
                response = await client.get(url, params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    emails = []
                    
                    for email_data in data.get('data', {}).get('emails', []):
                        emails.append({
                            'email': email_data.get('value'),
                            'first_name': email_data.get('first_name'),
                            'last_name': email_data.get('last_name'),
                            'title': email_data.get('position'),
                            'confidence': email_data.get('confidence'),  # 0-100
                            'phone': email_data.get('phone'),
                            'linkedin_url': email_data.get('linkedin_url'),
                        })
                    
                    return emails
                else:
                    logger.error(f"Hunter.io Error: {response.status_code} - {response.text}")
                    return []
                    
        except Exception as e:
            logger.error(f"Hunter email discovery error: {str(e)}")
            return []


class ZeroBounceEmailVerifier:
    """ZeroBounce 邮箱验证工具 - 确保域名信誉"""
    
    def __init__(self, zeroBounce_api_key: str):
        self.zeroBounce_api_key = zeroBounce_api_key
        self.base_url = "https://api.zerobounce.net/v2"
    
    async def validate_email(self, email: str, ip_address: Optional[str] = None) -> Dict:
        """
        验证单个邮箱的有效性
        
        Returns:
            {
                'status': 'valid' | 'invalid' | 'catch-all' | 'unknown' | 'spamtrap' | 'abuse',
                'sub_status': 详细状态,
                'confidence': 0-100
            }
        """
        try:
            async with httpx.AsyncClient() as client:
                url = f"{self.base_url}/validate"
                params = {
                    'api_key': self.zeroBounce_api_key,
                    'email': email,
                }
                
                if ip_address:
                    params['ip_address'] = ip_address
                
                response = await client.get(url, params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        'email': email,
                        'status': data.get('status'),  # valid, invalid, catch-all, unknown
                        'sub_status': data.get('sub_status'),
                        'confidence': 100 if data.get('status') == 'valid' else 0,
                        'is_catch_all': data.get('status') == 'catch-all',
                        'is_spamtrap': data.get('status') == 'spamtrap',
                        'is_abuse': data.get('status') == 'abuse',
                    }
                else:
                    logger.error(f"ZeroBounce Error: {response.status_code}")
                    return {'email': email, 'status': 'unknown', 'confidence': 0}
                    
        except Exception as e:
            logger.error(f"Email verification error: {str(e)}")
            return {'email': email, 'status': 'unknown', 'confidence': 0}
    
    async def batch_validate_emails(self, emails: List[str]) -> List[Dict]:
        """批量验证邮箱"""
        tasks = [self.validate_email(email) for email in emails]
        return await asyncio.gather(*tasks)


class OpenAIEmailGenerator:
    """GPT-4o 个性化邮件生成器"""
    
    def __init__(self, openai_api_key: str):
        openai.api_key = openai_api_key
        self.model = "gpt-4o"
    
    async def generate_personalized_email(
        self,
        company_name: str,
        contact_name: str,
        contact_title: str,
        company_description: str,
        language: str = 'en',
        context: Optional[Dict] = None
    ) -> Tuple[str, str]:
        """
        根据公司信息生成个性化的冷邮件开头
        
        Args:
            company_name: 公司名称
            contact_name: 联系人名称
            contact_title: 联系人职位
            company_description: 公司描述（从 Google Maps 抓取）
            language: 目标语言 (de, pl, en)
            context: 额外上下文，如展会名称、优惠期限等
        
        Returns:
            (subject, body) - 邮件主题和内容
        
        示例：展会后续跟进、时间限制等
        """
        
        language_names = {
            'de': 'German',
            'pl': 'Polish',
            'en': 'English',
        }
        
        # 构建 context 提示词
        context_prompt = ""
        if context:
            if context.get('urgency'):
                context_prompt += f"\nCreate a sense of urgency with the mentioned deadline: {context.get('urgency')}"
            if context.get('trade_show'):
                context_prompt += f"\nThis is a follow-up after {context.get('trade_show')} trade show"
            if context.get('special_offer'):
                context_prompt += f"\nMention this special offer: {context.get('special_offer')}"
        
        system_prompt = f"""You are an expert B2B sales copywriter specializing in the renewable energy sector.
Your task is to write a highly personalized, professional cold email in {language_names.get(language, 'English')}.

The email should:
1. Start with a compelling ice-breaker that references specific details about their business
2. Be concise (150-200 words)
3. Include a clear call-to-action
4. Maintain a professional but friendly tone
5. Include subtle urgency if context requires it{context_prompt}

IMPORTANT: The entire email must be in {language_names.get(language, 'English')}. 
Do NOT mix languages.

Format your response as JSON with keys: "subject" and "body"
"""
        
        user_prompt = f"""
Company: {company_name}
Contact Person: {contact_name}
Title: {contact_title}
About their business: {company_description}

Generate a personalized cold email that would resonate with {contact_name} and encourage them to respond.
"""
        
        try:
            response = await asyncio.to_thread(
                openai.ChatCompletion.create,
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=500,
            )
            
            content = response['choices'][0]['message']['content']
            result = json.loads(content)
            
            return result.get('subject', ''), result.get('body', '')
            
        except Exception as e:
            logger.error(f"GPT-4o generation error: {str(e)}")
            return "Contact from Afore", "Hello, we would like to discuss partnership opportunities."


# ==================== 核心业务流程 ====================

class LeadGenPipeline:
    """完整的获客流程：抓取 -> 验证 -> AI 撰写"""
    
    def __init__(
        self,
        serp_api_key: str,
        hunter_api_key: str,
        zeroBounce_api_key: str,
        openai_api_key: str
    ):
        self.scraper = GoogleMapsLeadScraper(serp_api_key)
        self.hunter = HunterEmailDiscovery(hunter_api_key)
        self.verifier = ZeroBounceEmailVerifier(zeroBounce_api_key)
        self.email_gen = OpenAIEmailGenerator(openai_api_key)
    
    async def scrape_and_enrich_leads(
        self,
        countries: List[str] = ['DE', 'PL', 'DK'],
        industries: Optional[List[str]] = None,
        limit_per_country: int = 50
    ) -> List[Dict]:
        """
        第一步：抓取公司 + 基础信息
        
        Returns:
            enriched_leads: 包含公司信息的潜在客户列表
        """
        
        all_leads = []
        
        for country in countries:
            logger.info(f"Scraping leads for {country}...")
            companies = await self.scraper.scrape_installers_by_location(
                country_code=country,
                limit=limit_per_country
            )
            
            all_leads.extend(companies)
        
        logger.info(f"Total leads scraped: {len(all_leads)}")
        return all_leads
    
    async def discover_and_verify_emails(
        self,
        companies: List[Dict]
    ) -> List[Dict]:
        """
        第二步：邮箱发现 + ZeroBounce 验证
        
        Workflow:
        1. 从公司网站域名提取
        2. 用 Hunter.io 查找决策人邮箱
        3. 用 ZeroBounce 验证邮箱有效性
        4. 只保留 "valid" 状态的邮箱
        
        Returns:
            enriched_contacts: 包含验证过邮箱的联系人列表
        """
        
        enriched_contacts = []
        
        for company in companies:
            if not company.get('website'):
                logger.warning(f"No website for {company.get('name')}, skipping...")
                continue
            
            # 提取域名
            domain = company['website'].replace('https://', '').replace('http://', '').split('/')[0]
            
            # 查找邮箱
            logger.info(f"Discovering emails for {company.get('name')} ({domain})...")
            emails = await self.hunter.find_emails_by_domain(domain)
            
            if not emails:
                logger.warning(f"No emails found for {domain}")
                continue
            
            # 验证邮箱
            verified_emails = await self.verifier.batch_validate_emails(
                [email['email'] for email in emails]
            )
            
            # 合并验证结果
            email_map = {v['email']: v for v in verified_emails}
            
            for email_data in emails:
                verification = email_map.get(email_data['email'], {})
                
                # 只添加有效的邮箱
                if verification.get('status') == 'valid':
                    contact = {
                        **email_data,
                        'company': company,
                        'verification_status': verification.get('status'),
                        'is_catch_all': verification.get('is_catch_all'),
                        'zeroBounce_confidence': verification.get('confidence'),
                    }
                    enriched_contacts.append(contact)
                    logger.info(f"✅ Valid email found: {email_data['email']}")
                else:
                    logger.warning(f"❌ Invalid email: {email_data['email']} ({verification.get('status')})")
        
        logger.info(f"Total verified contacts: {len(enriched_contacts)}")
        return enriched_contacts
    
    async def generate_personalized_emails(
        self,
        contacts: List[Dict],
        language_map: Dict[str, str] = None,
        context: Optional[Dict] = None
    ) -> List[Dict]:
        """
        第三步：GPT-4o 生成个性化邮件内容
        
        Args:
            contacts: 验证过的联系人列表
            language_map: 国家代码 -> 语言的映射 {'DE': 'de', 'PL': 'pl', 'DK': 'en'}
            context: 邮件上下文 {'urgency': '2 weeks', 'trade_show': 'Intersolar 2026'}
        
        Returns:
            personalized_emails: 包含生成的邮件内容
        """
        
        if language_map is None:
            language_map = {
                'DE': 'de',
                'PL': 'pl',
                'DK': 'en',  # 丹麦优先使用英文
            }
        
        personalized_emails = []
        
        for contact in contacts:
            company = contact.get('company', {})
            country = company.get('country', 'DE')
            language = language_map.get(country, 'en')
            
            logger.info(f"Generating email for {contact.get('first_name')} at {company.get('name')}...")
            
            subject, body = await self.email_gen.generate_personalized_email(
                company_name=company.get('name'),
                contact_name=contact.get('first_name', 'Valued Partner'),
                contact_title=contact.get('title', 'Manager'),
                company_description=company.get('description', ''),
                language=language,
                context=context or {}
            )
            
            personalized_email = {
                **contact,
                'subject': subject,
                'body': body,
                'language': language,
                'generated_at': datetime.utcnow().isoformat(),
            }
            personalized_emails.append(personalized_email)
        
        logger.info(f"Total personalized emails: {len(personalized_emails)}")
        return personalized_emails
    
    async def full_pipeline(
        self,
        countries: List[str] = ['DE', 'PL', 'DK'],
        limit_per_country: int = 50,
        language_map: Optional[Dict[str, str]] = None,
        context: Optional[Dict] = None
    ) -> List[Dict]:
        """
        完整流程：抓取 -> 邮箱发现 -> 验证 -> AI 撰写
        
        示例 context:
        {
            'urgency': '限时特价，2周内下单享受20%折扣',
            'trade_show': 'Intersolar Europe 2026',
            'special_offer': '免费现场评估'
        }
        """
        
        logger.info("=" * 60)
        logger.info("Starting Cold Email Lead Generation Pipeline")
        logger.info("=" * 60)
        
        # Step 1: 抓取和基础充实
        logger.info("\n[STEP 1] Scraping companies from Google Maps...")
        companies = await self.scrape_and_enrich_leads(
            countries=countries,
            limit_per_country=limit_per_country
        )
        
        # Step 2: 邮箱发现和验证
        logger.info("\n[STEP 2] Discovering and verifying emails...")
        contacts = await self.discover_and_verify_emails(companies)
        
        # Step 3: AI 个性化邮件生成
        logger.info("\n[STEP 3] Generating personalized emails with GPT-4o...")
        personalized_emails = await self.generate_personalized_emails(
            contacts,
            language_map=language_map,
            context=context
        )
        
        logger.info("\n" + "=" * 60)
        logger.info(f"Pipeline completed! Generated {len(personalized_emails)} ready-to-send emails")
        logger.info("=" * 60)
        
        return personalized_emails


# ==================== 使用示例 ====================

async def demo():
    """演示完整流程"""
    
    pipeline = LeadGenPipeline(
        serp_api_key="your_serp_api_key",
        hunter_api_key="your_hunter_api_key",
        zeroBounce_api_key="your_zeroBounce_api_key",
        openai_api_key="your_openai_api_key"
    )
    
    # 运行完整流程
    results = await pipeline.full_pipeline(
        countries=['DE', 'PL', 'DK'],
        limit_per_country=50,
        language_map={'DE': 'de', 'PL': 'pl', 'DK': 'en'},
        context={
            'urgency': '限时特价，2周内下单享受20%折扣',
            'trade_show': 'Intersolar Europe 2026',
            'special_offer': '免费现场评估 + 5年质保升级'
        }
    )
    
    # 输出结果示例
    if results:
        print("\n" + "=" * 60)
        print("SAMPLE OUTPUT")
        print("=" * 60)
        sample = results[0]
        print(f"\nCompany: {sample['company']['name']}")
        print(f"Contact: {sample['first_name']} ({sample['title']})")
        print(f"Email: {sample['email']}")
        print(f"Language: {sample['language']}")
        print(f"\nSubject: {sample['subject']}")
        print(f"\nBody:\n{sample['body']}")


# 运行
if __name__ == "__main__":
    asyncio.run(demo())
