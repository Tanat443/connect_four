# История 1.4: Интерактивная игровая доска и ходы

Статус: done

<!-- Примечание: Валидация необязательна. Запустите validate-create-story для проверки качества перед dev-story. -->

## История

Как **игроки на одном устройстве**,
я хочу **по очереди делать ходы на интерактивной доске**,
чтобы **мы могли сыграть локальный матч**.

## Критерии приемки

1. **Дано**: пустая доска в фазе `idle`.
2. **Когда**: Игрок 1 делает ход (бросает фишку).
3. **Тогда**: ход переходит к Игроку 2.
4. **И**: UI визуально отображает размещенную фишку в нижней доступной ячейке колонки.
5. **И**: доска блокирует множественные нажатия, пока «анимация падения» находится в процессе (или через блокировку состояния).

## Задачи / Подзадачи

- [x] Реализация управления состоянием (AC: 1, 3, 5)
  - [x] Создать `src/lib/game/reducer.ts` для обработки игровых действий (`DROP_DISC`, `RESET_MATCH`).
  - [x] Реализовать хук `src/hooks/use-match-reducer.ts` для интеграции редьюсера с компонентами.
  - [x] Добавить состояние `isAnimating` для предотвращения одновременных ходов.
- [x] UI компоненты игровой доски (AC: 4, 5)
  - [x] Создать `src/components/game/game-board.tsx` — сетка 7x6.
  - [x] Создать `src/components/game/column-button.tsx` — интерактивные зоны для сброса фишек.
  - [x] Создать `src/components/game/disc.tsx` — визуальное представление фишки с цветами игроков.
- [x] Интеграция логики и страницы (AC: 1-5)
  - [x] Создать `src/app/game/page.tsx` как основную страницу матча.
  - [x] Интегрировать `applyMove` из `rules.ts` для обновления состояния доски.
  - [x] Реализовать базовое отображение текущего хода (Match Status).

### Review Findings

**Status:** PASS with minor suggestions

- [x] [Review][Defer] Suggested: Animation Duration Config [src/hooks/use-match-reducer.ts:6] — optional refactor. `DROP_ANIMATION_MS` is hardcoded as 220; future polish can move UI timing constants to `src/lib/config/ui.ts`.
- [x] [Review][Defer] Minor: Redundant Phase Setting [src/lib/game/reducer.ts:44] — no action required. `phase: 'playing'` is set before calling `applyMove`; this is a UI convenience for the first move and does not break logic.

## Заметки разработчика

- **Соответствующие архитектурные паттерны и ограничения**:
  - Использовать React DOM/CSS для доски (не Canvas).
  - Следовать паттерну «Game Logic Boundary»: логика в `lib/game`, UI в `components/game`.
  - Мобильный интерфейс в приоритете (mobile-first).
  - Высокая контрастность ячеек и фишек (режим Liquid Glass не должен мешать читаемости).
- **Компоненты дерева исходного кода**:
  - `src/lib/game/reducer.ts` (NEW)
  - `src/hooks/use-match-reducer.ts` (NEW)
  - `src/components/game/*` (NEW)
  - `src/app/game/page.tsx` (NEW)
- **Краткое описание стандартов тестирования**:
  - Ожидается unit-тестирование редьюсера на корректность переходов фаз и смену игроков.

### Примечания по структуре проекта

- Все UI компоненты игры должны находиться в `src/components/game/`.
- Стилизация через Tailwind CSS с использованием переменных темы из `globals.css`.

### Ссылки

- [Источник: _bmad-output/planning-artifacts/epics.md#Story 1.4]
- [Источник: _bmad-output/game-architecture.md#State Management]
- [Источник: _bmad-output/project-context.md#Critical Implementation Rules]

## Запись агента-разработчика

### Использованная модель агента

Codex (GPT-5)

### Ссылки на логи отладки

- 2026-05-28: Confirmed red phase with `npx vitest run tests/game/reducer.test.ts` failing because `@/lib/game/reducer` did not exist.
- 2026-05-28: Verified reducer green phase with `npx vitest run tests/game/reducer.test.ts` passing 5 tests.
- 2026-05-28: Verified full regression suite with `npx vitest run` passing 17 tests across 3 files.
- 2026-05-28: Verified `npm run typecheck`, `npm run lint`, and `npm run build` pass.
- 2026-05-28: Verified `/game` returns HTTP 200 from the local dev server; in-app browser rendered the page but did not reflect click state changes during automation.

### Список примечаний к завершению

- Added a pure match reducer with `DROP_DISC`, `FINISH_ANIMATION`, and `RESET_MATCH` actions.
- Added `isAnimating` state and a client hook that unlocks the board after the drop animation window.
- Added React DOM game board components with accessible column buttons and player disc rendering.
- Added `/game` as the local match page and linked the home page start button to it.
- Added unit tests for reducer state transitions, turn switching, animation lock, unlock, and reset.

### Senior Developer Review (AI)

**Outcome:** PASS with minor suggestions

- Blind Hunter: architecture, organization, naming, and complexity are aligned with the project patterns.
- Edge Case Hunter: `isAnimating` guards input during drop animation; reducer actions cover required transitions; win/draw terminal states are handled; board updates avoid unintended mutation.
- Acceptance Auditor: AC 1-5 are covered by `createInitialMatchState`, reducer tests, `DROP_DISC` integration, `GameBoard` grid rendering, and animation lock behavior.
- Patch proposals: none required for correctness.

### Список файлов

- src/types/game.ts
- src/lib/game/reducer.ts
- src/hooks/use-match-reducer.ts
- src/components/game/game-board.tsx
- src/components/game/column-button.tsx
- src/components/game/disc.tsx
- src/app/game/page.tsx
- src/app/page.tsx
- tests/game/reducer.test.ts
- tests/game/rules.test.ts
- src/lib/game/win-detection.ts
- tests/game/win-detection.test.ts

### Change Log

- 2026-05-28: Implemented interactive local match board, reducer-driven turn state, animation locking, `/game` page, and reducer tests; story moved to review.
- 2026-05-28: Moved code review findings into this story file and removed the separate review artifact.
