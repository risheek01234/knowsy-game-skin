import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'player' | 'entity'>('player');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password, userType === 'entity');
    navigate(userType === 'entity' ? '/entity/dashboard' : '/user/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <ThemedCard className="w-full max-w-md" glow>
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold gradient-text mb-2">Knowsy</h1>
          <p className="text-muted-foreground">Welcome back!</p>
        </div>

        <Tabs value={userType} onValueChange={(v) => setUserType(v as 'player' | 'entity')} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="player">Player</TabsTrigger>
            <TabsTrigger value="entity">Entity</TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <ThemedButton type="submit" className="w-full" gradient glow>
            Login
          </ThemedButton>
        </form>

        <p className="text-center mt-4 text-sm text-muted-foreground">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-primary hover:underline"
          >
            Sign up
          </button>
        </p>
      </ThemedCard>
    </div>
  );
};
