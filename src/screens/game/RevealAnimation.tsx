import { useNavigate } from 'react-router-dom';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { Trophy } from 'lucide-react';

export const RevealAnimation = () => {
  const navigate = useNavigate();

  const results = [
    { rank: 1, title: 'Barbie', revealed: true },
    { rank: 2, title: 'Oppenheimer', revealed: true },
    { rank: 3, title: '???', revealed: false },
    { rank: 4, title: '???', revealed: false },
    { rank: 5, title: '???', revealed: false },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce" />
          <h1 className="text-4xl font-bold gradient-text mb-2">The Results Are In!</h1>
          <p className="text-muted-foreground">Revealing the correct ranking...</p>
        </div>

        <div className="space-y-4 mb-8">
          {results.map((result) => (
            <ThemedCard
              key={result.rank}
              glow={result.revealed}
              className={`transition-all duration-500 ${
                result.revealed ? 'animate-fade-in' : 'opacity-50'
              }`}
            >
              <div className="flex items-center gap-4 p-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl">
                  {result.rank}
                </div>
                <span className="text-2xl font-bold flex-1">
                  {result.revealed ? result.title : result.title}
                </span>
                {result.revealed && (
                  <span className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded-full">
                    +100 pts
                  </span>
                )}
              </div>
            </ThemedCard>
          ))}
        </div>

        <ThemedButton
          gradient
          glow
          size="lg"
          className="w-full"
          onClick={() => navigate('/game/scoreboard')}
        >
          Continue
        </ThemedButton>
      </div>
    </div>
  );
};
