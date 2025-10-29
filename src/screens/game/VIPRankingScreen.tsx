import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { gameService } from '@/services/gameService';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { DraggableList } from '@/components/game/DraggableList';
import { toast } from 'sonner';
import { Crown } from 'lucide-react';

export const VIPRankingScreen = () => {
  const { gameState, submitVIPRanking } = useGame();
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTopicItems();
  }, [gameState.currentRound?.topic_id]);

  const loadTopicItems = async () => {
    if (!gameState.currentRound?.topic_id || !gameState.game?.id) return;

    try {
      const topicItems = await gameService.getTopicItems(
        gameState.currentRound.topic_id,
        gameState.game.id
      );
      setItems([...topicItems]);
    } catch (error) {
      console.error('Failed to load topic items:', error);
      toast.error('Failed to load items');
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await submitVIPRanking(items);
      toast.success('Ranking submitted! Waiting for players...');
    } catch (error) {
      toast.error('Failed to submit ranking');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!gameState.isVIP) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <ThemedCard className="max-w-md text-center">
          <Crown className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-2xl font-bold mb-4">VIP is Ranking</h2>
          <p className="text-muted-foreground">
            The VIP is secretly arranging their preferences...
          </p>
        </ThemedCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <ThemedCard className="mb-6 text-center">
          <Crown className="h-12 w-12 mx-auto mb-3 text-yellow-500" />
          <h1 className="text-3xl font-bold gradient-text mb-2">
            {gameState.currentTopic?.name}
          </h1>
          <p className="text-muted-foreground">
            Arrange items in YOUR preferred order (drag to reorder)
          </p>
        </ThemedCard>

        <DraggableList
          items={items}
          onReorder={setItems}
          disabled={loading}
          className="mb-6"
        />

        <ThemedButton
          onClick={handleSubmit}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Submitting...' : 'Submit Ranking'}
        </ThemedButton>
      </div>
    </div>
  );
};
