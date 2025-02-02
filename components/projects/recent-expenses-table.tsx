'use client';

import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ExpenseFilters } from './expenses/expense-filters';
import { ExpenseMobileList } from './expenses/expense-mobile-list';
import { ExpenseTable } from './expenses/expense-table';
import { ExpenseChart } from './expenses/expense-chart';
import { Expense, ExpensesResponse, Budget } from './expenses/types';

export function RecentExpensesTable({ projectId }: { projectId: string }) {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('paid');
    const [budgetFilter, setBudgetFilter] = useState<string>('all');
    const { toast } = useToast();

    // Fetch budgets
    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const response = await fetch(`/api/projects/${projectId}/budgets`);
                if (!response.ok) {
                    throw new Error('Failed to fetch budgets');
                }
                const data = await response.json();
                setBudgets(data);
            } catch (err) {
                console.error('Error fetching budgets:', err);
                toast({
                    title: "Error",
                    description: "Failed to load budgets",
                    variant: "destructive",
                });
            }
        };

        fetchBudgets();
    }, [projectId, toast]);

    // Fetch expenses
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const url = new URL(`/api/projects/${projectId}/budgets-expenses`, window.location.origin);
                url.searchParams.append('page', '1');
                url.searchParams.append('pageSize', '50');
                if (statusFilter && statusFilter !== 'all') {
                    url.searchParams.append('status', statusFilter);
                }
                if (budgetFilter && budgetFilter !== 'all') {
                    url.searchParams.append('budgetId', budgetFilter);
                }

                const response = await fetch(url.toString());
                if (!response.ok) {
                    throw new Error('Failed to fetch expenses');
                }
                const data: ExpensesResponse = await response.json();
                setExpenses(data.data);
            } catch (err) {
                console.error('Error fetching expenses:', err);
                toast({
                    title: "Error",
                    description: "Failed to load recent expenses",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, [projectId, statusFilter, budgetFilter, toast]);


    if (loading) {
        return <div>Loading expenses...</div>;
    }

    return (
        <div className="space-y-4">
            <ExpenseFilters
                statusFilter={statusFilter}
                budgetFilter={budgetFilter}
                onStatusChange={setStatusFilter}
                onBudgetChange={setBudgetFilter}
                budgets={budgets}
            />

            <ExpenseChart expenses={expenses} />

            <ExpenseMobileList
                expenses={expenses}
            />

            <ExpenseTable
                expenses={expenses}
            />
        </div>
    );
} 