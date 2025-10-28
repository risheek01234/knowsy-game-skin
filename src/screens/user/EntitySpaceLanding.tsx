import { useNavigate, useParams } from 'react-router-dom';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { ArrowLeft, Play } from 'lucide-react';

export const EntitySpaceLanding = () => {
  const navigate = useNavigate();
  const { entityId } = useParams();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <ThemedButton variant="outline" onClick={() => navigate('/user/home')}>
            <ArrowLeft className="w-4 h-4" />
          </ThemedButton>
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Tech University</h1>
            <p className="text-muted-foreground">Welcome to the game space</p>
          </div>
        </div>

        <ThemedCard glow className="text-center">
          <div className="py-12">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-6 flex items-center justify-center">
              <Play className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-4">Ready to Play?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Join a game or create your own. Compete with friends and test your knowledge!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ThemedButton
                gradient
                glow
                size="lg"
                onClick={() => navigate(`/game-lobby/${entityId}`)}
              >
                Enter Game Lobby
              </ThemedButton>
              <ThemedButton variant="outline" size="lg" onClick={() => navigate('/user/home')}>
                Back to Knowsy Home
              </ThemedButton>
            </div>
          </div>
        </ThemedCard>
      </div>
    </div>
  );
};
