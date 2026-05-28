---
project_name: 'connect_four'
user_name: 'Tanat'
date: '2026-05-28'
sections_completed:
  - technology_stack
  - critical_implementation_rules
  - performance_rules
  - code_organization_rules
  - testing_rules
  - platform_build_rules
  - dont_miss_rules
existing_patterns_found: 7
source_architecture: 'C:/Users/w2/Desktop/connect_four/_bmad-output/game-architecture.md'
status: 'complete'
rule_count: 56
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing game code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

This project is currently pre-implementation: no `package.json` or app source tree exists yet. Use the architecture document as the source of truth when scaffolding.

- Framework: Next.js App Router 16.2.6
- Runtime UI: React 19.2.6
- Styling: Tailwind CSS 4.3.0
- UI primitives: Shadcn UI CLI 4.8.2
- Backend client: `@supabase/supabase-js` 2.106.2
- Deployment: Vercel
- Runtime requirement: Node.js >=20.9.0
- Optional AI docs MCP: Context7

## Critical Implementation Rules

### Product Scope

- Build a web app, not a canvas-first game engine project.
- Implement the board with React DOM/CSS components unless a later architecture update explicitly changes this.
- MVP is guest-first. Do not block play behind auth.
- Realtime multiplayer, full city leaderboard, Stripe, and Azure/LLM Coach are roadmap unless core MVP is complete.

### Game Logic Boundary

- `src/lib/game/*` must stay pure TypeScript.
- `src/lib/game/*` must not import React, Next.js, Supabase, browser storage, DOM APIs, or UI components.
- UI components may import game logic, but must not duplicate rules.
- Supabase modules may persist summaries but must not mutate live match state.

Required pure modules:

- `src/lib/game/board.ts`
- `src/lib/game/rules.ts`
- `src/lib/game/win-detection.ts`
- `src/lib/game/reducer.ts`
- `src/lib/game/bot.ts`
- `src/lib/game/hints.ts`
- `src/lib/game/coach.ts`
- `src/lib/game/rewards.ts`

### Match State Pattern

Use a local reducer/state-machine per match.

Allowed phases:

- `idle`
- `playing`
- `won`
- `draw`
- `review`
- `rewarded`

Components dispatch reducer actions. They do not mutate board arrays directly.

### Tactical Analysis Pattern

Bot, hint, and coach must share tactical analysis helpers.

- Do not reimplement win/block detection in components.
- Do not create separate tactical logic for bot and coach.
- Shared analysis should compute legal moves, immediate wins, immediate blocks, center-preferred moves, and threats.

### Match Completion Pipeline

End-of-match flow must stay consistent:

1. Reducer reaches `won` or `draw`.
2. UI displays result and winning line.
3. Coach insight is generated.
4. Reward is selected.
5. Match summary is persisted if possible.
6. UI continues even if persistence fails.

Persistence failure must not block result, coach insight, or reward display.

### Supabase Boundary

- No Supabase write per move in MVP.
- Persist match summaries after completion.
- Candidate tables: `matches`, `leaderboard_entries`, `rewards`, optional `profiles`.
- Never log Supabase keys, access tokens, email addresses, or raw user profile data.

### Error Handling

Use typed result objects for domain logic and try/catch at async boundaries.

Expected game outcomes like full column, invalid phase, and unavailable hint are not thrown exceptions.

### Testing Requirements

Core game logic must have table-driven unit tests for:

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

### UI and Accessibility

- Mobile-first layout is primary.
- Board columns must be real buttons or button-like controls.
- Column controls need labels like `Drop disc in column 1`.
- Color must not be the only win indicator.
- Coach feedback should be short, useful, and non-judgmental.
- Use Shadcn primitives for common buttons, cards, dialogs, tabs, and toggles.

### Liquid Glass Guardrails

- Board readability wins over decoration.
- Use Liquid Glass on shell, panels, dialogs, reward cards, and coach surfaces.
- Do not put heavy blur layers over every board cell.
- Board cells and discs must remain high contrast.
- Respect reduced motion where practical.

### File Organization

Use this planned structure when scaffolding:

```text
src/app/
src/components/game/
src/components/coach/
src/components/rewards/
src/components/leaderboard/
src/components/layout/
src/components/ui/
src/hooks/
src/lib/game/
src/lib/supabase/
src/lib/config/
src/lib/utils/
src/types/
tests/game/
public/audio/
public/images/rewards/
docs/
```

### Naming Rules

- React component files: `kebab-case.tsx`
- Hooks: `use-kebab-name.ts`
- Pure modules: `kebab-case.ts`
- Tests: `<module>.test.ts`
- Types/interfaces: `PascalCase`
- Functions: `camelCase`
- Reducer actions: `UPPER_SNAKE`
- Log event names: `dot.case`

### Platform and Build Rules

- Use `create-next-app` with TypeScript, Tailwind, and App Router.
- Add Shadcn UI after project creation with `npx shadcn@latest init`.
- Install `@supabase/supabase-js` and `next-themes`.
- Keep Supabase secrets in `.env.local`; commit only `.env.example`.
- Deploy target is Vercel.
- Do not introduce Phaser, PixiJS, Unity, Godot, or canvas architecture unless architecture is updated.

### Critical Don't-Miss Rules

- Do not write game rules inside React components.
- Do not write Supabase calls inside pure game modules.
- Do not persist every move to Supabase for MVP.
- Do not make auth required before quick play.
- Do not use color alone for winner indication.
- Do not let Liquid Glass reduce board contrast or tap clarity.
- Do not create separate tactical logic for bot, hint, and coach.
- Do not block reward display if persistence fails.
- Do not log PII, tokens, Supabase keys, or raw profile data.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any game code.
- Follow ALL rules exactly as documented.
- When in doubt, prefer the more restrictive boundary.
- Update this file if new patterns emerge during implementation.

**For Humans:**

- Keep this file lean and focused on agent needs.
- Update it when the technology stack changes.
- Review it after major architecture changes.
- Remove rules that become obvious or obsolete over time.

Last Updated: 2026-05-28
