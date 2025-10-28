import { useNavigate } from 'react-router-dom';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { ArrowLeft } from 'lucide-react';

export const DataMiningDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <ThemedButton variant="outline" onClick={() => navigate('/entity/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </ThemedButton>
          <h1 className="text-4xl font-bold gradient-text">Analytics Dashboard</h1>
        </div>
        <ThemedCard glow>
          <p className="text-muted-foreground">Screen: Data Mining Dashboard - Feature coming soon</p>
        </ThemedCard>
      </div>
    </div>
  );
};
