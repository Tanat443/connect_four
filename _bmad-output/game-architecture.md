---
title: 'Game Architecture'
project: 'connect_four'
date: '2026-05-28'
author: 'Tanat'
version: '1.0'
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9]
status: 'complete'
engine: 'Next.js App Router web stack'
platform: 'web'

# Source Documents
gdd: 'C:/Users/w2/Desktop/connect_four/_bmad-output/planning-artifacts/gdds/gdd-connect_four-2026-05-28/gdd.md'
epics: 'C:/Users/w2/Desktop/connect_four/_bmad-output/planning-artifacts/gdds/gdd-connect_four-2026-05-28/epics.md'
brief: 'C:/Users/w2/Desktop/connect_four/_bmad-output/game-brief.md'
---

# Game Architecture

## Executive Summary

**Connect Four Tatti** architecture is designed for the **Next.js App Router web stack** targeting **web**.

**Key Architectural Decisions:**

- Use React DOM and pure TypeScript game modules instead of canvas/game-engine complexity.
- Keep rules, bot, hint, and coach logic in shared `src/lib/game/*` analysis utilities.
- Use Supabase for match summaries, leaderboard/reward progress, and optional profile boundaries, not per-turn state.
- Keep MVP guest-first, with Supabase Auth and realtime multiplayer deferred unless core scope finishes early.

**Project Structure:** Hybrid feature/domain organization with 10 core systems mapped to explicit locations.

**Implementation Patterns:** 7 core patterns and 3 novel patterns define tactical analysis, match completion, and Liquid Glass boundaries for AI agent consistency.

**Ready for:** implementation story creation and project scaffolding.

---

## Document Status

This architecture document is being created through the GDS Architecture Workflow.

**Steps Completed:** 9 of 9 (Complete)
**Status:** Complete

---

## Project Context

### Game Overview

**Connect Four Tatti** - modern web platform for Connect Four, positioned as a gamified loyalty layer for customers waiting for cake delivery. Players complete short matches, receive coaching feedback, and earn prototype rewards such as badges, promo cards, or bonuses.

### Technical Scope

**Platform:** Web app
**Genre:** Puzzle / Casual Strategy
**Project Level:** Medium complexity MVP with roadmap to higher complexity realtime/social features

### Core Systems

| System | Complexity | GDD Reference |
| --- | --- | --- |
| Connect Four Rules Engine | Medium | Core Gameplay, Game Mechanics |
| Local Two-Player Match | Low | Development Epic 1 |
| Bot Opponent | Medium | Difficulty Curve, Epic 2 |
| Best Move Hint | Medium | Player Assistance, Epic 2 |
| Rule-Based AI Coach | Medium | AI Coach, Epic 2 |
| Reward Flow | Low-Medium | Economy and Resources, Epic 3 |
| Match History / Leaderboard | Medium | Progression, Epic 3 |
| Mobile UI + Liquid Glass | Medium | Art Style, Epic 4 |
| Theme System | Low | Epic 4 |
| Submission / README Flow | Low | Epic 5 |

### Technical Requirements

- Next.js App Router + Tailwind CSS + Shadcn UI.
- Supabase for at least one real backend feature: match history, leaderboard, profile, or rewards.
- Vercel deployment.
- Pure, testable game logic separated from UI.
- Mobile-first responsive interface.
- Restrained Liquid Glass effects that do not reduce board readability or mobile performance.
- Bot/hint/coach logic should reuse shared board analysis utilities.

### Complexity Drivers

**High Attention Areas:**
- Correct win detection and winning-line extraction for all directions.
- Bot, hint, and coach sharing the same tactical analysis without duplicated logic.
- Supabase boundary: deciding what is real persistence vs prototype/mock.
- Mobile visual polish without sacrificing performance.

**Novel / Product-Specific Elements:**
- Connect Four tied to marketplace reward flow.
- AI Coach as a lightweight rule-based product differentiator.
- Liquid Glass dessert-themed UI around a highly readable game board.

