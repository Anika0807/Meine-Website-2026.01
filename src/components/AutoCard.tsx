import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AutoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'col';
  gap?: string;
  hug?: boolean;
  fill?: boolean;
}

export default function AutoCard({
  title,
  children,
  className,
  direction = 'col',
  gap = 'gap-4',
  hug = false,
  fill = false,
}: AutoCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
      hug && "w-fit h-fit",
      fill && "w-full h-full",
      className
    )}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className={cn(
        "flex",
        direction === 'row' ? 'flex-row items-center' : 'flex-col',
        gap,
      )}>
        {children}
      </CardContent>
    </Card>
  );
}
