import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { Users, Copy, Settings, Crown } from 'lucide-react';
import { toast } from 'sonner';

export const GameWaitingRoom = () => {
  const { gameState, startRound } = useGame();
  const [loading, setLoading] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(gameState.code || '');
    toast.success('Code copied to clipboard!');
  };

  const handleStartGame = async () => {
    if (gameState.players.length < 2) {
      toast.error('Need at least 2 players to start!');
      return;
    }

    try {
      setLoading(true);
      await startRound();
      toast.success('Game starting!');
    } catch (error) {
      toast.error('Failed to start game');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentVIP = gameState.players.find(p => p.id === gameState.game?.current_vip_id);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">Waiting Room</h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl text-muted-foreground">Game Code:</span>
            <span className="text-4xl font-bold text-primary">{gameState.code || 'ABC123'}</span>
            <ThemedButton variant="outline" size="icon" onClick={copyCode}>
              <Copy className="w-4 h-4" />
            </ThemedButton>
          </div>
          <p className="text-muted-foreground">Share this code with players to join</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <ThemedCard glow>
            <div className="flex items-center gap-4 mb-4">
              <Users className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Players ({gameState.players.length})</h2>
            </div>
            <div className="space-y-3">
              {gameState.players.map((player) => (
                <div key={player.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                    {player.player_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-lg font-semibold">{player.player_name}</span>
                  {player.id === gameState.game?.current_vip_id && (
                    <div className="ml-auto flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      <Crown className="w-3 h-3" />
                      VIP
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ThemedCard>

          <ThemedCard glow>
            <h2 className="text-2xl font-bold mb-4">Game Info</h2>
            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground mb-1">Status</p>
                <p className="text-lg font-semibold">Waiting for players...</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Current VIP</p>
                <p className="text-lg font-semibold">{currentVIP?.player_name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Target Score</p>
                <p className="text-lg font-semibold">{gameState.game?.target_score || 10} points</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Points Per Correct</p>
                <p className="text-lg font-semibold">{gameState.game?.points_per_correct || 1} pts</p>
              </div>
            </div>
          </ThemedCard>
        </div>

        {gameState.isVIP ? (
          <ThemedButton
            gradient
            glow
            size="lg"
            className="w-full"
            onClick={handleStartGame}
            disabled={loading || gameState.players.length < 2}
          >
            {loading ? 'Starting...' : 'Start Game'}
          </ThemedButton>
        ) : (
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">Waiting for VIP to start the game...</p>
          </div>
        )}
      </div>
    </div>
  );
};
