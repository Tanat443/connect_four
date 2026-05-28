import { CSSProperties } from 'react';
import { PlayerId } from '@/types/game';
import { cn } from '@/lib/utils';

interface DiscProps {
    player: PlayerId;
    isWinningCell?: boolean;
    isDropping?: boolean;
    dropRow?: number;
}

export function Disc({ player, isWinningCell = false, isDropping = false, dropRow = 0 }: DiscProps) {
    const style = isDropping
        ? ({ '--drop-row': dropRow } as CSSProperties)
        : undefined;

    return (
        <div
            data-winning-cell={isWinningCell || undefined}
            data-dropping-disc={isDropping || undefined}
            style={style}
            className={cn(
                'relative grid aspect-square min-w-0 place-items-center rounded-full border shadow-inner transition-transform duration-200',
                player === null && 'border-board-cell-border bg-board-cell',
                player === 'player1' && 'donut-disc scale-95 border-primary/50 shadow-primary/25 [--donut-color:var(--player-one)]',
                player === 'player2' && 'donut-disc scale-95 border-accent/50 shadow-accent/25 [--donut-color:var(--player-two)]',
                isDropping && 'animate-disc-drop',
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
            {player !== null && (
                <>
                    <span
                        aria-hidden="true"
                        className="donut-sprinkle left-[22%] top-[32%] rotate-12 [--sprinkle-color:#fff176]"
                    />
                    <span
                        aria-hidden="true"
                        className="donut-sprinkle right-[18%] top-[38%] -rotate-45 [--sprinkle-color:#7dd3fc]"
                    />
                    <span
                        aria-hidden="true"
                        className="donut-sprinkle bottom-[24%] left-[35%] rotate-45 [--sprinkle-color:#fef3c7]"
                    />
                    <span
                        aria-hidden="true"
                        className="donut-sprinkle bottom-[34%] right-[24%] rotate-12 [--sprinkle-color:#c084fc]"
                    />
                </>
            )}
        </div>
    );
}
