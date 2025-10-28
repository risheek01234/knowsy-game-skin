import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EntitySkin {
  id: string;
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  font?: string;
  shapes?: {
    buttonStyle: 'rounded' | 'sharp' | 'pill';
    cardStyle: 'rounded' | 'sharp';
  };
}

interface SkinContextType {
  currentSkin: EntitySkin | null;
  loadEntitySkin: (entityId: string) => void;
  resetToDefaultSkin: () => void;
}

const defaultSkin: EntitySkin = {
  id: 'default',
  primaryColor: 'hsl(270 100% 65%)',
  secondaryColor: 'hsl(190 100% 50%)',
  shapes: {
    buttonStyle: 'rounded',
    cardStyle: 'rounded',
  },
};

const SkinContext = createContext<SkinContextType | undefined>(undefined);

export const SkinProvider = ({ children }: { children: ReactNode }) => {
  const [currentSkin, setCurrentSkin] = useState<EntitySkin | null>(defaultSkin);

  const loadEntitySkin = (entityId: string) => {
    // Placeholder - would fetch from database
    // For now, just use default skin
    setCurrentSkin(defaultSkin);
  };

  const resetToDefaultSkin = () => {
    setCurrentSkin(defaultSkin);
  };

  return (
    <SkinContext.Provider value={{ currentSkin, loadEntitySkin, resetToDefaultSkin }}>
      {children}
    </SkinContext.Provider>
  );
};

export const useSkin = () => {
  const context = useContext(SkinContext);
  if (context === undefined) {
    throw new Error('useSkin must be used within a SkinProvider');
  }
  return context;
};
