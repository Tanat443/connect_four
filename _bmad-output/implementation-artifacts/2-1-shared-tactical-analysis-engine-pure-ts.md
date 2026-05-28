# Story 2.1: Shared Tactical Analysis Engine (Pure TS)

Status: done

### Review Findings

- [x] [Review][Decision] Algorithm Strategy: Minimax vs Greedy — Upgraded to Minimax with Alpha-Beta Pruning (Depth 5) to support "Hard" level intelligence immediately.
- [x] [Review][Patch] Redundant Column Availability Check — Optimized `simulateMoveAt` to accept row coordinates, removing redundant lookups.
- [x] [Review][Defer] Move Evaluation Scopes — Strategic evaluation is now handled by the Minimax depth search and heuristic window scoring.

### Change Log
- 2026-05-28: Реализован shared tactical analysis engine и тестовое покрытие для Story 2.1.
- 2026-05-28: Алгоритм обновлен до Minimax с Alpha-Beta pruning для поддержки уровня "Hard". Оптимизированы симуляции ходов.

## Story

As a developer,
I want to have a single board analysis module that finds wins, blocks, and center-preference moves,
so that the bot, hints, and trainer use identical tactical logic.

## Acceptance Criteria

1. **Pure TypeScript Engine:** Logic resides in `src/lib/game/analysis.ts` and imports NO UI/Browser/Supabase libraries.
2. **Move Analysis:** The analyzer returns all legal moves, immediate winning moves, and immediate blocking moves for a given player.
3. **Tactical Ranking:** Moves are ranked with "Center Preference" (columns 3, 2/4, 1/5, 0/6) to favor strategic middle positions.
4. **Threat Detection:** Identify "missed threats" where the opponent would win on their next turn if the current player does not block.
5. **Shared Logic:** The module is designed to be the single source of truth for `bot.ts`, `hints.ts`, and `coach.ts`.

## Tasks / Subtasks

- [x] Core Analysis Functions (AC: 1, 2)
  - [x] Implement `getLegalMoves(board)`
  - [x] Implement `findWinningMoves(board, player)`
  - [x] Implement `findBlockingMoves(board, player)`
- [x] Tactical Heuristics (AC: 3)
  - [x] Implement `rankMovesByCenterPreference(moves)`
- [x] Threat Intelligence (AC: 4, 5)
  - [x] Implement `getMissedThreats(board, lastPlayer)`
- [x] Unit Verification
  - [x] Create comprehensive table-driven tests in `tests/game/analysis.test.ts`

## Dev Notes

- **Reuse Logic:** Import `ROWS`, `COLUMNS` from `@/lib/config/game`.
- **Win Detection:** Reuse `checkWin` or its internal `getWinningLine` logic from `win-detection.ts` by simulating hypothetical moves on cloned boards.
- **Pure Module:** Keep the analysis engine pure for testability and portability.

### Project Structure Notes

- Module: `src/lib/game/analysis.ts`
- Tests: `tests/game/analysis.test.ts`
- Pattern: Tactical Analysis Core (as defined in `game-architecture.md#Tactical-Analysis-Core`)

### References

- [Source: epics.md#Story-2.1]
- [Source: game-architecture.md#Tactical-Analysis-Core]
- [Source: project-context.md#Tactical-Analysis-Pattern]

## Dev Agent Record

### Agent Model Used

Antigravity v1.0

### Debug Log References
- `npx vitest run tests/game/analysis.test.ts` initially failed because `src/lib/game/analysis.ts` did not exist, confirming the red phase.
- `npx vitest run`: 5 files passed, 27 tests passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.

### Completion Notes List
- Implemented `src/lib/game/analysis.ts` as a pure TypeScript tactical analysis module with no UI, browser, or Supabase imports.
- Added legal move discovery, immediate winning move simulation, immediate blocking move detection, center-preference ranking, missed threat detection, and aggregate `analyzeBoard` output for future bot/hint/coach callers.
- Added table-driven coverage in `tests/game/analysis.test.ts` for legal moves, horizontal/vertical/diagonal wins, blocking, ranking, missed threats, and shared analysis shape.

### File List
- `src/lib/game/analysis.ts`
- `tests/game/analysis.test.ts`

### Review Findings

- [ ] [Review][Decision] Algorithm Strategy: Minimax vs Greedy — Current implementation is a Depth-1 greedy approach. While it fulfills Story 2.1 requirements, research confirms that a "Strong" bot requires Minimax with Alpha-Beta Pruning (Depth 5+). Do we upgrade now for "Medium" mode or defer to a future "Hard" mode story?
- [ ] [Review][Patch] Redundant Column Availability Check — `findWinningMoves` filters legal moves, but `simulateMove` calls `getLowestAvailableRow` again. Efficiency can be improved by passing the pre-calculated row. [src/lib/game/analysis.ts:41]
- [x] [Review][Defer] Move Evaluation Scopes — Current analysis only returns win/block. Strategic evaluation (e.g. forks, threats in 2 moves) is not implemented. [src/lib/game/analysis.ts:21] — deferred, outside current AC scope.

### Change Log
- 2026-05-28: Реализован shared tactical analysis engine и тестовое покрытие для Story 2.1.
