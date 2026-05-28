import { describe, expect, it } from 'vitest';
import { createEmptyBoard } from '@/lib/game/board';
import { checkWin, isDraw } from '@/lib/game/win-detection';
import { Board, PlayerId } from '@/types/game';

type Disc = Exclude<PlayerId, null>;

function boardWithDiscs(discs: ReadonlyArray<readonly [number, number, Disc]>): Board {
    const board = createEmptyBoard();

    for (const [row, column, player] of discs) {
        board[row][column] = player;
    }

    return board;
}

describe('Connect Four - Win and Draw Detection', () => {
    describe('checkWin', () => {
        const winCases = [
            {
                name: 'horizontal win',
                discs: [
                    [5, 1, 'player1'],
                    [5, 2, 'player1'],
                    [5, 3, 'player1'],
                    [5, 4, 'player1'],
                ],
                expectedLine: [[5, 1], [5, 2], [5, 3], [5, 4]],
                expectedWinner: 'player1',
            },
            {
                name: 'vertical win',
                discs: [
                    [2, 0, 'player2'],
                    [3, 0, 'player2'],
                    [4, 0, 'player2'],
                    [5, 0, 'player2'],
                ],
                expectedLine: [[2, 0], [3, 0], [4, 0], [5, 0]],
                expectedWinner: 'player2',
            },
            {
                name: 'diagonal down-right win',
                discs: [
                    [1, 2, 'player1'],
                    [2, 3, 'player1'],
                    [3, 4, 'player1'],
                    [4, 5, 'player1'],
                ],
                expectedLine: [[1, 2], [2, 3], [3, 4], [4, 5]],
                expectedWinner: 'player1',
            },
            {
                name: 'diagonal up-right win',
                discs: [
                    [5, 1, 'player2'],
                    [4, 2, 'player2'],
                    [3, 3, 'player2'],
                    [2, 4, 'player2'],
                ],
                expectedLine: [[5, 1], [4, 2], [3, 3], [2, 4]],
                expectedWinner: 'player2',
            },
        ] as const;

        it.each(winCases)('detects a $name', ({ discs, expectedLine, expectedWinner }) => {
            const board = boardWithDiscs(discs);

            expect(checkWin(board)).toEqual({
                winner: expectedWinner,
                winningLine: expectedLine,
            });
        });

        it('returns null when there is no winner', () => {
            const board = boardWithDiscs([
                [5, 0, 'player1'],
                [5, 1, 'player2'],
                [5, 2, 'player1'],
                [5, 3, 'player2'],
            ]);

            expect(checkWin(board)).toBeNull();
        });
    });

    describe('isDraw', () => {
        it('returns draw for a full board with no four-in-a-row', () => {
            const fullBoardNoWin: Board = [
                ['player2', 'player1', 'player1', 'player2', 'player2', 'player1', 'player1'],
                ['player2', 'player1', 'player2', 'player2', 'player1', 'player1', 'player1'],
                ['player2', 'player2', 'player1', 'player2', 'player2', 'player1', 'player1'],
                ['player1', 'player2', 'player1', 'player1', 'player2', 'player2', 'player2'],
                ['player1', 'player2', 'player1', 'player2', 'player2', 'player1', 'player1'],
                ['player1', 'player1', 'player2', 'player2', 'player1', 'player1', 'player2'],
            ];

            expect(checkWin(fullBoardNoWin)).toBeNull();
            expect(isDraw(fullBoardNoWin)).toBe('draw');
        });

        it('returns null when the board still has open cells', () => {
            expect(isDraw(createEmptyBoard())).toBeNull();
        });

        it('returns null when a full board has a winner', () => {
            const fullBoardWithWin: Board = [
                ['player2', 'player1', 'player1', 'player2', 'player2', 'player1', 'player1'],
                ['player2', 'player1', 'player2', 'player2', 'player1', 'player1', 'player1'],
                ['player2', 'player2', 'player1', 'player2', 'player2', 'player1', 'player1'],
                ['player1', 'player2', 'player1', 'player1', 'player2', 'player2', 'player2'],
                ['player1', 'player2', 'player1', 'player2', 'player2', 'player1', 'player1'],
                ['player1', 'player1', 'player1', 'player1', 'player2', 'player2', 'player2'],
            ];

            expect(isDraw(fullBoardWithWin)).toBeNull();
        });
    });
});
