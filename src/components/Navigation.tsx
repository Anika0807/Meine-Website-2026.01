
import { useEffect, useState } from 'react';
import { initLanguage } from '../lib/language';
import { nav_home, nav_projects, nav_about, nav_contact } from '../paraglide/messages.js';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';


export default function Navigation() {
  const [currentPath, setCurrentPath] = useState('');
  const [locale, setLocale] = useState('de');

  useEffect(() => {
    const path = window.location.pathname;
    setCurrentPath(path.replace('/en', '') || '/');
    setLocale(path.startsWith('/en') ? 'en' : 'de');
    initLanguage();
  }, []);

  const href = (path: string) => locale === 'en' ? `/en${path === '/' ? '' : path}` || '/en' : path;

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/' || currentPath === '';
    return currentPath.startsWith(path);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <NavigationMenu>
          <NavigationMenuList className="gap-6">
            <NavigationMenuItem>
              <NavigationMenuLink
                href={href('/')}
                className={`text-foreground transition-colors duration-200 ${
                  isActive('/')
                    ? 'font-semibold text-primary underline underline-offset-8 decoration-2 decoration-primary'
                    : 'hover:text-primary hover:underline hover:underline-offset-8 hover:decoration-primary/70'
                }`}
              >
                {nav_home({})}
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href={href('/projekte')}
                className={`text-foreground transition-colors duration-200 ${
                  isActive('/projekte')
                    ? 'font-semibold text-primary underline underline-offset-8 decoration-2 decoration-primary'
                    : 'hover:text-primary hover:underline hover:underline-offset-8 hover:decoration-primary/70'
                }`}
              >
                {nav_projects({})}
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href={href('/ueber-mich')}
                className={`text-foreground transition-colors duration-200 ${
                  isActive('/ueber-mich')
                    ? 'font-semibold text-primary underline underline-offset-8 decoration-2 decoration-primary'
                    : 'hover:text-primary hover:underline hover:underline-offset-8 hover:decoration-primary/70'
                }`}
              >
                {nav_about({})}
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href={href('/kontakt')}
                className={`text-foreground transition-colors duration-200 ${
                  isActive('/kontakt')
                    ? 'font-semibold text-primary underline underline-offset-8 decoration-2 decoration-primary'
                    : 'hover:text-primary hover:underline hover:underline-offset-8 hover:decoration-primary/70'
                }`}
              >
                {nav_contact({})}
              </NavigationMenuLink>
            </NavigationMenuItem>
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
              <h2 className="text-xl font-semibold text-foreground">
                Anika Warncke
              </h2>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" aria-label="Menü schließen">
                  <X className="h-6 w-6" />
                </Button>
              </SheetClose>
            </div>

            {/* Links mit Active-Highlighting & Animation */}
            <nav className="flex-1 px-6 py-10 space-y-4">
              {([
                { path: '/', label: nav_home({}) },
                { path: '/projekte', label: nav_projects({}) },
                { path: '/ueber-mich', label: nav_about({}) },
                { path: '/kontakt', label: nav_contact({}) },
              ] as { path: string; label: string }[]).map((item) => (
                <SheetClose asChild key={item.path}>
                  <a
                    href={href(item.path)}
                    className={`block text-lg font-medium px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-primary/10 text-primary font-semibold shadow-sm'
                        : 'hover:bg-accent/50 hover:text-primary hover:shadow-sm'
                    }`}
                  >
                    {item.label}
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
