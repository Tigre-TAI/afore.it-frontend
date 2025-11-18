/**
 * React Hook for translations
 * 
 * 使用方法：
 * 'use client';
 * import { useTranslation } from '@/hooks/useTranslation';
 * 
 * export default function MyComponent() {
 *   const { t, lang } = useTranslation();
 *   return <h1>{t('nav.home')}</h1>;
 * }
 */

'use client';

import { useParams } from 'next/navigation';
import { getTranslations } from '@/lib/i18n';

export function useTranslation() {
  const params = useParams();
  const lang = (params?.lang as string) || 'it';
  const t = getTranslations(lang);

  return { t, lang };
}

