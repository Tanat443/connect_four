import { supabase } from './client';
import { MatchSummary } from '@/types/supabase';
import { AppResult } from '@/types/game';

type SupabaseError = { message: string };
type MatchesTable = {
    insert: (summary: MatchSummary) => {
        select: () => {
            single: () => Promise<{ data: unknown; error: SupabaseError | null }>;
        };
    };
};

export async function saveMatchSummary(summary: MatchSummary): Promise<AppResult<MatchSummary>> {
    if (!summary.player_1_id) {
        return { ok: true, data: summary };
    }

    try {
        const table = supabase.from('matches') as unknown as MatchesTable;
        const { data, error } = await table
            .insert(summary)
            .select()
            .single();

        if (error) {
            console.error('Supabase save error:', error);
            return {
                ok: false,
                code: 'SUPABASE_ERROR',
                message: error.message,
            };
        }

        return { ok: true, data: data as MatchSummary };
    } catch (err) {
        console.error('Unexpected persistence error:', err);
        return {
            ok: false,
            code: 'UNEXPECTED_ERROR',
            message: err instanceof Error ? err.message : 'Unknown error',
        };
    }
}
