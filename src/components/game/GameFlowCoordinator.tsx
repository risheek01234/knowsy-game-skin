import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';

export const GameFlowCoordinator = () => {
  const { gameState } = useGame();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!gameState.game) return;

    const currentPath = location.pathname;
    const status = gameState.game.status;

    const routeMap: Record<string, string> = {
      'waiting': '/game/waiting-room',
      'topic-selection': '/game/topic-selection',
      'ranking': gameState.isVIP ? '/game/vip-ranking' : '/game/vip-ranking',
      'guessing': '/game/player-guessing',
      'reveal': '/game/reveal',
      'scoreboard': '/game/scoreboard',
      'finished': '/game/game-over',
    };

    const targetRoute = routeMap[status];

    if (targetRoute && currentPath !== targetRoute && !currentPath.includes(targetRoute)) {
      navigate(targetRoute, { replace: true });
    }
  }, [gameState.game?.status, gameState.isVIP, navigate, location.pathname]);

  return null;
};
