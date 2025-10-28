import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { GripVertical, Clock } from 'lucide-react';

export const PlayerGuessing = () => {
  const navigate = useNavigate();
  const [items] = useState([
    { id: '1', title: 'Oppenheimer' },
    { id: '2', title: 'Barbie' },
    { id: '3', title: 'Guardians of the Galaxy Vol. 3' },
    { id: '4', title: 'Spider-Man: Across the Spider-Verse' },
    { id: '5', title: 'The Super Mario Bros. Movie' },
  ]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Guess the Ranking</h1>
            <p className="text-muted-foreground">Drag to arrange from highest to lowest</p>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <Clock className="w-6 h-6" />
            <span className="text-2xl font-bold">0:45</span>
          </div>
        </div>

        <ThemedCard glow>
          <div className="space-y-3 mb-6">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-4 bg-muted rounded-lg cursor-move hover:bg-muted/80 transition-colors"
              >
                <GripVertical className="w-5 h-5 text-muted-foreground" />
                <span className="text-2xl font-bold text-primary">{index + 1}</span>
                <span className="text-lg font-semibold flex-1">{item.title}</span>
              </div>
            ))}
          </div>

          <ThemedButton
            gradient
            glow
            size="lg"
            className="w-full"
            onClick={() => navigate('/game/reveal')}
          >
            Submit Ranking
          </ThemedButton>
        </ThemedCard>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            3 players have submitted • Waiting for 1 more...
          </p>
        </div>
      </div>
    </div>
  );
};
