import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface HeadingProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Heading1({ children, className, id }: HeadingProps) {
  return (
    <h1
      id={id}
      className={cn(
        'text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-foreground',
        'leading-[1.05] mb-8',
        className
      )}
    >
      {children}
    </h1>
  );
}

export function Heading2({ children, className, id }: HeadingProps) {
  return (
    <h2
      id={id}
      className={cn(
        'text-5xl md:text-6xl font-bold tracking-tight text-foreground',
        'leading-[1.1] mb-6',
        className
      )}
    >
      {children}
    </h2>
  );
}

export function Heading3({ children, className, id }: HeadingProps) {
  return (
    <h3
      id={id}
      className={cn(
        'text-4xl md:text-5xl font-bold tracking-tight text-foreground',
        'leading-[1.15] mb-5',
        className
      )}
    >
      {children}
    </h3>
  );
}

export function Heading4({ children, className, id }: HeadingProps) {
  return (
    <h4
      id={id}
      className={cn(
        'text-3xl md:text-4xl font-semibold tracking-tight text-foreground',
        'leading-[1.2] mb-4',
        className
      )}
    >
      {children}
    </h4>
  );
}

export function Heading5({ children, className, id }: HeadingProps) {
  return (
    <h5
      id={id}
      className={cn(
        'text-2xl md:text-3xl font-semibold text-foreground',
        'leading-[1.25] mb-3',
        className
      )}
    >
      {children}
    </h5>
  );
}

export function Heading6({ children, className, id }: HeadingProps) {
  return (
    <h6
      id={id}
      className={cn(
        'text-xl md:text-2xl font-medium text-foreground',
        'leading-[1.3] mb-2 uppercase tracking-wide',
        className
      )}
    >
      {children}
    </h6>
  );
}
