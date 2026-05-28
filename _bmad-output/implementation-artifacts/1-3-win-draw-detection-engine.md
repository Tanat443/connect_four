# Story 1.3: Win & Draw Detection Engine

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a player,
I want the game to accurately detect when someone wins or the board is full,
so that matches reach a clear conclusion.

## Acceptance Criteria

1. **Given** a board state with 4 connected discs of the same player horizontally
2. **When** the win detection utility is called
3. **Then** it correctly identifies the winner and returns the 4 coordinates.
4. **Given** a board state with 4 connected discs of the same player vertically
5. **When** the win detection utility is called
6. **Then** it correctly identifies the winner and returns the 4 coordinates.
7. **Given** a board state with 4 connected discs of the same player diagonally
8. **When** the win detection utility is called
9. **Then** it correctly identifies the winner and returns the 4 coordinates (both directions).
10. **Given** a full board with no 4-in-a-row
11. **When** the draw detection utility is called
12. **Then** it returns a `draw` state.

## Tasks / Subtasks

- [x] Initialize Win Detection Module (AC: 1-9)
  - [x] Create `src/lib/game/win-detection.ts`.
  - [x] Implement `checkWin(board: Board)` function.
- [x] Implement Directional Scanners (AC: 1, 4, 7)
  - [x] Implement Horizontal scan logic.
  - [x] Implement Vertical scan logic.
  - [x] Implement Diagonal (down-right and up-right) scan logic.
- [x] Implement Draw Detection (AC: 10-12)
  - [x] Implement `isDraw(board: Board)` helper.
- [x] Table-Driven Unit Tests (AC: 1-12)
  - [x] Create `tests/game/win-detection.test.ts`.
  - [x] Add comprehensive test cases for all win directions and draw states.

## Dev Notes

- **Relevant architecture patterns and constraints**:
  - Pure TypeScript domain modules under `src/lib/game/*.ts`.
  - Use constants `ROWS` and `COLUMNS` from `@/lib/config/game`.
  - Focus on efficiency: only scan valid ranges to avoid out-of-bounds checks.
- **Source tree components to touch**:
  - `src/lib/game/win-detection.ts` (NEW)
  - `tests/game/win-detection.test.ts` (NEW)
- **Testing standards summary**:
  - Mandatory table-driven tests.
  - Use board mockups (2D arrays) in tests to simulate specific win scenarios.

### Project Structure Notes

- `src/lib/game/win-detection.ts`: Core detection logic.
- `tests/game/win-detection.test.ts`: Unit tests.

### Previous Story Intelligence (Story 1.2)

- **Learnings**: Always validate inputs (bounds checks) even if internal.
- **Constants**: Already moved to `@/lib/config/game`. Use them.
- **Types**: Use standard `Board` and `PlayerId` from `@/types/game`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.3]
- [Source: _bmad-output/game-architecture.md#Game Logic Boundary]

## Dev Agent Record

### Agent Model Used

Codex (GPT-5)

### Debug Log References

- 2026-05-28: Confirmed red phase with `npx vitest run tests/game/win-detection.test.ts` failing because `@/lib/game/win-detection` did not exist.
- 2026-05-28: Verified green phase with `npx vitest run tests/game/win-detection.test.ts` passing 8 tests.
- 2026-05-28: Verified full regression suite with `npx vitest run` passing 12 tests across 2 files.
- 2026-05-28: Verified `npm run typecheck` and `npm run lint` pass.

### Completion Notes List

- Added pure TypeScript win detection with horizontal, vertical, down-right diagonal, and up-right diagonal scans.
- Added `isDraw(board)` helper that returns `draw` only when the board is full and `checkWin` finds no winner.
- Added table-driven unit coverage for all win directions, no-winner behavior, draw, open-board non-draw, and full-board-with-winner non-draw.
- Removed an unused `PlayerId` import from `src/lib/game/board.ts` so lint remains clean.

### File List

- src/lib/game/win-detection.ts
- src/lib/game/board.ts
- tests/game/win-detection.test.ts

### Change Log


### Review Findings

- [x] [Review][Patch] Избыточный вызов `checkWin` в `isDraw` [src/lib/game/win-detection.ts:45]
- [x] [Review][Patch] Эффективность проверки заполненности доски [src/lib/game/win-detection.ts:49]
- [x] [Review][Patch] Отсутствие теста для пограничного случая с внутренними пустыми ячейками [tests/game/win-detection.test.ts]
