import { describe, expect, it } from 'vitest';
import { createEmptyBoard } from '@/lib/game/board';
import { createInitialMatchState, matchReducer } from '@/lib/game/reducer';
import { MatchState } from '@/types/game';

describe('Connect Four - Match Reducer', () => {
    it('creates an idle empty match state for player 1', () => {
        expect(createInitialMatchState()).toEqual<MatchState>({
            board: createEmptyBoard(),
            currentPlayer: 'player1',
            phase: 'idle',
            moves: [],
            winner: null,
            winningLine: [],
            isAnimating: false,
        });
    });

    it('drops a disc from idle, starts play, and switches to player 2', () => {
        const state = createInitialMatchState();

        const nextState = matchReducer(state, { type: 'DROP_DISC', column: 3 });

        expect(nextState.phase).toBe('playing');
        expect(nextState.board[5][3]).toBe('player1');
        expect(nextState.currentPlayer).toBe('player2');
        expect(nextState.moves).toEqual([3]);
        expect(nextState.isAnimating).toBe(true);
    });

    it('ignores drop actions while animation is locked', () => {
        const state = {
            ...createInitialMatchState(),
            phase: 'playing',
            isAnimating: true,
        } satisfies MatchState;

        expect(matchReducer(state, { type: 'DROP_DISC', column: 2 })).toBe(state);
    });

    it('unlocks the board when animation finishes', () => {
        const state = {
            ...createInitialMatchState(),
            phase: 'playing',
            isAnimating: true,
        } satisfies MatchState;

        expect(matchReducer(state, { type: 'FINISH_ANIMATION' })).toEqual({
            ...state,
            isAnimating: false,
        });
    });

    it('resets the match to a fresh idle state', () => {
        const state = matchReducer(createInitialMatchState(), { type: 'DROP_DISC', column: 0 });

        expect(matchReducer(state, { type: 'RESET_MATCH' })).toEqual(createInitialMatchState());
    });

    it('resets winner and winning line after a completed match', () => {
        const wonState = {
            ...createInitialMatchState(),
            board: [
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                ['player1', 'player1', 'player1', 'player1', null, null, null],
            ],
            phase: 'won',
            winner: 'player1',
            winningLine: [
                [5, 0],
                [5, 1],
                [5, 2],
                [5, 3],
            ],
        } satisfies MatchState;

        expect(matchReducer(wonState, { type: 'RESET_MATCH' })).toEqual(createInitialMatchState());
    });
});
