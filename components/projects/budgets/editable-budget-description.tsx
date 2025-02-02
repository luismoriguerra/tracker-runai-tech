import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface EditableBudgetDescriptionProps {
    isEditing: boolean;
    editedDescription: string;
    description: string;
    isLoading: boolean;
    onEdit: () => void;
    onChange: (value: string) => void;
    onSave: () => void;
    onCancel: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
}

export function EditableBudgetDescription({
    isEditing,
    editedDescription,
    description,
    isLoading,
    onEdit,
    onChange,
    onSave,
    onCancel,
    onKeyDown
}: EditableBudgetDescriptionProps) {
    if (isEditing) {
        return (
            <div className="flex items-start gap-2">
                <Textarea
                    value={editedDescription}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    autoFocus
                    disabled={isLoading}
                    className="text-sm text-muted-foreground min-h-[60px]"
                />
                <div className="flex flex-col gap-1">
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
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                className="flex-1 justify-start p-0 h-auto hover:bg-transparent"
                onClick={onEdit}
                disabled={isLoading}
            >
                <p className="text-sm text-muted-foreground text-left w-full">
                    {description || 'No description'}
                </p>
            </Button>
        </div>
    );
} 