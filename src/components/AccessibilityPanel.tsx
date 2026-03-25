
import { useState, useEffect, useRef } from 'react';
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

const DEFAULT_SETTINGS = {
  fontSize: 100,
  lineHeight: 150,
  dyslexiaFont: false,
  highContrast: false,
  reducedMotion: false,
  grayscale: false,
  invertedColors: false,
  largeCursor: false,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function toPercent(value: unknown, fallback: number, min: number, max: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback;

  // Legacy compatibility: old values were stored as multipliers (e.g. 1.2)
  // instead of percentages (e.g. 120).
  const normalized = value > 0 && value <= 3 ? value * 100 : value;
  return clamp(Math.round(normalized), min, max);
}

function sanitizeSettings(raw: unknown) {
  const src = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  return {
    fontSize: toPercent(src.fontSize, DEFAULT_SETTINGS.fontSize, 80, 200),
    lineHeight: toPercent(src.lineHeight, DEFAULT_SETTINGS.lineHeight, 100, 250),
    dyslexiaFont: Boolean(src.dyslexiaFont),
    highContrast: Boolean(src.highContrast),
    reducedMotion: Boolean(src.reducedMotion),
    grayscale: Boolean(src.grayscale),
    invertedColors: Boolean(src.invertedColors),
    largeCursor: Boolean(src.largeCursor),
  };
}

type ValueAnimationPreset = 'snappy' | 'smooth';

const VALUE_ANIMATION_DURATION: Record<ValueAnimationPreset, number> = {
  snappy: 140,
  smooth: 220,
};

const VALUE_ANIMATION_PRESET: ValueAnimationPreset = 'snappy';

function useAnimatedPercent(target: number, duration: number) {
  const [display, setDisplay] = useState(target);
  const frameRef = useRef<number | null>(null);
  const currentValueRef = useRef(target);

  useEffect(() => {
    const shouldReduceMotion = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (shouldReduceMotion) {
      currentValueRef.current = target;
      setDisplay(target);
      return;
    }

    const from = currentValueRef.current;
    const to = target;

    if (from === to) {
      setDisplay(to);
      return;
    }

    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(from + (to - from) * eased);

      currentValueRef.current = next;
      setDisplay(next);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        currentValueRef.current = to;
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, duration]);

  return display;
}

export default function AccessibilityPanel({ locale: propLocale }: AccessibilityPanelProps) {
  // Locale from prop (SSR), fallback to URL path detection, then default
  let locale: Locale = propLocale ?? defaultLocale;
  if (typeof window !== 'undefined' && !propLocale) {
    locale = window.location.pathname.startsWith('/en') ? 'en' : 'de';
  }
  if (locale !== 'de' && locale !== 'en') locale = defaultLocale;
  const getMessage = (key: Parameters<typeof t>[1]) => t(locale, key);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const animationDuration = VALUE_ANIMATION_DURATION[VALUE_ANIMATION_PRESET];
  const animatedFontSize = useAnimatedPercent(settings.fontSize, animationDuration);
  const animatedLineHeight = useAnimatedPercent(settings.lineHeight, animationDuration);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('accessibility');
      if (!saved) {
        applySettings(DEFAULT_SETTINGS);
        return;
      }

      const parsed = JSON.parse(saved);
      const sanitized = sanitizeSettings(parsed);
      setSettings(sanitized);
      localStorage.setItem('accessibility', JSON.stringify(sanitized));
      applySettings(sanitized);
    } catch (_error) {
      setSettings(DEFAULT_SETTINGS);
      localStorage.setItem('accessibility', JSON.stringify(DEFAULT_SETTINGS));
      applySettings(DEFAULT_SETTINGS);
    }
  }, []);

  const updateSetting = (key: keyof typeof DEFAULT_SETTINGS, value: number | boolean) => {
    setSettings((prev) => {
      const newSettings = sanitizeSettings({ ...prev, [key]: value });
      localStorage.setItem('accessibility', JSON.stringify(newSettings));
      applySettings(newSettings);
      return newSettings;
    });
  };

  const applySettings = (s: typeof DEFAULT_SETTINGS) => {
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
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem('accessibility', JSON.stringify(DEFAULT_SETTINGS));
    applySettings(DEFAULT_SETTINGS);
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
            <div className="flex items-center justify-between gap-4">
              <Label className="flex items-center gap-3 text-base md:text-lg font-medium text-foreground" htmlFor="fontSize">
                <Type className="h-5 w-5" />
                {t(locale, 'accessibility.fontSize')}
              </Label>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs md:text-sm font-semibold tabular-nums text-primary" aria-live="polite">
                {animatedFontSize} %
              </span>
            </div>
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
            <div className="flex items-center justify-between gap-4">
              <Label className="flex items-center gap-3 text-base md:text-lg font-medium text-foreground" htmlFor="lineHeight">
                  <AlignJustify className="h-5 w-5" />
                  {t(locale, 'accessibility.lineHeight')}
              </Label>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs md:text-sm font-semibold tabular-nums text-primary" aria-live="polite">
                {animatedLineHeight} %
              </span>
            </div>
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
