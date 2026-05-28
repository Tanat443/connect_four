---
stepsCompleted: ["step-01-validate-prerequisites"]
inputDocuments: ["gdd.md", "game-architecture.md"]
---

# connect_four - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for connect_four, decomposing the requirements from the GDD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Start a new 7x6 Connect Four match.
FR2: Drop a disc into a column; disc occupies the lowest available row.
FR3: Reject moves in full columns with clear feedback.
FR4: Alternate turns correctly in local two-player mode.
FR5: Detect win horizontally, vertically, and diagonally (four connected discs).
FR6: Highlight the winning line visually (not by color alone).
FR7: Detect draw state when the board is full with no winner.
FR8: Play against an easy bot (random valid move).
FR9: Play against a medium bot (identifies immediate wins, blocks immediate losses, center-preference).
FR10: Request a best move hint (identifies win, block, or center-preferred move).
FR11: Post-match AI Coach analysis (names missed threats, winning moves, or decisive tactical moments).
FR12: Reward flow (badges, mock promo codes, bonus cards) after win or milestone.
FR13: View match history / leaderboard (backed by Supabase).
FR14: User Authentication (Google/Email) and Profile management (City, Display Name).

### NonFunctional Requirements

NFR1: Fast initial load on mobile web.
NFR2: Smooth tap response for disc placement (mobile-first interaction).
NFR3: Liquid Glass effects must not degrade mobile performance.
NFR4: Board readability wins over decoration (high contrast board and discs).
NFR5: Mobile-first responsive layout (usable with one hand).
NFR6: Guest-first MVP (no auth required to play quick matches).
NFR7: Persistence failure must not block game outcomes, coach insights, or reward display.
NFR8: Security: Never log PII, access tokens, Supabase keys, or raw profile data.

### Additional Requirements

- **Starter Template**: Use `create-next-app` with TypeScript, Tailwind CSS, and App Router.
- Infrastructure: Setup Shadcn UI primitives and `next-themes` for dark/light mode.
- Implementation Pattern: Use a local reducer/state-machine per match with explicit phases (idle, playing, won, draw, review, rewarded).
- Game Logic Boundary: Pure TypeScript modules in `src/lib/game/*` (no React/Supabase imports).
- Tactical Analysis Core: Shared analysis engine powers bot, hint, and coach.
- Match Completion Pipeline: Standard flow: Result -> Coach -> Reward -> Persist summary.
- Deployment: Target Vercel.
- File Organization: Use hybrid feature/domain structure as specified in Architecture.

### UX Design Requirements

*No separate UX Design document found. UX requirements derived from GDD and Architecture.*

UX-DR1: Dessert-themed UI with restrained Liquid Glass (translucent panels, soft blur, layered cards).
UX-DR2: High-contrast board cells and discs for accessibility.
UX-DR3: Column controls must be real buttons with accessible labels (e.g., "Drop disc in column 1").
UX-DR4: Visual highlights for winning moves that do not rely on color alone (e.g., ring, pattern, motion).
UX-DR5: Liquid Glass effects on shell, panels, and dialogs only; avoid heavy blur over the board.

### FR Coverage Map

FR1: Epic 1 - Start match functionality.
FR2: Epic 1 - Disc placement with gravity.
FR3: Epic 1 - Full column rejection logic.
FR4: Epic 1 - Local 2P turn alternation.
FR5: Epic 1 - Win detection (H, V, D).
FR6: Epic 1 - Winning line highlight.
FR7: Epic 1 - Draw state detection.
FR8: Epic 2 - Easy bot implementation.
FR9: Epic 2 - Medium bot with basic tactics.
FR10: Epic 2 - Player best move hints.
FR11: Epic 2 - Post-match AI Coach insights.
FR12: Epic 3 - Reward granting flow (badges/promo).
FR13: Epic 3 - Match history and leaderboard (Supabase).
FR14: Epic 3 - User Auth and Profiles.
UX-DR1: Epic 4 - Liquid Glass theme implementation.
UX-DR2: Epic 4 - High-contrast board and discs.
UX-DR3: Epic 4 - Accessible column buttons.
UX-DR4: Epic 4 - Accessible win highlights.
UX-DR5: Epic 4 - Targeted glass effects (shell/panels).
AR1-AR7: Epic 1 - Product scaffolding and core patterns.
AR8: Epic 5 - Final deployment to Vercel.

## Epic List

### Epic 1: Core Game Engine & Scaffolding
Deliver a complete, Correct Connect Four engine and local two-player mode, starting with project scaffolding.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, AR1, AR2, AR3, AR4, AR7.

### Epic 2: Intelligent Assistance (Bot, Hint, Coach)
Make the game smarter and more helpful through AI opponents, strategic hints, and post-match tactical analysis.
**FRs covered:** FR8, FR9, FR10, FR11, AR5.

