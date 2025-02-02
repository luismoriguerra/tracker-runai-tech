import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface EditableBudgetNameProps {
    isEditing: boolean;
    editedName: string;
    budgetName: string;
    isLoading: boolean;
    onEdit: () => void;
    onChange: (value: string) => void;
    onSave: () => void;
    onCancel: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
}

export function EditableBudgetName({
    isEditing,
    editedName,
    budgetName,
    isLoading,
    onEdit,
    onChange,
    onSave,
    onCancel,
    onKeyDown
}: EditableBudgetNameProps) {
    if (isEditing) {
        return (
            <div className="flex-1 flex items-center gap-2">
                <Input
                    value={editedName}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    autoFocus
                    disabled={isLoading}
                    className="text-xl sm:text-2xl font-bold"
                />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onSave}
                    disabled={isLoading}
                >
                    <Check className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <Button
            variant="ghost"
            className="flex-1 justify-start p-0 h-auto hover:bg-transparent"
            onClick={onEdit}
            disabled={isLoading}
        >
            <h1 className="text-xl sm:text-2xl font-bold">{budgetName}</h1>
        </Button>
    );
} 