import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { Building2, Zap, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

export const UserHome = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { createGame, joinGame } = useGame();
  const [quickJoinCode, setQuickJoinCode] = useState('');
  const [quickJoinName, setQuickJoinName] = useState('');
  const [loading, setLoading] = useState(false);

  const entities = [
    { id: '1', name: 'Tech University', gamesPlayed: 24 },
    { id: '2', name: 'Movie Fan Club', gamesPlayed: 18 },
    { id: '3', name: 'Book Lovers', gamesPlayed: 32 },
  ];

  const handleQuickStart = async () => {
    try {
      setLoading(true);
      await createGame({
        targetScore: 10,
        pointsPerCorrect: 1,
        bonusAllCorrect: 3,
        penaltyAllWrong: -2,
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

  const handleQuickJoin = async () => {
    if (!quickJoinCode || !quickJoinName) {
      toast.error('Please enter both name and code');
      return;
    }

    try {
      setLoading(true);
      await joinGame(quickJoinCode, quickJoinName);
      toast.success(`Joined game ${quickJoinCode}!`);
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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Knowsy</h1>
            <p className="text-muted-foreground">Guess what your friends think!</p>
          </div>
          <ThemedButton variant="outline" onClick={logout}>
            Logout
          </ThemedButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <ThemedCard glow className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Quick Start</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a game instantly with default settings
                </p>
                <ThemedButton
                  gradient
                  glow
                  onClick={handleQuickStart}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Creating...' : 'Create Game Now'}
                </ThemedButton>
              </div>
            </div>
          </ThemedCard>

          <ThemedCard glow className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Quick Join</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Jump into a game with a code
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <ThemedButton gradient glow className="w-full">
                      Join with Code
                    </ThemedButton>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Join Game</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Your Name</label>
                        <Input
                          value={quickJoinName}
                          onChange={(e) => setQuickJoinName(e.target.value)}
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Game Code</label>
                        <Input
                          value={quickJoinCode}
                          onChange={(e) => setQuickJoinCode(e.target.value.toUpperCase())}
                          placeholder="6-digit code"
                          maxLength={6}
                          className="text-center text-2xl font-bold"
                        />
                      </div>
                      <ThemedButton
                        gradient
                        glow
                        onClick={handleQuickJoin}
                        disabled={loading || !quickJoinCode || !quickJoinName}
                        className="w-full"
                      >
                        {loading ? 'Joining...' : 'Join Game'}
                      </ThemedButton>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </ThemedCard>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Game Spaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entities.map((entity) => (
              <ThemedCard
                key={entity.id}
                className="cursor-pointer hover:scale-105 transition-transform"
                glow
              >
                <button
                  onClick={() => navigate(`/entity-space/${entity.id}`)}
                  className="w-full text-left p-6"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{entity.name}</h3>
                  <p className="text-muted-foreground">{entity.gamesPlayed} games played</p>
                </button>
              </ThemedCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
