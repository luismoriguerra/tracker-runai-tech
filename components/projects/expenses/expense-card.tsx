import { format, parseISO } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface ExpenseCardProps {
    expense: {
        id: string;
        name: string;
        description: string;
        expense_date: string;
        amount: number;
        status: 'pending' | 'paid';
    };
    onEdit: () => void;
    onDelete: () => void;
    onStatusChange: (checked: boolean) => void;
}

export function ExpenseCard({ expense, onEdit, onDelete, onStatusChange }: ExpenseCardProps) {
    return (
        <Card>
            <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="font-medium">{expense.name}</span>
                        <span className="text-lg font-semibold">${expense.amount.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-500">{expense.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{format(parseISO(expense.expense_date), 'PP')}</span>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                checked={expense.status === 'paid'}
                                onCheckedChange={(checked) => onStatusChange(checked as boolean)}
                            />
                            <span>
                                {expense.status === 'paid' ? 'Paid' : 'Pending'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onEdit}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onDelete}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
} 