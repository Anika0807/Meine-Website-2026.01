import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { initLanguage, setCurrentLanguage } from '../lib/language';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

const navTranslations: Record<string, { path: string; label: string }[]> = {
  de: [
    { path: '/', label: 'Home' },
    { path: '/projekte', label: 'Projekte' },
    { path: '/ueber-mich', label: 'Über mich' },
    { path: '/kontakt', label: 'Kontakt' },
  ],
  en: [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/about', label: 'About me' },
    { path: '/contact', label: 'Contact' },
  ],
};

const menuTranslations: Record<string, Record<string, string>> = {
  de: {
    'menu.title': 'Menü',
    'menu.home': 'Home',
    'menu.projects': 'Projekte',
    'menu.about': 'Über mich',
    'menu.contact': 'Kontakt',
    'menu.appearance': 'Erscheinungsbild',
    'theme.light': 'Hell',
    'theme.dark': 'Dunkel',
    'theme.system': 'System',
  },
  en: {
    'menu.title': 'Menu',
    'menu.home': 'Home',
    'menu.projects': 'Projects',
    'menu.about': 'About me',
    'menu.contact': 'Contact',
    'menu.appearance': 'Appearance',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',
  },
};

export default function Navigation() {
  const [currentPath, setCurrentPath] = useState('');
  const [locale, setLocale] = useState('de');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    setCurrentPath(path.replace('/en', '') || '/');
    setLocale(path.startsWith('/en') ? 'en' : 'de');
    setTheme((localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null) ?? 'system');
    setIsMounted(true);
    initLanguage();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = navTranslations[locale] ?? navTranslations['de'];
  const href = (path: string) => locale === 'en' ? `/en${path === '/' ? '' : path}` || '/en' : path;

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/' || currentPath === '';
    return currentPath.startsWith(path);
  };

  const mapLocalizedPath = (path: string, targetLang: 'de' | 'en') => {
    const normalized = path.startsWith('/en') ? path.replace(/^\/en/, '') || '/' : path;

    if (targetLang === 'en') {
      if (normalized.startsWith('/projekte/')) return `/en/projects/${normalized.replace('/projekte/', '')}`;
      if (normalized === '/kontakt') return '/en/contact';
      if (normalized === '/ueber-mich') return '/en/about';
      if (normalized === '/projekte') return '/en/projects';
      return normalized === '/' ? '/en' : `/en${normalized}`;
    }

    if (normalized.startsWith('/projects/')) return `/projekte/${normalized.replace('/projects/', '')}`;
    if (normalized === '/contact') return '/kontakt';
    if (normalized === '/about') return '/ueber-mich';
    if (normalized === '/projects') return '/projekte';
    return normalized;
  };

  const switchLanguage = (newLang: 'de' | 'en') => {
    setCurrentLanguage(newLang);
    setLocale(newLang);
    setIsMobileMenuOpen(false);
    const newPath = mapLocalizedPath(window.location.pathname, newLang);
    window.location.href = newPath;
  };

  const applyTheme = (mode: 'light' | 'dark' | 'system') => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = mode === 'dark' || (mode === 'system' && prefersDark);
    localStorage.setItem('theme', mode);
    document.documentElement.classList.toggle('dark', isDark);
    setTheme(mode);
    setIsMobileMenuOpen(false);
  };

  const linkClass = (path: string) =>
    `nav-link text-foreground transition-colors duration-200 ${
      isActive(path)
        ? 'font-semibold text-primary underline underline-offset-8 decoration-2 decoration-primary'
        : 'hover:text-primary hover:underline hover:underline-offset-8 hover:decoration-primary/70'
    }`;

  const getMessage = (key: string) => menuTranslations[locale]?.[key] ?? key;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <NavigationMenu>
          <NavigationMenuList className="gap-6">
            {navLinks.map(({ path, label }) => (
              <NavigationMenuItem key={path}>
                <NavigationMenuLink href={href(path)} className={linkClass(path)}>
                  {label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </nav>

      {/* Mobile Hamburger */}
      <>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 md:hidden"
          aria-label="Menü öffnen"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" strokeWidth={3.5} />
        </Button>

        {isMounted && createPortal(
          <div
            id="mobile-menu"
            className={`fixed inset-0 z-[80] bg-background md:hidden ${isMobileMenuOpen ? 'flex flex-col' : 'hidden'}`}
          >
            <div className="flex items-center justify-between border-b border-border/50 px-6 pt-12 pb-6">
              <div className="text-3xl font-semibold tracking-tight">{getMessage('menu.title')}</div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-4xl leading-none text-muted-foreground"
                aria-label="Menü schließen"
              >
                ×
              </button>
            </div>

            <nav className="flex-1 space-y-2 px-6 py-10">
              {navLinks.map(({ path, label }) => (
                <a
                  key={path}
                  href={href(path)}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-btn px-6 py-7 text-2xl font-medium transition-all hover:bg-primary/10 hover:text-primary"
                >
                  {path === '/' && getMessage('menu.home')}
                  {(path === '/projekte' || path === '/projects') && getMessage('menu.projects')}
                  {(path === '/ueber-mich' || path === '/about') && getMessage('menu.about')}
                  {(path === '/kontakt' || path === '/contact') && getMessage('menu.contact')}
                </a>
              ))}
            </nav>

            <div className="px-6 pb-20">
              <p className="mb-6 text-sm text-muted-foreground">{getMessage('menu.appearance')}</p>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => applyTheme('light')}
                  className={`flex flex-col items-center gap-4 rounded-btn border py-8 transition-all ${theme === 'light' ? 'border-primary' : 'border-border hover:border-primary'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="text-base font-medium">{getMessage('theme.light')}</span>
                </button>

                <button
                  onClick={() => applyTheme('dark')}
                  className={`flex flex-col items-center gap-4 rounded-btn border py-8 transition-all ${theme === 'dark' ? 'border-primary' : 'border-border hover:border-primary'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span className="text-base font-medium">{getMessage('theme.dark')}</span>
                </button>

                <button
                  onClick={() => applyTheme('system')}
                  className={`flex flex-col items-center gap-4 rounded-btn border py-8 transition-all ${theme === 'system' ? 'border-primary' : 'border-border hover:border-primary'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2" />
                  </svg>
                  <span className="text-base font-medium">{getMessage('theme.system')}</span>
                </button>
              </div>
            </div>

            <div className="border-t px-6 pb-14 pt-8">
              <div className="flex justify-center gap-8 text-lg font-medium">
                <button
                  onClick={() => switchLanguage('de')}
                  className="rounded-full px-10 py-4 transition-colors hover:bg-accent/10"
                >
                  DE
                </button>
                <button
                  onClick={() => switchLanguage('en')}
                  className="rounded-full px-10 py-4 transition-colors hover:bg-accent/10"
                >
                  EN
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </>
    </>
  );
}
