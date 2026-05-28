import { describe, expect, it } from 'vitest';
import {
    analyzeBoard,
    findBlockingMoves,
    findWinningMoves,
    getLegalMoves,
    getMissedThreats,
    rankMovesByCenterPreference,
} from '@/lib/game/analysis';
import { createEmptyBoard } from '@/lib/game/board';
import { Board, PlayerId } from '@/types/game';

type Disc = Exclude<PlayerId, null>;

function boardWithDiscs(discs: ReadonlyArray<readonly [number, number, Disc]>): Board {
    const board = createEmptyBoard();

    for (const [row, column, player] of discs) {
        board[row][column] = player;
    }

    return board;
}

describe('Connect Four - Tactical Analysis', () => {
    describe('getLegalMoves', () => {
        it('returns every non-full column in ascending board order', () => {
            const board = boardWithDiscs([
                [0, 0, 'player1'],
                [1, 0, 'player2'],
                [2, 0, 'player1'],
                [3, 0, 'player2'],
                [4, 0, 'player1'],
                [5, 0, 'player2'],
                [0, 6, 'player1'],
                [1, 6, 'player2'],
                [2, 6, 'player1'],
                [3, 6, 'player2'],
                [4, 6, 'player1'],
                [5, 6, 'player2'],
            ]);

            expect(getLegalMoves(board)).toEqual([1, 2, 3, 4, 5]);
        });
    });

    describe('findWinningMoves', () => {
        const cases = [
            {
                name: 'horizontal win',
                player: 'player1',
                discs: [
                    [5, 0, 'player1'],
                    [5, 1, 'player1'],
                    [5, 2, 'player1'],
                ],
                expected: [3],
            },
            {
                name: 'vertical win',
                player: 'player2',
                discs: [
                    [5, 4, 'player2'],
                    [4, 4, 'player2'],
                    [3, 4, 'player2'],
                ],
                expected: [4],
            },
            {
                name: 'supported diagonal win',
                player: 'player1',
                discs: [
                    [5, 0, 'player1'],
                    [5, 1, 'player2'],
                    [4, 1, 'player1'],
                    [5, 2, 'player2'],
                    [4, 2, 'player2'],
                    [3, 2, 'player1'],
                    [5, 3, 'player2'],
                    [4, 3, 'player2'],
                    [3, 3, 'player2'],
                ],
                expected: [3],
            },
        ] as const;

        it.each(cases)('finds an immediate $name', ({ player, discs, expected }) => {
            expect(findWinningMoves(boardWithDiscs(discs), player)).toEqual(expected);
        });
    });

    describe('findBlockingMoves', () => {
        it('returns current player moves that stop opponent immediate wins', () => {
            const board = boardWithDiscs([
                [5, 1, 'player2'],
                [5, 2, 'player2'],
                [5, 3, 'player2'],
            ]);

            expect(findBlockingMoves(board, 'player1')).toEqual([0, 4]);
        });
    });

    describe('rankMovesByCenterPreference', () => {
        it('ranks by distance from the center column and keeps symmetric columns left-to-right', () => {
            expect(rankMovesByCenterPreference([0, 1, 2, 3, 4, 5, 6])).toEqual([3, 2, 4, 1, 5, 0, 6]);
            expect(rankMovesByCenterPreference([6, 2, 4, 0])).toEqual([2, 4, 0, 6]);
        });
    });

    describe('getMissedThreats', () => {
        it('identifies opponent next-turn wins that the last player must block', () => {
            const board = boardWithDiscs([
                [5, 2, 'player2'],
                [5, 3, 'player2'],
                [5, 4, 'player2'],
            ]);

            expect(getMissedThreats(board, 'player1')).toEqual([
                { player: 'player2', winningMove: 1 },
                { player: 'player2', winningMove: 5 },
            ]);
        });
    });

    describe('analyzeBoard Intelligence (Minimax)', () => {
        it('recognizes a strategic setup (horizontal 2-in-a-row in center)', () => {
            const board = boardWithDiscs([
                [5, 3, 'player1'],
                [5, 4, 'player1'],
            ]);
            // Playing in column 2 or 5 creates a 3-in-a-row with high potential.
            // Minimax should prefer 2 or 5 over others (due to higher window scores).
            const analysis = analyzeBoard(board, 'player1', 3);
            expect([2, 5]).toContain(analysis.bestMove);
        });

        it('blocks a vertical threat before it becomes an immediate win', () => {
            const board = boardWithDiscs([
                [5, 3, 'player2'],
                [4, 3, 'player2'],
            ]);
            const analysis = analyzeBoard(board, 'player1', 3);
            expect(analysis.bestMove).toBe(3);
        });
    });

    describe('analyzeBoard', () => {
        it('exposes one shared tactical result for bot, hints, and coach callers', () => {
            const board = boardWithDiscs([
                [5, 0, 'player1'],
                [5, 1, 'player1'],
                [5, 2, 'player1'],
                [5, 4, 'player2'],
                [5, 5, 'player2'],
                [5, 6, 'player2'],
            ]);

            expect(analyzeBoard(board, 'player1')).toMatchObject({
                legalMoves: [0, 1, 2, 3, 4, 5, 6],
                winningMoves: [3],
                blockingMoves: [3],
                centerPreferredMoves: [3, 2, 4, 1, 5, 0, 6],
                threats: [{ player: 'player2', winningMove: 3 }],
            });
        });
    });
});
