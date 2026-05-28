"use client";

import { COLUMNS } from '@/lib/config/game';
import { Board, LastMove, MatchPhase } from '@/types/game';
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
    lastMove?: LastMove | null;
    onColumnSelect: (column: number) => void;
}

export function GameBoard({
    board,
    phase,
    isAnimating,
    isInteractionDisabled = false,
    hintColumn = null,
    winningLine = null,
    lastMove = null,
    onColumnSelect,
}: GameBoardProps) {
    const isPlayable = phase === 'idle' || phase === 'playing';
    const winningCells = new Set((winningLine ?? []).map(([row, column]) => `${row}-${column}`));
    const isColumnDisabled = (column: number) =>
        !isPlayable || isAnimating || isInteractionDisabled || isColumnFull(board, column);

    return (
        <div className="mx-auto grid w-full max-w-[560px] gap-2">
            <div className="grid grid-cols-7 gap-1.5 px-2 sm:gap-2">
                {Array.from({ length: COLUMNS }, (_, column) => (
                    <ColumnButton
                        key={column}
                        column={column}
                        isHinted={hintColumn === column}
                        disabled={isColumnDisabled(column)}
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
                            className="relative isolate rounded-full"
                            role="gridcell"
                            aria-label={`Row ${rowIndex + 1}, column ${columnIndex + 1}`}
                        >
                            <button
                                type="button"
                                className="absolute inset-0 z-20 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-board disabled:pointer-events-none"
                                aria-label={`Drop disc in column ${columnIndex + 1}`}
                                disabled={isColumnDisabled(columnIndex)}
                                onClick={() => onColumnSelect(columnIndex)}
                            />
                            <Disc
                                player={player}
                                isWinningCell={winningCells.has(`${rowIndex}-${columnIndex}`)}
                                isDropping={
                                    isAnimating &&
                                    lastMove?.row === rowIndex &&
                                    lastMove.column === columnIndex
                                }
                                dropRow={rowIndex}
                            />
                            <span
                                aria-hidden="true"
                                className="board-cell-frame pointer-events-none absolute inset-0 z-10 rounded-full"
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
