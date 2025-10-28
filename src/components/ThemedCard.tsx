import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ThemedCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const ThemedCard = ({ 
  title, 
  description, 
  children, 
  className,
  glow = false 
}: ThemedCardProps) => {
  return (
    <Card className={cn('game-card', glow && 'glow-effect', className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="gradient-text text-2xl">{title}</CardTitle>}
          {description && <CardDescription className="text-muted-foreground">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={!title && !description ? 'p-6' : ''}>
        {children}
      </CardContent>
    </Card>
  );
};
