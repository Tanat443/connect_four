"use client";

import { COLUMNS } from '@/lib/config/game';
import { Board, MatchPhase } from '@/types/game';
import { isColumnFull } from '@/lib/game/board';
import { ColumnButton } from '@/components/game/column-button';
import { Disc } from '@/components/game/disc';

interface GameBoardProps {
    board: Board;
    phase: MatchPhase;
    isAnimating: boolean;
    isInteractionDisabled?: boolean;
    hintColumn?: number | null;
    winningLine: [number, number][] | null;
    onColumnSelect: (column: number) => void;
}

export function GameBoard({
    board,
    phase,
    isAnimating,
    isInteractionDisabled = false,
    hintColumn = null,
    winningLine = null,
    onColumnSelect,
}: GameBoardProps) {
    const isPlayable = phase === 'idle' || phase === 'playing';
    const winningCells = new Set((winningLine ?? []).map(([row, column]) => `${row}-${column}`));

    return (
        <div className="grid gap-2">
            <div className="grid grid-cols-7 gap-1.5 px-2 sm:gap-2">
                {Array.from({ length: COLUMNS }, (_, column) => (
                    <ColumnButton
                        key={column}
                        column={column}
                        isHinted={hintColumn === column}
                        disabled={!isPlayable || isAnimating || isInteractionDisabled || isColumnFull(board, column)}
                        onSelect={onColumnSelect}
                    />
                ))}
            </div>

            <div
                className="high-contrast-board grid aspect-[7/6] w-full grid-cols-7 gap-1.5 rounded-lg bg-board p-2 sm:gap-2 sm:p-3"
                data-board-surface="high-contrast"
                aria-label="Connect Four board"
                role="grid"
            >
                {board.map((row, rowIndex) =>
                    row.map((player, columnIndex) => (
                        <div
                            key={`${rowIndex}-${columnIndex}`}
                            role="gridcell"
                            aria-label={`Row ${rowIndex + 1}, column ${columnIndex + 1}`}
                        >
                            <Disc
                                player={player}
                                isWinningCell={winningCells.has(`${rowIndex}-${columnIndex}`)}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
