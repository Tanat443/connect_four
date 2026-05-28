import { MatchState } from '@/types/game';

type BotTurnState = Pick<MatchState, 'currentPlayer' | 'isAnimating' | 'mode' | 'phase'>;

export function shouldQueueBotMove(state: BotTurnState, isBotThinking: boolean): boolean {
    return (
        state.mode === 'pvc' &&
        state.currentPlayer === 'player2' &&
        state.phase === 'playing' &&
        !state.isAnimating &&
        !isBotThinking
    );
}
