import { useEffect, useState } from 'react';
import { getLanguageFromPathname, mapLocalizedPath, setCurrentLanguage } from '../lib/language';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Toggle } from '@/components/ui/toggle';
import { Menu, Sun, Moon, Monitor } from 'lucide-react';
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
    const pathname = window.location.pathname;
    const currentLocale = getLanguageFromPathname(pathname);
    const normalizedPath = currentLocale === 'en'
      ? pathname.replace(/^\/en(?=\/|$)/, '') || '/'
      : pathname;
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null) ?? 'system';

    setCurrentPath(normalizedPath);
    setLocale(currentLocale);
    setTheme(savedTheme);
    setCurrentLanguage(currentLocale);
    setIsMounted(true);

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
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            aria-label="Menü öffnen"
          >
            <Menu className="h-6 w-6" strokeWidth={3.5} />
          </Button>
        </SheetTrigger>
        
        <SheetContent 
          side="top" 
          className="w-full h-[100svh] flex flex-col overflow-y-auto overscroll-contain px-5 pt-[max(1rem,calc(env(safe-area-inset-top)+0.25rem))] pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+0.75rem))] sm:px-6"
          showCloseButton={false}
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="text-[1.75rem] font-semibold tracking-tight">{getMessage('menu.title')}</div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-3xl leading-none text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Menü schließen"
            >
              ×
            </button>
          </div>

          <nav className="space-y-1">
            {navLinks.map(({ path, label }) => (
              <a
                key={path}
                href={href(path)}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-lg px-5 py-3 text-lg font-medium transition-all hover:bg-primary/10 hover:text-primary active:bg-primary/20"
              >
                {path === '/' && getMessage('menu.home')}
                {(path === '/projekte' || path === '/projects') && getMessage('menu.projects')}
                {(path === '/ueber-mich' || path === '/about') && getMessage('menu.about')}
                {(path === '/kontakt' || path === '/contact') && getMessage('menu.contact')}
              </a>
            ))}
          </nav>

          <div className="mt-4 border-t border-border pt-4">
            <p className="mb-3 text-sm font-medium text-muted-foreground">{getMessage('menu.appearance')}</p>
            <div className="mb-4 grid grid-cols-3 gap-2">
              <Toggle
                pressed={theme === 'light'}
                onPressedChange={() => applyTheme('light')}
                className="flex h-auto min-w-0 flex-col items-center gap-2 rounded-lg border border-border px-3 py-4 data-[state=on]:border-primary data-[state=on]:bg-muted"
                aria-label={getMessage('theme.light')}
              >
                <Sun className="h-5 w-5" />
                <span className="text-xs font-medium text-center">{getMessage('theme.light')}</span>
              </Toggle>

              <Toggle
                pressed={theme === 'dark'}
                onPressedChange={() => applyTheme('dark')}
                className="flex h-auto min-w-0 flex-col items-center gap-2 rounded-lg border border-border px-3 py-4 data-[state=on]:border-primary data-[state=on]:bg-muted"
                aria-label={getMessage('theme.dark')}
              >
                <Moon className="h-5 w-5" />
                <span className="text-xs font-medium text-center">{getMessage('theme.dark')}</span>
              </Toggle>

              <Toggle
                pressed={theme === 'system'}
                onPressedChange={() => applyTheme('system')}
                className="flex h-auto min-w-0 flex-col items-center gap-2 rounded-lg border border-border px-3 py-4 data-[state=on]:border-primary data-[state=on]:bg-muted"
                aria-label={getMessage('theme.system')}
              >
                <Monitor className="h-5 w-5" />
                <span className="text-xs font-medium text-center">{getMessage('theme.system')}</span>
              </Toggle>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex justify-center gap-4 text-base font-medium">
              <button
                onClick={() => switchLanguage('de')}
                className={`rounded-full px-6 py-2.5 transition-all ${locale === 'de' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/10'}`}
              >
                DE
              </button>
              <button
                onClick={() => switchLanguage('en')}
                className={`rounded-full px-6 py-2.5 transition-all ${locale === 'en' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/10'}`}
              >
                EN
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
