import { getRequestContext } from '@cloudflare/next-on-pages';
import { nanoid } from 'nanoid';

export interface ProjectBudget {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  estimated_amount: number;
  created_at: string;
  updated_at: string;
  total_paid?: number;
}

export class ProjectBudgetService {
  private getDb() {
    return getRequestContext().env.DB;
  }

  async getBudgets(projectId: string): Promise<ProjectBudget[]> {
    const db = this.getDb();
    const { results } = await db
      .prepare(`
        SELECT pb.*, SUM(CASE WHEN be.status = 'paid' THEN be.amount ELSE 0 END) as total_paid
        FROM project_budgets pb
        LEFT JOIN budget_expenses be ON pb.id = be.budget_id
        WHERE pb.project_id = ?
        GROUP BY pb.id
        ORDER BY pb.created_at DESC
      `)
      .bind(projectId)
      .all<ProjectBudget>();
    return results;
  }

  async getTotalPaidPerProject(projectId: string): Promise<{ status: string; total_amount: number }[]> {
    const db = this.getDb();
    const { results } = await db
      .prepare(`
        SELECT be.status, SUM(be.amount) as total_amount
        FROM project_budgets pb
        JOIN budget_expenses be ON pb.id = be.budget_id
        WHERE 
          pb.project_id = ?
        GROUP BY be.status
        `)
      .bind(projectId)
      .all<{ status: string; total_amount: number }>();
    // console.log(results);
    return results;
  }

  async getBudget(id: string, projectId: string): Promise<ProjectBudget | null> {
    const db = this.getDb();
    const result = await db
      .prepare('SELECT * FROM project_budgets WHERE id = ? AND project_id = ?')
      .bind(id, projectId)
      .first<ProjectBudget>();
    return result || null;
  }

  async createBudget(budget: Omit<ProjectBudget, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectBudget> {
    const db = this.getDb();
    const id = nanoid();
    const timestamp = new Date().toISOString();

    const { results } = await db
      .prepare(
        'INSERT INTO project_budgets (id, project_id, name, description, estimated_amount, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *'
      )
      .bind(
        id,
        budget.project_id,
        budget.name,
        budget.description,
        budget.estimated_amount,
        timestamp,
        timestamp
      )
      .run();

    return results[0];
  }

  async updateBudget(
    id: string,
    projectId: string,
    updates: Partial<Pick<ProjectBudget, 'name' | 'description' | 'estimated_amount'>>
  ): Promise<ProjectBudget | null> {
    const db = this.getDb();
    const timestamp = new Date().toISOString();

    // Build update fields and values dynamically
    const updateFields: string[] = [];
    const values: (string | number | null)[] = [];

    if ('name' in updates && updates.name !== undefined) {
      updateFields.push('name = ?');
      values.push(updates.name);
    }
    if ('description' in updates && updates.description !== undefined) {
      updateFields.push('description = ?');
      values.push(updates.description);
    }
    if ('estimated_amount' in updates && updates.estimated_amount !== undefined) {
      updateFields.push('estimated_amount = ?');
      values.push(updates.estimated_amount);
    }

    // If no fields to update, return the existing budget
    if (updateFields.length === 0) {
      return this.getBudget(id, projectId);
    }

    // Always update the updated_at timestamp
    updateFields.push('updated_at = ?');
    values.push(timestamp);

    // Add id and projectId to values array
    values.push(id, projectId);

    const query = `
      UPDATE project_budgets 
      SET ${updateFields.join(', ')} 
      WHERE id = ? AND project_id = ? 
      RETURNING *
    `;

    const { results } = await db
      .prepare(query)
      .bind(...values)
      .run();

    return results[0] || null;
  }

  async deleteBudget(id: string, projectId: string): Promise<boolean> {
    const db = this.getDb();
    const { success } = await db
      .prepare('DELETE FROM project_budgets WHERE id = ? AND project_id = ?')
      .bind(id, projectId)
      .run();
    return success;
  }
} 