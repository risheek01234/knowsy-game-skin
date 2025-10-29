import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export const JoinGameInput = () => {
  const navigate = useNavigate();
  const { entityId } = useParams();
  const { joinGame } = useGame();
  const [code, setCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await joinGame(code, playerName);
      toast.success(`Joined game ${code}!`);
      navigate('/game/waiting-room');
    } catch (error) {
      toast.error('Failed to join game. Check the code and try again.');
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
          <h1 className="text-4xl font-bold gradient-text">Join Game</h1>
        </div>

        <ThemedCard glow>
          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <Label htmlFor="playerName">Your Name</Label>
              <Input
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <Label htmlFor="code">Game Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="text-2xl text-center font-bold tracking-wider"
                required
              />
            </div>

            <ThemedButton
              type="submit"
              gradient
              glow
              size="lg"
              className="w-full"
              disabled={!code || !playerName || code.length < 6 || loading}
            >
              {loading ? 'Joining...' : 'Join Game'}
            </ThemedButton>
          </form>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Ask the game host for the 6-digit code
            </p>
          </div>
        </ThemedCard>
      </div>
    </div>
  );
};
