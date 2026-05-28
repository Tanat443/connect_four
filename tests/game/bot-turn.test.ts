import { describe, expect, it } from 'vitest';
import { createInitialMatchState } from '@/lib/game/reducer';
import { shouldQueueBotMove } from '@/lib/game/bot-turn';
import { MatchState } from '@/types/game';

describe('Connect Four - Bot Turn Queueing', () => {
    it('queues a bot move only after the human move settles in bot mode', () => {
        const state = {
            ...createInitialMatchState('bot', 'medium'),
            phase: 'playing',
            currentPlayer: 'player2',
            isAnimating: false,
        } satisfies MatchState;

        expect(shouldQueueBotMove(state, false)).toBe(true);
    });

    it('does not queue while animating, thinking, completed, or in local mode', () => {
        const playableBotTurn = {
            ...createInitialMatchState('bot', 'medium'),
            phase: 'playing',
            currentPlayer: 'player2',
            isAnimating: false,
        } satisfies MatchState;

        expect(shouldQueueBotMove({ ...playableBotTurn, isAnimating: true }, false)).toBe(false);
        expect(shouldQueueBotMove(playableBotTurn, true)).toBe(false);
        expect(shouldQueueBotMove({ ...playableBotTurn, phase: 'won' }, false)).toBe(false);
        expect(shouldQueueBotMove({ ...playableBotTurn, mode: 'local' }, false)).toBe(false);
        expect(shouldQueueBotMove({ ...playableBotTurn, currentPlayer: 'player1' }, false)).toBe(false);
    });
});
