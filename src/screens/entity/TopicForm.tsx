import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus } from 'lucide-react';

export const TopicForm = () => {
  const navigate = useNavigate();
  const { topicId } = useParams();
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<string[]>([]);

  const handleSave = () => {
    // Placeholder save logic
    navigate('/entity/topics');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <ThemedButton variant="outline" onClick={() => navigate('/entity/topics')}>
            <ArrowLeft className="w-4 h-4" />
          </ThemedButton>
          <h1 className="text-4xl font-bold gradient-text">
            {topicId ? 'Edit Topic' : 'New Topic'}
          </h1>
        </div>

        <ThemedCard glow>
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Topic Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Movies 2023"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>Items ({items.length})</Label>
                <ThemedButton
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/entity/topics/${topicId || 'new'}/items`)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Items
                </ThemedButton>
              </div>
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-muted rounded-lg">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <ThemedButton gradient glow onClick={handleSave} className="flex-1">
                Save Topic
              </ThemedButton>
              <ThemedButton variant="outline" onClick={() => navigate('/entity/topics')}>
                Cancel
              </ThemedButton>
            </div>
          </div>
        </ThemedCard>
      </div>
    </div>
  );
};
