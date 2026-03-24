import CookieConsent from 'react-cookie-consent';

interface CookieBannerProps {
  locale?: string;
}

export default function CookieBanner({ locale = 'de' }: CookieBannerProps) {
  const isEn = locale === 'en';

  return (
    <CookieConsent
      location="bottom"
      buttonText={isEn ? 'Accept all' : 'Alle akzeptieren'}
      declineButtonText={isEn ? 'Necessary only' : 'Nur notwendige'}
      cookieName="meineWebsiteConsent"
      style={{
        background: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
        borderTop: '1px solid hsl(var(--border))',
        paddingTop: '1rem',
        paddingRight: '1.5rem',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        paddingLeft: '1.5rem',
        alignItems: 'center',
        gap: '1rem',
      }}
      buttonStyle={{
        background: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
        fontSize: '0.875rem',
        borderRadius: '0.5rem',
        padding: '0.5rem 1.25rem',
        fontWeight: '500',
      }}
      declineButtonStyle={{
        background: 'transparent',
        color: 'hsl(var(--muted-foreground))',
        fontSize: '0.875rem',
        borderRadius: '0.5rem',
        padding: '0.5rem 1.25rem',
        fontWeight: '500',
        border: '1px solid hsl(var(--border))',
      }}
      enableDeclineButton
      flipButtons
      ariaAcceptLabel={isEn ? 'Accept all cookies' : 'Alle Cookies akzeptieren'}
      ariaDeclineLabel={isEn ? 'Accept necessary cookies only' : 'Nur notwendige Cookies akzeptieren'}
      expires={365}
      onAccept={() => {
        document.dispatchEvent(new Event('analytics:load'));
        // Update GA4 Consent Mode after explicit user acceptance.
        (window as any).gtag?.('consent', 'update', {
          analytics_storage: 'granted',
        });
      }}
      onDecline={() => {
        // Immediately revoke analytics consent when declined.
        (window as any).gtag?.('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
      }}
    >
      {isEn ? (
        <>
          This website uses cookies and Google Analytics to statistically analyze site usage and improve your experience.{' '}
          <a href="/en/datenschutz" className="underline hover:text-primary transition-colors">
            Learn more
          </a>
        </>
      ) : (
        <>
          Diese Website verwendet Cookies und Google Analytics, um die Nutzung der Website statistisch auszuwerten und die Nutzererfahrung zu verbessern.{' '}
          <a href="/datenschutz" className="underline hover:text-primary transition-colors">
            Mehr erfahren
          </a>
        </>
      )}
    </CookieConsent>
  );
}
