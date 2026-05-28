import { describe, expect, it } from 'vitest';
import { RewardMatchSummary, selectReward } from '@/lib/game/rewards';

describe('Reward Selection Logic', () => {
    const baseSummary: RewardMatchSummary = {
        mode: 'local',
        winner: 'player1',
        move_count: 20,
        difficulty: 'easy',
    };

    it('grants a Starter Baker badge for the first match', () => {
        const reward = selectReward(baseSummary, true);
        expect(reward?.id).toBe('first-match-badge');
        expect(reward?.type).toBe('BADGE');
    });

    it('grants a promo code for defeating a medium bot', () => {
        const summary: RewardMatchSummary = { ...baseSummary, mode: 'bot', difficulty: 'medium' };
        const reward = selectReward(summary, false);
        expect(reward?.type).toBe('PROMO');
        expect(reward?.code).toBe('CAKE10');
    });

    it('grants a master discount for defeating a hard bot', () => {
        const summary: RewardMatchSummary = { ...baseSummary, mode: 'bot', difficulty: 'hard' };
        const reward = selectReward(summary, false);
        expect(reward?.code).toBe('MASTER25');
    });

    it('grants a speedy win badge for winning in 10 moves or fewer', () => {
        const summary: RewardMatchSummary = { ...baseSummary, move_count: 8 };
        const reward = selectReward(summary, false);
        expect(reward?.id).toBe('speedy-win-badge');
    });

    it('returns null if no conditions are met', () => {
        const summary: RewardMatchSummary = { ...baseSummary, winner: 'player2' };
        const reward = selectReward(summary, false);
        expect(reward).toBeNull();
    });
});
