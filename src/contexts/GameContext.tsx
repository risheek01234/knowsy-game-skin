import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { gameService } from '@/services/gameService';
import { useAuth } from './AuthContext';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface Player {
  id: string;
  user_id: string;
  player_name: string;
  score: number;
  joined_at: string;
  is_active: boolean;
}

export interface Topic {
  id: string;
  name: string;
  flag: number;
  items: string[];
  creator_id: string | null;
  is_global: boolean;
}

export interface Round {
  id: string;
  game_id: string;
  round_number: number;
  topic_id: string | null;
  vip_player_id: string | null;
  vip_ranking: string[] | null;
  reveal_index: number;
  status: string;
}

export interface Game {
  id: string;
  code: string;
  creator_id: string;
  current_vip_id: string | null;
  status: string;
  current_round: number;
  target_score: number;
  points_per_correct: number;
  bonus_all_correct: number;
  penalty_all_wrong: number;
}

interface GameState {
  game: Game | null;
  currentPlayer: Player | null;
  players: Player[];
  currentRound: Round | null;
  topics: Topic[];
  currentTopic: Topic | null;
  isVIP: boolean;
  hasSubmittedGuess: boolean;
}

interface GameContextType {
  gameState: GameState;
  createGame: (settings?: any) => Promise<void>;
  joinGame: (code: string, playerName: string) => Promise<void>;
  startRound: () => Promise<void>;
  selectTopic: (topicId: string) => Promise<void>;
  passTurn: () => Promise<void>;
  submitVIPRanking: (ranking: string[]) => Promise<void>;
  submitPlayerGuess: (guessRanking: string[]) => Promise<void>;
  revealNext: () => Promise<void>;
  completeRound: () => Promise<void>;
  startNextRound: () => Promise<void>;
  leaveGame: () => void;
  updateTopicItems: (topicId: string, items: string[]) => Promise<void>;
}

