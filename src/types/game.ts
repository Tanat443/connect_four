export type PlayerId = 'player1' | 'player2' | null;

export type Board = PlayerId[][];

export type MatchPhase = 'idle' | 'playing' | 'won' | 'draw' | 'review' | 'rewarded';

export interface MatchState {
    board: Board;
    currentPlayer: PlayerId;
    phase: MatchPhase;
    moves: number[];
    winner: PlayerId;
    winningLine: [number, number][];
}

export type GameErrorCode = 'FULL_COLUMN' | 'GAME_OVER' | 'INVALID_STATE';

export type AppResult<T, Code extends string = string> =
    | { ok: true; data: T }
    | { ok: false; code: Code; message: string };
