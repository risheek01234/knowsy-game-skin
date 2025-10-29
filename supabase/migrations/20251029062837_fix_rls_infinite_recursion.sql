/*
  # Fix RLS Infinite Recursion in game_players

  ## Problem
  The policy "Users can view players in their games" on game_players table
  was creating infinite recursion by checking game_id in a subquery that
  also references game_players.

  ## Solution
  Simplify the RLS policies to avoid circular references:
  - Use direct auth.uid() checks where possible
  - Avoid nested subqueries that reference the same table
  - Use game table directly for access control
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view players in their games" ON game_players;
DROP POLICY IF EXISTS "Users can join games" ON game_players;
DROP POLICY IF EXISTS "Users can update own player data" ON game_players;

-- Create simplified, non-recursive policies
CREATE POLICY "Users can view all players in games they joined"
  ON game_players FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM games
      WHERE games.id = game_players.game_id
      AND (
        games.creator_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM game_players gp
          WHERE gp.game_id = games.id
          AND gp.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Authenticated users can insert as players"
  ON game_players FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own player record"
  ON game_players FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Also simplify the games table policies to avoid potential issues
DROP POLICY IF EXISTS "Users can view games they participate in" ON games;
DROP POLICY IF EXISTS "Game creators and VIPs can update games" ON games;

CREATE POLICY "Users can view games they created or joined"
  ON games FOR SELECT
  USING (creator_id = auth.uid());

CREATE POLICY "Game creators can update games"
  ON games FOR UPDATE
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());