
import { useEffect, useState } from 'react';
import { initLanguage } from '../lib/language';
import { nav_home, nav_projects, nav_about, nav_contact } from '../paraglide/messages.js';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';


export default function Navigation() {
  // currentPath erst im Browser setzen
  const [currentPath, setCurrentPath] = useState('');
  useEffect(() => {
    setCurrentPath(window.location.pathname.replace('/en', ''));
    initLanguage();
  }, []);

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/' || currentPath === '';
    }
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
                className={`text-foreground transition-colors ${
                  isActive('/') 
                    ? 'font-semibold text-primary underline underline-offset-8 decoration-2' 
                    : 'hover:text-primary hover:underline hover:underline-offset-8 hover:decoration-primary/70'
                }`}
              >
                {nav_home({})}
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={`text-foreground transition-colors ${
                  isActive('/projekte') 
                    ? 'font-semibold text-primary underline underline-offset-8 decoration-2' 
                    : 'hover:text-primary hover:underline hover:underline-offset-8 hover:decoration-primary/70'
                }`}
              >
                {nav_projects({})}
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={`text-foreground transition-colors ${
                  isActive('/ueber-mich') 
                    ? 'font-semibold text-primary underline underline-offset-8 decoration-2' 
                    : 'hover:text-primary hover:underline hover:underline-offset-8 hover:decoration-primary/70'
                }`}
              >
                {nav_about({})}
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={`text-foreground transition-colors ${
                  isActive('/kontakt') 
                    ? 'font-semibold text-primary underline underline-offset-8 decoration-2' 
                    : 'hover:text-primary hover:underline hover:underline-offset-8 hover:decoration-primary/70'
                }`}
              >
                {nav_contact({})}
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4 fixed top-4 right-6 z-50 md:relative md:top-auto md:right-auto">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </nav>

      {/* Mobile Hamburger */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[380px] bg-background border-l border-border p-0">
          <div className="flex flex-col h-full">
            {/* Header im Sheet */}
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Anika Warncke
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Innenarchitektur & UX/UI Design
              </p>
            </div>

            {/* Mobile Links mit Active-Highlighting */}
            <nav className="flex-1 px-6 py-10 space-y-4">
              <a
                href="/"
                className={`block text-lg font-medium px-4 py-3 rounded-lg transition-colors ${
                  isActive('/') 
                    ? 'bg-primary/10 text-primary font-semibold' 
                    : 'hover:bg-accent/50 hover:text-primary'
                }`}
              >
                {nav_home({})}
              </a>

              <a
                href="/projekte"
                className={`block text-lg font-medium px-4 py-3 rounded-lg transition-colors ${
                  isActive('/projekte') 
                    ? 'bg-primary/10 text-primary font-semibold' 
                    : 'hover:bg-accent/50 hover:text-primary'
                }`}
              >
                {nav_projects({})}
              </a>

              <a
                href="/ueber-mich"
                className={`block text-lg font-medium px-4 py-3 rounded-lg transition-colors ${
                  isActive('/ueber-mich') 
                    ? 'bg-primary/10 text-primary font-semibold' 
                    : 'hover:bg-accent/50 hover:text-primary'
                }`}
              >
                {nav_about({})}
              </a>

              <a
                href="/kontakt"
                className={`block text-lg font-medium px-4 py-3 rounded-lg transition-colors ${
                  isActive('/kontakt') 
                    ? 'bg-primary/10 text-primary font-semibold' 
                    : 'hover:bg-accent/50 hover:text-primary'
                }`}
              >
                {nav_contact({})}
              </a>
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
