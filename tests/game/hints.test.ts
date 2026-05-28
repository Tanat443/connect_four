import { describe, expect, it } from 'vitest';
import { createEmptyBoard } from '@/lib/game/board';
import { getHintMove } from '@/lib/game/hints';
import { createInitialMatchState, matchReducer } from '@/lib/game/reducer';
import { Board, PlayerId } from '@/types/game';

type Disc = Exclude<PlayerId, null>;

function boardWithDiscs(discs: ReadonlyArray<readonly [number, number, Disc]>): Board {
    const board = createEmptyBoard();

    for (const [row, column, player] of discs) {
        board[row][column] = player;
    }

    return board;
}

describe('Connect Four - Player Hints', () => {
    it('returns the same best move exposed by the shared Minimax tactical engine', () => {
        const board = boardWithDiscs([
            [5, 0, 'player1'],
            [5, 1, 'player1'],
            [5, 2, 'player1'],
        ]);

        expect(getHintMove(board, 'player1')).toMatchObject({
            column: 3,
            source: 'minimax',
        });
    });

    it('returns null when no active player can be hinted', () => {
        expect(getHintMove(createEmptyBoard(), null)).toBeNull();
    });

    it('stores the hinted column in match state through SHOW_HINT', () => {
        const state = createInitialMatchState();

        const nextState = matchReducer(state, { type: 'SHOW_HINT' });

        expect(nextState.hintColumn).toBe(3);
    });

    it('clears a visible hint as soon as a move is made', () => {
        const stateWithHint = matchReducer(createInitialMatchState(), { type: 'SHOW_HINT' });

        const nextState = matchReducer(stateWithHint, { type: 'DROP_DISC', column: 3 });

        expect(nextState.hintColumn).toBeNull();
        expect(nextState.board[5][3]).toBe('player1');
    });

    it('clears a visible hint when the match is reset', () => {
        const stateWithHint = matchReducer(createInitialMatchState(), { type: 'SHOW_HINT' });

        expect(matchReducer(stateWithHint, { type: 'RESET_MATCH' }).hintColumn).toBeNull();
    });
});
