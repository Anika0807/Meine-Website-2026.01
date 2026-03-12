'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { nav_home, nav_projects, nav_about, nav_contact, hero_title } from '@/paraglide/messages.js';

interface Props {
  locale?: 'de' | 'en';
}

export default function Navigation({ locale = 'de' }: Props) {
  const opts = { locale };
  const base = locale === 'en' ? '/en' : '';
  return (
    <>
      {/* Desktop */}
      <nav className="hidden md:flex items-center gap-8">
        <NavigationMenu>
          <NavigationMenuList className="gap-6">
            <NavigationMenuItem>
              <NavigationMenuLink href={base + '/'} className="text-foreground hover:text-primary transition-colors">
                {nav_home({}, opts)}
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href={base + '/projekte'} className="text-foreground hover:text-primary transition-colors">
                {nav_projects({}, opts)}
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href={base + '/ueber-mich'} className="text-foreground hover:text-primary transition-colors">
                {nav_about({}, opts)}
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href={base + '/kontakt'} className="text-foreground hover:text-primary transition-colors">
                {nav_contact({}, opts)}
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
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[380px] bg-background border-l border-border p-0">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Anika Warncke
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {hero_title({}, opts)}
              </p>
            </div>

            <nav className="flex-1 px-6 py-10 space-y-6">
              <a href={base + '/'} className="block text-lg font-medium text-foreground hover:text-primary transition-colors px-4 py-3 rounded-lg hover:bg-accent/50">
                {nav_home({}, opts)}
              </a>
              <a href={base + '/projekte'} className="block text-lg font-medium text-foreground hover:text-primary transition-colors px-4 py-3 rounded-lg hover:bg-accent/50">
                {nav_projects({}, opts)}
              </a>
              <a href={base + '/ueber-mich'} className="block text-lg font-medium text-foreground hover:text-primary transition-colors px-4 py-3 rounded-lg hover:bg-accent/50">
                {nav_about({}, opts)}
              </a>
              <a href={base + '/kontakt'} className="block text-lg font-medium text-foreground hover:text-primary transition-colors px-4 py-3 rounded-lg hover:bg-accent/50">
                {nav_contact({}, opts)}
              </a>
            </nav>

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
