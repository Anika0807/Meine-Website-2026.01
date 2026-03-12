
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
        border: checked ? '2px solid #1d4ed8' : '2px solid #9ca3af',
        padding: '2px',
        cursor: 'pointer',
        transition: 'background-color 0.2s, border-color 0.2s',
        backgroundColor: checked ? '#2563eb' : '#d1d5db',
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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-6 right-6 z-50 rounded-full shadow-2xl hover:shadow-3xl hover:bg-primary/90 transition-all duration-300 border-2 border-primary/50 text-primary-foreground"
          aria-label={t(locale, 'accessibility.ariaLabel')}
        >
          <PersonStanding className="h-6 w-6" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-background border-border rounded-2xl shadow-2xl p-8">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <PersonStanding className="h-6 w-6 text-primary" />
            {t(locale, 'accessibility.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Schriftgröße */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-3 text-base font-medium" htmlFor="fontSize">
                <Type className="h-5 w-5" />
                {t(locale, 'accessibility.fontSize')}
              </Label>
              <span className="text-sm font-medium text-muted-foreground">{settings.fontSize}%</span>
            </div>
            <div className="relative pt-2">
              <Slider
                id="fontSize"
                value={[settings.fontSize]}
                min={80}
                max={200}
                step={10}
                className="w-full"
                onValueChange={([v]) => updateSetting('fontSize', v)}
                aria-valuemin={80}
                aria-valuemax={200}
                aria-valuenow={settings.fontSize}
                aria-label={t(locale, 'accessibility.fontSizeAria')}
              />
              {/* Sichtbare Skala mit Labels */}
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>80%</span>
                <span>140%</span>
                <span>200%</span>
              </div>
            </div>
          </div>

          {/* Zeilenabstand */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-3 text-base font-medium" htmlFor="lineHeight">
                <AlignJustify className="h-5 w-5" />
                {t(locale, 'accessibility.lineHeight')}
              </Label>
              <span className="text-sm font-medium text-muted-foreground">{settings.lineHeight}%</span>
            </div>
            <div className="relative pt-2">
              <Slider
                id="lineHeight"
                value={[settings.lineHeight]}
                min={100}
                max={250}
                step={25}
                className="w-full"
                onValueChange={([v]) => updateSetting('lineHeight', v)}
                aria-valuemin={100}
                aria-valuemax={250}
                aria-valuenow={settings.lineHeight}
                aria-label={t(locale, 'accessibility.lineHeightAria')}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>100%</span>
                <span>175%</span>
                <span>250%</span>
              </div>
            </div>
          </div>

          {/* Alle weiteren Funktionen mit Toggle */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-3 text-base font-medium" htmlFor="dyslexia">
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
              <Label className="flex items-center gap-3 text-base font-medium" htmlFor="highContrast">
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
              <Label className="flex items-center gap-3 text-base font-medium" htmlFor="reducedMotion">
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
              <Label className="flex items-center gap-3 text-base font-medium" htmlFor="grayscale">
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
              <Label className="flex items-center gap-3 text-base font-medium" htmlFor="invertedColors">
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
              <Label className="flex items-center gap-3 text-base font-medium" htmlFor="largeCursor">
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

          {/* Reset-Button – präsenter und größer */}
          <Button
            variant="outline"
            className="w-full mt-10 text-base font-medium border-2 border-primary/50 hover:bg-primary/10"
            onClick={resetSettings}
          >
            {t(locale, 'accessibility.reset')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
