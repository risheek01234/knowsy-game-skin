import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { GripVertical } from 'lucide-react';

export const VIPRanking = () => {
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Rank the Items</h1>
          <p className="text-muted-foreground">As VIP, set the correct order from highest to lowest</p>
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
            onClick={() => navigate('/game/guessing')}
          >
            Confirm Ranking
          </ThemedButton>
        </ThemedCard>
      </div>
    </div>
  );
};
