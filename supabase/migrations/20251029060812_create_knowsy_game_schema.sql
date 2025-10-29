/*
  # Knowsy Game Platform - Complete Database Schema

  ## Overview
  This migration creates the complete database structure for the Knowsy game platform,
  including topics, games, players, rounds, rankings, and guesses with real-time sync support.

  ## New Tables

  ### `topics`
  Stores all game topics (default and custom)
  - `id` (uuid, primary key)
  - `name` (text) - Topic name
  - `flag` (int) - 0 for default, 1 for editable
  - `items` (jsonb) - Array of items for this topic
  - `creator_id` (uuid, nullable) - User who created custom topic
  - `is_global` (boolean) - Whether topic is available to all users
  - `created_at` (timestamptz)

  ### `games`
  Stores game instances
  - `id` (uuid, primary key)
  - `code` (text, unique) - 6-character join code
  - `creator_id` (uuid) - User who created the game
  - `current_vip_id` (uuid, nullable) - Current VIP player
  - `status` (text) - waiting, topic-selection, ranking, guessing, reveal, scoreboard, finished
  - `current_round` (int) - Current round number
  - `target_score` (int) - Score needed to win
  - `points_per_correct` (int) - Points awarded per correct guess
  - `bonus_all_correct` (int) - Bonus for getting all correct
  - `penalty_all_wrong` (int) - Penalty for getting all wrong
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `game_players`
  Tracks players in each game
  - `id` (uuid, primary key)
  - `game_id` (uuid, foreign key)
  - `user_id` (uuid)
  - `player_name` (text)
  - `score` (int) - Current total score
  - `joined_at` (timestamptz) - Used for VIP rotation order
  - `is_active` (boolean) - Whether player is still in game

  ### `rounds`
  Stores information about each game round
  - `id` (uuid, primary key)
  - `game_id` (uuid, foreign key)
  - `round_number` (int)
  - `topic_id` (uuid, foreign key)
  - `vip_player_id` (uuid, foreign key)
  - `vip_ranking` (jsonb) - Array of item IDs in VIP's order
  - `reveal_index` (int) - Current reveal position (-1 = not started, 0-9 = positions)
  - `status` (text) - topic-selection, ranking, guessing, revealing, completed
  - `created_at` (timestamptz)

  ### `player_guesses`
  Stores each player's guess for a round
  - `id` (uuid, primary key)
  - `round_id` (uuid, foreign key)
  - `player_id` (uuid, foreign key)
  - `guess_ranking` (jsonb) - Array of item IDs in player's guessed order
  - `score` (int) - Points earned this round
  - `submitted_at` (timestamptz)

  ### `game_topic_overrides`
  Stores custom item lists for FLAG:1 topics per game instance
  - `id` (uuid, primary key)
  - `game_id` (uuid, foreign key)
  - `topic_id` (uuid, foreign key)
  - `custom_items` (jsonb) - Overridden items array
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Policies restrict access based on game participation and ownership
  - VIP-only actions protected by policies
  - Creator-only settings protected

  ## Indexes
  - Game code lookup
  - Player game queries
  - Round queries by game
  - Real-time subscription optimization
*/

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  flag int DEFAULT 0,
  items jsonb NOT NULL,
  creator_id uuid,
  is_global boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  creator_id uuid NOT NULL,
  current_vip_id uuid,
  status text DEFAULT 'waiting',
  current_round int DEFAULT 0,
  target_score int DEFAULT 10,
  points_per_correct int DEFAULT 1,
  bonus_all_correct int DEFAULT 3,
  penalty_all_wrong int DEFAULT -2,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create game_players table
CREATE TABLE IF NOT EXISTS game_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  player_name text NOT NULL,
  score int DEFAULT 0,
  joined_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Create rounds table
CREATE TABLE IF NOT EXISTS rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  round_number int NOT NULL,
  topic_id uuid REFERENCES topics(id),
  vip_player_id uuid REFERENCES game_players(id),
  vip_ranking jsonb,
  reveal_index int DEFAULT -1,
  status text DEFAULT 'topic-selection',
  created_at timestamptz DEFAULT now()
);

