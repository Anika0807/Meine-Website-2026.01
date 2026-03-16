import de from '../messages/de.json';
import en from '../messages/en.json';

export type Locale = 'de' | 'en';
export const defaultLocale: Locale = 'de';
export const locales: Locale[] = ['de', 'en'];

const messages = { de, en } as const;

export function getLocaleFromUrl(url: URL): Locale {
  const [, first] = url.pathname.split('/');
  if (locales.includes(first as Locale)) return first as Locale;
  return defaultLocale;
}

export function t(locale: Locale, key: string): string {
  const current = messages[locale] as Record<string, string>;
  const fallback = messages[defaultLocale] as Record<string, string>;
  return current[key] ?? fallback[key] ?? key;
}