### Technical Risks

- Scope creep from bot, multiplayer, AI Coach, leaderboard, rewards, and Pro ideas.
- Multiplayer is roadmap unless core MVP finishes early.
- Liquid Glass can harm readability/performance if overused.
- AI Coach can become too large if treated like a full LLM feature.
- Reward flow can feel fake unless represented clearly in UI and README.

---

## Engine & Framework

### Selected Engine

**Next.js App Router web stack**

Runtime framework: Next.js 16.2.6 + React 19.2.6
Styling/UI: Tailwind CSS 4.3.0 + Shadcn UI CLI 4.8.2
Backend/data: Supabase JS 2.106.2
Deployment: Vercel
Runtime requirement: Node.js >=20.9.0

**Rationale:** Connect Four Tatti is a web-first product game, not a physics-heavy canvas game. Next.js gives routing, deployment fit, server/client boundaries, and strong integration with Supabase and Vercel. The Connect Four board can be implemented with accessible DOM/CSS components, keeping game logic pure and testable.

### Project Initialization

```bash
npx create-next-app@latest connect-four-tatti --ts --tailwind --app
cd connect-four-tatti
npx shadcn@latest init
npm install @supabase/supabase-js next-themes
```

### Engine-Provided Architecture

| Component | Solution | Notes |
| --- | --- | --- |
| Rendering | React DOM | Board, panels, rewards, coach UI as components |
| Routing | Next.js App Router | Routes for game, leaderboard, profile/mock rewards |
| Styling | Tailwind CSS + CSS variables | Liquid Glass tokens, dark/light theme |
| UI Components | Shadcn UI | Buttons, dialogs, cards, tabs, theme switch |
| Backend Client | Supabase JS | Match history, leaderboard, rewards |
| Build/Deploy | Next.js + Vercel | Public project link for submission |
| Input | Browser pointer/keyboard events | Tap/click columns; optional 1-7 keys |
| Audio | Browser Audio API or simple HTMLAudio | Minimal drop/win/reward sounds |

### Remaining Architectural Decisions

- Exact app folder structure.
- Client/server boundaries for Supabase reads/writes.
- Game logic module shape and tests.
- Bot/hint/coach shared analysis utilities.
- Guest mode vs Supabase Auth.
- Match history and leaderboard schema.
- Reward model: mock cards vs persisted rewards.
- Liquid Glass CSS performance boundaries.
- Whether multiplayer is roadmap only or architecture-prepared.

### Starter Template Decision

Use `create-next-app` rather than a game starter template. A Phaser/Pixi starter would add canvas/game-loop complexity that this MVP does not need. The app should behave like a polished product interface with a game board inside it.

### AI Development Tools

No engine-specific MCP is needed because this is not Unity/Godot/Unreal. Recommended optional MCP:

- **Context7**: gives AI agents current docs for Next.js, Supabase, Tailwind, Shadcn, and React.
- Include as optional architecture note, not required for the app to run.

---

## Architectural Decisions

### Decision Summary

| Category | Decision | Version | Rationale |
| --- | --- | --- | --- |
| State Management | Local reducer/state machine per match | React 19.2.6 | Predictable turn transitions, testable, enough for MVP |
| Game Logic | Pure TypeScript domain modules under `src/lib/game` | TypeScript | Rules, bot, hint, coach share utilities and stay UI-independent |
| Persistence | Supabase for match results, leaderboard, rewards | supabase-js 2.106.2 | Satisfies Strong level backend requirement without overbuilding |
| Auth | Guest-first MVP with optional profile/auth boundary | Supabase Auth later | Faster onboarding; avoids blocking play behind login |
| Routing | App Router route groups | Next.js 16.2.6 | Clean separation between game, leaderboard, rewards/profile |
| UI | Shadcn primitives + feature components | shadcn 4.8.2 | Fast polished UI, consistent buttons/cards/dialogs |
| Styling | Tailwind tokens + CSS variables | Tailwind 4.3.0 | Supports dark/light and Liquid Glass constraints |
| Bot/Hint/Coach | Shared board analysis engine | TypeScript | Prevents duplicated tactical logic |
| Rewards | Prototype reward objects persisted optionally | Supabase / local fallback | Reward loop visible even if real coupons are not integrated |
| Multiplayer | Deferred, architecture-prepared via match session model | Roadmap | Keeps MVP focused while leaving path to realtime |
| Audio | Lightweight browser audio wrapper | Browser Audio | Minimal drop/win/reward sounds without middleware |

