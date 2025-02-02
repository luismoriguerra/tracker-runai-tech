export interface Budget {
    id: string;
    name: string;
    amount: number;
    projectId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Expense {
    id: string;
    amount: number;
    name: string;
    file_path?: string;
    description: string;
    expense_date: string;
    status: 'paid' | 'pending';
    budgetId: string;
    projectId: string;
    createdAt: string;
    updatedAt: string;
    budget: Budget;
}

export interface ExpensesResponse {
    data: Expense[];
    total: number;
    page: number;
    pageSize: number;
} 