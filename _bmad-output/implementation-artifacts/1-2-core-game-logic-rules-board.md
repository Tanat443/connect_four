# Story 1.2: Core Game Logic - Rules & Board

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a player,
I want the game to follow standard Connect Four rules,
so that the gameplay is fair and predictable.

## Acceptance Criteria

1. **Given** a pure TypeScript module `src/lib/game/rules.ts`
2. **When** I try to drop a disc into a valid column
3. **Then** the disc occupies the lowest available row in that column.
4. **And** the move is recorded in the match state.
5. **When** I try to drop a disc into a full column
6. **Then** the move is rejected with a `FULL_COLUMN` error code.
7. **And** the board state remains unchanged.

## Tasks / Subtasks

- [x] Initialize Core Game Logic Modules (AC: 1)
  - [x] Create `src/lib/game/board.ts` with board initialization and placement helpers.
  - [x] Create `src/lib/game/rules.ts` for move validation and rule enforcement.
- [x] Implement Disc Placement Logic (AC: 2, 3)
  - [x] Implement `getLowestAvailableRow(board, column)` helper.
  - [x] Implement `applyMove(state, column)` returning a result object.
- [x] Implement Full Column Rejection (AC: 6, 7)
  - [x] Ensure `applyMove` returns `{ ok: false, code: 'FULL_COLUMN' }` when column is full.
- [x] Table-Driven Unit Tests (AC: 1-7)
  - [x] Add tests in `tests/game/rules.test.ts` for valid moves.
  - [x] Add tests in `tests/game/rules.test.ts` for full column rejection.

### Review Findings

- [x] [Review][Patch] Missing Bounds Check for Column Indices [src/lib/game/rules.ts:5]
- [x] [Review][Patch] Hardcoded Board Constants in Domain Module [src/lib/game/board.ts:3]

## Dev Notes

- **Relevant architecture patterns and constraints**:
  - Pure TypeScript domain modules under `src/lib/game/*.ts`.
  - No React, Next.js, or Supabase imports allowed in these modules.
  - Use a local reducer/state-machine pattern (though the state machine itself is Story 1.4, the rules module is the foundation).
- **Source tree components to touch**:
  - `src/lib/game/board.ts` (NEW)
  - `src/lib/game/rules.ts` (NEW)
  - `tests/game/rules.test.ts` (NEW)
- **Testing standards summary**:
  - Table-driven unit tests are mandatory for core game logic.
  - Use typed result objects for domain logic errors (e.g., `FULL_COLUMN`).

### Project Structure Notes

- Alignment with unified project structure:
  - `src/lib/game/` for core modules.
  - `tests/game/` for unit tests.

### Project Context Rules

- **Framework Context**: Next.js App Router 16.2.6, React 19.2.6, Tailwind CSS 4.3.0.
- **Game Logic Boundary**: `src/lib/game/*` must stay pure TypeScript. No imports of React, Next.js, Supabase, or DOM APIs.
- **Naming Conventions**: Kebab-case for files (`rules.ts`), PascalCase for Types (`MatchState`), camelCase for functions (`applyMove`).
- **Error Handling**: Use typed result objects (e.g., `AppResult`) instead of throwing for expected game outcomes like full columns.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2]
- [Source: _bmad-output/game-architecture.md#Game Logic Boundary]
- [Source: _bmad-output/project-context.md#Critical Implementation Rules]

## Dev Agent Record

### Agent Model Used

Antigravity (Claude 3.5 Sonnet / Gemini 2.0 Pro)

### Debug Log References

- Vitest run pass: 3 tests, 100% logic coverage for Story 1.2.

### Completion Notes List

- Implemented `src/lib/game/board.ts` and `src/lib/game/rules.ts`.
- Defined core types in `src/types/game.ts`.
- Configured Vitest for path alias support.
- Verified all acceptance criteria with table-driven tests.

### File List

- `src/lib/game/board.ts`
- `src/lib/game/rules.ts`
- `tests/game/rules.test.ts`
