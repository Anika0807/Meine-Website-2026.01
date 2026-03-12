import { useEffect, useState } from 'react';
import { setCurrentLanguage } from '../lib/language';
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
    let newPath = currentPath;
    if (newLang === 'en' && !currentPath.startsWith('/en')) {
      newPath = '/en' + currentPath;
    } else if (newLang === 'de' && currentPath.startsWith('/en')) {
      newPath = currentPath.replace('/en', '') || '/';
    }
    window.location.href = newPath;
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant={lang === 'de' ? 'default' : 'ghost'}
        size="sm"
        className="text-sm px-3"
        onClick={() => switchLang('de')}
      >
        DE
      </Button>
      <span className="text-muted-foreground">/</span>
      <Button
        variant={lang === 'en' ? 'default' : 'ghost'}
        size="sm"
        className="text-sm px-3"
        onClick={() => switchLang('en')}
      >
        EN
      </Button>
    </div>
  );
}
