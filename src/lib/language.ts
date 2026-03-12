import { setLocale, localStorageKey } from '../paraglide/runtime.js';

export function setCurrentLanguage(lang: 'de' | 'en') {
  setLocale(lang);
  localStorage.setItem(localStorageKey, lang);
}

export function initLanguage() {
  const path = window.location.pathname;
  if (path.startsWith('/en')) {
    setCurrentLanguage('en');
  } else {
    const saved = localStorage.getItem(localStorageKey) as 'de' | 'en' | null;
    setCurrentLanguage(saved ?? 'de');
  }
}
