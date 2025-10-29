import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  isEntity: boolean;
  entityId?: string;
  supabaseUser: SupabaseUser;
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const storedMeta = localStorage.getItem('knowsy_user_meta');
        const meta = storedMeta ? JSON.parse(storedMeta) : { isEntity: false };
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          isEntity: meta.isEntity,
          entityId: meta.entityId,
          supabaseUser: session.user,
        });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const storedMeta = localStorage.getItem('knowsy_user_meta');
        const meta = storedMeta ? JSON.parse(storedMeta) : { isEntity: false };
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          isEntity: meta.isEntity,
          entityId: meta.entityId,
          supabaseUser: session.user,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, isEntity: boolean) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Login failed');

    const entityId = isEntity ? data.user.id : undefined;
    const userMeta = { isEntity, entityId };

    localStorage.setItem('knowsy_user_meta', JSON.stringify(userMeta));

    setUser({
      id: data.user.id,
      email: data.user.email || '',
      isEntity,
      entityId,
      supabaseUser: data.user,
    });
  };

  const signup = async (email: string, password: string, isEntity: boolean) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Signup failed');

    const entityId = isEntity ? data.user.id : undefined;
    const userMeta = { isEntity, entityId };

    localStorage.setItem('knowsy_user_meta', JSON.stringify(userMeta));

    setUser({
      id: data.user.id,
      email: data.user.email || '',
      isEntity,
      entityId,
      supabaseUser: data.user,
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('knowsy_user_meta');
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
