import { v4 as uuidv4 } from 'uuid';
import { getRequestContext } from '@cloudflare/next-on-pages';

export interface Expense {
    id: string;
    user_id: string;
    project_id: string;
    name: string;
    description: string;
    amount: number;
    expense_date: string;
    status: 'pending' | 'paid';
    created_at?: string;
    updated_at?: string;
}

export class ExpensesService {
    private getDb() {
        return getRequestContext().env.DB;
    }

    async getProjectExpenses(projectId: string, userId: string): Promise<Expense[]> {
        const db = this.getDb();
        const expenses = await db
            .prepare('SELECT * FROM expenses WHERE project_id = ? AND user_id = ? ORDER BY expense_date DESC')
            .bind(projectId, userId)
            .all();
        return expenses.results as Expense[];
    }

    async createExpense(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense> {
        const db = this.getDb();
        const id = uuidv4();
        await db
            .prepare(
                'INSERT INTO expenses (id, user_id, project_id, name, description, amount, expense_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
            )
            .bind(
                id,
                expense.user_id,
                expense.project_id,
                expense.name,
                expense.description,
                expense.amount,
                expense.expense_date,
                expense.status || 'paid'
            )
            .run();

        return {
            id,
            ...expense,
        };
    }

    async updateExpense(
        id: string,
        userId: string,
        expense: Partial<Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
    ): Promise<void> {
        const db = this.getDb();
        const setClauses: string[] = [];
        const values: any[] = [];

        if (expense.name !== undefined) {
            setClauses.push('name = ?');
            values.push(expense.name);
        }
        if (expense.description !== undefined) {
            setClauses.push('description = ?');
            values.push(expense.description);
        }
        if (expense.expense_date !== undefined) {
            setClauses.push('expense_date = ?');
            values.push(expense.expense_date);
        }
        if (expense.amount !== undefined) {
            setClauses.push('amount = ?');
            values.push(expense.amount);
        }
        if (expense.project_id !== undefined) {
            setClauses.push('project_id = ?');
            values.push(expense.project_id);
        }
        if (expense.status !== undefined) {
            setClauses.push('status = ?');
            values.push(expense.status);
        }

        setClauses.push('updated_at = CURRENT_TIMESTAMP');

        if (setClauses.length === 0) return;

        const query = `
            UPDATE expenses 
            SET ${setClauses.join(', ')}
            WHERE id = ? AND user_id = ?
        `;

        await db
            .prepare(query)
            .bind(...values, id, userId)
            .run();
    }

    async deleteExpense(id: string, userId: string): Promise<void> {
        const db = this.getDb();
        await db
            .prepare('DELETE FROM expenses WHERE id = ? AND user_id = ?')
            .bind(id, userId)
            .run();
    }
} 