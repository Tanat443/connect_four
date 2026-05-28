import { AppResult } from '@/types/game';
import { LeaderboardEntry, Profile } from '@/types/supabase';
import { supabase } from './client';

export type CityLeaderboardRow = LeaderboardEntry & {
    profile: Profile | null;
};

type SupabaseError = { message: string };
type LeaderboardTable = {
    select: (columns: string) => {
        eq: (column: string, value: string) => {
            order: (column: string, options: { ascending: boolean }) => {
                limit: (count: number) => Promise<{ data: unknown; error: SupabaseError | null }>;
            };
        };
    };
};

export async function getCityLeaderboard(city: string): Promise<AppResult<CityLeaderboardRow[]>> {
    const normalizedCity = city.trim();

    if (!normalizedCity) {
        return { ok: true, data: [] };
    }

    const table = supabase.from('leaderboards') as unknown as LeaderboardTable;
    const { data, error } = await table
        .select(`
            user_id,
            rating,
            matches_played,
            wins_bot,
            wins_online,
            updated_at,
            profile:profiles!leaderboards_user_id_fkey (
                id,
                email,
                display_name,
                city,
                avatar_url,
                created_at,
                updated_at
            )
        `)
        .eq('profile.city', normalizedCity)
        .order('rating', { ascending: false })
        .limit(5);

    return error
        ? { ok: false, code: 'SUPABASE_LEADERBOARD_ERROR', message: error.message }
        : { ok: true, data: data as CityLeaderboardRow[] };
}
