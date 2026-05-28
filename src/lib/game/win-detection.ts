import { COLUMNS, ROWS } from '@/lib/config/game';
import { Board, PlayerId } from '@/types/game';

export type BoardCoordinate = [number, number];

export interface WinResult {
    winner: Exclude<PlayerId, null>;
    winningLine: BoardCoordinate[];
}

const WIN_LENGTH = 4;
const DIRECTIONS: Array<[number, number]> = [
    [0, 1],
    [1, 0],
    [1, 1],
    [-1, 1],
];

export function checkWin(board: Board): WinResult | null {
    for (let row = 0; row < ROWS; row++) {
        for (let column = 0; column < COLUMNS; column++) {
            const player = board[row]?.[column];

            if (player === null || player === undefined) {
                continue;
            }

            for (const [rowStep, columnStep] of DIRECTIONS) {
                const line = getWinningLine(board, row, column, rowStep, columnStep, player);

                if (line !== null) {
                    return {
                        winner: player,
                        winningLine: line,
                    };
                }
            }
        }
    }

    return null;
}

export function isDraw(board: Board): 'draw' | null {
    if (checkWin(board) !== null) {
        return null;
    }

    return board.every(row => row.every(cell => cell !== null)) ? 'draw' : null;
}

function getWinningLine(
    board: Board,
    startRow: number,
    startColumn: number,
    rowStep: number,
    columnStep: number,
    player: Exclude<PlayerId, null>
): BoardCoordinate[] | null {
    const endRow = startRow + rowStep * (WIN_LENGTH - 1);
    const endColumn = startColumn + columnStep * (WIN_LENGTH - 1);

    if (!isInBounds(endRow, endColumn)) {
        return null;
    }

    const line: BoardCoordinate[] = [];

    for (let offset = 0; offset < WIN_LENGTH; offset++) {
        const row = startRow + rowStep * offset;
        const column = startColumn + columnStep * offset;

        if (board[row]?.[column] !== player) {
            return null;
        }

        line.push([row, column]);
    }

    return line;
}

function isInBounds(row: number, column: number): boolean {
    return row >= 0 && row < ROWS && column >= 0 && column < COLUMNS;
}
