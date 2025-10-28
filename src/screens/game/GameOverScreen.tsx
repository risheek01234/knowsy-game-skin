import { useNavigate } from 'react-router-dom';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { Trophy, Crown, Medal } from 'lucide-react';

export const GameOverScreen = () => {
  const navigate = useNavigate();

  const finalScores = [
    { id: '1', name: 'Sarah', score: 1850, avatar: '🎯' },
    { id: '2', name: 'John', score: 1520, avatar: '🎮' },
    { id: '3', name: 'Mike', score: 1350, avatar: '🎲' },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <Trophy className="w-24 h-24 text-primary mx-auto mb-4 animate-bounce" />
          <h1 className="text-5xl font-bold gradient-text mb-4">Game Over!</h1>
          <p className="text-xl text-muted-foreground">Congratulations to all players!</p>
        </div>

        <div className="space-y-4 mb-8">
          {finalScores.map((player, index) => {
            const icons = [Crown, Medal, Medal];
            const Icon = icons[index];
            const colors = ['text-yellow-500', 'text-gray-400', 'text-orange-600'];

            return (
              <ThemedCard
                key={player.id}
                glow={index === 0}
                className="hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-center gap-4 p-6">
                  <div className="relative">
                    <Icon className={`w-8 h-8 ${colors[index]} absolute -top-3 -left-2`} />
                    <span className="text-5xl">{player.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">{player.name}</h3>
                    <p className="text-muted-foreground">
                      {index === 0 ? '🏆 Winner!' : `#${index + 1} Place`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-primary">{player.score}</p>
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
            onClick={() => navigate('/game-lobby/1')}
          >
            Play Again
          </ThemedButton>
          <ThemedButton
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => navigate('/user/home')}
          >
            Back to Home
          </ThemedButton>
        </div>
      </div>
    </div>
  );
};
