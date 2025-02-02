import { v4 as uuidv4 } from 'uuid';
import { getRequestContext } from '@cloudflare/next-on-pages';

export interface ProjectPayment {
    id: string;
    user_id: string;
    project_id: string;
    payment_date: string;
    amount: number;
    status: 'pending' | 'paid';
    created_at?: string;
    updated_at?: string;
}

export class ProjectPaymentsService {
    private getDb() {
        return getRequestContext().env.DB;
    }

    async getProjectPayments(projectId: string, userId: string): Promise<ProjectPayment[]> {
        const db = this.getDb();
        const payments = await db
            .prepare('SELECT * FROM project_payments WHERE project_id = ? AND user_id = ? ORDER BY payment_date DESC')
            .bind(projectId, userId)
            .all();
        return payments.results as ProjectPayment[];
    }

    async createProjectPayment(payment: Omit<ProjectPayment, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectPayment> {
        const db = this.getDb();
        const id = uuidv4();
        await db
            .prepare(
                'INSERT INTO project_payments (id, user_id, project_id, payment_date, amount, status) VALUES (?, ?, ?, ?, ?, ?)'
            )
            .bind(id, payment.user_id, payment.project_id, payment.payment_date, payment.amount, payment.status || 'pending')
            .run();

        return {
            id,
            ...payment,
        };
    }

    async updateProjectPayment(
        id: string,
        userId: string,
        payment: Partial<Omit<ProjectPayment, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
    ): Promise<void> {
        const db = this.getDb();
        const setClauses: string[] = [];
        const values: (string | number)[] = [];

        if (payment.payment_date !== undefined) {
            setClauses.push('payment_date = ?');
            values.push(payment.payment_date);
        }
        if (payment.amount !== undefined) {
            setClauses.push('amount = ?');
            values.push(payment.amount);
        }
        if (payment.project_id !== undefined) {
            setClauses.push('project_id = ?');
            values.push(payment.project_id);
        }
        if (payment.status !== undefined) {
            setClauses.push('status = ?');
            values.push(payment.status);
        }

        setClauses.push('updated_at = CURRENT_TIMESTAMP');

        if (setClauses.length === 0) return;

        const query = `
      UPDATE project_payments 
      SET ${setClauses.join(', ')}
      WHERE id = ? AND user_id = ?
    `;

        await db
            .prepare(query)
            .bind(...values, id, userId)
            .run();
    }

    async deleteProjectPayment(id: string, userId: string): Promise<void> {
        const db = this.getDb();
        await db
            .prepare('DELETE FROM project_payments WHERE id = ? AND user_id = ?')
            .bind(id, userId)
            .run();
    }
} 