### State Management

**Approach:** local match reducer with explicit match phases.

Phases:
- `idle`
- `playing`
- `won`
- `draw`
- `review`
- `rewarded`

The reducer owns board state, current player, move history, winner, winning line, selected mode, and phase. React components dispatch actions, but do not mutate board state directly.

### Data Persistence

**Save System:** Supabase-backed match summary with local fallback.

Persist:
- match id
- mode: local / bot
- winner
- move count
- difficulty
- created_at
- coach insight summary
- reward id or reward label

Do not persist full realtime game state for MVP unless multiplayer enters scope.

### Game Logic Boundary

All core logic lives in pure TypeScript modules:

- `src/lib/game/rules.ts`
- `src/lib/game/board.ts`
- `src/lib/game/win-detection.ts`
- `src/lib/game/bot.ts`
- `src/lib/game/hints.ts`
- `src/lib/game/coach.ts`
- `src/lib/game/rewards.ts`

UI imports these modules; modules do not import React.

### App Structure

Recommended structure:

```text
src/app/
  page.tsx
  game/page.tsx
  leaderboard/page.tsx
  rewards/page.tsx
src/components/game/
src/components/layout/
src/components/rewards/
src/components/coach/
src/lib/game/
src/lib/supabase/
src/types/
```

### Supabase Boundary

Use Supabase only for product/progress systems, not for every local turn.

Tables later:
- `matches`
- `leaderboard_entries`
- `rewards`
- `profiles` optional

### Architecture Decision Records

1. **Use DOM/React board instead of canvas.**
   Rationale: the game is grid-based, UI-heavy, and product-oriented. DOM keeps accessibility, styling, and Liquid Glass integration easier.

2. **Keep game logic pure.**
   Rationale: rules, bot, hint, and coach need the same board analysis; pure modules reduce bugs and make tests easy.

3. **Guest-first onboarding.**
   Rationale: the user should play immediately while waiting for delivery; auth can enhance progress later.

4. **Defer realtime multiplayer.**
   Rationale: link multiplayer is a Great-level roadmap feature, but core MVP needs bot, rewards, coach, and polish first.

---

## Cross-cutting Concerns

These patterns apply to ALL systems and must be followed by every implementation.

### Error Handling

**Strategy:** typed result objects for game/domain logic, try/catch at async boundaries.

Domain functions should avoid throwing for expected game outcomes. Invalid moves, full columns, unavailable hints, and completed-game interactions return typed results. Async Supabase calls use try/catch and fail gracefully: match result and reward are shown to the user even if persistence fails.

**Error Levels:**
- `recoverable`: invalid move, full column, no hint available.
- `async`: Supabase/network failure.
- `fatal`: impossible board state or corrupted match state.

**Example:**

```ts
type AppResult<T, Code extends string = string> =
  | { ok: true; data: T }
  | { ok: false; code: Code; message: string };

type GameErrorCode = "FULL_COLUMN" | "GAME_OVER" | "INVALID_STATE";

function applyMove(state: MatchState, column: number): AppResult<MatchState, GameErrorCode> {
  if (state.phase !== "playing") {
    return { ok: false, code: "GAME_OVER", message: "Match is not playable." };
  }

  if (isColumnFull(state.board, column)) {
    return { ok: false, code: "FULL_COLUMN", message: "This column is full." };
  }

  return { ok: true, data: nextState };
}
```