### Epic 3: Reward Loop & Persistence
Implement the marketplace loyalty experience with rewards and backend progress tracking via Supabase.
**FRs covered:** FR12, FR13, AR6.

### Epic 4: Visual Polish & Mobile UI
Apply the dessert-themed "Liquid Glass" visual direction and ensure a premium mobile-first experience.
**FRs covered:** UX-DR1, UX-DR2, UX-DR3, UX-DR4, UX-DR5.

### Epic 5: Project Finalization & Deployment
Ensure the project is ready for submission with documentation and live deployment.
**FRs covered:** AR8.

## Epic 1: Core Game Engine & Scaffolding

Deliver a complete, Correct Connect Four engine and local two-player mode, starting with project scaffolding.

### Story 1.1: Project Scaffolding & Responsive Shell

As a developer,
I want to initialize the Next.js project with Tailwind, Shadcn, and a dessert-themed shell,
So that I have a modern, high-contrast foundation for the game.

**Acceptance Criteria:**

**Given** a new project directory
**When** I run the scaffolding commands (Next.js, Shadcn UI init)
**Then** the app starts successfully without errors.
**And** a basic layout shell with a navigation bar and theme toggle (Dark/Light) is visible.
**And** CSS variables for the dessert-themed palette are defined in `globals.css`.

### Story 1.2: Core Game Logic - Rules & Board

As a player,
I want the game to follow standard Connect Four rules,
So that the gameplay is fair and predictable.

**Acceptance Criteria:**

**Given** a pure TypeScript module `src/lib/game/rules.ts`
**When** I try to drop a disc into a valid column
**Then** the disc occupies the lowest available row in that column.
**And** the move is recorded in the match state.
**When** I try to drop a disc into a full column
**Then** the move is rejected with a `FULL_COLUMN` error code.
**And** the board state remains unchanged.

### Story 1.3: Win & Draw Detection Engine

As a player,
I want the game to accurately detect when someone wins or the board is full,
So that matches reach a clear conclusion.

**Acceptance Criteria:**

**Given** a board state with 4 connected discs of the same player
**When** the win detection utility is called
**Then** it correctly identifies a Horizontal, Vertical, or Diagonal win.
**And** it returns the coordinates of the 4 winning discs for highlighting.
**When** the board is full and no wins are detected
**Then** it returns a `draw` state.

### Story 1.4: Interactive Game Board & Turns

As players on the same device,
I want to alternate turns on an interactive board,
So that we can play a local match.

**Acceptance Criteria:**

**Given** an empty board in the `idle` phase
**When** Player 1 drops a disc
**Then** the turn switches to Player 2.
**And** the UI visually represents the placed disc.
**And** the board prevents multiple drops while a "fall" animation is theoretically in progress (or via state lock).

### Story 1.5: Win Visuals & Game Over Flow

As a player,
I want to see exactly how the match ended and be able to restart,
So that I can acknowledge the result and play again.

**Acceptance Criteria:**

**Given** a match state that reaches a `won` or `draw` phase
**When** the win is detected
**Then** the winning line is highlighted visually (e.g., using rings or high-contrast borders).
**And** a Game Over status appears with the winner's name or "Draw".
**When** I click "Restart Match"
**Then** the board clears and the state resets to `playing` (Phase 1).

## Epic 2: Intelligent Assistance (Bot, Hint, Coach)

Make the game smarter and more helpful through AI opponents, strategic hints, and post-match tactical analysis.

### Story 2.1: Shared Tactical Analysis Engine (Pure TS)

As a developer,
I want to have a single board analysis module that finds wins, blocks, and center-preference moves,
So that the bot, hints, and trainer use identical tactical logic.

**Acceptance Criteria:**

**Given** a pure TypeScript module `src/lib/game/analysis.ts`
**When** the analyzer is called with a board state
**Then** it returns a list of legal moves, immediate winning moves, and immediate blocking moves.
**And** it ranks legal moves based on center-column preference.
**And** it identifies "missed threats" (opponent wins on next turn if not blocked).

### Story 2.2: Easy & Medium Bot Opponents

As a solo player,
I want to play against AI at different difficulty levels,
So that I can practice and improve my skills.

**Acceptance Criteria:**

**Given** a match in bot mode
**When** the difficulty is "Easy"
**Then** the bot selects a random legal move.
**When** the difficulty is "Medium"
**Then** the bot takes an immediate win if available.
**And** it blocks an immediate opponent threat if no win is available.
**And** it prefers center columns if no immediate win/block exists.

### Story 2.3: Player Hint System

As a player,
I want to be able to request a best move suggestion,
So that I can learn to spot tactical opportunities.

**Acceptance Criteria:**

**Given** an ongoing match
**When** I click the "Hint" button
**Then** the column with the highest-ranked move is visually highlighted (e.g., pulsing border or icon).
**And** the hint logic uses the shared tactical engine from Story 2.1.

### Story 2.4: Post-Match AI Coach

