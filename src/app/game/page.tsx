"use client";

import { Lightbulb, RotateCcw } from 'lucide-react';
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
import { Difficulty, GameMode, MatchPhase } from '@/types/game';

const MODE_OPTIONS: Array<{ value: GameMode; label: string }> = [
    { value: 'local', label: GAME_LABELS.playerVsPlayer },
    { value: 'bot', label: GAME_LABELS.playerVsBot },
];

const DIFFICULTY_OPTIONS: Array<{ value: Difficulty; label: string }> = [
    { value: 'easy', label: GAME_LABELS.easy },
    { value: 'medium', label: GAME_LABELS.medium },
    { value: 'hard', label: GAME_LABELS.hard },
];

export default function GamePage() {
    const { state, isBotThinking, dropDisc, resetMatch, showHint, setMode, setDifficulty } = useMatchReducer();
    const isBotMode = state.mode === 'bot';
    const isGameOver = state.phase === 'won' || state.phase === 'draw';
    const isBotTurn = isBotMode && state.currentPlayer === 'player2' && !isGameOverPhase(state.phase);
    const currentPlayerLabel = isBotTurn
        ? GAME_LABELS.botPlayer
        : state.currentPlayer === 'player1'
            ? GAME_LABELS.player1
            : GAME_LABELS.player2;
    const winnerLabel = state.winner === 'player1' ? GAME_LABELS.player1 : GAME_LABELS.player2;
    const matchDescription = isGameOver
        ? GAME_LABELS.gameOver
        : state.phase === 'idle'
            ? GAME_LABELS.player1Starts
            : isBotThinking
                ? GAME_LABELS.botThinking
                : `${currentPlayerLabel}${GAME_LABELS.turnSuffix}`;
    const statusDescription = state.phase === 'won'
        ? `${winnerLabel}${GAME_LABELS.winsSuffix}`
        : state.phase === 'draw'
            ? GAME_LABELS.drawSuffix
            : isBotThinking
                ? GAME_LABELS.botPlaying
                : state.isAnimating
                    ? GAME_LABELS.discSettling
                    : `${currentPlayerLabel}${GAME_LABELS.readySuffix}`;
    const isBoardInteractionDisabled = isBotTurn || isBotThinking;
    const isHintDisabled = isGameOver || state.isAnimating || isBotThinking || isBotTurn;

    return (
        <AppShell>
            <section className="grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]">
                <Card className="glass-panel overflow-hidden border">
                    <CardHeader>
                        <CardTitle className="text-2xl sm:text-3xl">{GAME_LABELS.localMatch}</CardTitle>
                        <CardDescription>{matchDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <GameBoard
                            board={state.board}
                            phase={state.phase}
                            isAnimating={state.isAnimating}
                            isInteractionDisabled={isBoardInteractionDisabled}
                            winningLine={state.winningLine}
                            hintColumn={state.hintColumn}
                            lastMove={state.lastMove}
                            onColumnSelect={dropDisc}
                        />
                    </CardContent>
                </Card>

                <div className="grid content-start gap-4">
                    <Card className="glass-panel border">
                        <CardHeader>
                            <CardTitle>{GAME_LABELS.matchSettings}</CardTitle>
                            <CardDescription>
                                {isBotMode ? GAME_LABELS.playerVsBot : GAME_LABELS.playerVsPlayer}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <div className="text-sm text-muted-foreground">{GAME_LABELS.modeHeader}</div>
                                <div className="grid grid-cols-2 gap-2">
                                    {MODE_OPTIONS.map(option => (
                                        <Button
                                            key={option.value}
                                            type="button"
                                            variant={state.mode === option.value ? 'default' : 'outline'}
                                            aria-pressed={state.mode === option.value}
                                            onClick={() => setMode(option.value)}
                                        >
                                            {option.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <div className="text-sm text-muted-foreground">{GAME_LABELS.botDifficulty}</div>
                                <div className="grid grid-cols-3 gap-2">
                                    {DIFFICULTY_OPTIONS.map(option => (
                                        <Button
                                            key={option.value}
                                            type="button"
                                            variant={state.difficulty === option.value ? 'default' : 'outline'}
                                            aria-pressed={state.difficulty === option.value}
                                            disabled={!isBotMode}
                                            onClick={() => setDifficulty(option.value)}
                                        >
                                            {option.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-panel border">
                        <CardHeader>
                            <CardTitle>{GAME_LABELS.matchStatus}</CardTitle>
                            <CardDescription>{statusDescription}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            {isGameOver && (
                                <div
                                    className="rounded-lg border border-winner-ring/70 bg-winner-ring/15 p-3 shadow-sm shadow-winner-ring/15"
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
                                <div className="rounded-lg border border-glass-border bg-background/55 p-3 shadow-sm">
                                    <div className="text-muted-foreground">{GAME_LABELS.turnHeader}</div>
                                    <div className="font-medium">{currentPlayerLabel}</div>
                                </div>
                                <div className="rounded-lg border border-glass-border bg-background/55 p-3 shadow-sm">
                                    <div className="text-muted-foreground">{GAME_LABELS.movesHeader}</div>
                                    <div className="font-medium">{state.moves.length}</div>
                                </div>
                                <div className="rounded-lg border border-glass-border bg-background/55 p-3 shadow-sm">
                                    <div className="text-muted-foreground">{GAME_LABELS.modeHeader}</div>
                                    <div className="font-medium">
                                        {isBotMode ? GAME_LABELS.playerVsBot : GAME_LABELS.playerVsPlayer}
                                    </div>
                                </div>
                                <div className="rounded-lg border border-glass-border bg-background/55 p-3 shadow-sm">
                                    <div className="text-muted-foreground">{GAME_LABELS.difficultyHeader}</div>
                                    <div className="font-medium capitalize">{state.difficulty}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isHintDisabled}
                                    onClick={showHint}
                                >
                                    <Lightbulb className="size-4" aria-hidden="true" />
                                    {GAME_LABELS.hint}
                                </Button>
                                <Button type="button" variant="outline" onClick={resetMatch}>
                                    <RotateCcw className="size-4" aria-hidden="true" />
                                    {isGameOver ? GAME_LABELS.restartMatch : GAME_LABELS.resetMatch}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </AppShell>
    );
}

function isGameOverPhase(phase: MatchPhase): boolean {
    return phase === 'won' || phase === 'draw';
}