### Logging

**Format:** small structured console logs in development.
**Destination:** browser console for MVP; no external logging service.

**Log Levels:**
- `error`: Supabase failure, impossible state.
- `warn`: recoverable fallback, skipped persistence.
- `info`: match completed, reward granted.
- `debug`: bot choice, hint reasoning, coach analysis in development only.

**Privacy Rule:** logs must not include PII, access tokens, Supabase keys, email addresses, or raw user profile data.

**Example:**

```ts
logger.info("match.completed", {
  mode: match.mode,
  winner: match.winner,
  moveCount: match.moves.length,
});
```

### Configuration

**Approach:** typed constants split by concern.

**Configuration Structure:**
- `src/lib/config/game.ts` - board size, connect length, player ids.
- `src/lib/config/bot.ts` - difficulty settings.
- `src/lib/config/rewards.ts` - reward pool and mock promo values.
- `src/lib/config/ui.ts` - animation timing and glass intensity.
- `.env.local` - Supabase URL/key only.

```ts
export const GAME_CONFIG = {
  rows: 6,
  columns: 7,
  connectLength: 4,
} as const;
```

### Module Boundaries

Core game modules must stay pure and UI-independent.

**Rules:**
- `src/lib/game/*` may not import React, Next.js, Supabase, browser storage, or UI components.
- `src/lib/game/*` can import shared types and config.
- Supabase modules may consume match summaries, but not mutate live board state.
- UI components dispatch reducer actions; they do not mutate board arrays directly.

### Event System

**Pattern:** typed local UI events via reducer actions, not a global event bus.

For MVP, reducer actions are enough. Global event bus would add unnecessary complexity. Cross-feature events like match completion should be handled by explicit callbacks/services.

**Event Naming:** domain-style past tense for completed events; imperative for reducer actions.

```ts
type MatchAction =
  | { type: "DROP_DISC"; column: number }
  | { type: "RESET_MATCH" }
  | { type: "MATCH_COMPLETED"; summary: MatchSummary }
  | { type: "REWARD_GRANTED"; reward: Reward };
```

### Debug Tools

**Available Tools:**
- development-only debug panel for board state, current player, phase, bot difficulty.
- console debug for bot/hint/coach reasoning.
- optional "force win / reset / fill column" buttons behind dev flag.

**Activation:** `NEXT_PUBLIC_DEBUG_GAME=true` in local development only.

```ts
export const DEBUG_GAME = process.env.NEXT_PUBLIC_DEBUG_GAME === "true";
```

### Testing Rules

Core game logic must use table-driven unit tests.

**Required coverage:**
- horizontal win
- vertical win
- both diagonal win directions
- draw detection
- full column rejection
- wrong phase rejection
- winning line extraction
- easy bot valid move
- medium bot takes immediate win
- medium bot blocks immediate threat
- coach returns relevant insight

### Accessibility and UX Consistency

- Board columns must be real buttons or button-like controls.
- Column controls must have labels like `Drop disc in column 1`.
- Color must not be the only win indicator; use highlight, ring, pattern, or motion.
- Coach feedback must be short, useful, and non-judgmental.
- Buttons and cards use Shadcn primitives.
- Mobile layout is primary; desktop expands without changing game rules.

### Liquid Glass and Visual Guardrails

- Board readability wins over decoration.
- Liquid Glass is allowed for shell, panels, dialogs, reward cards, and coach surfaces.
- Game board cells and discs must remain high contrast.
- Avoid stacking multiple heavy blur layers over the board.
- Respect reduced motion where possible.

### Performance Rules

- Game logic is synchronous and pure.
- No Supabase write per move in MVP.
- Persist only match summaries after completion.
- Persistence failure must not block result, coach insight, or reward display.
- Liquid Glass effects are limited to shell/cards/modals, not heavy layers over every board cell.

---

## Project Structure

