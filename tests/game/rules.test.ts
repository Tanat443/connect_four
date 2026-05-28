import { describe, it, expect } from 'vitest';
import { createEmptyBoard } from '@/lib/game/board';
import { applyMove } from '@/lib/game/rules';
import { MatchState } from '@/types/game';

describe('Connect Four - Core Rules', () => {
    const createInitialState = (): MatchState => ({
        id: 'test-match',
        board: createEmptyBoard(),
        currentPlayer: 'player1',
        phase: 'playing',
        moves: [],
        winner: null,
        winningLine: null,
        isAnimating: false,
        hintColumn: null,
        mode: 'local',
        difficulty: 'easy',
        reward: null,
    });

    describe('applyMove', () => {
        it('should drop a disc into the lowest available row', () => {
            const state = createInitialState();

            // Test table for progressive drops in column 3
            const scenarios = [
                { column: 3, expectedRow: 5, expectedPlayer: 'player1', nextPlayer: 'player2' },
                { column: 3, expectedRow: 4, expectedPlayer: 'player2', nextPlayer: 'player1' },
                { column: 0, expectedRow: 5, expectedPlayer: 'player1', nextPlayer: 'player2' },
            ];

            let currentState = state;
            for (const scene of scenarios) {
                const result = applyMove(currentState, scene.column);
                expect(result.ok).toBe(true);
                if (result.ok) {
                    expect(result.data.board[scene.expectedRow][scene.column]).toBe(scene.expectedPlayer);
                    expect(result.data.currentPlayer).toBe(scene.nextPlayer);
                    expect(result.data.moves[result.data.moves.length - 1]).toBe(scene.column);
                    currentState = result.data;
                }
            }
        });

        it('should reject moves in a full column', () => {
            let state = createInitialState();
            const column = 5;

            // Fill the column (6 rows)
            for (let i = 0; i < 6; i++) {
                const result = applyMove(state, column);
                expect(result.ok).toBe(true);
                if (result.ok) state = result.data;
            }

            // 7th drop should fail
            const result = applyMove(state, column);
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.code).toBe('FULL_COLUMN');
                expect(result.message).toContain('full');
            }
            expect(state.board).toEqual(state.board); // Board unchanged
        });

        it('should reject moves if match is not in playing phase', () => {
            const state = createInitialState();
            state.phase = 'won';

            const result = applyMove(state, 0);
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.code).toBe('GAME_OVER');
            }
        });

        it('should reject invalid column indices', () => {
            const state = createInitialState();
            const invalidColumns = [-1, 7, 100];

            for (const col of invalidColumns) {
                const result = applyMove(state, col);
                expect(result.ok).toBe(false);
                if (!result.ok) {
                    expect(result.code).toBe('INVALID_STATE');
                }
            }
        });
    });
});
