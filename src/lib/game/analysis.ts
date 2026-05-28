import { getLowestAvailableRow } from '@/lib/game/board';
import { checkWin } from '@/lib/game/win-detection';
import { COLUMNS, ROWS } from '@/lib/config/game';
import { Board, PlayerId } from '@/types/game';

type ActivePlayer = Exclude<PlayerId, null>;

export interface Threat {
    player: ActivePlayer;
    winningMove: number;
}

export interface TacticalAnalysis {
    legalMoves: number[];
    winningMoves: number[];
    blockingMoves: number[];
    centerPreferredMoves: number[];
    threats: Threat[];
    bestMove?: number;
}

const DEFAULT_DEPTH = 5;

/**
 * Main entry point for tactical analysis.
 * Now includes Minimax search for the "bestMove".
 */
export function analyzeBoard(board: Board, player: ActivePlayer, depth: number = DEFAULT_DEPTH): TacticalAnalysis {
    const legalMoves = getLegalMoves(board);

    // Find immediate tactical moves
    const winningMoves = findWinningMoves(board, player);
    const blockingMoves = findBlockingMoves(board, player);

    // Minimax search for the best logical move
    const bestMove = findBestMove(board, player, depth);

    return {
        legalMoves,
        winningMoves,
        blockingMoves,
        centerPreferredMoves: rankMovesByCenterPreference(legalMoves),
        threats: getMissedThreats(board, player),
        bestMove,
    };
}

export function getLegalMoves(board: Board): number[] {
    const moves: number[] = [];
    for (let col = 0; col < COLUMNS; col++) {
        if (getLowestAvailableRow(board, col) !== null) {
            moves.push(col);
        }
    }
    return moves;
}

export function findWinningMoves(board: Board, player: ActivePlayer): number[] {
    return getLegalMoves(board).filter(column => {
        const row = getLowestAvailableRow(board, column);
        if (row === null) return false;

        const nextBoard = simulateMoveAt(board, row, column, player);
        return checkWin(nextBoard)?.winner === player;
    });
}

export function findBlockingMoves(board: Board, player: ActivePlayer): number[] {
    return findWinningMoves(board, getOpponent(player));
}

export function rankMovesByCenterPreference(moves: number[]): number[] {
    const centerColumn = Math.floor(COLUMNS / 2);
    return [...moves].sort((a, b) => {
        const delta = Math.abs(a - centerColumn) - Math.abs(b - centerColumn);
        return delta === 0 ? a - b : delta;
    });
}

export function getMissedThreats(board: Board, lastPlayer: ActivePlayer): Threat[] {
    const opponent = getOpponent(lastPlayer);
    return findWinningMoves(board, opponent).map(move => ({ player: opponent, winningMove: move }));
}

/**
 * Minimax with Alpha-Beta Pruning
 */
function findBestMove(board: Board, player: ActivePlayer, depth: number): number | undefined {
    const moves = getLegalMoves(board);
    if (moves.length === 0) return undefined;
    if (moves.length === 1) return moves[0];

    // Priority: immediate win
    const wins = findWinningMoves(board, player);
    if (wins.length > 0) return wins[0];

    let bestVal = -Infinity;
    let bestMove = moves[0];

    // Priority 2: immediate block (if only one, we must take it, but minimax will find it too)

    const orderedMoves = rankMovesByCenterPreference(moves);

    for (const col of orderedMoves) {
        const row = getLowestAvailableRow(board, col)!;
        const nextBoard = simulateMoveAt(board, row, col, player);
        const val = minimax(nextBoard, depth - 1, -Infinity, Infinity, false, player);

        if (val > bestVal) {
            bestVal = val;
            bestMove = col;
        }
    }

    return bestMove;
}

function minimax(
    board: Board,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean,
    player: ActivePlayer
): number {
    const win = checkWin(board);
    if (win) {
        // High score for win, penalty for loss. Adjust by depth to favor faster wins.
        return win.winner === player ? 1000000 + depth : -1000000 - depth;
    }
    if (depth === 0) {
        return evaluateBoard(board, player);
    }

    const moves = getLegalMoves(board);
    if (moves.length === 0) return 0; // Draw

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (const col of rankMovesByCenterPreference(moves)) {
            const row = getLowestAvailableRow(board, col)!;
            const nextBoard = simulateMoveAt(board, row, col, player);
            const ev = minimax(nextBoard, depth - 1, alpha, beta, false, player);
            maxEval = Math.max(maxEval, ev);
            alpha = Math.max(alpha, ev);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        const opponent = getOpponent(player);
        for (const col of rankMovesByCenterPreference(moves)) {
            const row = getLowestAvailableRow(board, col)!;
            const nextBoard = simulateMoveAt(board, row, col, opponent);
            const ev = minimax(nextBoard, depth - 1, alpha, beta, true, player);
            minEval = Math.min(minEval, ev);
            beta = Math.min(beta, ev);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

/**
 * Heuristic evaluation function.
 */
function evaluateBoard(board: Board, player: ActivePlayer): number {
    let score = 0;
    const opponent = getOpponent(player);

    // Center preference
    const centerCol = Math.floor(COLUMNS / 2);
    for (let r = 0; r < ROWS; r++) {
        if (board[r][centerCol] === player) score += 3;
        else if (board[r][centerCol] === opponent) score -= 3;
    }

    // Window evaluation
    // Horizontal
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLUMNS - 3; c++) {
            score += evaluateWindow([board[r][c], board[r][c + 1], board[r][c + 2], board[r][c + 3]], player);
        }
    }

    // Vertical
    for (let c = 0; c < COLUMNS; c++) {
        for (let r = 0; r < ROWS - 3; r++) {
            score += evaluateWindow([board[r][c], board[r + 1][c], board[r + 2][c], board[r + 3][c]], player);
        }
    }

    // Diagonal Up
    for (let r = 3; r < ROWS; r++) {
        for (let c = 0; c < COLUMNS - 3; c++) {
            score += evaluateWindow([board[r][c], board[r - 1][c + 1], board[r - 2][c + 2], board[r - 3][c + 3]], player);
        }
    }

    // Diagonal Down
    for (let r = 0; r < ROWS - 3; r++) {
        for (let c = 0; c < COLUMNS - 3; c++) {
            score += evaluateWindow([board[r][c], board[r + 1][c + 1], board[r + 2][c + 2], board[r + 3][c + 3]], player);
        }
    }

    return score;
}

function evaluateWindow(window: PlayerId[], player: ActivePlayer): number {
    let score = 0;
    const opponent = getOpponent(player);
    const playerCount = window.filter(p => p === player).length;
    const emptyCount = window.filter(p => p === null).length;
    const opponentCount = window.filter(p => p === opponent).length;

    if (playerCount === 4) score += 10000;
    else if (playerCount === 3 && emptyCount === 1) score += 100;
    else if (playerCount === 2 && emptyCount === 2) score += 10;

    if (opponentCount === 3 && emptyCount === 1) score -= 900; // Extremely high penalty for opponent 3-in-a-row
    else if (opponentCount === 2 && emptyCount === 2) score -= 20;

    return score;
}

function simulateMoveAt(board: Board, row: number, column: number, player: ActivePlayer): Board {
    const nextBoard = board.map(r => [...r]);
    nextBoard[row][column] = player;
    return nextBoard;
}

function getOpponent(player: ActivePlayer): ActivePlayer {
    return player === 'player1' ? 'player2' : 'player1';
}