### Organization Pattern

**Pattern:** Hybrid feature/domain structure.

**Rationale:** Next.js App Router defines route-level organization, while game logic needs a separate pure domain layer. This prevents UI code, Supabase code, and game rules from mixing.

### Directory Structure

```text
connect-four-tatti/
  src/
    app/
      page.tsx
      game/
        page.tsx
      leaderboard/
        page.tsx
      rewards/
        page.tsx
      layout.tsx
      globals.css
    components/
      game/
        game-board.tsx
        column-button.tsx
        disc.tsx
        match-status.tsx
        mode-selector.tsx
      coach/
        coach-panel.tsx
        hint-card.tsx
      rewards/
        reward-card.tsx
        reward-dialog.tsx
      leaderboard/
        leaderboard-table.tsx
      layout/
        app-shell.tsx
        theme-toggle.tsx
      ui/
        # shadcn components
    hooks/
      use-match-reducer.ts
      use-bot-turn.ts
      use-sound-effects.ts
    lib/
      game/
        board.ts
        rules.ts
        win-detection.ts
        reducer.ts
        bot.ts
        hints.ts
        coach.ts
        rewards.ts
      supabase/
        client.ts
        matches.ts
        leaderboard.ts
        rewards.ts
      config/
        game.ts
        bot.ts
        rewards.ts
        ui.ts
      utils/
        logger.ts
        result.ts
        cn.ts
    types/
      game.ts
      rewards.ts
      supabase.ts
  tests/
    game/
      win-detection.test.ts
      rules.test.ts
      bot.test.ts
      coach.test.ts
  public/
    audio/
      disc-drop.mp3
      win.mp3
      reward.mp3
    images/
      rewards/
  docs/
    rubric.md
  README.md
  .env.example
```

### System Location Mapping

| System | Location | Responsibility |
| --- | --- | --- |
| Game rules | `src/lib/game/rules.ts` | Move validation, turn rules, draw checks |
| Board model | `src/lib/game/board.ts` | Board creation, cloning, disc placement helpers |
| Win detection | `src/lib/game/win-detection.ts` | Four-in-row detection and winning line extraction |
| Match reducer | `src/lib/game/reducer.ts` + `hooks/use-match-reducer.ts` | Match phases and UI action dispatch |
| Bot | `src/lib/game/bot.ts` | Easy/medium bot move selection |
| Hint | `src/lib/game/hints.ts` | Best move / useful move suggestion |
| AI Coach | `src/lib/game/coach.ts` | Rule-based post-match insight |
| Rewards | `src/lib/game/rewards.ts` + `src/lib/supabase/rewards.ts` | Reward selection and optional persistence |
| Supabase | `src/lib/supabase/*` | Backend reads/writes only |
| Game UI | `src/components/game/*` | Board, discs, controls, status |
| Coach UI | `src/components/coach/*` | Hint and coach display |
| Theme/UI shell | `src/components/layout/*` | App shell, theme toggle, Liquid Glass surfaces |
| Tests | `tests/game/*` | Pure logic test coverage |

### Naming Conventions

#### Files

- React components: `kebab-case.tsx`, e.g. `game-board.tsx`.
- Hooks: `use-kebab-name.ts`, e.g. `use-match-reducer.ts`.
- Pure modules: `kebab-case.ts`, e.g. `win-detection.ts`.
- Tests: `<module>.test.ts`, e.g. `rules.test.ts`.

#### Code Elements

| Element | Convention | Example |
| --- | --- | --- |
| Types/interfaces | PascalCase | `MatchState`, `CoachInsight` |
| Functions | camelCase | `applyMove`, `findWinningLine` |
| Constants | UPPER_SNAKE or exported const object | `GAME_CONFIG` |
| React components | PascalCase | `GameBoard` |
| Reducer actions | UPPER_SNAKE | `DROP_DISC` |
| Event names/log events | dot.case | `match.completed` |

### Architectural Boundaries

