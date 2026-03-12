'use client';

import { Button } from '@/components/ui/button';
import { test_title, test_button, test_text1, test_text2 } from '@/paraglide/messages.js';

interface Props {
  locale?: 'de' | 'en';
}

export default function SimpleTest({ locale = 'de' }: Props) {
  const opts = { locale };
  return (
    <div className="p-8 bg-card text-card-foreground rounded-xl border border-border shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-accent/20">
      <h2 className="text-2xl font-bold mb-4 text-primary">
        {test_title({}, opts)}
      </h2>
      <Button 
        variant="default" 
        size="lg" 
        className="mb-6 w-full transition-all duration-200 hover:scale-105 hover:shadow-md hover:bg-primary/90"
      >
        {test_button({}, opts)}
      </Button>
      <p className="text-muted-foreground mb-2">
        {test_text1({}, opts)}
      </p>
      <p className="text-muted-foreground">
        {test_text2({}, opts)}
      </p>
    </div>
  );
}