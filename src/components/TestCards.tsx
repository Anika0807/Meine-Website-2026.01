// src/components/TestCards.tsx
import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TestCards: FC = () => {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
          <CardTitle>Test Card 1</CardTitle>
          <CardDescription>Mobile-First ab iPhone SE</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-muted-foreground">
            Diese Card ist responsiv, hat Hover-Effekt und passt perfekt ins Grid.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="default" size="lg" className="w-full">
            Mehr erfahren
          </Button>
        </CardFooter>
      </Card>

      <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
          <CardTitle>Test Card 2</CardTitle>
          <CardDescription>Dark Mode ready</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-muted-foreground">
            Wechsle später zu Dark Mode – CSS-Variablen machen es trivial.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="lg" className="w-full">
            Outline Button
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TestCards;