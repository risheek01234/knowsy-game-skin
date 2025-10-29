import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { supabase } from '@/lib/supabase';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { RevealCard } from '@/components/game/RevealCard';
import { toast } from 'sonner';
import { Crown } from 'lucide-react';

export const RevealAnimation = () => {
  const { gameState, revealNext, completeRound } = useGame();
  const [playerGuesses, setPlayerGuesses] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (gameState.currentRound?.id) {
      loadPlayerGuesses();
    }
  }, [gameState.currentRound?.id]);

  const loadPlayerGuesses = async () => {
    if (!gameState.currentRound?.id) return;

    try {
      const { data } = await supabase
        .from('player_guesses')
        .select('player_id, guess_ranking')
        .eq('round_id', gameState.currentRound.id);

      if (data) {
        const guessesMap: Record<string, string[]> = {};
        data.forEach(guess => {
          guessesMap[guess.player_id] = guess.guess_ranking;
        });
        setPlayerGuesses(guessesMap);
      }
    } catch (error) {
      console.error('Failed to load guesses:', error);
    }
  };

  const handleRevealNext = async () => {
    try {
      setLoading(true);
      await revealNext();

      const maxItems = gameState.currentTopic?.items.length || 0;
      const nextIndex = (gameState.currentRound?.reveal_index || -1) + 1;

      if (nextIndex >= maxItems - 1) {
        setTimeout(() => {
          completeRound();
        }, 2000);
      }
    } catch (error) {
      toast.error('Failed to reveal');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const vipRanking = gameState.currentRound?.vip_ranking || [];
  const revealIndex = gameState.currentRound?.reveal_index || -1;
  const currentPlayerGuess = playerGuesses[gameState.currentPlayer?.id || ''] || [];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <ThemedCard className="mb-6 text-center">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            {gameState.currentTopic?.name}
          </h1>
          <p className="text-muted-foreground">
            Revealing rankings one by one...
          </p>
        </ThemedCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Crown className="h-5 w-5 text-yellow-500" />
              <h3 className="text-xl font-bold">VIP Ranking</h3>
            </div>
            <div className="space-y-3">
              {vipRanking.map((item, index) => (
                <RevealCard
                  key={index}
                  position={index}
                  item={item}
                  isRevealed={index <= revealIndex}
                  isVIP={true}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-bold">Your Guess</h3>
            </div>
            <div className="space-y-3">
              {currentPlayerGuess.map((item, index) => (
                <RevealCard
                  key={index}
                  position={index}
                  item={item}
                  isRevealed={index <= revealIndex}
                  isCorrect={index <= revealIndex ? item === vipRanking[index] : undefined}
                  playerGuess={item}
                />
              ))}
            </div>
          </div>
        </div>

        {gameState.isVIP && revealIndex < vipRanking.length - 1 && (
          <ThemedButton
            onClick={handleRevealNext}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Revealing...' : 'Reveal Next'}
          </ThemedButton>
        )}

        {!gameState.isVIP && (
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">
              Waiting for VIP to reveal next item...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
