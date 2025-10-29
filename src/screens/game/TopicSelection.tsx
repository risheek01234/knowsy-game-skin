import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { Button } from '@/components/ui/button';
import { Edit, Lock } from 'lucide-react';
import { toast } from 'sonner';

export const TopicSelection = () => {
  const { gameState, selectTopic, passTurn } = useGame();
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isCreator = gameState.game?.creator_id === gameState.currentPlayer?.user_id;

  const handleSelectTopic = async (topicId: string) => {
    try {
      setLoading(true);
      await selectTopic(topicId);
      toast.success('Topic selected!');
    } catch (error) {
      toast.error('Failed to select topic');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePassTurn = async () => {
    try {
      setLoading(true);
      await passTurn();
      toast.info('VIP role passed to next player');
    } catch (error) {
      toast.error('Failed to pass turn');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!gameState.isVIP) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <ThemedCard className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Waiting for VIP</h2>
          <p className="text-muted-foreground">
            The VIP is selecting a topic for this round...
          </p>
        </ThemedCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Choose Topic</h1>
          <p className="text-muted-foreground">
            You are the VIP! Select a topic for this round
          </p>
        </div>

        <div className="grid gap-4 mb-6">
          {gameState.topics.map((topic) => (
            <ThemedCard
              key={topic.id}
              glow={selectedTopicId === topic.id}
              className="cursor-pointer hover:scale-[1.01] transition-transform"
            >
              <button
                onClick={() => setSelectedTopicId(topic.id)}
                className="w-full text-left p-6"
                disabled={loading}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">{topic.name}</h3>
                    <p className="text-muted-foreground">
                      {topic.items.length} items to rank
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {topic.flag === 1 && isCreator && (
                      <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                        <Edit className="h-3 w-3" />
                        Editable
                      </div>
                    )}
                    {topic.flag === 0 && (
                      <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Fixed
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </ThemedCard>
          ))}
        </div>

        <div className="flex gap-4">
          <ThemedButton
            onClick={() => selectedTopicId && handleSelectTopic(selectedTopicId)}
            disabled={!selectedTopicId || loading}
            className="flex-1"
          >
            {loading ? 'Selecting...' : 'Confirm Selection'}
          </ThemedButton>
          <Button
            variant="outline"
            onClick={handlePassTurn}
            disabled={loading}
            className="px-8"
          >
            Pass Turn
          </Button>
        </div>
      </div>
    </div>
  );
};
