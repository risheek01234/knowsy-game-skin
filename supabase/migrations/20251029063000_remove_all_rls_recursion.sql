/*
  # Remove All RLS Recursion - Final Solution

  ## Problem
  The "Users can view games where they are a player" policy on games table
  queries game_players, which has policies that query games table.
  This creates a circular dependency: games -> game_players -> games

  ## Solution
  Remove the circular reference by dropping the problematic policy.
  Instead, rely on application-level joins or simplified policies that
  don't create cycles.

  ## Policies Strategy
  - games: Only allow viewing games you created directly
  - game_players: Only check games table (one-way reference, no cycle)
  - Application layer: Join tables as needed using service role if necessary
*/

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Users can view games where they are a player" ON games;

-- Keep only the simple creator policy for games
-- (The "Users can view games they created" policy from previous migration is already in place)

-- Verify game_players policies are non-recursive
-- (They should only reference games table, not query game_players within game_players policies)

-- Add a note: For viewing games you've joined, the application should:
-- 1. Query game_players to get game_ids for the user
-- 2. Then query games table with those IDs
-- Or use service role for certain operations that need full access
