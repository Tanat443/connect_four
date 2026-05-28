# Story 3.2: Milestone & Reward Logic

Status: ready-for-dev

## Story

As a player,
I want to earn virtual rewards for achievements like "First Win" or "Top Performer",
so that I feel incentivized to keep playing.

## Acceptance Criteria

1. **Given** a match summary (from Story 3.1)
2. **When** specific conditions are met (e.g., player wins, bot difficulty is medium, or first match completed)
3. **Then** a reward object (badge, mock promo code, or bonus card) is generated.
4. **And** the reward is added to the match result state for the UI to display in the next stage (Story 3.3).

## Tasks / Subtasks

- [ ] Define Reward types in `src/types/rewards.ts` (AC: 3)
  - [ ] Define `RewardType` (BADGE, PROMO, BONUS)
  - [ ] Define `Reward` interface with icon, label, and description
- [ ] Implement Reward Logic in `src/lib/game/rewards.ts` (AC: 1, 2, 3)
  - [ ] Implement `selectReward(summary: MatchSummary): Reward | null`
  - [ ] Add logic for "First Match" (always grants a badge)
  - [ ] Add logic for "Bot Defeated" (grants a mock promo code if difficulty > easy)
- [ ] Integrate into Match Completion Pipeline (AC: 4)
  - [ ] Update `use-match-reducer.ts` to call `selectReward` after match ends
  - [ ] Update `MatchState` to hold the current session's reward

## Dev Notes

- **Pure Logic Rule**: `src/lib/game/rewards.ts` must stay pure and not import UI or Supabase.
- **Match Completion Pipeline**: This story happens AFTER `saveMatchSummary` (or concurrently) as part of the pipeline defined in `project-context.md`.
- **Mocking**: For this story, focus on the logic and data structures. Actual "Liquid Glass" visual presentation is Story 3.3.

### Project Structure Notes

- New file: `src/lib/game/rewards.ts`
- New file: `src/types/rewards.ts`
- Modify: `src/hooks/use-match-reducer.ts`

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.2]
- [Source: _bmad-output/project-context.md#Match Completion Pipeline]
- [Source: _bmad-output/game-architecture.md#Entity Patterns]

## Dev Agent Record

### Agent Model Used

Antigravity (Winston/Architect)

### Debug Log References

N/A

### Completion Notes List

N/A

### File List

- src/lib/game/rewards.ts
- src/types/rewards.ts
- src/hooks/use-match-reducer.ts
