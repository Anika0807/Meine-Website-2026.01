import { cookieMaxAge, cookieName, setLocale, localStorageKey } from '../paraglide/runtime.js';

export type Language = 'de' | 'en';

const projectSlugs = new Set([
  'my-mind-studio',
  'naturkompass',
  'festsaal-im-klostergasthof',
  'flavorfusion',
  'schlaf',
  'omnomzen',
  'weserkoje',
  'planora',
]);

const normalizePathname = (pathname: string) => {
  if (!pathname) return '/';
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
};

export function mapLocalizedPath(pathname: string, targetLang: 'de' | 'en') {
  let path = normalizePathname(pathname);

  // Legacy route compatibility: /projekte/en/<slug> -> /en/projects/<slug>
  if (path.startsWith('/projekte/en/')) {
    const slug = path.replace('/projekte/en/', '');
    path = `/en/projects/${slug}`;
  }

  if (targetLang === 'en') {
    if (path === '/' || path === '/en') return '/en';

    if (path.startsWith('/en/projects/')) return path;
    if (path.startsWith('/projekte/')) return `/en/projects/${path.replace('/projekte/', '')}`;

    if (path.startsWith('/en/')) {
      const maybeLegacyProject = path.replace('/en/', '');
      if (projectSlugs.has(maybeLegacyProject)) return `/en/projects/${maybeLegacyProject}`;
      return path;
    }

    if (path === '/kontakt') return '/en/contact';
    if (path === '/ueber-mich') return '/en/about';
    if (path === '/projekte') return '/en/projects';
    if (path === '/impressum') return '/en/impressum';
    if (path === '/datenschutz') return '/en/datenschutz';

    return `/en${path}`;
  }

  if (path === '/en') return '/';
  if (path.startsWith('/en/projects/')) return `/projekte/${path.replace('/en/projects/', '')}`;

  // Legacy route compatibility: /en/<project-slug> -> /projekte/<project-slug>
  if (path.startsWith('/en/')) {
    const remainder = path.replace('/en/', '');
    if (projectSlugs.has(remainder)) return `/projekte/${remainder}`;
    if (remainder === 'contact') return '/kontakt';
    if (remainder === 'about') return '/ueber-mich';
    if (remainder === 'projects' || remainder === 'projekte') return '/projekte';
    return `/${remainder}`;
  }

  if (path.startsWith('/projects/')) return `/projekte/${path.replace('/projects/', '')}`;
  if (path === '/contact') return '/kontakt';
  if (path === '/about') return '/ueber-mich';
  if (path === '/projects') return '/projekte';

  return path;
}

export function getLanguageFromPathname(pathname: string): Language {
  return normalizePathname(pathname).startsWith('/en') ? 'en' : 'de';
}

export function setCurrentLanguage(lang: Language) {
  setLocale(lang);

  if (typeof window === 'undefined') return;

  localStorage.setItem(localStorageKey, lang);
  localStorage.setItem('lang', lang);
  document.cookie = `${cookieName}=${lang}; path=/; max-age=${cookieMaxAge}; samesite=lax`;
  document.cookie = `lang=${lang}; path=/; max-age=${cookieMaxAge}; samesite=lax`;
}

export function initLanguage() {
  setCurrentLanguage(getLanguageFromPathname(window.location.pathname));
}
