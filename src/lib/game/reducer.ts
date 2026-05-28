import { createEmptyBoard } from '@/lib/game/board';
import { applyMove } from '@/lib/game/rules';
import { getHintMove } from '@/lib/game/hints';
import { checkWin, isDraw } from '@/lib/game/win-detection';
import { Difficulty, GameMode, LastMove, MatchState, Reward } from '@/types/game';

export type MatchAction =
    | { type: 'DROP_DISC'; column: number }
    | { type: 'SHOW_HINT' }
    | { type: 'FINISH_ANIMATION' }
    | { type: 'RESET_MATCH'; mode?: GameMode; difficulty?: Difficulty }
    | { type: 'RESTART_MATCH' }
    | { type: 'SET_REWARD'; reward: Reward };

export function createInitialMatchState(mode: GameMode = 'local', difficulty: Difficulty = 'easy'): MatchState {
    return {
        id: crypto.randomUUID(),
        board: createEmptyBoard(),
        currentPlayer: 'player1',
        phase: 'idle',
        moves: [],
        difficulty,
        winner: null,
        winningLine: null,
        hintColumn: null,
        reward: null,
        mode,
        isAnimating: false,
        lastMove: null,
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
                lastMove: null,
            };
        case 'RESET_MATCH':
            return createInitialMatchState(
                action.mode ?? state.mode,
                action.difficulty ?? state.difficulty
            );
        case 'RESTART_MATCH':
            return createInitialMatchState(state.mode, state.difficulty);
        case 'SET_REWARD': {
            return {
                ...state,
                reward: action.reward,
            };
        }
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
    const lastMove = findLastMove(state, result.data, column);

    if (winResult !== null) {
        return {
            ...result.data,
            phase: 'won',
            winner: winResult.winner,
            winningLine: winResult.winningLine,
            isAnimating: true,
            lastMove,
        };
    }

    const drawResult = isDraw(result.data.board);

    return {
        ...result.data,
        phase: drawResult ?? result.data.phase,
        isAnimating: true,
        lastMove,
    };
}

function findLastMove(previousState: MatchState, nextState: MatchState, column: number): LastMove {
    const placedPlayer = previousState.currentPlayer === 'player2' ? 'player2' : 'player1';

    for (let row = 0; row < nextState.board.length; row += 1) {
        if (
            previousState.board[row][column] === null &&
            nextState.board[row][column] === placedPlayer
        ) {
            return {
                row,
                column,
                player: placedPlayer,
            };
        }
    }

    return {
        row: nextState.board.length - 1,
        column,
        player: placedPlayer,
    };
}