- `src/lib/game/*` must not import React, Next.js, Supabase, browser APIs, or UI components.
- `src/components/*` can import game logic but cannot duplicate game rules.
- `src/lib/supabase/*` can persist summaries but cannot mutate live match state.
- `src/app/*` composes pages and providers; it should not contain complex game rules.
- `tests/game/*` test pure modules without rendering React.

---

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents.

### Novel Patterns

#### Tactical Analysis Core

**Purpose:** One shared analysis layer powers bot moves, best move hints, and AI Coach feedback.

**Components:**
- `win-detection.ts`: detects wins and winning lines.
- `rules.ts`: validates legal moves and applies moves.
- `bot.ts`: chooses moves using analysis.
- `hints.ts`: exposes player-facing suggestions.
- `coach.ts`: converts tactical findings into short, kind explanations.

**Data Flow:**
1. Match state provides board + current player.
2. Analysis utilities compute legal moves, immediate wins, immediate blocks, center preference, and missed threats.
3. Bot consumes analysis to pick a move.
4. Hint consumes analysis to suggest a move.
5. Coach consumes move history + final board to explain one meaningful moment.

**Implementation Guide:**

```ts
type TacticalAnalysis = {
  legalMoves: number[];
  winningMoves: number[];
  blockingMoves: number[];
  centerPreferredMoves: number[];
  threats: Threat[];
};

function analyzeBoard(board: Board, player: PlayerId): TacticalAnalysis {
  return {
    legalMoves: getLegalMoves(board),
    winningMoves: findWinningMoves(board, player),
    blockingMoves: findBlockingMoves(board, player),
    centerPreferredMoves: rankCenterMoves(board),
    threats: findThreats(board, player),
  };
}
```

**Usage:** Any bot, hint, or coach implementation must call `analyzeBoard` or lower-level shared helpers. Do not reimplement win/block detection inside UI components.

#### Match Completion Pipeline

**Purpose:** Keep end-of-match behavior consistent: result, coach, reward, persistence.

**Components:**
- Match reducer moves phase to `won` or `draw`.
- Coach service creates `CoachInsight`.
- Reward service creates `Reward`.
- Supabase service persists `MatchSummary`.

**Data Flow:**
1. `DROP_DISC` produces win/draw.
2. UI displays result and winning line.
3. `createCoachInsight(match)` runs.
4. `selectReward(match, insight)` runs.
5. `saveMatchSummary(summary)` attempts Supabase persistence.
6. UI proceeds even if persistence fails.

**Implementation Guide:**

```ts
async function completeMatch(match: MatchState): Promise<CompletionResult> {
  const insight = createCoachInsight(match);
  const reward = selectReward(match, insight);

  const summary = createMatchSummary(match, insight, reward);
  const persistence = await saveMatchSummary(summary);

  return {
    insight,
    reward,
    persisted: persistence.ok,
  };
}
```

**Usage:** End-of-match UI must use this pipeline instead of manually calling coach/reward/persistence in separate components.

#### Glass UI Boundary

**Purpose:** Keep Liquid Glass visual polish from damaging game readability and performance.

**Components:**
- `app-shell.tsx`: page-level glass shell.
- `reward-card.tsx`: glass reward surface.
- `coach-panel.tsx`: glass coach surface.
- `game-board.tsx`: high-contrast board, not heavy glass.

**Implementation Guide:**

```tsx
<Card className="glass-panel">
  <CoachPanel insight={insight} />
</Card>

<GameBoard className="high-contrast-board" />
```

**Usage:** Glass effects belong on panels/cards/modals. Board cells and discs use high-contrast styles.

### Communication Patterns

**Pattern:** explicit props, callbacks, and reducer actions.

Components communicate through typed props and callbacks. Game-wide state changes go through reducer actions. No global event bus for MVP.

```tsx
<GameBoard
  board={match.board}
  winningLine={match.winningLine}
  onDropDisc={(column) => dispatch({ type: "DROP_DISC", column })}
/>
```

