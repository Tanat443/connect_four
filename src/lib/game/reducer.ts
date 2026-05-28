import { createEmptyBoard } from '@/lib/game/board';
import { applyMove } from '@/lib/game/rules';
import { checkWin, isDraw } from '@/lib/game/win-detection';
import { MatchState } from '@/types/game';

export type MatchAction =
    | { type: 'DROP_DISC'; column: number }
    | { type: 'FINISH_ANIMATION' }
    | { type: 'RESET_MATCH' };

export function createInitialMatchState(): MatchState {
    return {
        board: createEmptyBoard(),
        currentPlayer: 'player1',
        phase: 'idle',
        moves: [],
        winner: null,
        winningLine: [],
        isAnimating: false,
    };
}

export function matchReducer(state: MatchState, action: MatchAction): MatchState {
    switch (action.type) {
        case 'DROP_DISC':
            return dropDisc(state, action.column);
        case 'FINISH_ANIMATION':
            return {
                ...state,
                isAnimating: false,
            };
        case 'RESET_MATCH':
            return createInitialMatchState();
        default:
            return state;
    }
}

function dropDisc(state: MatchState, column: number): MatchState {
    if (state.isAnimating || (state.phase !== 'idle' && state.phase !== 'playing')) {
        return state;
    }

    const playableState: MatchState = {
        ...state,
        phase: 'playing',
    };
    const result = applyMove(playableState, column);

    if (!result.ok) {
        return state;
    }

    const winResult = checkWin(result.data.board);

    if (winResult !== null) {
        return {
            ...result.data,
            phase: 'won',
            winner: winResult.winner,
            winningLine: winResult.winningLine,
            isAnimating: true,
        };
    }

    const drawResult = isDraw(result.data.board);

    return {
        ...result.data,
        phase: drawResult ?? result.data.phase,
        isAnimating: true,
    };
}
