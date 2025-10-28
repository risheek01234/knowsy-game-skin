import { useNavigate } from 'react-router-dom';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { Crown, Trophy } from 'lucide-react';

export const RoundScoreboard = () => {
  const navigate = useNavigate();

  const players = [
    { id: '1', name: 'Sarah', score: 850, avatar: '🎯', roundPoints: 250 },
    { id: '2', name: 'John', score: 720, avatar: '🎮', roundPoints: 180 },
    { id: '3', name: 'Mike', score: 650, avatar: '🎲', roundPoints: 150 },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold gradient-text mb-2">Round Complete!</h1>
          <p className="text-muted-foreground">Here's how everyone scored</p>
        </div>

        <div className="space-y-4 mb-8">
          {players.map((player, index) => (
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
                  <span className="text-4xl">{player.avatar}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{player.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    +{player.roundPoints} points this round
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

        <div className="flex gap-4">
          <ThemedButton
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => navigate('/game/waiting-room')}
          >
            Next Round
          </ThemedButton>
          <ThemedButton
            gradient
            glow
            size="lg"
            className="flex-1"
            onClick={() => navigate('/game/game-over')}
          >
            End Game
          </ThemedButton>
        </div>
      </div>
    </div>
  );
};
