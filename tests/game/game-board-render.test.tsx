import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { GameBoard } from '@/components/game/game-board';
import { createEmptyBoard } from '@/lib/game/board';

describe('Connect Four - Game Board Rendering', () => {
    it('marks winning cells with a non-color visual indicator', () => {
        const board = createEmptyBoard();
        board[5][0] = 'player1';
        board[5][1] = 'player1';
        board[5][2] = 'player1';
        board[5][3] = 'player1';

        const html = renderToStaticMarkup(
            <GameBoard
                board={board}
                phase="won"
                isAnimating={false}
                winningLine={[
                    [5, 0],
                    [5, 1],
                    [5, 2],
                    [5, 3],
                ]}
                onColumnSelect={() => undefined}
            />
        );

        expect(html).toContain('Winning disc');
        expect(html.match(/data-winning-cell="true"/g)).toHaveLength(4);
        expect(html).toContain('ring-winner-ring');
    });

    it('disables column controls when interaction is externally locked', () => {
        const html = renderToStaticMarkup(
            <GameBoard
                board={createEmptyBoard()}
                phase="playing"
                isAnimating={false}
                isInteractionDisabled={true}
                winningLine={null}
                onColumnSelect={() => undefined}
            />
        );

        expect(html.match(/disabled=""/g)).toHaveLength(49);
    });

    it('marks a hinted column with a non-color visual indicator', () => {
        const html = renderToStaticMarkup(
            <GameBoard
                board={createEmptyBoard()}
                phase="playing"
                isAnimating={false}
                hintColumn={3}
                winningLine={null}
                onColumnSelect={() => undefined}
            />
        );

        expect(html).toContain('data-hinted-column="true"');
        expect(html).toContain('Suggested by Minimax hint');
        expect(html).toContain('animate-pulse');
    });

    it('keeps the board as a high-contrast surface instead of a glass panel', () => {
        const html = renderToStaticMarkup(
            <GameBoard
                board={createEmptyBoard()}
                phase="playing"
                isAnimating={false}
                winningLine={null}
                onColumnSelect={() => undefined}
            />
        );

        expect(html).toContain('data-board-surface="high-contrast"');
        expect(html).toContain('high-contrast-board');
        expect(html).not.toContain('glass-panel');
    });

    it('marks the last placed disc for the drop animation while locked', () => {
        const board = createEmptyBoard();
        board[5][3] = 'player1';

        const html = renderToStaticMarkup(
            <GameBoard
                board={board}
                phase="playing"
                isAnimating={true}
                winningLine={null}
                lastMove={{ row: 5, column: 3, player: 'player1' }}
                onColumnSelect={() => undefined}
            />
        );

        expect(html).toContain('data-dropping-disc="true"');
        expect(html).toContain('animate-disc-drop');
        expect(html).toContain('board-cell-frame');
        expect(html).toContain('donut-sprinkle');
        expect(html).toContain('--drop-row:5');
    });

    it('makes every board cell in a column clickable for dropping a disc', () => {
        const html = renderToStaticMarkup(
            <GameBoard
                board={createEmptyBoard()}
                phase="playing"
                isAnimating={false}
                winningLine={null}
                onColumnSelect={() => undefined}
            />
        );

        expect(html.match(/aria-label="Drop disc in column 4"/g)).toHaveLength(7);
    });
});
