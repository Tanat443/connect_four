import { createEmptyBoard } from '@/lib/game/board';
import { applyMove } from '@/lib/game/rules';
import { getHintMove } from '@/lib/game/hints';
import { checkWin, isDraw } from '@/lib/game/win-detection';
import { Difficulty, GameMode, MatchState } from '@/types/game';

export type MatchAction =
    | { type: 'DROP_DISC'; column: number }
    | { type: 'SHOW_HINT' }
    | { type: 'FINISH_ANIMATION' }
    | { type: 'RESET_MATCH'; mode?: GameMode; difficulty?: Difficulty };

export function createInitialMatchState(mode: GameMode = 'pvp', difficulty: Difficulty = 'easy'): MatchState {
    return {
        board: createEmptyBoard(),
        currentPlayer: 'player1',
        phase: 'idle',
        moves: [],
        winner: null,
        winningLine: [],
        isAnimating: false,
        hintColumn: null,
        mode,
        difficulty,
    };
}

export function matchReducer(state: MatchState, action: MatchAction): MatchState {
    switch (action.type) {
        case 'DROP_DISC':
            return dropDisc(state, action.column);
        case 'SHOW_HINT':
            return showHint(state);
        case 'FINISH_ANIMATION':
            return {
                ...state,
                isAnimating: false,
            };
        case 'RESET_MATCH':
            return createInitialMatchState(
                action.mode ?? state.mode,
                action.difficulty ?? state.difficulty
            );
        default:
            return state;
    }
}

function showHint(state: MatchState): MatchState {
    if (state.isAnimating || (state.phase !== 'idle' && state.phase !== 'playing')) {
        return state;
    }

    const hint = getHintMove(state.board, state.currentPlayer);

    return {
        ...state,
        hintColumn: hint?.column ?? null,
    };
}

function dropDisc(state: MatchState, column: number): MatchState {
    if (state.isAnimating || (state.phase !== 'idle' && state.phase !== 'playing')) {
        return state;
    }

    const playableState: MatchState = {
        ...state,
        phase: 'playing',
        hintColumn: null,
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
