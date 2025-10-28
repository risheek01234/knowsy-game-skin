import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'player' | 'entity'>('player');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    await signup(email, password, userType === 'entity');
    navigate(userType === 'entity' ? '/entity/dashboard' : '/user/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <ThemedCard className="w-full max-w-md" glow>
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold gradient-text mb-2">Join Knowsy</h1>
          <p className="text-muted-foreground">Create your account</p>
        </div>

        <Tabs value={userType} onValueChange={(v) => setUserType(v as 'player' | 'entity')} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="player">Player</TabsTrigger>
            <TabsTrigger value="entity">Entity</TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSignup} className="space-y-4">
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
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <ThemedButton type="submit" className="w-full" gradient glow>
            Sign Up
          </ThemedButton>
        </form>

        <p className="text-center mt-4 text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-primary hover:underline"
          >
            Login
          </button>
        </p>
      </ThemedCard>
    </div>
  );
};
