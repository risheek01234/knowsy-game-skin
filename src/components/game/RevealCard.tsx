import React from 'react';
import { Card } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RevealCardProps {
  position: number;
  item: string;
  isRevealed: boolean;
  isCorrect?: boolean;
  isVIP?: boolean;
  playerGuess?: string;
  className?: string;
}

export const RevealCard: React.FC<RevealCardProps> = ({
  position,
  item,
  isRevealed,
  isCorrect,
  isVIP = false,
  playerGuess,
  className,
}) => {
  return (
    <div className={cn('relative', className)}>
      <Card
        className={cn(
          'p-6 transition-all duration-500 transform',
          isRevealed ? 'scale-100' : 'scale-95'
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg',
              isVIP
                ? 'bg-yellow-500 text-white'
                : isRevealed && isCorrect !== undefined
                ? isCorrect
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-600'
            )}
          >
            {isRevealed && !isVIP && isCorrect !== undefined ? (
              isCorrect ? (
                <Check className="h-6 w-6" />
              ) : (
                <X className="h-6 w-6" />
              )
            ) : (
              position + 1
            )}
          </div>

          <div className="flex-1">
            {isRevealed ? (
              <>
                <div className="text-xl font-semibold">{item}</div>
                {!isVIP && playerGuess && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Your guess: {playerGuess}
                  </div>
                )}
              </>
            ) : (
              <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
            )}
          </div>

          {isVIP && (
            <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
              VIP
            </div>
          )}
        </div>
      </Card>

      {isRevealed && (
        <div
          className={cn(
            'absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center',
            'transform transition-all duration-300 animate-in zoom-in',
            isCorrect ? 'bg-green-500' : isCorrect === false ? 'bg-red-500' : 'hidden'
          )}
        >
          {isCorrect ? (
            <Check className="h-5 w-5 text-white" />
          ) : (
            <X className="h-5 w-5 text-white" />
          )}
        </div>
      )}
    </div>
  );
};
