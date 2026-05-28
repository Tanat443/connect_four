import { Difficulty, GameMode } from './game';

export type MatchStatus = 'playing' | 'won' | 'draw' | 'abandoned';

export interface MatchSummary {
    id: string; // UUID
    game_mode: GameMode;
    player_1_id: string | null;
    player_2_id: string | null;
    bot_difficulty: Difficulty | null;
    status: MatchStatus;
    winner_id: string | null;
    move_count: number;
    coach_insight: string | null;
    reward_label: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface Profile {
    id: string;
    email: string | null;
    display_name: string;
    city: string | null;
    avatar_url: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface LeaderboardEntry {
    user_id: string;
    rating: number;
    matches_played: number;
    wins_bot: number;
    wins_online: number;
    updated_at: string;
    profile?: Profile; // Optional join
}

export type Database = {
    public: {
        Tables: {
            matches: {
                Row: MatchSummary;
                Insert: MatchSummary;
                Update: Partial<MatchSummary>;
                Relationships: [
                    {
                        foreignKeyName: "matches_player_1_id_fkey";
                        columns: ["player_1_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "matches_player_2_id_fkey";
                        columns: ["player_2_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "matches_winner_id_fkey";
                        columns: ["winner_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            profiles: {
                Row: Profile;
                Insert: Profile;
                Update: Partial<Profile>;
                Relationships: [];
            };
            leaderboards: {
                Row: LeaderboardEntry;
                Insert: LeaderboardEntry;
                Update: Partial<LeaderboardEntry>;
                Relationships: [
                    {
                        foreignKeyName: "leaderboards_user_id_fkey";
                        columns: ["user_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            game_mode: GameMode;
            match_status: MatchStatus;
            bot_difficulty: Difficulty;
        };
    };
};
