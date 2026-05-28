# Story 2.3: Player Hint System

Status: review

## Story

As a player,
I want to be able to request a best move suggestion,
so that I can learn to spot tactical opportunities.

## Acceptance Criteria

1. **Hint Activation:** Given an ongoing match, when I click the "Hint" button, the system identifies the best move for the current player.
2. **Visual Feedback:** The column with the highest-ranked move is visually highlighted (e.g., pulsing border, glow, or an icon above the column) to guide the player.
3. **Tactical Engine Integration:** The hint logic uses the shared tactical engine from Story 2.1 (`src/lib/game/analysis.ts`). Specifically, it should use the `bestMove` provided by `analyzeBoard` (which uses Minimax at depth 5).
4. **Transient State:** The hint visualization is transient—it should clear as soon as a move is made (either by the player or the bot) or when the match is reset.
5. **Availability:** Hints are available regardless of the game mode (PvP or PvBot), helping the current human player.
6. **Pure Logic:** Any hint-specific logic (outside of UI) lives in `src/lib/game/hints.ts` or directly calls `analyzeBoard`.

## Tasks / Subtasks

- [x] Core Hint Logic (AC: 1, 3, 6)
  - [x] Implement `src/lib/game/hints.ts` (if needed for abstraction) or ensure `analyzeBoard` results are correctly exposed.
  - [x] Add `hintColumn: number | null` to `MatchState` in `src/types/game.ts`.
  - [x] Update `matchReducer` in `src/lib/game/reducer.ts` to handle a `SHOW_HINT` action that sets `hintColumn`.
  - [x] Ensure any `DROP_DISC` or `RESET_MATCH` action clears `hintColumn`.
- [x] UI Hint Integration (AC: 2, 4, 5)
  - [x] Add a "Hint" button (using Shadcn Button primitive) to the game UI (e.g., near the board or in an action bar).
  - [x] Update `src/components/game/game-board.tsx` and `src/components/game/column-button.tsx` to accept a `isHinted` prop or check the state for highlighting.
  - [x] Apply a "pulsing" or "glow" effect to the hinted column using Tailwind classes (e.g., `animate-pulse`, `shadow-lg shadow-primary`).
- [x] Unit Verification (AC: 1, 3, 6)
  - [x] Create `tests/game/hints.test.ts`.
  - [x] Verify that requesting a hint in various board states returns the logically best move according to the tactical engine.
  - [x] Verify that move actions clear the hint.

## Dev Notes

- **Tactical Core:** Do not reimplement win/block detection. Use `analyzeBoard(board, player)`.
- **UI Boundary:** The game board is built with React DOM/CSS. Stick to Tailwind for animations and visual highlights to maintain the "Liquid Glass" theme constraints.
- **State Flow:** Hinting is a UI-level assistance but persists in state to ensure consistency across re-renders. It is not persisted to Supabase.
- **Performance:** `analyzeBoard` at depth 5 is fast enough for a single call upon button click.

### Project Structure Notes

- Logic: `src/lib/game/hints.ts` / `src/lib/game/analysis.ts`
- State: `src/lib/game/reducer.ts`, `src/types/game.ts`
- Components: `src/components/game/game-board.tsx`, `src/app/game/page.tsx`
- Tests: `tests/game/hints.test.ts`

### References

- [Source: _bmad-output/game-architecture.md#Tactical Analysis Core]
- [Source: _bmad-output/project-context.md#Tactical Analysis Pattern]
- [Source: src/lib/game/analysis.ts#L28]

## Dev Agent Record

### Agent Model Used

Antigravity v1.0

### Debug Log References

- 2026-05-28: Started implementation; resolver script `_bmad/scripts/resolve_customization.py` was not present, so base gds-dev-story workflow was followed.
- 2026-05-28: RED check confirmed missing `src/lib/game/hints.ts` via `npx vitest run tests/game/hints.test.ts`.
- 2026-05-28: Validation passed: `npx vitest run`, `npm run lint`, `npm run typecheck`, and `npm run build`.
- 2026-05-28: In-app browser loaded `127.0.0.1:3000/game`; screenshot verified the Hint button highlights the center column. Move-clears-hint behavior is covered by automated reducer tests.

### Completion Notes List

- Added a pure `getHintMove` helper that delegates to `analyzeBoard(board, player).bestMove`, preserving the Story 2.1 Minimax with Alpha-Beta pruning path as the source of hint decisions.
- Added `hintColumn` state plus `SHOW_HINT` reducer support; hints are cleared by successful `DROP_DISC` actions and by `RESET_MATCH`.
- Added a Shadcn Button-based Hint control and Tailwind pulse/glow highlighting on the hinted column button, with screen-reader text for non-color feedback.
- Added unit and render coverage for hint selection, unavailable active player, reducer state updates, hint clearing, and hinted column markup.

### File List

- src/lib/game/hints.ts
- src/lib/game/reducer.ts
- src/types/game.ts
- src/hooks/use-match-reducer.ts
- src/app/game/page.tsx
- src/components/game/game-board.tsx
- src/components/game/column-button.tsx
- src/lib/config/labels.ts
- tests/game/hints.test.ts
- tests/game/reducer.test.ts
- tests/game/rules.test.ts
- tests/game/game-board-render.test.tsx

### Change Log

- 2026-05-28: Implemented Player Hint System and moved story to review.
