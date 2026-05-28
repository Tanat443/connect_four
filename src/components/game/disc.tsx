import { PlayerId } from '@/types/game';
import { cn } from '@/lib/utils';

interface DiscProps {
    player: PlayerId;
    isWinningCell?: boolean;
}

export function Disc({ player, isWinningCell = false }: DiscProps) {
    return (
        <div
            data-winning-cell={isWinningCell || undefined}
            className={cn(
                'relative grid aspect-square min-w-0 place-items-center rounded-full border shadow-inner transition-transform duration-200',
                player === null && 'border-board-cell-border bg-board-cell',
                player === 'player1' && 'scale-95 border-primary/50 bg-player-one shadow-primary/25',
                player === 'player2' && 'scale-95 border-accent/50 bg-player-two shadow-accent/25',
                isWinningCell && 'ring-4 ring-winner-ring ring-offset-2 ring-offset-board'
            )}
        >
            <span className="sr-only">
                {isWinningCell
                    ? 'Winning disc'
                    : player === null
                        ? 'Empty cell'
                        : player === 'player1'
                            ? 'Player 1 disc'
                            : 'Player 2 disc'}
            </span>
            {isWinningCell && (
                <span
                    aria-hidden="true"
                    className="absolute inset-2 rounded-full border-2 border-background/80"
                />
            )}
        </div>
    );
}
