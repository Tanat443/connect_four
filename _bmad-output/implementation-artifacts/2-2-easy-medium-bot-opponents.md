# Story 2.2: Easy & Medium Bot Opponents

Status: completed

### Change Log
- 2026-05-28: Added missing UX/UI integration scope for playable bot mode on the game screen.
- 2026-05-28: Implemented playable bot mode UX/UI integration and automatic bot turns.
- 2026-05-28: Реализована логика выбора хода для ботов (Easy, Medium, Hard).
- 2026-05-28: Обновлен `MatchState` и `matchReducer` для поддержки режимов игры и сложности.
- 2026-05-28: Добавлено полное покрытие тестами для модуля `bot.ts`.

## Story

As a solo player,
I want to play against AI at different difficulty levels,
so that I can practice and improve my skills.

## Acceptance Criteria

1. **Bot Modes:** The system supports "Easy", "Medium", and "Hard" difficulty levels.
2. **Easy Logic:** Selection of a random legal column.
3. **Medium Logic:** 
   - Takes an immediate win if available.
   - Blocks an immediate opponent threat if no win is available.
   - Prefers center columns if no immediate tactical moves exist.
4. **Hard Logic:** Uses Minimax with Alpha-Beta Pruning (provided by Story 2.1).
5. **Pure Logic:** Bot logic resides in `src/lib/game/bot.ts` and does not import UI libraries.
6. **Mode Selection UI:** The game screen exposes a clear control to choose local player-vs-player mode or player-vs-bot mode before or during match reset.
7. **Difficulty Selection UI:** When player-vs-bot mode is selected, the player can choose bot difficulty (`Easy`, `Medium`, `Hard`) from the UI, and the selected difficulty is passed into match state.
8. **Automatic Bot Turn:** In player-vs-bot mode, after the human player drops a disc and the match remains playable, the bot automatically selects and dispatches its move using `getNextBotMove`.
9. **Bot Turn UX:** While the bot turn is pending or resolving, player column controls are disabled and the match status communicates that the bot is thinking/playing.
10. **Reset Preserves Selection:** Restarting/resetting the match preserves the currently selected mode and difficulty unless the player explicitly changes them.

## Tasks / Subtasks

- [x] Core Bot Implementation (AC: 1, 2, 3, 4, 5)
  - [x] Define `Difficulty` and `GameMode` in `src/types/game.ts`
  - [x] Implement `getNextBotMove` in `src/lib/game/bot.ts`
  - [x] Update `createInitialMatchState` and `matchReducer` in `src/lib/game/reducer.ts`
- [x] Unit Verification
  - [x] Create `tests/game/bot.test.ts`
  - [x] Verify all difficulty levels (Easy/Medium/Hard)
- [x] UX/UI Bot Mode Integration (AC: 6, 7, 8, 9, 10)
  - [x] Add a player-vs-player / player-vs-bot mode control to `src/app/game/page.tsx` or a dedicated game settings component.
  - [x] Add a difficulty selector that is visible/enabled for player-vs-bot mode and maps to `Difficulty`.
  - [x] Update `useMatchReducer` or create a focused bot-turn hook so player 2 bot moves automatically after a valid human move.
  - [x] Disable board column controls while the bot turn is pending or while animation lock is active.
  - [x] Update match status copy so the user can distinguish human turn, bot thinking, bot move, win, and draw states.
  - [x] Ensure reset/restart keeps selected `mode` and `difficulty` in the new match state.
- [x] UX/UI Verification (AC: 6, 7, 8, 9, 10)
  - [x] Add component/hook tests or reducer-level integration tests for selecting bot mode and difficulty.
  - [x] Add coverage proving a human move in bot mode triggers exactly one bot move when the match remains playable.
  - [x] Add coverage proving no bot move happens after `won`, `draw`, full-column rejection, or reset.
  - [x] Verify existing local player-vs-player flow still works unchanged.

## Dev Notes

- **Reuse Logic:** Bot logic utilizes `analyzeBoard` from `src/lib/game/analysis.ts`.
- **Pure Module:** `bot.ts` is a pure TypeScript module, suitable for any environment.
- **Minimax:** Hard mode is already supported by the depth-5 Minimax search in the tactical engine.
- **UI Boundary:** UI may call `getNextBotMove`, but must not duplicate tactical logic in React components.
- **Expected UI Touchpoints:** `src/app/game/page.tsx`, `src/hooks/use-match-reducer.ts`, and optionally a new `src/hooks/use-bot-turn.ts` or `src/components/game/mode-selector.tsx`.
- **Player Mapping:** Treat the human as `player1` and the bot as `player2` for this story unless a later story introduces configurable sides.
- **Timing:** Use the existing animation lock/timing pattern so the bot move does not fire before the human disc settles.

## Dev Agent Record

### Agent Model Used
Antigravity v1.0

### Debug Log References
- `npx vitest run tests/game/bot.test.ts`: 6 passed.
- `npx vitest run`: 35 tests passed.
- `npm run typecheck`: passed.
- `npx vitest run tests/game/game-board-render.test.tsx tests/game/reducer.test.ts tests/game/bot-turn.test.ts tests/game/bot.test.ts`: 17 passed.
- `npx vitest run`: 39 passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- In-app browser verification attempted for `http://localhost:3000/game`, but local dev server was not reachable in the browser environment (`ERR_CONNECTION_REFUSED`); production build verified the route.

### Completion Notes List
- Implemented `src/lib/game/bot.ts` with difficulty-based strategy selection.
- Added `Difficulty` and `GameMode` to `MatchState` for persistence and state tracking.
- Fixed regressions in `reducer.test.ts` caused by state structure changes.
- Added playable bot mode controls to the game screen with PvP/PvBot selection and Easy/Medium/Hard difficulty buttons.
- Added automatic player2 bot turn scheduling after the human move settles, using shared `getNextBotMove` logic and a pure queue predicate.
- Board columns now accept an external interaction lock so the player cannot move during bot thinking/turn resolution.
- Reset/restart preserves selected mode and difficulty through existing reducer reset semantics.

### File List
- `src/lib/game/bot.ts`
- `src/types/game.ts`
- `src/lib/game/reducer.ts`
- `src/lib/game/bot-turn.ts`
- `src/hooks/use-match-reducer.ts`
- `src/app/game/page.tsx`
- `src/components/game/game-board.tsx`
- `src/lib/config/labels.ts`
- `src/lib/config/ui.ts`
- `tests/game/bot.test.ts`
- `tests/game/bot-turn.test.ts`
- `tests/game/game-board-render.test.tsx`
- `tests/game/reducer.test.ts`
- `_bmad-output/implementation-artifacts/2-2-easy-medium-bot-opponents.md`
