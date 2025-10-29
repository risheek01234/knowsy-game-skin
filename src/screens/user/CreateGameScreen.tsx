import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export const CreateGameScreen = () => {
  const navigate = useNavigate();
  const { entityId } = useParams();
  const { createGame } = useGame();
  const [targetScore, setTargetScore] = useState('10');
  const [pointsPerCorrect, setPointsPerCorrect] = useState('1');
  const [bonusAllCorrect, setBonusAllCorrect] = useState('3');
  const [penaltyAllWrong, setPenaltyAllWrong] = useState('-2');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);
      await createGame({
        targetScore: parseInt(targetScore),
        pointsPerCorrect: parseInt(pointsPerCorrect),
        bonusAllCorrect: parseInt(bonusAllCorrect),
        penaltyAllWrong: parseInt(penaltyAllWrong),
      });
      toast.success('Game created! Share the code with players.');
      navigate('/game/waiting-room');
    } catch (error) {
      toast.error('Failed to create game');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <ThemedButton variant="outline" onClick={() => navigate(`/game-lobby/${entityId}`)}>
            <ArrowLeft className="w-4 h-4" />
          </ThemedButton>
          <h1 className="text-4xl font-bold gradient-text">Create New Game</h1>
        </div>

        <ThemedCard glow>
          <div className="space-y-6">
            <div>
              <Label htmlFor="targetScore">Target Score to Win</Label>
              <Input
                id="targetScore"
                type="number"
                value={targetScore}
                onChange={(e) => setTargetScore(e.target.value)}
                min="5"
                max="50"
              />
            </div>

            <div>
              <Label htmlFor="pointsPerCorrect">Points Per Correct Guess</Label>
              <Input
                id="pointsPerCorrect"
                type="number"
                value={pointsPerCorrect}
                onChange={(e) => setPointsPerCorrect(e.target.value)}
                min="1"
                max="10"
              />
            </div>

            <div>
              <Label htmlFor="bonusAllCorrect">Bonus for All Correct</Label>
              <Input
                id="bonusAllCorrect"
                type="number"
                value={bonusAllCorrect}
                onChange={(e) => setBonusAllCorrect(e.target.value)}
                min="0"
                max="20"
              />
            </div>

            <div>
              <Label htmlFor="penaltyAllWrong">Penalty for All Wrong</Label>
              <Input
                id="penaltyAllWrong"
                type="number"
                value={penaltyAllWrong}
                onChange={(e) => setPenaltyAllWrong(e.target.value)}
                min="-10"
                max="0"
              />
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">How to Play</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• You will be the first VIP (host)</li>
                <li>• VIP ranks items in their preferred order</li>
                <li>• Players guess the VIP's ranking</li>
                <li>• Points awarded for correct positions</li>
                <li>• VIP rotates each round by join order</li>
              </ul>
            </div>

            <ThemedButton
              gradient
              glow
              size="lg"
              className="w-full"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Game'}
            </ThemedButton>
          </div>
        </ThemedCard>
      </div>
    </div>
  );
};
