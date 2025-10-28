import { useNavigate } from 'react-router-dom';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';

export const TopicSelection = () => {
  const navigate = useNavigate();
  
  const topics = [
    { id: '1', title: 'Movies 2023', items: 10 },
    { id: '2', title: 'Tech Giants', items: 8 },
    { id: '3', title: 'Classic Books', items: 12 },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Choose Topic</h1>
          <p className="text-muted-foreground">VIP: Select the topic for this round</p>
        </div>
        <div className="space-y-4">
          {topics.map((topic) => (
            <ThemedCard key={topic.id} glow className="cursor-pointer hover:scale-[1.02] transition-transform">
              <button onClick={() => navigate('/game/vip-ranking')} className="w-full text-left p-6">
                <h3 className="text-2xl font-bold">{topic.title}</h3>
                <p className="text-muted-foreground">{topic.items} items to rank</p>
              </button>
            </ThemedCard>
          ))}
        </div>
      </div>
    </div>
  );
};
