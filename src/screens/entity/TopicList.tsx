import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { Plus, ArrowLeft, Edit, Trash } from 'lucide-react';

export const TopicList = () => {
  const navigate = useNavigate();
  const [topics] = useState([
    { id: '1', title: 'Movies 2023', itemCount: 10 },
    { id: '2', title: 'Tech Giants', itemCount: 8 },
    { id: '3', title: 'Classic Books', itemCount: 12 },
  ]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <ThemedButton variant="outline" onClick={() => navigate('/entity/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </ThemedButton>
          <div className="flex-1">
            <h1 className="text-4xl font-bold gradient-text mb-2">Topics</h1>
            <p className="text-muted-foreground">Manage your quiz topics</p>
          </div>
          <ThemedButton gradient glow onClick={() => navigate('/entity/topics/new')}>
            <Plus className="w-4 h-4 mr-2" />
            New Topic
          </ThemedButton>
        </div>

        <div className="space-y-4">
          {topics.map((topic) => (
            <ThemedCard key={topic.id} className="hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between p-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{topic.title}</h3>
                  <p className="text-muted-foreground">{topic.itemCount} items</p>
                </div>
                <div className="flex gap-2">
                  <ThemedButton
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/entity/topics/${topic.id}`)}
                  >
                    <Edit className="w-4 h-4" />
                  </ThemedButton>
                  <ThemedButton variant="outline" size="icon">
                    <Trash className="w-4 h-4" />
                  </ThemedButton>
                </div>
              </div>
            </ThemedCard>
          ))}
        </div>
      </div>
    </div>
  );
};
