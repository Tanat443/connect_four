import { Reward } from './rewards';
export { type Reward };

export type PlayerId = 'player1' | 'player2' | null;

export type Board = PlayerId[][];

export type MatchPhase = 'idle' | 'playing' | 'won' | 'draw' | 'review' | 'rewarded';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'local' | 'bot' | 'online';

export interface LastMove {
    row: number;
    column: number;
    player: Exclude<PlayerId, null>;
}

export interface MatchState {
    id: string;
    board: Board;
    currentPlayer: PlayerId;
    phase: MatchPhase;
    moves: number[];
    winner: PlayerId | 'draw' | null;
    winningLine: [number, number][] | null;
    isAnimating: boolean;
    lastMove: LastMove | null;
    hintColumn: number | null;
    difficulty: Difficulty;
    mode: GameMode;
    reward: Reward | null;
}

export type GameErrorCode = 'FULL_COLUMN' | 'GAME_OVER' | 'INVALID_STATE';

export type AppResult<T, Code extends string = string> =
    | { ok: true; data: T }
    | { ok: false; code: Code; message: string };
