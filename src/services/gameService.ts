import { supabase } from '@/lib/supabase';

export const gameService = {
  async createGame(userId: string, settings?: {
    targetScore?: number;
    pointsPerCorrect?: number;
    bonusAllCorrect?: number;
    penaltyAllWrong?: number;
  }) {
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();

    const { data: game, error: gameError } = await supabase
      .from('games')
      .insert({
        code,
        creator_id: userId,
        status: 'waiting',
        target_score: settings?.targetScore || 10,
        points_per_correct: settings?.pointsPerCorrect || 1,
        bonus_all_correct: settings?.bonusAllCorrect || 3,
        penalty_all_wrong: settings?.penaltyAllWrong || -2,
      })
      .select()
      .single();

    if (gameError) throw gameError;

    const { data: player, error: playerError } = await supabase
      .from('game_players')
      .insert({
        game_id: game.id,
        user_id: userId,
        player_name: 'Host',
      })
      .select()
      .single();

    if (playerError) throw playerError;

    await supabase
      .from('games')
      .update({ current_vip_id: player.id })
      .eq('id', game.id);

    return { game, player };
  },

  async joinGame(code: string, userId: string, playerName: string) {
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (gameError) throw new Error('Game not found');

    const { data: existingPlayer } = await supabase
      .from('game_players')
      .select('*')
      .eq('game_id', game.id)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingPlayer) {
      return { game, player: existingPlayer };
    }

    const { data: player, error: playerError } = await supabase
      .from('game_players')
      .insert({
        game_id: game.id,
        user_id: userId,
        player_name: playerName,
      })
      .select()
      .single();

    if (playerError) throw playerError;

    return { game, player };
  },

  async getGamePlayers(gameId: string) {
    const { data, error } = await supabase
      .from('game_players')
      .select('*')
      .eq('game_id', gameId)
      .eq('is_active', true)
      .order('joined_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getAllTopics() {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('is_global', true)
      .order('name');

    if (error) throw error;
    return data;
  },

  async startRound(gameId: string, vipPlayerId: string, roundNumber: number) {
    const { data, error } = await supabase
      .from('rounds')
      .insert({
        game_id: gameId,
        round_number: roundNumber,
        vip_player_id: vipPlayerId,
        status: 'topic-selection',
      })
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from('games')
      .update({
        status: 'topic-selection',
        current_round: roundNumber
      })
      .eq('id', gameId);

    return data;
  },

  async selectTopic(roundId: string, topicId: string) {
    const { data, error } = await supabase
      .from('rounds')
      .update({
        topic_id: topicId,
        status: 'ranking'
      })
      .eq('id', roundId)
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from('games')
      .update({ status: 'ranking' })
      .eq('id', data.game_id);

    return data;
  },

  async submitVIPRanking(roundId: string, ranking: string[]) {
    const { data, error } = await supabase
      .from('rounds')
      .update({
        vip_ranking: ranking,
        status: 'guessing'
      })
      .eq('id', roundId)
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from('games')
      .update({ status: 'guessing' })
      .eq('id', data.game_id);

    return data;
  },

  async submitPlayerGuess(roundId: string, playerId: string, guessRanking: string[]) {
    const { data, error } = await supabase
      .from('player_guesses')
      .insert({
        round_id: roundId,
        player_id: playerId,
        guess_ranking: guessRanking,
        score: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async checkAllGuessesSubmitted(roundId: string, gameId: string) {
    const [playersResult, guessesResult, roundResult] = await Promise.all([
      supabase
        .from('game_players')
        .select('id')
        .eq('game_id', gameId)
        .eq('is_active', true),
      supabase
        .from('player_guesses')
        .select('player_id')
        .eq('round_id', roundId),
      supabase
        .from('rounds')
        .select('vip_player_id')
        .eq('id', roundId)
        .single()
    ]);

    if (playersResult.error || guessesResult.error || roundResult.error) {
      throw new Error('Failed to check guesses');
    }

    const nonVIPPlayers = playersResult.data.filter(
      p => p.id !== roundResult.data.vip_player_id
    );
    const submittedPlayerIds = new Set(guessesResult.data.map(g => g.player_id));

    const allSubmitted = nonVIPPlayers.every(p => submittedPlayerIds.has(p.id));

    if (allSubmitted) {
      await supabase
        .from('rounds')
        .update({ status: 'revealing' })
        .eq('id', roundId);

      await supabase
        .from('games')
        .update({ status: 'reveal' })
        .eq('id', gameId);
    }

    return allSubmitted;
  },

  async updateRevealIndex(roundId: string, index: number) {
    const { data, error } = await supabase
      .from('rounds')
      .update({ reveal_index: index })
      .eq('id', roundId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async calculateScores(roundId: string) {
    const { data: round } = await supabase
      .from('rounds')
      .select('*, game_id, vip_ranking')
      .eq('id', roundId)
      .single();

    if (!round || !round.vip_ranking) throw new Error('Round not found');

    const { data: game } = await supabase
      .from('games')
      .select('*')
      .eq('id', round.game_id)
      .single();

    if (!game) throw new Error('Game not found');

    const { data: guesses } = await supabase
      .from('player_guesses')
      .select('*')
      .eq('round_id', roundId);

    if (!guesses) return;

    for (const guess of guesses) {
      let score = 0;
      let correctCount = 0;

      for (let i = 0; i < round.vip_ranking.length; i++) {
        if (guess.guess_ranking[i] === round.vip_ranking[i]) {
          score += game.points_per_correct;
          correctCount++;
        }
      }

      if (correctCount === round.vip_ranking.length) {
        score += game.bonus_all_correct;
      } else if (correctCount === 0) {
        score += game.penalty_all_wrong;
      }

      await supabase
        .from('player_guesses')
        .update({ score })
        .eq('id', guess.id);

      const { data: player } = await supabase
        .from('game_players')
        .select('score')
        .eq('id', guess.player_id)
        .single();

      if (player) {
        await supabase
          .from('game_players')
          .update({ score: player.score + score })
          .eq('id', guess.player_id);
      }
    }
  },

  async completeRound(roundId: string, gameId: string) {
    await supabase
      .from('rounds')
      .update({ status: 'completed' })
      .eq('id', roundId);

    await supabase
      .from('games')
      .update({ status: 'scoreboard' })
      .eq('id', gameId);
  },

  async rotateVIP(gameId: string) {
    const { data: game } = await supabase
      .from('games')
      .select('current_vip_id')
      .eq('id', gameId)
      .single();

    if (!game) throw new Error('Game not found');

    const { data: players } = await supabase
      .from('game_players')
      .select('*')
      .eq('game_id', gameId)
      .eq('is_active', true)
      .order('joined_at', { ascending: true });

    if (!players || players.length === 0) throw new Error('No players found');

    const currentVIPIndex = players.findIndex(p => p.id === game.current_vip_id);
    const nextVIPIndex = (currentVIPIndex + 1) % players.length;
    const nextVIP = players[nextVIPIndex];

    await supabase
      .from('games')
      .update({ current_vip_id: nextVIP.id })
      .eq('id', gameId);

    return nextVIP;
  },

  async checkForWinner(gameId: string) {
    const { data: game } = await supabase
      .from('games')
      .select('target_score')
      .eq('id', gameId)
      .single();

    if (!game) throw new Error('Game not found');

    const { data: players } = await supabase
      .from('game_players')
      .select('*')
      .eq('game_id', gameId)
      .eq('is_active', true)
      .order('score', { ascending: false });

    if (!players || players.length === 0) return null;

    const topPlayer = players[0];
    if (topPlayer.score >= game.target_score) {
      await supabase
        .from('games')
        .update({ status: 'finished' })
        .eq('id', gameId);

      return topPlayer;
    }

    return null;
  },

  async getTopicItems(topicId: string, gameId?: string) {
    const { data: override } = gameId
      ? await supabase
          .from('game_topic_overrides')
          .select('custom_items')
          .eq('game_id', gameId)
          .eq('topic_id', topicId)
          .maybeSingle()
      : { data: null };

    if (override) {
      return override.custom_items;
    }

    const { data: topic } = await supabase
      .from('topics')
      .select('items')
      .eq('id', topicId)
      .single();

    return topic?.items || [];
  },

  async saveTopicOverride(gameId: string, topicId: string, customItems: string[]) {
    const { data, error } = await supabase
      .from('game_topic_overrides')
      .upsert({
        game_id: gameId,
        topic_id: topicId,
        custom_items: customItems,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
