import { useState, useEffect } from 'react';

interface CookieBannerProps {
  locale?: string;
}

export default function CookieBanner({ locale = 'de' }: CookieBannerProps) {
  const isEn = locale === 'en';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )meineWebsiteConsent=([^;]*)/);
    if (!match) setVisible(true);
  }, []);

  const saveConsent = (value: 'true' | 'false') => {
    document.cookie = `meineWebsiteConsent=${value}; path=/; max-age=31536000; samesite=lax`;
    setVisible(false);
  };

  const handleAccept = () => {
    saveConsent('true');
    document.dispatchEvent(new Event('analytics:load'));
    (window as any).gtag?.('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  };

  const handleDecline = () => {
    saveConsent('false');
    (window as any).gtag?.('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={isEn ? 'Cookie settings' : 'Cookie-Einstellungen'}
      className="fixed bottom-0 left-0 right-0 z-[9990] bg-card text-card-foreground border-t border-border"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <div className="max-w-7xl mx-auto px-5 py-4 md:px-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="flex-1 text-sm text-muted-foreground leading-relaxed">
          {isEn
            ? 'This website uses cookies and Google Analytics to analyze site usage and improve your experience. '
            : 'Diese Website verwendet Cookies und Google Analytics zur statistischen Auswertung der Nutzung. '}
          <a
            href={isEn ? '/en/datenschutz' : '/datenschutz'}
            className="underline underline-offset-2 hover:text-primary transition-colors"
          >
            {isEn ? 'Learn more' : 'Mehr erfahren'}
          </a>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleDecline}
            className="rounded-btn px-5 py-2.5 text-sm font-medium min-h-[44px] border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
            aria-label={isEn ? 'Decline all optional cookies' : 'Alle optionalen Cookies ablehnen'}
          >
            {isEn ? 'Decline' : 'Ablehnen'}
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-btn px-5 py-2.5 text-sm font-medium min-h-[44px] bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
            aria-label={isEn ? 'Accept all cookies' : 'Alle Cookies akzeptieren'}
          >
            {isEn ? 'Accept all' : 'Alle akzeptieren'}
          </button>
        </div>
      </div>
    </div>
  );
}