-- Create player_guesses table
CREATE TABLE IF NOT EXISTS player_guesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id uuid NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES game_players(id),
  guess_ranking jsonb NOT NULL,
  score int DEFAULT 0,
  submitted_at timestamptz DEFAULT now()
);

-- Create game_topic_overrides table
CREATE TABLE IF NOT EXISTS game_topic_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  topic_id uuid NOT NULL REFERENCES topics(id),
  custom_items jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(game_id, topic_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_games_code ON games(code);
CREATE INDEX IF NOT EXISTS idx_game_players_game_id ON game_players(game_id);
CREATE INDEX IF NOT EXISTS idx_game_players_user_id ON game_players(user_id);
CREATE INDEX IF NOT EXISTS idx_rounds_game_id ON rounds(game_id);
CREATE INDEX IF NOT EXISTS idx_player_guesses_round_id ON player_guesses(round_id);
CREATE INDEX IF NOT EXISTS idx_player_guesses_player_id ON player_guesses(player_id);

-- Enable Row Level Security
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_guesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_topic_overrides ENABLE ROW LEVEL SECURITY;

-- RLS Policies for topics
CREATE POLICY "Anyone can view global topics"
  ON topics FOR SELECT
  USING (is_global = true OR creator_id = auth.uid());

CREATE POLICY "Authenticated users can create topics"
  ON topics FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update own topics"
  ON topics FOR UPDATE
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

-- RLS Policies for games
CREATE POLICY "Users can view games they participate in"
  ON games FOR SELECT
  USING (
    creator_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM game_players
      WHERE game_players.game_id = games.id
      AND game_players.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create games"
  ON games FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Game creators and VIPs can update games"
  ON games FOR UPDATE
  TO authenticated
  USING (
    creator_id = auth.uid() OR
    current_vip_id IN (
      SELECT id FROM game_players
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    creator_id = auth.uid() OR
    current_vip_id IN (
      SELECT id FROM game_players
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for game_players
CREATE POLICY "Users can view players in their games"
  ON game_players FOR SELECT
  USING (
    user_id = auth.uid() OR
    game_id IN (
      SELECT game_id FROM game_players
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join games"
  ON game_players FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own player data"
  ON game_players FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for rounds
CREATE POLICY "Users can view rounds in their games"
  ON rounds FOR SELECT
  USING (
    game_id IN (
      SELECT game_id FROM game_players
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "VIPs can create rounds"
  ON rounds FOR INSERT
  TO authenticated
  WITH CHECK (
    vip_player_id IN (
      SELECT id FROM game_players
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "VIPs can update their rounds"
  ON rounds FOR UPDATE
  TO authenticated
  USING (
    vip_player_id IN (
      SELECT id FROM game_players
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    vip_player_id IN (
      SELECT id FROM game_players
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for player_guesses
CREATE POLICY "Users can view guesses in their rounds"
  ON player_guesses FOR SELECT
  USING (
    round_id IN (
      SELECT rounds.id FROM rounds
      INNER JOIN game_players ON rounds.game_id = game_players.game_id
      WHERE game_players.user_id = auth.uid()
    )
  );

CREATE POLICY "Players can submit guesses"
  ON player_guesses FOR INSERT
  TO authenticated
  WITH CHECK (
    player_id IN (
      SELECT id FROM game_players
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for game_topic_overrides
CREATE POLICY "Users can view overrides in their games"
  ON game_topic_overrides FOR SELECT
  USING (
    game_id IN (
      SELECT game_id FROM game_players
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Game creators can create overrides"
  ON game_topic_overrides FOR INSERT
  TO authenticated
  WITH CHECK (
    game_id IN (
      SELECT id FROM games
      WHERE creator_id = auth.uid()
    )
  );

CREATE POLICY "Game creators can update overrides"
  ON game_topic_overrides FOR UPDATE
  TO authenticated
  USING (
    game_id IN (
      SELECT id FROM games
      WHERE creator_id = auth.uid()
    )
  )
  WITH CHECK (
    game_id IN (
      SELECT id FROM games
      WHERE creator_id = auth.uid()
    )
  );