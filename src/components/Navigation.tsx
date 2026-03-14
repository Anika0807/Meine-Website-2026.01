import { useEffect, useState } from 'react';
import { initLanguage } from '../lib/language';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Menu, X } from 'lucide-react';
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
    { path: '/projekte', label: 'Projects' },
    { path: '/ueber-mich', label: 'About me' },
    { path: '/contact', label: 'Contact' },
  ],
};

export default function Navigation() {
  const [currentPath, setCurrentPath] = useState('');
  const [locale, setLocale] = useState('de');

  useEffect(() => {
    const path = window.location.pathname;
    setCurrentPath(path.replace('/en', '') || '/');
    setLocale(path.startsWith('/en') ? 'en' : 'de');
    initLanguage();
  }, []);

  const navLinks = navTranslations[locale] ?? navTranslations['de'];
  const href = (path: string) => locale === 'en' ? `/en${path === '/' ? '' : path}` || '/en' : path;

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/' || currentPath === '';
    return currentPath.startsWith(path);
  };

  const linkClass = (path: string) =>
    `text-foreground transition-colors duration-200 ${
      isActive(path)
        ? 'font-semibold text-primary underline underline-offset-8 decoration-2 decoration-primary'
        : 'hover:text-primary hover:underline hover:underline-offset-8 hover:decoration-primary/70'
    }`;

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
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" aria-label="Menü öffnen">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="w-[300px] sm:w-[380px] bg-background border-l border-border p-0 overflow-y-auto transition-transform duration-300 ease-in-out"
        >
          <div className="flex flex-col h-full">
            {/* Header mit Close-Button */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Anika Warncke</h2>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" aria-label="Menü schließen">
                  <X className="h-6 w-6" />
                </Button>
              </SheetClose>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col p-6 gap-2 flex-1">
              {navLinks.map(({ path, label }) => (
                <SheetClose asChild key={path}>
                  <a
                    href={href(path)}
                    className={`text-lg py-3 px-2 rounded-lg transition-colors ${
                      isActive(path)
                        ? 'font-semibold text-primary bg-primary/10'
                        : 'text-foreground hover:text-primary hover:bg-muted'
                    }`}
                  >
                    {label}
                  </a>
                </SheetClose>
              ))}
            </nav>

            {/* Footer im Sheet */}
            <div className="p-6 border-t border-border flex items-center justify-between">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
