/**
 * API 路由：处理客户问题并返回 FAQ 答案
 * POST /api/chatbot
 * 
 * 功能：
 * - 自动检测语言（意大利语/英语）
 * - WhatsApp真实客户对话数据库
 * - 智能回复和人工转接
 * - 完整的Afore联系信息
 */

import { NextRequest, NextResponse } from 'next/server';
import { findBestFAQ, detectLanguage, FAQ_DATA } from '@/data/faq';

export interface ChatbotRequest {
  question: string;
  language?: string; // 'it', 'en' - 如果不提供，自动检测
  isFirstMessage?: boolean; // 是否为对话的第一条消息
}

export interface ChatbotResponse {
  success: boolean;
  answer?: string;
  greeting?: string; // 自我介绍（仅第一条消息时）
  category?: string;
  suggestedFAQ?: string;
  needsHumanSupport: boolean;
  message?: string;
  contactInfo?: {
    email: string;
    officePhone: string;
    commercialPhone: string;
    supportPhoneWhatsapp: string;
  };
  detectedLanguage?: string;
}

// 多语言响应模板
const GREETINGS = {
  it: "Ciao! Sono l'assistente online di Afore Italia, disponibile 24 ore su 24, 7 giorni su 7, per risolvere ogni tua necessità. 😊\n\nCome posso aiutarti oggi?",
  en: "Hello! I'm Afore Italia's online assistant, available 24/7 to help you with any questions. 😊\n\nHow can I help you today?",
};

const NO_MATCH_MESSAGES = {
  it: "Mi dispiace, non ho trovato una risposta diretta nel nostro database. Tuttavia, il nostro team di supporto è disponibile per assisterti:",
  en: "I apologize, I couldn't find a direct answer in our database. However, our support team is available to assist you:",
};

const CONTACT_INFO = {
  email: "afore@aforeitaly.com",
  officePhone: "+39 06 40419655",
  commercialPhone: "+39 351 3399999",
  supportPhoneWhatsapp: "+39 389 431 3885 (Solo WhatsApp)",
};

const CONTACT_FORMAT = {
  it: `📧 Email: ${CONTACT_INFO.email}
📞 Ufficio: ${CONTACT_INFO.officePhone}
💼 Ufficio Commerciale: ${CONTACT_INFO.commercialPhone}
💬 Assistenza WhatsApp: ${CONTACT_INFO.supportPhoneWhatsapp}`,
  en: `📧 Email: ${CONTACT_INFO.email}
📞 Office: ${CONTACT_INFO.officePhone}
💼 Commercial: ${CONTACT_INFO.commercialPhone}
💬 Support WhatsApp: ${CONTACT_INFO.supportPhoneWhatsapp}`,
};

export async function POST(request: NextRequest): Promise<NextResponse<ChatbotResponse>> {
  try {
    const body: ChatbotRequest = await request.json();
    let { question, language, isFirstMessage = false } = body;

    // 验证输入
    if (!question || question.trim().length === 0) {
      return NextResponse.json({
        success: false,
        message: language === 'it' 
          ? 'Per favore fornisci una domanda valida' 
          : 'Please provide a valid question',
        needsHumanSupport: false,
      }, { status: 400 });
    }

    // 自动检测语言（如果未提供）
    if (!language) {
      language = detectLanguage(question);
    }

    // 查找最匹配的 FAQ
    const bestMatch = findBestFAQ(question, language, 0.4);

    const response: ChatbotResponse = {
      success: true,
      needsHumanSupport: false,
      detectedLanguage: language,
    };

    // 如果是第一条消息，添加自我介绍
    if (isFirstMessage) {
      response.greeting = GREETINGS[language as keyof typeof GREETINGS] || GREETINGS.it;
    }

    if (bestMatch) {
      // 找到了匹配的 FAQ
      response.answer = bestMatch.answer;
      response.category = bestMatch.category;
      response.suggestedFAQ = bestMatch.question;
    } else {
      // 没有找到匹配的 FAQ，建议联系人工支持
      response.message = NO_MATCH_MESSAGES[language as keyof typeof NO_MATCH_MESSAGES] || NO_MATCH_MESSAGES.it;
      response.needsHumanSupport = true;
      response.contactInfo = CONTACT_INFO;
      
      // 添加格式化的联系方式
      response.answer = CONTACT_FORMAT[language as keyof typeof CONTACT_FORMAT];
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Chatbot API Error:', error);
    return NextResponse.json({
      success: false,
      message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      needsHumanSupport: true,
    }, { status: 500 });
  }
}

/**
 * GET 路由：返回所有 FAQ（用于前端初始化或调试）
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    success: true,
    faqCount: FAQ_DATA.length,
    categories: [...new Set(FAQ_DATA.map(f => f.category))],
  }, { status: 200 });
}
