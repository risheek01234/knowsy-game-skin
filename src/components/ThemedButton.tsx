import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ThemedButtonProps extends ButtonProps {
  gradient?: boolean;
  glow?: boolean;
}

export const ThemedButton = ({ 
  className, 
  gradient = false, 
  glow = false,
  children, 
  ...props 
}: ThemedButtonProps) => {
  return (
    <Button
      className={cn(
        'game-button font-semibold transition-all',
        gradient && 'bg-gradient-to-r from-primary to-secondary text-primary-foreground',
        glow && 'glow-effect',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};
