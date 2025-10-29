import { useGame } from '@/contexts/GameContext';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { Trophy, Crown, Medal } from 'lucide-react';

export const GameOverScreen = () => {
  const { gameState, leaveGame } = useGame();

  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  const handlePlayAgain = () => {
    leaveGame();
    window.location.href = '/user/home';
  };

  const handleBackHome = () => {
    leaveGame();
    window.location.href = '/user/home';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <Trophy className="w-24 h-24 text-primary mx-auto mb-4 animate-bounce" />
          <h1 className="text-5xl font-bold gradient-text mb-4">Game Over!</h1>
          <p className="text-xl text-muted-foreground">Congratulations to all players!</p>
        </div>

        <ThemedCard className="mb-8 p-6 text-center bg-gradient-to-br from-yellow-50 to-yellow-100">
          <Crown className="w-16 h-16 mx-auto mb-3 text-yellow-600" />
          <h2 className="text-3xl font-bold mb-2">{winner?.player_name}</h2>
          <p className="text-xl text-muted-foreground mb-4">is the Winner!</p>
          <p className="text-5xl font-bold text-primary">{winner?.score} points</p>
        </ThemedCard>

        <div className="space-y-4 mb-8">
          {sortedPlayers.slice(1).map((player, index) => {
            const realIndex = index + 1;
            const icons = [Medal, Medal, Medal];
            const Icon = icons[index] || Medal;
            const colors = ['text-gray-400', 'text-orange-600', 'text-gray-300'];

            return (
              <ThemedCard
                key={player.id}
                className="hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-center gap-4 p-6">
                  <div className="relative">
                    <Icon className={`w-6 h-6 ${colors[index] || 'text-gray-300'} absolute -top-2 -left-2`} />
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold">
                      #{realIndex + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">{player.player_name}</h3>
                    <p className="text-muted-foreground">
                      #{realIndex + 1} Place
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">{player.score}</p>
                    <p className="text-sm text-muted-foreground">points</p>
                  </div>
                </div>
              </ThemedCard>
            );
          })}
        </div>

        <div className="space-y-3">
          <ThemedButton
            gradient
            glow
            size="lg"
            className="w-full"
            onClick={handlePlayAgain}
          >
            Play Again
          </ThemedButton>
          <ThemedButton
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleBackHome}
          >
            Back to Home
          </ThemedButton>
        </div>
      </div>
    </div>
  );
};