As a player,
I want to receive a short feedback message after the match about my performance,
So that I understand how to play better.

**Acceptance Criteria:**

**Given** a completed match
**When** the match reaches the `review` phase
**Then** the AI Coach displays a relevant tactical insight (e.g., "You missed a win in column 3" or "Great block in column 5!").
**And** the feedback is short, non-judgmental, and based on the move history analysis.

## Epic 3: Reward Loop & Persistence

Implement the marketplace loyalty experience with rewards and backend progress tracking via Supabase.

### Story 3.1: Supabase Match Summary Persistence

As a developer,
I want to persist the outcomes of each match (winner, mode, moves, insight) to Supabase,
So that users have a real record of their progress.

**Acceptance Criteria:**

**Given** a completed match
**When** the phase moves to `review`
**Then** a match summary is inserted into the Supabase `matches` table.
**And** the UI remains functional even if the persistence call fails (graceful degradation).

### Story 3.2: Milestone & Reward Logic

As a player,
I want to earn virtual rewards for achievements like "First Win" or "Top Performer",
So that I feel incentivized to keep playing.

**Acceptance Criteria:**

**Given** a match summary
**When** specific conditions are met (e.g., player wins, bot difficulty is medium)
**Then** a reward object (badge, mock promo code) is generated and added to the player's profile/state.

### Story 3.3: Reward Glass Cards & Dialogs

As a player,
I want to see my rewards in a premium visual format,
So that the achievement feels special.

**Acceptance Criteria:**

**Given** a newly earned reward
**When** the reward is granted
**Then** a "Liquid Glass" modal or card appears with dessert-themed visuals.
**And** the reward details (e.g., "10% Mock Discount") are clearly legible.

### Story 3.4: Match History & Leaderboard Dashboard

As a player,
I want to view my past results and competitive rankings,
So that I can track my growth over time.

**Acceptance Criteria:**

**Given** match data in Supabase
**When** I visit the Leaderboard or Profile page
**Then** I see a list of recent matches and a city-wide rank (mock or real).
**And** the data is fetched asynchronously with loading states.

### Story 3.5: User Authentication & Profiles

As a player,
I want to sign in with my Google account and set my city,
So that my wins are tracked against my profile and I can see my rank in my city.

**Acceptance Criteria:**

**Given** a guest player
**When** I click "Sign In with Google"
**Then** I am redirected to Supabase Auth.
**And** upon return, a row is created in the `profiles` table with my email and metadata.
**When** I complete a match while signed in
**Then** the match summary in Supabase includes my `user_id`.

## Epic 4: Visual Polish & Mobile UI

Apply the dessert-themed "Liquid Glass" visual direction and ensure a premium mobile-first experience.

### Story 4.1: Liquid Glass Theme & Visual Refinement

As a user,
I want to see a premium UI with blur effects, soft shadows, and a dessert palette,
So that the app feels modern and attractive.

**Acceptance Criteria:**

**Given** the layout shell
**When** I view the app
**Then** translucent panels with backdrop-blur are used for cards and dialogs.
**And** the color palette matches the dessert theme specified in the GDD.
**And** the app supports both Dark and Light modes correctly.

### Story 4.2: Accessible Interactions & Polished Animations

As a mobile player,
I want smooth animations and accessible controls,
So that the game is enjoyable and usable for everyone.

**Acceptance Criteria:**

**Given** the game board
**When** a disc is dropped
**Then** it falls smoothly to its position using CSS transitions.
**And** column headers include clear ARIA labels for screen readers.
**And** the game board is navigable via keyboard using numbers 1-7.

### Story 4.3: Themed Assets & Branding

As a user,
I want to see UI elements like reward icons and disc textures that fit the dessert theme,
So that I feel immersed in the cake marketplace brand.

**Acceptance Criteria:**

**Given** the rewards or game screens
**When** I earn a badge or see a disc
**Then** the icons and assets use dessert-inspired motifs (e.g., cake badges, colorful disc textures).

## Epic 5: Project Finalization & Deployment

Ensure the project is ready for submission with documentation and live deployment.

### Story 5.1: README & Project Storytelling

As a developer,
I want to provide high-quality documentation (README) describing features, tech stack, and evaluation compliance,
So that the project is easy for others to understand and review.

**Acceptance Criteria:**

**Given** a completed project
**When** I view the README.md
**Then** it contains a project overview, setup instructions, and architecture breakdown (Tactical Analysis Core, Match Completion Pipeline).
**And** it clearly demonstrates how the project fulfills the evaluation rubric.

### Story 5.2: Final Vercel Deployment & QA

As a product owner,
I want the game to be available via a public URL with all features functional,
So that the project is ready for submission.

**Acceptance Criteria:**

**Given** the code in the repository
**When** the project is deployed to Vercel
**Then** the live URL loads successfully.
**And** all core features (local play, bots, Supabase persistence) are verified to work in the production environment.
