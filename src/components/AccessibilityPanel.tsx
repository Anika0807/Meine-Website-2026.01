import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Accessibility, Eye, Type, AlignJustify, SunMoon } from 'lucide-react';

export default function AccessibilityPanel() {
  const [settings, setSettings] = useState({
    fontSize: 100,
    lineHeight: 150,
    dyslexiaFont: false,
    highContrast: false,
    reducedMotion: false,
    grayscale: false,
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
  };

  const resetSettings = () => {
    const defaults = {
      fontSize: 100,
      lineHeight: 150,
      dyslexiaFont: false,
      highContrast: false,
      reducedMotion: false,
      grayscale: false,
    };
    setSettings(defaults);
    localStorage.setItem('accessibility', JSON.stringify(defaults));
    applySettings(defaults);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Barrierefreiheit Einstellungen"
        >
          <Accessibility className="h-6 w-6" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Accessibility className="h-6 w-6 text-primary" />
            Barrierefreiheit
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Schriftgröße */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Schriftgröße
              </Label>
              <span className="text-sm text-muted-foreground">{settings.fontSize}%</span>
            </div>
            <Slider
              value={[settings.fontSize]}
              min={80}
              max={200}
              step={10}
              onValueChange={([v]) => updateSetting('fontSize', v)}
            />
          </div>

          {/* Zeilenabstand */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <AlignJustify className="h-5 w-5" />
                Zeilenabstand
              </Label>
              <span className="text-sm text-muted-foreground">{settings.lineHeight}%</span>
            </div>
            <Slider
              value={[settings.lineHeight]}
              min={100}
              max={250}
              step={25}
              onValueChange={([v]) => updateSetting('lineHeight', v)}
            />
          </div>

          {/* Dyslexie-Schrift */}
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Dyslexie-Schrift (OpenDyslexic)
            </Label>
            <Switch
              checked={settings.dyslexiaFont}
              onCheckedChange={(checked) => updateSetting('dyslexiaFont', checked)}
            />
          </div>

          {/* Hoher Kontrast */}
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <SunMoon className="h-5 w-5" />
              Hoher Kontrast
            </Label>
            <Switch
              checked={settings.highContrast}
              onCheckedChange={(checked) => updateSetting('highContrast', checked)}
            />
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Bewegungen reduzieren
            </Label>
            <Switch
              checked={settings.reducedMotion}
              onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
            />
          </div>

          {/* Graustufen */}
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Graustufen (Farben umkehren)
            </Label>
            <Switch
              checked={settings.grayscale}
              onCheckedChange={(checked) => updateSetting('grayscale', checked)}
            />
          </div>

          {/* Reset */}
          <Button
            variant="outline"
            className="w-full mt-6"
            onClick={resetSettings}
          >
            Einstellungen zurücksetzen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}