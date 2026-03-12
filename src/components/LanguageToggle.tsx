'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function LanguageToggle() {
  const [lang, setLang] = useState('de');

  useEffect(() => {
    const currentPath = window.location.pathname;
    const savedLang = localStorage.getItem('lang') || 'de';

    if (currentPath.startsWith('/en')) {
      setLang('en');
      localStorage.setItem('lang', 'en');
    } else {
      setLang(savedLang);
    }
  }, []);

  const switchLang = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);

    const currentPath = window.location.pathname;
    if (newLang === 'en' && !currentPath.startsWith('/en')) {
      window.location.href = '/en' + currentPath;
    } else if (newLang === 'de' && currentPath.startsWith('/en')) {
      window.location.href = currentPath.replace('/en', '');
    } else {
      window.location.reload();
    }
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
