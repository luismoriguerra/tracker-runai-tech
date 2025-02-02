export interface Expense {
    id: string;
    name: string;
    description: string;
    expense_date: string;
    amount: number;
    status: 'pending' | 'paid';
    file_path?: string;
} 