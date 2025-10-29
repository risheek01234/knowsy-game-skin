import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      topics: {
        Row: {
          id: string;
          name: string;
          flag: number;
          items: string[];
          creator_id: string | null;
          is_global: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          flag?: number;
          items: string[];
          creator_id?: string | null;
          is_global?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          flag?: number;
          items?: string[];
          creator_id?: string | null;
          is_global?: boolean;
          created_at?: string;
        };
      };
      games: {
        Row: {
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          creator_id: string;
          current_vip_id?: string | null;
          status?: string;
          current_round?: number;
          target_score?: number;
          points_per_correct?: number;
          bonus_all_correct?: number;
          penalty_all_wrong?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          creator_id?: string;
          current_vip_id?: string | null;
          status?: string;
          current_round?: number;
          target_score?: number;
          points_per_correct?: number;
          bonus_all_correct?: number;
          penalty_all_wrong?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      game_players: {
        Row: {
          id: string;
          game_id: string;
          user_id: string;
          player_name: string;
          score: number;
          joined_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          game_id: string;
          user_id: string;
          player_name: string;
          score?: number;
          joined_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          game_id?: string;
          user_id?: string;
          player_name?: string;
          score?: number;
          joined_at?: string;
          is_active?: boolean;
        };
      };
      rounds: {
        Row: {
          id: string;
          game_id: string;
          round_number: number;
          topic_id: string | null;
          vip_player_id: string | null;
          vip_ranking: string[] | null;
          reveal_index: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          round_number: number;
          topic_id?: string | null;
          vip_player_id?: string | null;
          vip_ranking?: string[] | null;
          reveal_index?: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          game_id?: string;
          round_number?: number;
          topic_id?: string | null;
          vip_player_id?: string | null;
          vip_ranking?: string[] | null;
          reveal_index?: number;
          status?: string;
          created_at?: string;
        };
      };
      player_guesses: {
        Row: {
          id: string;
          round_id: string;
          player_id: string;
          guess_ranking: string[];
          score: number;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          round_id: string;
          player_id: string;
          guess_ranking: string[];
          score?: number;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          round_id?: string;
          player_id?: string;
          guess_ranking?: string[];
          score?: number;
          submitted_at?: string;
        };
      };
      game_topic_overrides: {
        Row: {
          id: string;
          game_id: string;
          topic_id: string;
          custom_items: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          topic_id: string;
          custom_items: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          game_id?: string;
          topic_id?: string;
          custom_items?: string[];
          created_at?: string;
        };
      };
    };
  };
}
