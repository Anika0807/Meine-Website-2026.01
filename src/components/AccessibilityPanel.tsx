
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { PersonStanding, Eye, Type, AlignJustify, Contrast } from 'lucide-react';
import { t, defaultLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        width: '48px',
        height: '26px',
        borderRadius: '9999px',
        border: checked ? '2px solid hsl(var(--primary))' : '2px solid #9ca3af',
        padding: '2px',
        cursor: 'pointer',
        transition: 'background-color 0.2s, border-color 0.2s',
        backgroundColor: checked ? 'hsl(var(--primary))' : '#d1d5db',
        flexShrink: 0,
        outline: 'none',
      }}
    >
      <span
        style={{
          display: 'block',
          width: '18px',
          height: '18px',
          borderRadius: '9999px',
          backgroundColor: '#ffffff',
          transform: checked ? 'translateX(22px)' : 'translateX(0)',
          transition: 'transform 0.2s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
          flexShrink: 0,
        }}
      />
    </button>
  );
}

interface AccessibilityPanelProps {
  locale?: Locale;
}

export default function AccessibilityPanel({ locale: propLocale }: AccessibilityPanelProps) {
  // Locale from prop (SSR), fallback to URL path detection, then default
  let locale: Locale = propLocale ?? defaultLocale;
  if (typeof window !== 'undefined' && !propLocale) {
    locale = window.location.pathname.startsWith('/en') ? 'en' : 'de';
  }
  if (locale !== 'de' && locale !== 'en') locale = defaultLocale;
  const getMessage = (key: Parameters<typeof t>[1]) => t(locale, key);
  const [settings, setSettings] = useState({
    fontSize: 100,
    lineHeight: 150,
    dyslexiaFont: false,
    highContrast: false,
    reducedMotion: false,
    grayscale: false,
    invertedColors: false,
    largeCursor: false,
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('accessibility');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings(parsed);
      applySettings(parsed);
    }
  }, []);

  const updateSetting = (key: keyof typeof settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('accessibility', JSON.stringify(newSettings));
    applySettings(newSettings);
  };

  const applySettings = (s: typeof settings) => {
    const root = document.documentElement;

    root.style.setProperty('--font-size-multiplier', `${s.fontSize / 100}`);
    root.style.setProperty('--line-height-multiplier', `${s.lineHeight / 100}`);

    root.classList.toggle('dyslexia-font', s.dyslexiaFont);
    root.classList.toggle('high-contrast', s.highContrast);
    root.classList.toggle('reduced-motion', s.reducedMotion);
    root.classList.toggle('grayscale', s.grayscale);
    root.classList.toggle('inverted-colors', s.invertedColors);
    root.classList.toggle('large-cursor', s.largeCursor);
  };

  const resetSettings = () => {
    const defaults = {
      fontSize: 100,
      lineHeight: 150,
      dyslexiaFont: false,
      highContrast: false,
      reducedMotion: false,
      grayscale: false,
      invertedColors: false,
      largeCursor: false,
    };
    setSettings(defaults);
    localStorage.setItem('accessibility', JSON.stringify(defaults));
    applySettings(defaults);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          id="accessibility-button"
          variant="default"
          size="icon"
          className={`fixed bottom-[max(1.25rem,calc(env(safe-area-inset-bottom)+0.75rem))] right-[max(1rem,calc(env(safe-area-inset-right)+0.75rem))] z-[60] flex h-[52px] min-w-[62px] items-center justify-center rounded-btn bg-primary px-2 text-primary-foreground shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/30 md:bottom-8 md:right-8 md:h-[72px] md:min-w-[82px] md:px-3 ${isOpen ? 'hidden' : ''}`}
          aria-label={t(locale, 'accessibility.ariaLabel')}
        >
          <PersonStanding className="size-9 md:size-[50px]" strokeWidth={2.25} />
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        overlayClassName="z-[180] bg-transparent md:bg-black/60"
        className="z-[190] top-0 left-0 !flex h-[100svh] max-h-[100svh] w-full max-w-none !flex-col translate-x-0 translate-y-0 overflow-hidden rounded-none border-0 bg-background p-0 shadow-none ring-0 sm:max-w-none md:top-1/2 md:left-1/2 md:h-auto md:max-h-[92svh] md:w-full md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-card md:border md:border-border/50 md:shadow-2xl md:ring-1 md:ring-foreground/10"
      >
        <div className="flex items-center justify-between border-b border-border/50 px-5 pt-[max(1rem,calc(env(safe-area-inset-top)+0.5rem))] pb-4 md:px-6 md:pt-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-card bg-primary/10 text-primary md:h-10 md:w-10">
              <PersonStanding className="h-6 w-6" strokeWidth={2.25} />
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              {t(locale, 'accessibility.title')}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-[2rem] text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Panel schließen"
          >
            ×
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+0.75rem))] space-y-7 md:max-h-[calc(92svh-96px)] md:p-8 md:space-y-9">
          <div>
            <Label className="flex items-center gap-3 text-base md:text-lg font-medium text-foreground" htmlFor="fontSize">
              <Type className="h-5 w-5" />
              {t(locale, 'accessibility.fontSize')}
            </Label>
            <div className="relative mt-4">
              <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-primary"></div>
              <Slider
                id="fontSize"
                value={[settings.fontSize]}
                min={80}
                max={200}
                step={10}
                className="accessibility-slider relative z-10 w-full"
                onValueChange={([v]) => updateSetting('fontSize', v)}
                aria-valuemin={80}
                aria-valuemax={200}
                aria-valuenow={settings.fontSize}
                aria-label={t(locale, 'accessibility.fontSizeAria')}
              />
            </div>
            <div className="mt-1 flex justify-between text-xs md:text-sm text-muted-foreground">
              <span>80 %</span>
              <span>200 %</span>
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-3 text-base md:text-lg font-medium text-foreground" htmlFor="lineHeight">
                <AlignJustify className="h-5 w-5" />
                {t(locale, 'accessibility.lineHeight')}
            </Label>
            <div className="relative mt-4">
              <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-primary"></div>
              <Slider
                id="lineHeight"
                value={[settings.lineHeight]}
                min={100}
                max={250}
                step={25}
                className="accessibility-slider relative z-10 w-full"
                onValueChange={([v]) => updateSetting('lineHeight', v)}
                aria-valuemin={100}
                aria-valuemax={250}
                aria-valuenow={settings.lineHeight}
                aria-label={t(locale, 'accessibility.lineHeightAria')}
              />
            </div>
            <div className="mt-1 flex justify-between text-xs md:text-sm text-muted-foreground">
              <span>100 %</span>
              <span>250 %</span>
            </div>
          </div>

          <div className="space-y-4 pt-1 md:space-y-5 md:pt-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-3 text-base md:text-lg font-medium" htmlFor="dyslexia">
                <Type className="h-5 w-5" />
                {t(locale, 'accessibility.dyslexiaFont')}
              </Label>
              <Toggle
                checked={settings.dyslexiaFont}
                onChange={(checked) => updateSetting('dyslexiaFont', checked)}
                label={t(locale, 'accessibility.dyslexiaFontAria')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-3 text-base md:text-lg font-medium" htmlFor="highContrast">
                <Contrast className="h-5 w-5" />
                {t(locale, 'accessibility.highContrast')}
              </Label>
              <Toggle
                checked={settings.highContrast}
                onChange={(checked) => updateSetting('highContrast', checked)}
                label={t(locale, 'accessibility.highContrastAria')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-3 text-base md:text-lg font-medium" htmlFor="reducedMotion">
                <Eye className="h-5 w-5" />
                {t(locale, 'accessibility.reducedMotion')}
              </Label>
              <Toggle
                checked={settings.reducedMotion}
                onChange={(checked) => updateSetting('reducedMotion', checked)}
                label={t(locale, 'accessibility.reducedMotionAria')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-3 text-base md:text-lg font-medium" htmlFor="grayscale">
                <Eye className="h-5 w-5" />
                {t(locale, 'accessibility.grayscale')}
              </Label>
              <Toggle
                checked={settings.grayscale}
                onChange={(checked) => updateSetting('grayscale', checked)}
                label={t(locale, 'accessibility.grayscaleAria')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-3 text-base md:text-lg font-medium" htmlFor="invertedColors">
                <Eye className="h-5 w-5" />
                {t(locale, 'accessibility.invertedColors')}
              </Label>
              <Toggle
                checked={settings.invertedColors}
                onChange={(checked) => updateSetting('invertedColors', checked)}
                label={t(locale, 'accessibility.invertedColorsAria')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-3 text-base md:text-lg font-medium" htmlFor="largeCursor">
                <Eye className="h-5 w-5" />
                {t(locale, 'accessibility.largeCursor')}
              </Label>
              <Toggle
                checked={settings.largeCursor}
                onChange={(checked) => updateSetting('largeCursor', checked)}
                label={t(locale, 'accessibility.largeCursorAria')}
              />
            </div>
          </div>

          <button
            onClick={resetSettings}
            className="w-full rounded-btn bg-primary py-4 text-base font-medium text-primary-foreground transition-all hover:bg-primary/90 md:py-5 md:text-lg"
          >
            {getMessage('accessibility.reset')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
