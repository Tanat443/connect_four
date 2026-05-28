# Story 2.4: Post-Match AI Coach

Status: ready-for-dev

## Story

As a player,
I want to receive a short feedback message after the match about my performance,
so that I understand how to play better.

## Acceptance Criteria

1. **Trigger Phase:** When a match concludes (win or draw), the system transition to the `review` phase (after any initial win visuals).
2. **Coach Insight Display:** In the `review` phase, a dedicated "AI Coach" section appears in the UI (e.g., within a glass card or a modal).
3. **Tactical Accuracy:** The coach identifies at least one significant tactical event from the match history:
    - **Missed Win:** "You missed a winning move in column [X] on turn [Y]."
    - **Successful Block:** "Great job blocking the opponent's threat in column [X]!"
    - **Decisive Move:** "Column [X] was the decisive move that sealed your victory."
4. **Integration:** The coach logic leverages the shared tactical analysis engine (`src/lib/game/analysis.ts`) to re-evaluate historical board states.
5. **Tone & Style:** The feedback is short, non-judgmental, and fits the "Liquid Glass" dessert theme (e.g., using a helpful, "pastry chef-like" or professional coach persona).
6. **Persistence Ready:** The coach insight is stored in the `MatchState` so it can be later persisted to Supabase (Story 3.1).

## Tasks / Subtasks

- [ ] Core Coach Logic (AC: 3, 4)
  - [ ] Implement `src/lib/game/coach.ts` to analyze move history and generate `CoachInsight` strings.
  - [ ] Add `insight: string | null` to `MatchState` in `src/types/game.ts`.
  - [ ] Update `matchReducer` to compute the insight when transitioning to `won` or `draw` phases (or upon entering `review`).
- [ ] UI Implementation (AC: 1, 2, 5)
  - [ ] Create `src/components/game/coach-display.tsx` using Shadcn/Tailwind with translucent glass effects.
  - [ ] Integrate the coach display into `src/app/game/page.tsx`, visible only during the `review` phase.
  - [ ] Ensure the "Restart Match" button is still accessible to reset the game.
- [ ] Unit Verification (AC: 3, 4, 6)
  - [ ] Create `tests/game/coach.test.ts`.
  - [ ] Verify insight generation for various match scenarios (missed win, block, decisive move).

## Dev Notes

- **History Analysis:** To find a "missed win", iterate through the `moves` history, recreating the board state at each step, and check if `findWinningMoves` returns a column that the player didn't pick.
- **Terminology:** Keep it simple. Avoid deep jargon. Focus on "threats", "wins", and "blocks".
- **Visuals:** Use a "Lightbulb" or "UserCheck" icon for the coach section.

## References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.4: Post-Match AI Coach]
- [Source: src/lib/game/analysis.ts]
- [Source: src/types/game.ts#MatchPhase]
