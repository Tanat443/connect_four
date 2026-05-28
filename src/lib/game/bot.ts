import { analyzeBoard } from './analysis';
import { Board, Difficulty, PlayerId } from '@/types/game';

type ActivePlayer = Exclude<PlayerId, null>;

/**
 * Strategy-based move selection for the Bot Opponent.
 * 
 * Easy: Random legal move.
 * Medium: Win > Block > Center Preference.
 * Hard: Minimax (Depth 5).
 */
export function getNextBotMove(board: Board, player: ActivePlayer, difficulty: Difficulty = 'medium'): number {
    const analysis = analyzeBoard(board, player);
    const { legalMoves, winningMoves, blockingMoves, centerPreferredMoves, bestMove } = analysis;

    if (legalMoves.length === 0) {
        return 0; // Should not happen in a valid game state
    }

    switch (difficulty) {
        case 'easy':
            return legalMoves[Math.floor(Math.random() * legalMoves.length)];

        case 'medium':
            // 1. Take immediate win
            if (winningMoves.length > 0) return winningMoves[0];

            // 2. Block immediate threat
            if (blockingMoves.length > 0) return blockingMoves[0];

            // 3. Center preference
            if (centerPreferredMoves.length > 0) return centerPreferredMoves[0];

            // 4. Any legal move (redundant but safe)
            return legalMoves[0];

        case 'hard':
            // Hard uses the Minimax result from analyzeBoard
            return bestMove !== undefined ? bestMove : centerPreferredMoves[0];

        default:
            return legalMoves[0];
    }
}
