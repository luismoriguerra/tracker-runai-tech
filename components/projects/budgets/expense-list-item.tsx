import { useState } from 'react';
import { z } from 'zod';
import { Expense } from '@/types/expense';
import { ExpenseForm } from './expense-form';
import { ExpenseView } from './expense-view';
import { useToast } from "@/hooks/use-toast";

interface ExpenseListItemProps {
    expense: Expense;
    onUpdate: (id: string, expense: Expense, file?: File) => Promise<void>;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, checked: boolean) => Promise<void>;
}

const expenseSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    expense_date: z.string(),
    amount: z.number().positive(),
});

export function ExpenseListItem({ expense, onUpdate, onDelete, onStatusChange }: ExpenseListItemProps) {
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [editExpense, setEditExpense] = useState<Expense | null>(null);

    const handleUpdate = async (file?: File) => {
        if (!editExpense) return;
        
        try {
            const validatedData = expenseSchema.parse(editExpense);
            const expenseData: Expense = {
                ...validatedData,
                id: expense.id,
                status: editExpense.status
            };
            await onUpdate(expense.id, expenseData, file);
            setIsEditing(false);
            setEditExpense(null);
        } catch (error) {
            console.error('Error updating expense:', error);
            toast({
                variant: "destructive",
                title: "Error updating expense",
                description: "Please try again later",
            });
        }
    };

    if (isEditing) {
        return (
            <ExpenseForm
                expense={expense}
                onSave={handleUpdate}
                onCancel={() => {
                    setIsEditing(false);
                    setEditExpense(null);
                }}
                editExpense={editExpense}
                setEditExpense={setEditExpense}
            />
        );
    }

    return (
        <ExpenseView
            expense={expense}
            onEdit={() => {
                setIsEditing(true);
                setEditExpense(expense);
            }}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
        />
    );
} 