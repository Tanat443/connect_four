"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { UI_CONFIG } from '@/lib/config/ui';
import { getNextBotMove } from '@/lib/game/bot';
import { shouldQueueBotMove } from '@/lib/game/bot-turn';
import { createInitialMatchState, matchReducer } from '@/lib/game/reducer';
import { Difficulty, GameMode } from '@/types/game';

export function useMatchReducer() {
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
