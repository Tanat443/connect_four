import { Reward } from '@/types/rewards';

export type RewardMatchSummary = {
    winner: string | null;
    mode: string;
    difficulty: string | null;
    move_count: number;
};

/**
 * Pure logic to select a reward based on match outcome.
 * This does not perform any side effects.
 */
export function selectReward(
    summary: RewardMatchSummary,
    isFirstMatch: boolean
): Reward | null {
    // 1. Reward for the very first match completed (Win or Loss)
    if (isFirstMatch) {
        return {
            id: 'first-match-badge',
            type: 'BADGE',
            label: 'Starter Baker',
            description: 'You completed your first match in the cake marketplace!',
            icon: 'CakeSlice',
        };
    }

    // 2. Reward for winning against a bot (Medium or Hard)
    if (summary.winner === 'player1' && summary.mode === 'bot') {
        if (summary.difficulty === 'medium') {
            return {
                id: 'medium-bot-conqueror',
                type: 'PROMO',
                label: '10% Sweet Discount',
                description: 'You defeated the Medium Bot! Use this code for a real treat.',
                icon: 'Ticket',
                code: 'CAKE10',
            };
        }
        if (summary.difficulty === 'hard') {
            return {
                id: 'hard-bot-master',
                type: 'PROMO',
                label: '25% Master Baker Discount',
                description: 'Incredible! You outsmarted the Hard Bot.',
                icon: 'Trophy',
                code: 'MASTER25',
            };
        }
    }

    // 3. Reward for a quick win (fewer than 10 moves)
    if (summary.winner === 'player1' && summary.move_count <= 10) {
        return {
            id: 'speedy-win-badge',
            type: 'BADGE',
            label: 'Quick Reflexes',
            description: 'You won the match in record time!',
            icon: 'Zap',
        };
    }

    return null;
}
