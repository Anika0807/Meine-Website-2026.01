import { useEffect, useState } from 'react';
import { mapLocalizedPath, setCurrentLanguage } from '../lib/language';
import { Button } from '@/components/ui/button';

export default function LanguageToggle() {
  const [lang, setLang] = useState('de');

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
          `h-8 min-h-8 text-sm px-3 min-w-[48px] ${lang === 'de' ? 'bg-primary text-primary-foreground' : ''}`
        }
        onClick={() => switchLang('de')}
      >
        DE
      </Button>
      <Button
        variant={lang === 'en' ? 'default' : 'ghost'}
        size="sm"
        className={
          `h-8 min-h-8 text-sm px-3 min-w-[48px] ${lang === 'en' ? 'bg-primary text-primary-foreground' : ''}`
        }
        onClick={() => switchLang('en')}
      >
        EN
      </Button>
    </div>
  );
}