### Entity Patterns

**Creation:** factory functions for board, match, rewards, summaries.

```ts
function createInitialMatch(mode: MatchMode): MatchState {
  return {
    board: createEmptyBoard(),
    mode,
    phase: "playing",
    currentPlayer: "player1",
    moves: [],
    winner: null,
    winningLine: [],
  };
}
```

### State Patterns

**Pattern:** reducer-driven finite match phases.

All transitions must pass through `matchReducer`.

```ts
type MatchPhase = "idle" | "playing" | "won" | "draw" | "review" | "rewarded";
```

### Data Patterns

**Access:** service functions for Supabase, pure return values for game data.

```ts
async function saveMatchSummary(summary: MatchSummary): Promise<AppResult<MatchSummary>> {
  const { data, error } = await supabase.from("matches").insert(summary).select().single();

  if (error) {
    return { ok: false, code: "SUPABASE_WRITE_FAILED", message: "Could not save match." };
  }

  return { ok: true, data };
}
```

### Consistency Rules

| Pattern | Convention | Enforcement |
| --- | --- | --- |
| Game logic | Pure TS modules only | No React/Next/Supabase imports in `src/lib/game/*` |
| State changes | Reducer actions only | Components dispatch actions |
| Tactical logic | Shared analysis helpers | Bot/hint/coach reuse analysis |
| Persistence | Summary-only writes | No Supabase writes per move |
| UI composition | Shadcn primitives + feature components | No one-off button/card styles |
| Liquid Glass | Panels only, board readable | Board avoids heavy blur |
| Tests | Table-driven tests for core rules | Required under `tests/game/*` |

---

## Architecture Validation

### Validation Summary

| Check | Result | Notes |
| --- | --- | --- |
| Decision Compatibility | PASS | Next.js web stack, pure game domain, Supabase persistence, and reducer state model align |
| GDD Coverage | PASS | Core rules, local mode, bot, hint, coach, rewards, leaderboard/history, UI polish, and submission readiness all have architecture support |
| Pattern Completeness | PASS | Error handling, logging, config, events, debug, accessibility, performance, state, data, and communication patterns are defined |
| Epic Mapping | PASS | All 5 epics map to project structure and implementation patterns |
| Document Completeness | PASS WITH MINOR FIXES | No placeholders found; document status updated and Node.js runtime requirement added |

### Coverage Report

**Systems Covered:** 10/10
**Patterns Defined:** 7 core patterns + 3 novel patterns
**Decisions Made:** 11 architectural decisions

### Issues Resolved

- Updated document status from `Steps Completed: 1 of 9` to current workflow progress.
- Added `Node.js >=20.9.0` to Engine & Framework compatibility notes.

### Validation Date

2026-05-28

---

## Development Environment

### Prerequisites

- Node.js >=20.9.0
- npm
- Git
- Supabase project
- Vercel account

### AI Tooling (MCP Servers)

No engine-specific MCP servers were selected because this project does not use Unity, Godot, or Unreal.

Recommended optional MCP:

| MCP Server | Purpose | Install Type |
| --- | --- | --- |
| Context7 | Current docs for Next.js, React, Tailwind, Shadcn UI, and Supabase | npx or Docker |

Context7 is optional. It helps AI agents avoid stale framework/API assumptions.

### Setup Commands

```bash
npx create-next-app@latest connect-four-tatti --ts --tailwind --app
cd connect-four-tatti
npx shadcn@latest init
npm install @supabase/supabase-js next-themes
```

### First Steps

1. Create the Next.js project with the setup commands.
2. Add the directory structure defined in this architecture.
3. Configure `.env.local` with Supabase URL and anon key.
4. Implement pure game logic before UI polish.
5. Add table-driven tests for `rules`, `win-detection`, `bot`, and `coach`.
6. Build the mobile-first game page, then add reward and persistence flows.
