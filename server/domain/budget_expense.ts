import { v4 as uuidv4 } from 'uuid';
import { getRequestContext } from '@cloudflare/next-on-pages';

export interface BudgetExpense {
    id: string;
    budget_id: string;
    name: string;
    description: string;
    amount: number;
    status: 'pending' | 'paid';
    expense_date: string;
    file_path?: string;
    created_at?: string;
    updated_at?: string;
}

export class BudgetExpenseService {
    private getDb() {
        return getRequestContext().env.DB;
    }

    async getBudgetExpenses(budgetId: string): Promise<BudgetExpense[]> {
        const db = this.getDb();
        const expenses = await db
            .prepare('SELECT * FROM budget_expenses WHERE budget_id = ? ORDER BY expense_date DESC')
            .bind(budgetId)
            .all();
        return expenses.results as BudgetExpense[];
    }

    async createBudgetExpense(expense: Omit<BudgetExpense, 'id' | 'created_at' | 'updated_at'>): Promise<BudgetExpense> {
        const db = this.getDb();
        const id = uuidv4();
        await db
            .prepare(
                'INSERT INTO budget_expenses (id, budget_id, name, description, amount, expense_date, status, file_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
            )
            .bind(
                id,
                expense.budget_id,
                expense.name,
                expense.description,
                expense.amount,
                expense.expense_date,
                expense.status || 'pending',
                expense.file_path || null
            )
            .run();

        return {
            id,
            ...expense,
        };
    }

    async updateBudgetExpense(
        id: string,
        expense: Partial<Omit<BudgetExpense, 'id' | 'created_at' | 'updated_at'>>
    ): Promise<void> {
        const db = this.getDb();
        const setClauses: string[] = [];
        const values: (string | number | null)[] = [];

        if (expense.name !== undefined) {
            setClauses.push('name = ?');
            values.push(expense.name);
        }
        if (expense.description !== undefined) {
            setClauses.push('description = ?');
            values.push(expense.description);
        }
        if (expense.amount !== undefined) {
            setClauses.push('amount = ?');
            values.push(expense.amount);
        }
        if (expense.budget_id !== undefined) {
            setClauses.push('budget_id = ?');
            values.push(expense.budget_id);
        }
        if (expense.status !== undefined) {
            setClauses.push('status = ?');
            values.push(expense.status);
        }
        if (expense.expense_date !== undefined) {
            setClauses.push('expense_date = ?');
            values.push(expense.expense_date);
        }
        if (expense.file_path !== undefined) {
            setClauses.push('file_path = ?');
            values.push(expense.file_path);
        }

        setClauses.push('updated_at = CURRENT_TIMESTAMP');

        if (setClauses.length === 0) return;

        const query = `
            UPDATE budget_expenses 
            SET ${setClauses.join(', ')}
            WHERE id = ?
        `;

        await db
            .prepare(query)
            .bind(...values, id)
            .run();
    }

    async deleteBudgetExpense(id: string): Promise<void> {
        const db = this.getDb();
        await db
            .prepare('DELETE FROM budget_expenses WHERE id = ?')
            .bind(id)
            .run();
    }
} 