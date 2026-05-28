# Story 3.1: Supabase Match Summary Persistence

Status: ready-for-dev

## Story

As a developer,
I want to persist the outcomes of each match (winner, mode, moves, insight) to Supabase,
so that users have a real record of their progress.

## Acceptance Criteria

1. **Given** a completed match
2. **When** the phase moves to `review`
3. **Then** a match summary is inserted into the Supabase `matches` table.
4. **And** the UI remains functional even if the persistence call fails (graceful degradation).

## Tasks / Subtasks

- [x] Configure Supabase Client in `src/lib/supabase/client.ts` (AC: 3)
- [x] Create Match Persistence Service in `src/lib/supabase/matches.ts` (AC: 3)
- [x] Update `MatchState` to include a unique `id` for each match (AC: 3)
- [x] Integrate persistence call into `use-match-reducer` hook (AC: 2, 3, 4)
- [x] Verify implementation with unit tests in `tests/supabase/matches.test.ts`

## Dev Notes

- **Persistence Timing**: Summary must be sent exactly once when the match reaches terminal state.
- **Graceful Degradation**: NFR7 requires that network failures do not block the UI. Use try/catch and error logging.
- **Match ID**: Each match needs a UUID to avoid collisions and allow future updates.

### Project Structure Notes

- Uses `src/lib/supabase/client.ts` for the client.
- Uses `src/lib/supabase/matches.ts` for the service.
- State mutation happens in `use-match-reducer` via `useEffect`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.1]
- [Source: _bmad-output/project-context.md#Supabase Boundary]

## Dev Agent Record

### Agent Model Used

Antigravity (Winston/Architect)

### Debug Log References

N/A

### Completion Notes List

- Ultimate context engine analysis completed (retroactively).
- Implementation already verified and tested.

### File List

- src/lib/supabase/client.ts
- src/lib/supabase/matches.ts
- src/hooks/use-match-reducer.ts
- tests/supabase/matches.test.ts
