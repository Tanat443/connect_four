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
});
