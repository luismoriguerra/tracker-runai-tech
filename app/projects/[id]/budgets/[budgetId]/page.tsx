'use client';

export const runtime = 'edge';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BudgetHeader } from '@/components/projects/budgets/budget-header';
import { BudgetStats } from '@/components/projects/budgets/budget-stats';
import { AddExpenseForm } from '@/components/projects/budgets/add-expense-form';
import { ExpenseListItem } from '@/components/projects/budgets/expense-list-item';
import { DeleteExpenseDialog } from '@/components/projects/budgets/delete-expense-dialog';
import { useToast } from '@/hooks/use-toast';
import { Expense } from '@/types/expense';

export default function BudgetExpensesPage() {
    const { id, budgetId } = useParams();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [budget, setBudget] = useState<{ name: string, estimated_amount: number, description: string } | null>(null);
    const { toast } = useToast();

    const fetchBudget = useCallback(async () => {
        try {
            const response = await fetch(`/api/projects/${id}/budgets/${budgetId}`);
            if (!response.ok) throw new Error('Failed to fetch budget');
            const data = await response.json();
            setBudget(data);
        } catch {
            toast({
                title: "Error",
                description: "Failed to fetch budget details",
                variant: "destructive",
            });
        }
    }, [id, budgetId, toast]);

    const fetchExpenses = useCallback(async () => {
        try {
            const response = await fetch(`/api/projects/${id}/budgets/${budgetId}/expenses`);
            if (!response.ok) throw new Error('Failed to fetch expenses');
            const data = await response.json();
            setExpenses(data);
        } catch {
            toast({
                title: "Error",
                description: "Failed to fetch expenses",
                variant: "destructive",
            });
        }
    }, [id, budgetId, toast]);

    useEffect(() => {
        fetchBudget();
        fetchExpenses();
    }, [fetchBudget, fetchExpenses]);

    const handleAddExpense = async (expense: Omit<Expense, 'id'>, file?: File) => {
        try {
            let filePath: string | undefined;

            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                const uploadResponse = await fetch(`/api/projects/${id}/budgets/${budgetId}/expenses/upload`, {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload file');
                }

                const { filename } = await uploadResponse.json();
                filePath = filename;
            }

            const response = await fetch(`/api/projects/${id}/budgets/${budgetId}/expenses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...expense, file_path: filePath }),
            });

            if (!response.ok) throw new Error('Failed to add expense');
            setIsAddingNew(false);
            fetchExpenses();
            toast({
                title: "Success",
                description: "Expense added successfully",
            });
        } catch (error) {
            console.error('Error adding expense:', error);
            toast({
                title: "Error",
                description: "Failed to add expense",
                variant: "destructive",
            });
        }
    };

    const handleUpdateExpense = async (expenseId: string, expense: Expense, file?: File) => {
        try {
            const updatedExpense = { ...expense };

            // If there's a file, upload it first
            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                const uploadResponse = await fetch(
                    `/api/projects/${id}/budgets/${budgetId}/expenses/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload file');
                }

                const { filename } = await uploadResponse.json();
                console.log(filename);
                updatedExpense.file_path = filename;
            }

            // Update the expense with new data
            const response = await fetch(
                `/api/projects/${id}/budgets/${budgetId}/expenses/${expenseId}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedExpense),
                }
            );

            if (!response.ok) throw new Error('Failed to update expense');
            
            fetchExpenses();
            toast({
                title: "Success",
                description: "Expense updated successfully",
            });
        } catch (error) {
            console.error('Error updating expense:', error);
            toast({
                title: "Error",
                description: "Failed to update expense",
                variant: "destructive",
            });
        }
    };

    const handleDeleteExpense = async () => {
        if (!deleteId) return;
        try {
            const response = await fetch(`/api/projects/${id}/budgets/${budgetId}/expenses/${deleteId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete expense');
            setDeleteId(null);
            fetchExpenses();
            toast({
                title: "Success",
                description: "Expense deleted successfully",
            });
        } catch {
            toast({
                title: "Error",
                description: "Failed to delete expense",
                variant: "destructive",
            });
        }
    };

    const handleStatusChange = async (expenseId: string, checked: boolean) => {
        try {
            const response = await fetch(`/api/projects/${id}/budgets/${budgetId}/expenses/${expenseId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: checked ? 'paid' : 'pending',
                }),
            });
            if (!response.ok) throw new Error('Failed to update expense status');
            fetchExpenses();
            toast({
                title: "Success",
                description: "Expense status updated successfully",
            });
        } catch {
            toast({
                title: "Error",
                description: "Failed to update expense status",
                variant: "destructive",
            });
        }
    };

    const totalExpenses = expenses.reduce((sum, p) => sum + p.amount, 0);
    const totalPaid = expenses.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="container px-4 sm:px-6 mx-auto py-4 sm:py-6">
            <BudgetHeader
                projectId={id as string}
                budgetId={budgetId as string}
                budgetName={budget?.name || ''}
                description={budget?.description || ''}
                estimatedAmount={budget?.estimated_amount || 0}
                onUpdate={(updates) => {
                    if (budget) {
                        setBudget({
                            ...budget,
                            ...(updates.name && { name: updates.name }),
                            ...(updates.description !== undefined && { description: updates.description })
                        });
                    }
                }}
            />

            <BudgetStats
                estimatedAmount={budget?.estimated_amount || 0}
                totalExpenses={totalExpenses}
                totalPaid={totalPaid}
            />

            <div className="flex justify-start mb-4">
                <Button onClick={() => setIsAddingNew(true)}>Add Expense</Button>
            </div>

            {isAddingNew && (
                <AddExpenseForm
                    onSubmit={handleAddExpense}
                    onCancel={() => setIsAddingNew(false)}
                />
            )}

            <div className="space-y-4">
                {expenses.map((expense) => (
                    <ExpenseListItem
                        key={expense.id}
                        expense={expense}
                        onUpdate={handleUpdateExpense}
                        onDelete={(id) => setDeleteId(id)}
                        onStatusChange={handleStatusChange}
                    />
                ))}
            </div>

            <DeleteExpenseDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDeleteExpense}
            />
        </div>
    );
} 