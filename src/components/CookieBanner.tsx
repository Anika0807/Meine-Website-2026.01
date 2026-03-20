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
      declineButtonText={isEn ? 'Decline' : 'Ablehnen'}
      cookieName="meineWebsiteConsent"
      style={{
        background: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
        borderTop: '1px solid hsl(var(--border))',
        padding: '1rem 1.5rem',
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
      ariaDeclineLabel={isEn ? 'Decline cookies' : 'Cookies ablehnen'}
      expires={365}
      onAccept={() => {
        // Update GA4 Consent Mode after explicit user acceptance.
        (window as any).gtag?.('consent', 'update', {
          analytics_storage: 'granted',
        });
      }}
    >
      {isEn ? (
        <>
          This website uses cookies to improve your experience.{' '}
          <a href="/datenschutz" className="underline hover:text-primary transition-colors">
            Learn more
          </a>
        </>
      ) : (
        <>
          Diese Website verwendet Cookies, um die Nutzererfahrung zu verbessern.{' '}
          <a href="/datenschutz" className="underline hover:text-primary transition-colors">
            Mehr erfahren
          </a>
        </>
      )}
    </CookieConsent>
  );
}
