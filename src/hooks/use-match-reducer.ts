"use client";

import { useCallback, useEffect, useReducer } from 'react';
import { UI_CONFIG } from '@/lib/config/ui';
import { createInitialMatchState, matchReducer } from '@/lib/game/reducer';

export function useMatchReducer() {
    const [state, dispatch] = useReducer(matchReducer, undefined, createInitialMatchState);

    useEffect(() => {
        if (!state.isAnimating) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            dispatch({ type: 'FINISH_ANIMATION' });
        }, UI_CONFIG.dropAnimationMs);

        return () => window.clearTimeout(timeoutId);
    }, [state.isAnimating, state.moves.length]);

    const dropDisc = useCallback((column: number) => {
        dispatch({ type: 'DROP_DISC', column });
    }, []);

    const resetMatch = useCallback(() => {
        dispatch({ type: 'RESET_MATCH' });
    }, []);

    return {
        state,
        dropDisc,
        resetMatch,
    };
}
