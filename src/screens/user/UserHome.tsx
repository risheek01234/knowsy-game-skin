import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { Building2 } from 'lucide-react';

export const UserHome = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const entities = [
    { id: '1', name: 'Tech University', gamesPlayed: 24 },
    { id: '2', name: 'Movie Fan Club', gamesPlayed: 18 },
    { id: '3', name: 'Book Lovers', gamesPlayed: 32 },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Knowsy</h1>
            <p className="text-muted-foreground">Choose a game space to play</p>
          </div>
          <ThemedButton variant="outline" onClick={logout}>
            Logout
          </ThemedButton>
        </div>

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
  );
};
