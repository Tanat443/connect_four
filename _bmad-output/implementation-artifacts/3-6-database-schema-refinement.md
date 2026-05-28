# Story 3.6: Database Schema Refinement (Matches & Leaderboard)

Status: ready-for-dev

## Story

As a developer,
I want to refactor the database schema to better support game modes, complex participant tracking, and aggregated statistics,
so that the leaderboard and match history features are performant and accurate.

## Acceptance Criteria

1. **Given** the existing Supabase project.
2. **When** the migration 002 is applied.
3. **Then** the `profiles` table includes `avatar_url`.
4. **And** the `matches` table includes `game_mode`, `player_1_id`, `player_2_id`, `bot_difficulty`, `status`, and `winner_id` as foreign keys.
5. **And** a new `leaderboards` table is created for aggregated ELO ratings and win/loss counts.
6. **And** TypeScript types in `src/types/supabase.ts` accurately reflect the new schema.

## Tasks / Subtasks

- [ ] Database Migration (AC: 1, 2, 3, 4, 5)
  - [ ] Create `supabase/migrations/002_refined_schema.sql`.
  - [ ] Implement Enums for `game_mode`, `match_status`, and `bot_difficulty`.
  - [ ] Refactor `matches` table columns and relationships.
  - [ ] Create `leaderboards` table with default rating (1200).
- [ ] TypeScript Type Refinement (AC: 6)
  - [ ] Update `src/types/supabase.ts` with new interfaces for `MatchSummary`, `Profile`, and `LeaderboardEntry`.
- [ ] Data Persistence Logic Update
  - [ ] Update `saveMatchSummary` in `src/lib/supabase/matches.ts` to use the new fields.
  - [ ] Update `use-match-reducer.ts` to pass the correct mode/player IDs/difficulty during match completion.

## Dev Notes

- **Enums**: Use Postgres enums instead of raw strings for type safety in the DB.
- **Foreign Keys**: `player_1_id` and `player_2_id` refer to `profiles.id` (UUID). `winner_id` also refers to `profiles.id`.
- **ELO Rating**: The `leaderboards` table is intended for high-performance reads (aggregated data) instead of calculating wins on-the-fly.

### References

- [Source: User Request - Story 3.6 Database Structure]
- [Source: _bmad-output/game-architecture.md#Supabase Boundary]

## Change Log

- 2026-05-28: Initial story creation for database schema refactoring and leaderboard support.
