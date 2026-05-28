# Story 3.5: User Authentication & Profiles

Status: review

## Story

As a player,
I want to sign in with my Google account and set my city,
so that my wins are tracked against my profile and I can see my rank in my city.

## Acceptance Criteria

1. **Given** the Supabase project is configured with Auth providers (Google/Email).
2. **When** a user signs in successfully.
3. **Then** a profile is created/updated in the `profiles` table with `id`, `email`, `display_name`, and `city`.
4. **And** the user session is persisted across page reloads.
5. **When** a match is completed while signed in.
6. **Then** the match record in Supabase is linked to the user's `id`.

## Tasks / Subtasks

- [x] Database Schema: Profiles (AC: 3)
  - [x] Create `profiles` table with RLS (Row Level Security).
  - [x] Set up a Supabase Function/Trigger to auto-create profile on Auth signup (optional but recommended).
- [x] Authentication Integration (AC: 1, 2, 4)
  - [x] Implement `src/lib/supabase/auth.ts` service (signIn, signOut, getSession).
  - [x] Create a `useAuth` hook to manage the global auth state.
- [x] Link Matches to Profiles (AC: 5, 6)
  - [x] Update `matches` table to include `user_id` (foreign key to `profiles.id`).
  - [x] Update match persistence logic in `use-match-reducer.ts` to include current `user_id`.
- [x] Profile Settings UI (AC: 3)
  - [x] Create a simple user profile drawer or page to edit `display_name` and `city`.

## Dev Notes

- **Auth Provider**: Google Auth requires client ID/Secret configuration in the Supabase Dashboard.
- **RLS**: Ensure users can only update their own profile.
- **Hybrid Mode**: The game should still work for guests (anonymous play), but prompts for login to "Save progress" or "Join leaderboard".

### Project Structure Notes

- New file: `src/lib/supabase/auth.ts`
- New file: `src/hooks/use-auth.ts`
- New component: `src/components/layout/user-nav.tsx` (Login button / User info)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.5]
- [Source: _bmad-output/project-context.md#Supabase Boundary]

## Dev Agent Record

### Agent Model Used

Antigravity (Winston/Architect)

Codex GPT-5

### File List

- supabase/migrations/001_profiles_auth.sql
- src/app/layout.tsx
- src/components/layout/app-shell.tsx
- src/components/layout/user-nav.tsx
- src/hooks/use-auth.tsx
- src/hooks/use-match-reducer.ts
- src/lib/supabase/auth.ts
- src/lib/supabase/matches.ts
- src/types/supabase.ts
- tests/game/reducer.test.ts
- tests/game/rules.test.ts
- tests/supabase/auth.test.ts
- tests/supabase/matches.test.ts

### Implementation Plan

- Add Supabase auth/profile boundary without requiring sign-in before play.
- Persist authenticated profile metadata via `profiles` RLS policies and auth signup trigger.
- Link completed match summaries to `auth.users.id` through `profiles.id` when a session exists.

### Debug Log

- `npm test -- tests/supabase/auth.test.ts tests/supabase/matches.test.ts` failed because no `test` script exists.
- `npx vitest run tests/supabase/auth.test.ts tests/supabase/matches.test.ts` initially failed with sandbox `spawn EPERM`; reran with approval.
- Red tests failed as expected before implementation: missing `auth.ts` and missing `user_id` persistence.
- Browser verification found nested button inside `summary`; replaced with native styled summary trigger.

### Completion Notes

- Added `profiles` table migration with RLS, owner-only insert/update policies, auth signup trigger, and nullable `matches.user_id` foreign key.
- Added Supabase auth service for Google OAuth, email OTP, sign-out, session lookup, profile upsert/load/update.
- Added global `AuthProvider`/`useAuth`, connected it in root layout, and added header user nav with Google sign-in, email link sign-in, profile city/display-name editing, and sign-out.
- Updated match persistence to include signed-in `user.id` while preserving guest play with `user_id: null`.
- Added focused auth/persistence tests and refreshed existing reducer/rules tests for dynamic match ids.

### Change Log

- 2026-05-28: Implemented user authentication, profile persistence, match user linking, profile UI, and validation tests.
