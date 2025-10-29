/*
  # Final Fix for RLS Infinite Recursion

  ## Problem
  Even the previous fix still had potential for recursion because it checked
  game_players in a subquery while defining a policy for game_players.

  ## Solution
  Use a completely different approach:
  1. Allow users to view game_players records for games they created
  2. Allow users to view their own game_players records
  3. Simplify by removing nested game_players queries
*/

-- Drop all existing game_players policies
DROP POLICY IF EXISTS "Users can view all players in games they joined" ON game_players;
DROP POLICY IF EXISTS "Authenticated users can insert as players" ON game_players;
DROP POLICY IF EXISTS "Users can update their own player record" ON game_players;

-- Create simple, non-recursive policies for game_players
CREATE POLICY "Users can view players in games they created"
  ON game_players FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM games
      WHERE games.id = game_players.game_id
      AND games.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own player records"
  ON game_players FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can join games as players"
  ON game_players FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own player data"
  ON game_players FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Also fix the games policies to be simpler
DROP POLICY IF EXISTS "Users can view games they created or joined" ON games;
DROP POLICY IF EXISTS "Game creators can update games" ON games;

CREATE POLICY "Users can view games they created"
  ON games FOR SELECT
  USING (creator_id = auth.uid());

CREATE POLICY "Users can view games where they are a player"
  ON games FOR SELECT
  USING (
    id IN (
      SELECT game_id FROM game_players WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Game creators can update their games"
  ON games FOR UPDATE
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());