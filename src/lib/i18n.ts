/**
 * 国际化（i18n）工具函数
 * 
 * 使用方法：
 * import { getTranslations } from '@/lib/i18n';
 * const t = getTranslations('it');
 * const text = t('nav.home'); // "HOME"
 */

import itTranslations from '@/locales/it.json';
import enTranslations from '@/locales/en.json';
import esTranslations from '@/locales/es.json';

type TranslationKey = string;
type Translations = typeof itTranslations;

const translations: Record<string, Translations> = {
  it: itTranslations,
  en: enTranslations,
  es: esTranslations,
};

/**
 * 获取翻译函数
 * @param lang 语言代码 ('it' | 'en' | 'es')
 * @returns 翻译函数
 */
export function getTranslations(lang: string = 'it') {
  const validLang = ['it', 'en', 'es'].includes(lang) ? lang : 'it';
  const t = translations[validLang] || translations.it;

  /**
   * 翻译函数
   * @param key 翻译键，支持点号分隔的嵌套路径，如 'nav.home' 或 'prodotti.title'
   * @param params 可选的参数对象，用于替换占位符，如 {year: 2024}
   * @returns 翻译后的文本
   */
  return function translate(key: TranslationKey, params?: Record<string, string | number>): string {
    const keys = key.split('.');
    let value: any = t;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k as keyof typeof value];
      } else {
        // 如果找不到翻译，返回键本身（开发时便于发现缺失的翻译）
        console.warn(`Translation missing for key: ${key} in language: ${validLang}`);
        return key;
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string for key: ${key} in language: ${validLang}`);
      return key;
    }

    // 替换占位符，如 {year} -> 2024
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  };
}

/**
 * 获取所有支持的语言
 */
export function getSupportedLanguages(): string[] {
  return ['it', 'en', 'es'];
}

/**
 * 验证语言代码是否有效
 */
export function isValidLanguage(lang: string): boolean {
  return getSupportedLanguages().includes(lang);
}

