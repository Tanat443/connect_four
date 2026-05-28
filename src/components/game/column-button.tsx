"use client";

import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ColumnButtonProps {
    column: number;
    disabled: boolean;
    onSelect: (column: number) => void;
}

export function ColumnButton({ column, disabled, onSelect }: ColumnButtonProps) {
    return (
        <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            className="h-8 w-full rounded-md"
            aria-label={`Drop disc in column ${column + 1}`}
            disabled={disabled}
            onClick={() => onSelect(column)}
        >
            <ArrowDown className="size-4" aria-hidden="true" />
        </Button>
    );
}
