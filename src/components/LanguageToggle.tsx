import { useEffect, useState } from 'react';
import { setCurrentLanguage } from '../lib/language';
import { Button } from '@/components/ui/button';

export default function LanguageToggle() {
  const [lang, setLang] = useState('de');

  const mapLocalizedPath = (path: string, targetLang: 'de' | 'en') => {
    const normalized = path.startsWith('/en') ? path.replace(/^\/en/, '') || '/' : path;

    if (targetLang === 'en') {
      if (normalized === '/kontakt') return '/en/contact';
      if (normalized === '/ueber-mich') return '/en/about';
      return normalized === '/' ? '/en' : `/en${normalized}`;
    }

    if (normalized === '/contact') return '/kontakt';
    if (normalized === '/about') return '/ueber-mich';
    return normalized;
  };

  useEffect(() => {
    const currentPath = window.location.pathname;
    const savedLang = (localStorage.getItem('PARAGLIDE_LOCALE') || localStorage.getItem('lang') || 'de') as 'de' | 'en';

    if (currentPath.startsWith('/en')) {
      setLang('en');
      localStorage.setItem('lang', 'en');
    } else {
      setLang(savedLang);
    }
  }, []);

  const switchLang = (newLang: 'de' | 'en') => {
    setCurrentLanguage(newLang);
    setLang(newLang);
    const currentPath = window.location.pathname;
    const newPath = mapLocalizedPath(currentPath, newLang);
    window.location.href = newPath;
  };

  return (
    <div className="lang-toggle flex items-center gap-1">
      <Button
        variant={lang === 'de' ? 'default' : 'ghost'}
        size="sm"
        className={
          `text-sm px-3 ${lang === 'de' ? 'bg-primary text-primary-foreground' : ''}`
        }
        onClick={() => switchLang('de')}
      >
        DE
      </Button>
      <span className="text-muted-foreground">/</span>
      <Button
        variant={lang === 'en' ? 'default' : 'ghost'}
        size="sm"
        className={
          `text-sm px-3 ${lang === 'en' ? 'bg-primary text-primary-foreground' : ''}`
        }
        onClick={() => switchLang('en')}
      >
        EN
      </Button>
    </div>
  );
}
