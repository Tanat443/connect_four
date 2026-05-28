import { describe, expect, it, vi } from 'vitest';
import { saveMatchSummary } from '@/lib/supabase/matches';
import { MatchSummary } from '@/types/supabase';

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
    supabase: {
        from: vi.fn(() => ({
            insert: vi.fn(() => ({
                select: vi.fn(() => ({
                    single: vi.fn(() => Promise.resolve({
                        data: {
                            id: 'test-uuid',
                            game_mode: 'local',
                            player_1_id: 'user-uuid',
                            status: 'won'
                        },
                        error: null
                    }))
                }))
            }))
        }))
    }
}));

describe('Supabase Persistence', () => {
    it('successfully saves a match summary', async () => {
        const summary: MatchSummary = {
            id: 'test-uuid',
            game_mode: 'local',
            player_1_id: 'user-uuid',
            player_2_id: null,
            bot_difficulty: null,
            status: 'won',
            winner_id: 'user-uuid',
            move_count: 10,
            coach_insight: null,
            reward_label: null,
        };

        const result = await saveMatchSummary(summary);

        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.data.id).toBe('test-uuid');
            expect(result.data.player_1_id).toBe('user-uuid');
        }
    });

    it('skips Supabase persistence for guest matches', async () => {
        const { supabase } = await import('@/lib/supabase/client');
        vi.mocked(supabase.from).mockClear();

        const summary: MatchSummary = {
            id: 'guest-uuid',
            game_mode: 'local',
            player_1_id: null,
            player_2_id: null,
            bot_difficulty: null,
            status: 'won',
            winner_id: null,
            move_count: 10,
            coach_insight: null,
            reward_label: null,
        };

        const result = await saveMatchSummary(summary);

        expect(result.ok).toBe(true);
        expect(supabase.from).not.toHaveBeenCalled();
    });

    it('handles Supabase errors gracefully for signed-in matches', async () => {
        const { supabase } = await import('@/lib/supabase/client');
        vi.mocked(supabase.from).mockReturnValueOnce({
            insert: vi.fn(() => ({
                select: vi.fn(() => ({
                    single: vi.fn(() => Promise.resolve({
                        data: null,
                        error: { message: 'Database error' }
                    }))
                }))
            }))
        } as unknown as ReturnType<typeof supabase.from>);

        const summary: MatchSummary = {
            id: 'fail-uuid',
            game_mode: 'local',
            player_1_id: 'user-uuid',
            player_2_id: null,
            bot_difficulty: null,
            status: 'won',
            winner_id: 'user-uuid',
            move_count: 10,
            coach_insight: null,
            reward_label: null,
        };

        const result = await saveMatchSummary(summary);

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.code).toBe('SUPABASE_ERROR');
            expect(result.message).toBe('Database error');
        }
    });
});
