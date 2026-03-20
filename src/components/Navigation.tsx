import { useEffect, useState } from 'react';
import { initLanguage, setCurrentLanguage } from '../lib/language';
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
          className="w-full h-[100svh] flex flex-col overflow-hidden px-6 pt-8 pb-12"
          showCloseButton={false}
        >
          <div className="flex items-center justify-between mb-10">
            <div className="text-3xl font-semibold tracking-tight">{getMessage('menu.title')}</div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-4xl leading-none text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Menü schließen"
            >
              ×
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            {navLinks.map(({ path, label }) => (
              <a
                key={path}
                href={href(path)}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-lg px-6 py-6 text-xl font-medium transition-all hover:bg-primary/10 hover:text-primary active:bg-primary/20"
              >
                {path === '/' && getMessage('menu.home')}
                {(path === '/projekte' || path === '/projects') && getMessage('menu.projects')}
                {(path === '/ueber-mich' || path === '/about') && getMessage('menu.about')}
                {(path === '/kontakt' || path === '/contact') && getMessage('menu.contact')}
              </a>
            ))}
          </nav>

          <div className="my-8 pt-8 border-t border-border">
            <p className="mb-8 text-sm text-muted-foreground font-medium">{getMessage('menu.appearance')}</p>
            <div className="flex gap-3 justify-center mb-12">
              <Toggle
                pressed={theme === 'light'}
                onPressedChange={() => applyTheme('light')}
                className="flex flex-col items-center gap-3 h-auto px-6 py-5 rounded-lg border border-border data-[state=on]:bg-muted data-[state=on]:border-primary"
                aria-label={getMessage('theme.light')}
              >
                <Sun className="h-6 w-6" />
                <span className="text-xs font-medium text-center">{getMessage('theme.light')}</span>
              </Toggle>

              <Toggle
                pressed={theme === 'dark'}
                onPressedChange={() => applyTheme('dark')}
                className="flex flex-col items-center gap-3 h-auto px-6 py-5 rounded-lg border border-border data-[state=on]:bg-muted data-[state=on]:border-primary"
                aria-label={getMessage('theme.dark')}
              >
                <Moon className="h-6 w-6" />
                <span className="text-xs font-medium text-center">{getMessage('theme.dark')}</span>
              </Toggle>

              <Toggle
                pressed={theme === 'system'}
                onPressedChange={() => applyTheme('system')}
                className="flex flex-col items-center gap-3 h-auto px-6 py-5 rounded-lg border border-border data-[state=on]:bg-muted data-[state=on]:border-primary"
                aria-label={getMessage('theme.system')}
              >
                <Monitor className="h-6 w-6" />
                <span className="text-xs font-medium text-center">{getMessage('theme.system')}</span>
              </Toggle>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex justify-center gap-8 text-lg font-medium">
              <button
                onClick={() => switchLanguage('de')}
                className={`rounded-full px-8 py-3 transition-all ${locale === 'de' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/10'}`}
              >
                DE
              </button>
              <button
                onClick={() => switchLanguage('en')}
                className={`rounded-full px-8 py-3 transition-all ${locale === 'en' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/10'}`}
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