const initialState: GameState = {
  game: null,
  currentPlayer: null,
  players: [],
  currentRound: null,
  topics: [],
  currentTopic: null,
  isVIP: false,
  hasSubmittedGuess: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (gameState.game) {
      const channel = supabase
        .channel(`game:${gameState.game.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'games',
            filter: `id=eq.${gameState.game.id}`,
          },
          (payload) => {
            setGameState((prev) => ({
              ...prev,
              game: payload.new as Game,
            }));
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'game_players',
            filter: `game_id=eq.${gameState.game.id}`,
          },
          async () => {
            const players = await gameService.getGamePlayers(gameState.game!.id);
            setGameState((prev) => ({
              ...prev,
              players,
            }));
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'rounds',
            filter: `game_id=eq.${gameState.game.id}`,
          },
          (payload) => {
            setGameState((prev) => ({
              ...prev,
              currentRound: payload.new as Round,
            }));
          }
        )
        .subscribe();

      setRealtimeChannel(channel);

      return () => {
        channel.unsubscribe();
      };
    }
  }, [gameState.game?.id]);

  useEffect(() => {
    if (gameState.currentRound?.topic_id) {
      loadCurrentTopic();
    }
  }, [gameState.currentRound?.topic_id]);

  useEffect(() => {
    setGameState((prev) => ({
      ...prev,
      isVIP: prev.currentPlayer?.id === prev.game?.current_vip_id,
    }));
  }, [gameState.currentPlayer?.id, gameState.game?.current_vip_id]);

  const loadCurrentTopic = async () => {
    if (!gameState.currentRound?.topic_id) return;

    const { data } = await supabase
      .from('topics')
      .select('*')
      .eq('id', gameState.currentRound.topic_id)
      .single();

    if (data) {
      setGameState((prev) => ({ ...prev, currentTopic: data }));
    }
  };

  const createGame = async (settings?: any) => {
    if (!user) throw new Error('User not authenticated');

    const { game, player } = await gameService.createGame(user.id, settings);
    const players = await gameService.getGamePlayers(game.id);
    const topics = await gameService.getAllTopics();

    setGameState({
      ...initialState,
      game,
      currentPlayer: player,
      players,
      topics,
      isVIP: true,
    });
  };

  const joinGame = async (code: string, playerName: string) => {
    if (!user) throw new Error('User not authenticated');

    const { game, player } = await gameService.joinGame(code, user.id, playerName);
    const players = await gameService.getGamePlayers(game.id);
    const topics = await gameService.getAllTopics();

    const { data: currentRound } = await supabase
      .from('rounds')
      .select('*')
      .eq('game_id', game.id)
      .eq('round_number', game.current_round)
      .maybeSingle();

    setGameState({
      ...initialState,
      game,
      currentPlayer: player,
      players,
      topics,
      currentRound,
      isVIP: player.id === game.current_vip_id,
    });
  };

  const startRound = async () => {
    if (!gameState.game || !gameState.game.current_vip_id) {
      throw new Error('Game or VIP not set');
    }

    const round = await gameService.startRound(
      gameState.game.id,
      gameState.game.current_vip_id,
      gameState.game.current_round + 1
    );

    setGameState((prev) => ({
      ...prev,
      currentRound: round,
      hasSubmittedGuess: false,
    }));
  };

  const selectTopic = async (topicId: string) => {
    if (!gameState.currentRound) throw new Error('No active round');

    const round = await gameService.selectTopic(gameState.currentRound.id, topicId);

    setGameState((prev) => ({
      ...prev,
      currentRound: round,
    }));
  };

  const passTurn = async () => {
    if (!gameState.game) throw new Error('No active game');

    const nextVIP = await gameService.rotateVIP(gameState.game.id);

    const { data: updatedGame } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameState.game.id)
      .single();

    if (updatedGame) {
      setGameState((prev) => ({
        ...prev,
        game: updatedGame,
        isVIP: prev.currentPlayer?.id === nextVIP.id,
      }));
    }
  };

  const submitVIPRanking = async (ranking: string[]) => {
    if (!gameState.currentRound) throw new Error('No active round');

    await gameService.submitVIPRanking(gameState.currentRound.id, ranking);
  };

  const submitPlayerGuess = async (guessRanking: string[]) => {
    if (!gameState.currentRound || !gameState.currentPlayer) {
      throw new Error('No active round or player');
    }

    await gameService.submitPlayerGuess(
      gameState.currentRound.id,
      gameState.currentPlayer.id,
      guessRanking
    );

    setGameState((prev) => ({ ...prev, hasSubmittedGuess: true }));

    await gameService.checkAllGuessesSubmitted(
      gameState.currentRound.id,
      gameState.game!.id
    );
  };

  const revealNext = async () => {
    if (!gameState.currentRound) throw new Error('No active round');

    const nextIndex = gameState.currentRound.reveal_index + 1;
    await gameService.updateRevealIndex(gameState.currentRound.id, nextIndex);

    const maxItems = gameState.currentTopic?.items.length || 0;
    if (nextIndex >= maxItems - 1) {
      await gameService.calculateScores(gameState.currentRound.id);
    }
  };

  const completeRound = async () => {
    if (!gameState.currentRound || !gameState.game) {
      throw new Error('No active round or game');
    }

    await gameService.completeRound(gameState.currentRound.id, gameState.game.id);

    const winner = await gameService.checkForWinner(gameState.game.id);

    if (!winner) {
      const players = await gameService.getGamePlayers(gameState.game.id);
      setGameState((prev) => ({ ...prev, players }));
    }
  };

  const startNextRound = async () => {
    if (!gameState.game) throw new Error('No active game');

    await gameService.rotateVIP(gameState.game.id);

    const { data: updatedGame } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameState.game.id)
      .single();

    if (updatedGame) {
      setGameState((prev) => ({
        ...prev,
        game: updatedGame,
      }));

      await startRound();
    }
  };

  const leaveGame = () => {
    if (realtimeChannel) {
      realtimeChannel.unsubscribe();
    }
    setGameState(initialState);
  };

  const updateTopicItems = async (topicId: string, items: string[]) => {
    if (!gameState.game) throw new Error('No active game');

    await gameService.saveTopicOverride(gameState.game.id, topicId, items);

    const topics = await gameService.getAllTopics();
    setGameState((prev) => ({ ...prev, topics }));
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        createGame,
        joinGame,
        startRound,
        selectTopic,
        passTurn,
        submitVIPRanking,
        submitPlayerGuess,
        revealNext,
        completeRound,
        startNextRound,
        leaveGame,
        updateTopicItems,
      }}
    >
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
