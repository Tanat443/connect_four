import { Board } from '@/types/game';
import { ROWS, COLUMNS } from '@/lib/config/game';

export function createEmptyBoard(): Board {
    return Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));
}

export function getLowestAvailableRow(board: Board, column: number): number | null {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][column] === null) {
            return row;
        }
    }
    return null;
}

export function isColumnFull(board: Board, column: number): boolean {
    return getLowestAvailableRow(board, column) === null;
}
