import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { gameService } from '@/services/gameService';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { DraggableList } from '@/components/game/DraggableList';
import { toast } from 'sonner';
import { Users, CheckCircle } from 'lucide-react';

export const PlayerGuessing = () => {
  const { gameState, submitPlayerGuess } = useGame();
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [waitingCount, setWaitingCount] = useState(0);

  useEffect(() => {
    loadTopicItems();
    checkWaitingPlayers();
  }, [gameState.currentRound?.topic_id]);

  const loadTopicItems = async () => {
    if (!gameState.currentRound?.topic_id || !gameState.game?.id) return;

    try {
      const topicItems = await gameService.getTopicItems(
        gameState.currentRound.topic_id,
        gameState.game.id
      );
      const shuffled = [...topicItems].sort(() => Math.random() - 0.5);
      setItems(shuffled);
    } catch (error) {
      console.error('Failed to load topic items:', error);
      toast.error('Failed to load items');
    }
  };

  const checkWaitingPlayers = () => {
    const nonVIPPlayers = gameState.players.filter(
      p => p.id !== gameState.game?.current_vip_id
    );
    setWaitingCount(nonVIPPlayers.length);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await submitPlayerGuess(items);
      toast.success('Guess submitted!');
    } catch (error) {
      toast.error('Failed to submit guess');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (gameState.isVIP) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <ThemedCard className="max-w-md text-center">
          <Users className="h-16 w-16 mx-auto mb-4 text-blue-500" />
          <h2 className="text-2xl font-bold mb-4">Players are Guessing</h2>
          <p className="text-muted-foreground mb-4">
            Waiting for all players to submit their guesses...
          </p>
          <div className="text-4xl font-bold text-primary">
            {waitingCount} remaining
          </div>
        </ThemedCard>
      </div>
    );
  }

  if (gameState.hasSubmittedGuess) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <ThemedCard className="max-w-md text-center">
          <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
          <h2 className="text-2xl font-bold mb-4">Guess Submitted!</h2>
          <p className="text-muted-foreground">
            Waiting for other players to finish...
          </p>
        </ThemedCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <ThemedCard className="mb-6 text-center">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            {gameState.currentTopic?.name}
          </h1>
          <p className="text-muted-foreground">
            Guess the VIP's ranking by arranging the items
          </p>
        </ThemedCard>

        <DraggableList
          items={items}
          onReorder={setItems}
          disabled={loading || gameState.hasSubmittedGuess}
          className="mb-6"
        />

        <ThemedButton
          onClick={handleSubmit}
          disabled={loading || gameState.hasSubmittedGuess}
          className="w-full mb-4"
        >
          {loading ? 'Submitting...' : 'Submit Guess'}
        </ThemedButton>

        <div className="p-4 bg-muted/50 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            {waitingCount} player{waitingCount !== 1 ? 's' : ''} remaining
          </p>
        </div>
      </div>
    </div>
  );
};
