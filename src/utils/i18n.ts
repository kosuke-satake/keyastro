
import type { URL } from 'url';

export type Lang = 'en' | 'ja';

/**
 * Detects the language from the URL.
 * Assumes the first path segment is the language code.
 * Defaults to 'en' if not found or invalid.
 */
export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang === 'ja') return 'ja';
  return 'en';
}

/**
 * Generates a localized link.
 * @param path The path starting with / (e.g., '/about')
 * @param lang The language code
 */
export function getLink(path: string, lang: Lang): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/${lang}${cleanPath}`;
}
