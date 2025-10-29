/*
  # Add Security Definer Function to Break RLS Recursion

  ## Problem
  We need users to see games they've joined, but directly querying game_players
  from games policy creates infinite recursion.

  ## Solution
  Create a SECURITY DEFINER function that bypasses RLS to check if a user
  is in a game. This breaks the recursion chain because the function
  executes with elevated privileges and doesn't trigger RLS policies.

  ## Implementation
  1. Create a function that checks if user is a player in a game
  2. Use this function in the games SELECT policy
  3. Function runs as definer (bypasses RLS) so no recursion occurs
*/

-- Create a security definer function to check if user is in a game
CREATE OR REPLACE FUNCTION is_player_in_game(game_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM game_players
    WHERE game_id = game_uuid
    AND user_id = user_uuid
  );
$$;

-- Now add the policy for viewing games you've joined
-- This uses the security definer function, so it doesn't trigger RLS recursion
CREATE POLICY "Users can view games they joined"
  ON games FOR SELECT
  USING (is_player_in_game(id, auth.uid()));
