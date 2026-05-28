import { describe, it, expect } from 'vitest';
import { getNextBotMove } from '@/lib/game/bot';
import { PlayerId } from '@/types/game';
import { createEmptyBoard } from '@/lib/game/board';

describe('Bot Logic (getNextBotMove)', () => {
    const P1: PlayerId = 'player1';
    const P2: PlayerId = 'player2';

    it('Easy Bot: returns a random legal move on an empty board', () => {
        const board = createEmptyBoard();
        const move = getNextBotMove(board, P2, 'easy');
        expect(move).toBeGreaterThanOrEqual(0);
        expect(move).toBeLessThan(7);
    });

    it('Medium Bot: takes an immediate winning move', () => {
        // P2 has 3 in a row vertically in column 3
        const board = createEmptyBoard();
        board[5][3] = P2;
        board[4][3] = P2;
        board[3][3] = P2;

        const move = getNextBotMove(board, P2, 'medium');
        expect(move).toBe(3);
    });

    it('Medium Bot: blocks an immediate opponent threat', () => {
        // P1 has 3 in a row horizontally at the bottom
        const board = createEmptyBoard();
        board[5][0] = P1;
        board[5][1] = P1;
        board[5][2] = P1;

        const move = getNextBotMove(board, P2, 'medium');
        expect(move).toBe(3); // Column 3 should block
    });

    it('Medium Bot: prefers center column when no immediate win/block', () => {
        const board = createEmptyBoard();
        const move = getNextBotMove(board, P2, 'medium');
        expect(move).toBe(3); // Column 3 is the exact center
    });

    it('Hard Bot: uses minimax to avoid a trap (complex scenario)', () => {
        // P1 is setting up a horizontal win at the bottom
        const board = createEmptyBoard();
        board[5][0] = P1;
        board[5][1] = P1;
        // P1 wants to eventually place at 2 and 3.
        // Hard bot should see further ahead, but even at depth-5 it should at least match Medium for simple things.

        const move = getNextBotMove(board, P2, 'hard');
        expect(move).toBe(3); // Should still prefer center/block
    });

    it('Easy Bot: works when some columns are full', () => {
        const board = createEmptyBoard();
        // Fill all columns except 6
        for (let c = 0; c < 6; c++) {
            for (let r = 0; r < 6; r++) {
                board[r][c] = P1;
            }
        }
        const move = getNextBotMove(board, P2, 'easy');
        expect(move).toBe(6);
    });
});
