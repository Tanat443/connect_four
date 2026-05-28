"use client";

import { RotateCcw } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { GameBoard } from '@/components/game/game-board';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { GAME_LABELS } from '@/lib/config/labels';
import { useMatchReducer } from '@/hooks/use-match-reducer';

export default function GamePage() {
    const { state, dropDisc, resetMatch } = useMatchReducer();
    const currentPlayerLabel = state.currentPlayer === 'player1' ? GAME_LABELS.player1 : GAME_LABELS.player2;
    const winnerLabel = state.winner === 'player1' ? GAME_LABELS.player1 : GAME_LABELS.player2;
    const isGameOver = state.phase === 'won' || state.phase === 'draw';
    const matchDescription = isGameOver
        ? GAME_LABELS.gameOver
        : state.phase === 'idle'
            ? GAME_LABELS.player1Starts
            : `${currentPlayerLabel}${GAME_LABELS.turnSuffix}`;
    const statusDescription = state.phase === 'won'
        ? `${winnerLabel}${GAME_LABELS.winsSuffix}`
        : state.phase === 'draw'
            ? GAME_LABELS.drawSuffix
            : state.isAnimating
                ? GAME_LABELS.discSettling
                : `${currentPlayerLabel}${GAME_LABELS.readySuffix}`;

    return (
        <AppShell>
            <section className="grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]">
                <Card className="glass-panel overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-2xl sm:text-3xl">{GAME_LABELS.localMatch}</CardTitle>
                        <CardDescription>{matchDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <GameBoard
                            board={state.board}
                            phase={state.phase}
                            isAnimating={state.isAnimating}
                            winningLine={state.winningLine}
                            onColumnSelect={dropDisc}
                        />
                    </CardContent>
                </Card>

                <div className="grid content-start gap-4">
                    <Card className="glass-panel">
                        <CardHeader>
                            <CardTitle>{GAME_LABELS.matchStatus}</CardTitle>
                            <CardDescription>{statusDescription}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            {isGameOver && (
                                <div
                                    className="rounded-lg border border-winner-ring/70 bg-winner-ring/15 p-3"
                                    role="status"
                                    aria-live="polite"
                                >
                                    <div className="text-sm text-muted-foreground">{GAME_LABELS.gameOver}</div>
                                    <div className="text-lg font-medium">
                                        {state.phase === 'won' ? `${winnerLabel} wins` : GAME_LABELS.draw}
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-lg border border-border/70 bg-background/55 p-3">
                                    <div className="text-muted-foreground">{GAME_LABELS.turnHeader}</div>
                                    <div className="font-medium">{currentPlayerLabel}</div>
                                </div>
                                <div className="rounded-lg border border-border/70 bg-background/55 p-3">
                                    <div className="text-muted-foreground">{GAME_LABELS.movesHeader}</div>
                                    <div className="font-medium">{state.moves.length}</div>
                                </div>
                            </div>
                            <Button type="button" variant="outline" onClick={resetMatch}>
                                <RotateCcw className="size-4" aria-hidden="true" />
                                {isGameOver ? GAME_LABELS.restartMatch : GAME_LABELS.resetMatch}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </AppShell>
    );
}
