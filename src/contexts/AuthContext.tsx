import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  isEntity: boolean;
  entityId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, isEntity: boolean) => Promise<void>;
  signup: (email: string, password: string, isEntity: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const checkSession = () => {
      const storedUser = localStorage.getItem('knowsy_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    
    checkSession();
  }, []);

  const login = async (email: string, password: string, isEntity: boolean) => {
    // Placeholder login logic
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      isEntity,
      entityId: isEntity ? Math.random().toString(36).substr(2, 9) : undefined,
    };
    
    setUser(mockUser);
    localStorage.setItem('knowsy_user', JSON.stringify(mockUser));
  };

  const signup = async (email: string, password: string, isEntity: boolean) => {
    // Placeholder signup logic
    await login(email, password, isEntity);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('knowsy_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
