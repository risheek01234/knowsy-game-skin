import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { supabase } from '@/lib/supabase';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { Crown, Trophy } from 'lucide-react';
import { toast } from 'sonner';

export const RoundScoreboard = () => {
  const { gameState, startNextRound } = useGame();
  const [roundScores, setRoundScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (gameState.currentRound?.id) {
      loadRoundScores();
    }
  }, [gameState.currentRound?.id]);

  const loadRoundScores = async () => {
    if (!gameState.currentRound?.id) return;

    try {
      const { data } = await supabase
        .from('player_guesses')
        .select('player_id, score')
        .eq('round_id', gameState.currentRound.id);

      if (data) {
        const scoresMap: Record<string, number> = {};
        data.forEach(guess => {
          scoresMap[guess.player_id] = guess.score;
        });
        setRoundScores(scoresMap);
      }
    } catch (error) {
      console.error('Failed to load round scores:', error);
    }
  };

  const handleNextRound = async () => {
    try {
      setLoading(true);
      await startNextRound();
      toast.success('Starting next round!');
    } catch (error) {
      toast.error('Failed to start next round');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];
  const hasWinner = winner && winner.score >= (gameState.game?.target_score || 10);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold gradient-text mb-2">Round Complete!</h1>
          <p className="text-muted-foreground">Here's how everyone scored</p>
        </div>

        <div className="space-y-4 mb-8">
          {sortedPlayers.map((player, index) => (
            <ThemedCard
              key={player.id}
              glow={index === 0}
              className="hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center gap-4 p-6">
                <div className="relative">
                  {index === 0 && (
                    <Crown className="w-6 h-6 text-yellow-500 absolute -top-3 -left-2" />
                  )}
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold">
                    #{index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{player.player_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    +{roundScores[player.id] || 0} points this round
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">{player.score}</p>
                  <p className="text-sm text-muted-foreground">total</p>
                </div>
              </div>
            </ThemedCard>
          ))}
        </div>

        {hasWinner ? (
          <div className="text-center p-6 bg-yellow-100 rounded-lg mb-4">
            <Trophy className="w-12 h-12 mx-auto mb-2 text-yellow-600" />
            <p className="text-xl font-bold text-yellow-800">
              {winner.player_name} wins the game!
            </p>
          </div>
        ) : (
          <ThemedButton
            onClick={handleNextRound}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Starting...' : 'Start Next Round'}
          </ThemedButton>
        )}
      </div>
    </div>
  );
};
