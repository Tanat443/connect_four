"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { UI_CONFIG } from '@/lib/config/ui';
import { getNextBotMove } from '@/lib/game/bot';
import { shouldQueueBotMove } from '@/lib/game/bot-turn';
import { createInitialMatchState, matchReducer } from '@/lib/game/reducer';
import { selectReward } from '@/lib/game/rewards';
import { saveMatchSummary } from '@/lib/supabase/matches';
import { Difficulty, GameMode } from '@/types/game';
import { MatchStatus, MatchSummary } from '@/types/supabase';
import { useAuth } from './use-auth';

export function useMatchReducer() {
    const { user } = useAuth();
    const [state, dispatch] = useReducer(matchReducer, undefined, createInitialMatchState);
    const [isBotThinking, setIsBotThinking] = useState(false);
    const isBotThinkingRef = useRef(false);
    const botTimeoutRef = useRef<number | null>(null);
    const { board, currentPlayer, difficulty, isAnimating, mode, phase } = state;

    useEffect(() => {
        if (!state.isAnimating) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            dispatch({ type: 'FINISH_ANIMATION' });
        }, UI_CONFIG.dropAnimationMs);

        return () => window.clearTimeout(timeoutId);
    }, [state.isAnimating, state.moves.length]);

    useEffect(() => {
        if (
            !shouldQueueBotMove({ currentPlayer, isAnimating, mode, phase }, isBotThinkingRef.current) ||
            botTimeoutRef.current !== null
        ) {
            return;
        }

        isBotThinkingRef.current = true;
        setIsBotThinking(true);

        botTimeoutRef.current = window.setTimeout(() => {
            const botMove = getNextBotMove(board, 'player2', difficulty ?? 'medium');

            if (botMove >= 0) {
                dispatch({ type: 'DROP_DISC', column: botMove });
            }

            botTimeoutRef.current = null;
            isBotThinkingRef.current = false;
            setIsBotThinking(false);
        }, UI_CONFIG.botThinkingMs);

        return () => {
            if (botTimeoutRef.current !== null) {
                window.clearTimeout(botTimeoutRef.current);
                botTimeoutRef.current = null;
            }
            isBotThinkingRef.current = false;
            setIsBotThinking(false);
        };
    }, [board, currentPlayer, difficulty, isAnimating, mode, phase]);
    const savedMatchIdRef = useRef<string | null>(null);

    useEffect(() => {
        const isGameOver = phase === 'won' || phase === 'draw';
        if (!isGameOver || savedMatchIdRef.current === state.id) {
            return;
        }

        savedMatchIdRef.current = state.id;

        const reward = selectReward({
            winner: state.winner,
            mode: state.mode,
            difficulty: state.difficulty,
            move_count: state.moves.length,
        }, false);

        if (reward) {
            dispatch({ type: 'SET_REWARD', reward });
        }

        const status: MatchStatus = phase === 'won' ? 'won' : 'draw';
        const summary: MatchSummary = {
            id: state.id,
            game_mode: state.mode,
            player_1_id: user?.id ?? null,
            player_2_id: null, // Roadmap: online opponent ID
            bot_difficulty: state.mode === 'bot' ? state.difficulty : null,
            status,
            winner_id: state.winner === 'player1' ? (user?.id ?? null) : null,
            move_count: state.moves.length,
            coach_insight: null,
            reward_label: reward?.label ?? null,
        };

        saveMatchSummary(summary).then(result => {
            if (result.ok) {
                console.log('Match persisted successfully:', result.data.id);
            }
        });
    }, [phase, state.id, state.mode, state.winner, state.moves.length, state.difficulty, user?.id]);

    const dropDisc = useCallback((column: number) => {
        dispatch({ type: 'DROP_DISC', column });
    }, []);

    const resetMatch = useCallback(() => {
        dispatch({ type: 'RESET_MATCH' });
    }, []);

    const showHint = useCallback(() => {
        dispatch({ type: 'SHOW_HINT' });
    }, []);

    const setMode = useCallback((mode: GameMode) => {
        isBotThinkingRef.current = false;
        dispatch({ type: 'RESET_MATCH', mode });
    }, []);

    const setDifficulty = useCallback((difficulty: Difficulty) => {
        isBotThinkingRef.current = false;
        dispatch({ type: 'RESET_MATCH', difficulty });
    }, []);

    return {
        state,
        isBotThinking,
        dropDisc,
        resetMatch,
        showHint,
        setMode,
        setDifficulty,
    };
}
