import { MatchState, AppResult, GameErrorCode } from '@/types/game';
import { getLowestAvailableRow } from './board';
import { COLUMNS } from '@/lib/config/game';

export function applyMove(state: MatchState, column: number): AppResult<MatchState, GameErrorCode> {
    if (state.phase !== 'playing') {
        return { ok: false, code: 'GAME_OVER', message: 'Match is not playable.' };
    }

    if (column < 0 || column >= COLUMNS) {
        return { ok: false, code: 'INVALID_STATE', message: 'Invalid column index.' };
    }

    const row = getLowestAvailableRow(state.board, column);
    if (row === null) {
        return { ok: false, code: 'FULL_COLUMN', message: 'This column is full.' };
    }

    // Clone board to avoid mutation
    const newBoard = state.board.map(r => [...r]);
    newBoard[row][column] = state.currentPlayer;

    const nextPlayer = state.currentPlayer === 'player1' ? 'player2' : 'player1';

    return {
        ok: true,
        data: {
            ...state,
            board: newBoard,
            currentPlayer: nextPlayer,
            moves: [...state.moves, column],
        }
    };
}
