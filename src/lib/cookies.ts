/**
 * Cookie管理工具函数
 * 用于处理Cookie Consent和Cookie存储
 */

export type CookiePreferences = {
  necessary: boolean; // 必要Cookie，始终为true
  analytics: boolean; // 分析Cookie
  marketing: boolean; // 营销Cookie
  functional: boolean; // 功能Cookie
};

export const COOKIE_NAMES = {
  CONSENT: 'afore_cookie_consent',
  PREFERENCES: 'afore_cookie_preferences',
} as const;

/**
 * 默认Cookie偏好设置
 */
export const DEFAULT_COOKIE_PREFERENCES: CookiePreferences = {
  necessary: true, // 必要Cookie始终启用
  analytics: false,
  marketing: false,
  functional: false,
};

/**
 * 检查是否在浏览器环境
 */
const isBrowser = typeof window !== 'undefined';

/**
 * 获取Cookie值
 */
export function getCookie(name: string): string | null {
  if (!isBrowser) return null;
  
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * 设置Cookie
 */
export function setCookie(
  name: string,
  value: string,
  days: number = 365,
  path: string = '/'
): void {
  if (!isBrowser) return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=${path};SameSite=Lax`;
}

/**
 * 删除Cookie
 */
export function deleteCookie(name: string, path: string = '/'): void {
  if (!isBrowser) return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path};`;
}

/**
 * 检查用户是否已经同意Cookie
 */
export function hasCookieConsent(): boolean {
  if (!isBrowser) return false;
  return getCookie(COOKIE_NAMES.CONSENT) === 'true';
}

/**
 * 获取用户Cookie偏好设置
 */
export function getCookiePreferences(): CookiePreferences {
  if (!isBrowser) return DEFAULT_COOKIE_PREFERENCES;
  
  const preferences = getCookie(COOKIE_NAMES.PREFERENCES);
  if (!preferences) return DEFAULT_COOKIE_PREFERENCES;
  
  try {
    const parsed = JSON.parse(preferences);
    return { ...DEFAULT_COOKIE_PREFERENCES, ...parsed };
  } catch {
    return DEFAULT_COOKIE_PREFERENCES;
  }
}

/**
 * 保存用户Cookie偏好设置
 */
export function setCookiePreferences(preferences: CookiePreferences): void {
  if (!isBrowser) return;
  
  // 确保必要Cookie始终为true
  const prefs = { ...preferences, necessary: true };
  
  setCookie(COOKIE_NAMES.PREFERENCES, JSON.stringify(prefs), 365);
  setCookie(COOKIE_NAMES.CONSENT, 'true', 365);
  
  // 触发自定义事件，通知其他组件
  window.dispatchEvent(new CustomEvent('cookiePreferencesUpdated', { detail: prefs }));
}

/**
 * 接受所有Cookie
 */
export function acceptAllCookies(): void {
  setCookiePreferences({
    necessary: true,
    analytics: true,
    marketing: true,
    functional: true,
  });
}

/**
 * 拒绝所有非必要Cookie
 */
export function rejectAllCookies(): void {
  setCookiePreferences({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  });
}

/**
 * 检查特定类型的Cookie是否被允许
 */
export function isCookieAllowed(type: keyof CookiePreferences): boolean {
  const preferences = getCookiePreferences();
  return preferences[type] === true;
}

