"use client";

import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ColumnButtonProps {
    column: number;
    disabled: boolean;
    isHinted?: boolean;
    onSelect: (column: number) => void;
}

export function ColumnButton({ column, disabled, isHinted = false, onSelect }: ColumnButtonProps) {
    return (
        <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            className={cn(
                "h-8 w-full rounded-md",
                isHinted && "animate-pulse border-primary bg-primary/20 shadow-lg shadow-primary/40 ring-2 ring-primary/60"
            )}
            aria-label={`Drop disc in column ${column + 1}`}
            aria-describedby={isHinted ? `hint-column-${column + 1}` : undefined}
            data-hinted-column={isHinted ? 'true' : undefined}
            disabled={disabled}
            onClick={() => onSelect(column)}
        >
            <ArrowDown className="size-4" aria-hidden="true" />
            {isHinted && (
                <span id={`hint-column-${column + 1}`} className="sr-only">
                    Suggested by Minimax hint
                </span>
            )}
        </Button>
    );
}
