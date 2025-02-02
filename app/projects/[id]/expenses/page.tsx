'use client';

export const runtime = 'edge';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SetBreadcrumb } from '@/components/set-breadcrumb';
import { ExpenseForm } from '@/components/projects/expenses/expense-form';
import { ExpenseCard } from '@/components/projects/expenses/expense-card';
import { ExpenseStats } from '@/components/projects/expenses/expense-stats';
import { ExpenseDeleteDialog } from '@/components/projects/expenses/expense-delete-dialog';
import { useToast } from '@/hooks/use-toast';

interface Expense {
    id: string;
    name: string;
    description: string;
    expense_date: string;
    amount: number;
    status: 'pending' | 'paid';
}

export default function ProjectExpensesPage() {
    const { id } = useParams();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const { toast } = useToast();

    const fetchExpenses = useCallback(async () => {
        try {
            const response = await fetch(`/api/projects/${id}/expenses`);
            if (!response.ok) throw new Error('Failed to fetch expenses');
            const data = await response.json();
            setExpenses(data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            toast({
                title: "Error",
                description: "Failed to fetch expenses",
                variant: "destructive",
            });
        }
    }, [id, toast]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const handleAddExpense = async (data: Omit<Expense, 'id'>) => {
        try {
            const response = await fetch(`/api/projects/${id}/expenses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
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

    const handleUpdateExpense = async (expenseId: string, data: Omit<Expense, 'id'>) => {
        try {
            await fetch(`/api/projects/${id}/expenses`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ expenseId, ...data }),
            });
            setEditingId(null);
            fetchExpenses();
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    };

    const handleDeleteExpense = async () => {
        if (!deleteId) return;
        try {
            await fetch(`/api/projects/${id}/expenses`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ expenseId: deleteId }),
            });
            setDeleteId(null);
            fetchExpenses();
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const handleStatusChange = async (expenseId: string, checked: boolean) => {
        try {
            await fetch(`/api/projects/${id}/expenses`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    expenseId,
                    status: checked ? 'paid' : 'pending',
                }),
            });
            fetchExpenses();
        } catch (error) {
            console.error('Error updating expense status:', error);
        }
    };

    return (
        <div className="container mx-auto py-6">
            <SetBreadcrumb breadcrumbs={[
                { route: '/projects', label: 'Projects' },
                { route: `/projects/${id}`, label: 'Project Expenses' },
                { route: `/projects/${id}/expenses`, label: 'Expenses' }
            ]} />
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Project Expenses</h1>
                <Button onClick={() => setIsAddingNew(true)}>Add Expense</Button>
            </div>

            <ExpenseStats expenses={expenses} />

            <div className="space-y-4">
                {isAddingNew && (
                    <ExpenseForm
                        onSubmit={handleAddExpense}
                        onCancel={() => setIsAddingNew(false)}
                    />
                )}

                {expenses.map((expense) => (
                    editingId === expense.id ? (
                        <ExpenseForm
                            key={expense.id}
                            initialData={expense}
                            onSubmit={(data) => handleUpdateExpense(expense.id, data)}
                            onCancel={() => setEditingId(null)}
                        />
                    ) : (
                        <ExpenseCard
                            key={expense.id}
                            expense={expense}
                            onEdit={() => setEditingId(expense.id)}
                            onDelete={() => setDeleteId(expense.id)}
                            onStatusChange={(checked) => handleStatusChange(expense.id, checked)}
                        />
                    )
                ))}
            </div>

            <ExpenseDeleteDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDeleteExpense}
            />
        </div>
    );
} 