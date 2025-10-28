import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Player {
  id: string;
  name: string;
  avatar?: string;
  score: number;
}

interface GameState {
  gameId: string | null;
  code: string | null;
  players: Player[];
  isVIP: boolean;
  currentTopic: string | null;
  round: number;
  status: 'waiting' | 'topic-selection' | 'ranking' | 'guessing' | 'reveal' | 'scoreboard' | 'finished';
}

interface GameContextType {
  gameState: GameState;
  createGame: (topicId?: string) => void;
  joinGame: (code: string, playerName: string) => void;
  setTopic: (topicId: string) => void;
  submitRanking: (rankings: string[]) => void;
  nextRound: () => void;
  endGame: () => void;
  leaveGame: () => void;
}

const initialState: GameState = {
  gameId: null,
  code: null,
  players: [],
  isVIP: false,
  currentTopic: null,
  round: 0,
  status: 'waiting',
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(initialState);

  const createGame = (topicId?: string) => {
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    setGameState({
      ...initialState,
      gameId: Math.random().toString(36).substr(2, 9),
      code,
      isVIP: true,
      currentTopic: topicId || null,
      status: 'waiting',
    });
  };

  const joinGame = (code: string, playerName: string) => {
    setGameState(prev => ({
      ...prev,
      gameId: Math.random().toString(36).substr(2, 9),
      code,
      players: [...prev.players, {
        id: Math.random().toString(36).substr(2, 9),
        name: playerName,
        score: 0,
      }],
    }));
  };

  const setTopic = (topicId: string) => {
    setGameState(prev => ({ ...prev, currentTopic: topicId }));
  };

  const submitRanking = (rankings: string[]) => {
    // Placeholder for ranking submission
    console.log('Rankings submitted:', rankings);
  };

  const nextRound = () => {
    setGameState(prev => ({
      ...prev,
      round: prev.round + 1,
      status: 'topic-selection',
    }));
  };

  const endGame = () => {
    setGameState(prev => ({ ...prev, status: 'finished' }));
  };

  const leaveGame = () => {
    setGameState(initialState);
  };

  return (
    <GameContext.Provider value={{
      gameState,
      createGame,
      joinGame,
      setTopic,
      submitRanking,
      nextRound,
      endGame,
      leaveGame,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
