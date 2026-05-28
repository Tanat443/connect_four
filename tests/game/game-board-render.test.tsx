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
                onColumnSelect={() => undefined}
            />
        );

        expect(html.match(/disabled=""/g)).toHaveLength(7);
    });

    it('marks a hinted column with a non-color visual indicator', () => {
        const html = renderToStaticMarkup(
            <GameBoard
                board={createEmptyBoard()}
                phase="playing"
                isAnimating={false}
                hintColumn={3}
                onColumnSelect={() => undefined}
            />
        );

        expect(html).toContain('data-hinted-column="true"');
        expect(html).toContain('Suggested by Minimax hint');
        expect(html).toContain('animate-pulse');
    });
});
