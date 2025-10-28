import { useNavigate, useParams } from 'react-router-dom';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { ArrowLeft, Plus, Users } from 'lucide-react';

export const GameLobby = () => {
  const navigate = useNavigate();
  const { entityId } = useParams();

  const activeGames = [
    { code: 'ABC123', players: 4, host: 'John' },
    { code: 'XYZ789', players: 2, host: 'Sarah' },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <ThemedButton variant="outline" onClick={() => navigate(`/entity-space/${entityId}`)}>
            <ArrowLeft className="w-4 h-4" />
          </ThemedButton>
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Game Lobby</h1>
            <p className="text-muted-foreground">Join or create a game</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <ThemedCard glow className="cursor-pointer hover:scale-105 transition-transform">
            <button
              onClick={() => navigate(`/create-game/${entityId}`)}
              className="w-full text-center p-8"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Create Game</h3>
              <p className="text-muted-foreground">Start a new game session</p>
            </button>
          </ThemedCard>

          <ThemedCard glow className="cursor-pointer hover:scale-105 transition-transform">
            <button
              onClick={() => navigate(`/join-game/${entityId}`)}
              className="w-full text-center p-8"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Join Game</h3>
              <p className="text-muted-foreground">Enter a game code</p>
            </button>
          </ThemedCard>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Active Games</h2>
          <div className="space-y-4">
            {activeGames.map((game) => (
              <ThemedCard key={game.code} className="hover:scale-[1.02] transition-transform">
                <div className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Code: {game.code}</h3>
                    <p className="text-muted-foreground">
                      Host: {game.host} • {game.players} players
                    </p>
                  </div>
                  <ThemedButton gradient onClick={() => navigate(`/game/${game.code}`)}>
                    Join
                  </ThemedButton>
                </div>
              </ThemedCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
