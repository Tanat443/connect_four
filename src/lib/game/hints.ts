import { analyzeBoard } from '@/lib/game/analysis';
import { Board, PlayerId } from '@/types/game';

type ActivePlayer = Exclude<PlayerId, null>;

export interface HintMove {
    column: number;
    source: 'minimax';
}

export function getHintMove(board: Board, player: PlayerId): HintMove | null {
    if (player === null) {
        return null;
    }

    const analysis = analyzeBoard(board, player as ActivePlayer);

    return analysis.bestMove === undefined
        ? null
        : {
            column: analysis.bestMove,
            source: 'minimax',
        };
}
