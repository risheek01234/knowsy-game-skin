import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { BarChart3, Palette, QrCode, BookOpen } from 'lucide-react';

export const EntityDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { title: 'Topics', icon: BookOpen, path: '/entity/topics', color: 'from-purple-500 to-pink-500' },
    { title: 'Skinning', icon: Palette, path: '/entity/skinning', color: 'from-cyan-500 to-blue-500' },
    { title: 'QR Code', icon: QrCode, path: '/entity/qr-code', color: 'from-green-500 to-emerald-500' },
    { title: 'Analytics', icon: BarChart3, path: '/entity/analytics', color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Entity Dashboard</h1>
            <p className="text-muted-foreground">Manage your Knowsy game space</p>
          </div>
          <ThemedButton variant="outline" onClick={logout}>
            Logout
          </ThemedButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <ThemedCard key={item.path} className="cursor-pointer hover:scale-105 transition-transform" glow>
              <button
                onClick={() => navigate(item.path)}
                className="w-full text-left p-6"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">
                  {item.title === 'Topics' && 'Create and manage quiz topics'}
                  {item.title === 'Skinning' && 'Customize your game appearance'}
                  {item.title === 'QR Code' && 'Generate game space access codes'}
                  {item.title === 'Analytics' && 'View player data and insights'}
                </p>
              </button>
            </ThemedCard>
          ))}
        </div>
      </div>
    </div>
  );
};
