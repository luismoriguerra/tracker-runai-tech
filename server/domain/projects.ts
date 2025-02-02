import { getRequestContext } from '@cloudflare/next-on-pages';
import { nanoid } from 'nanoid';

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string;
  expense_estimation: number;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  project_id: string;
  name: string;
  description: string;
  estimated_amount: number;
  created_at: string;
  updated_at: string;
}

export class ProjectsService {
  private getDb() {
    return getRequestContext().env.DB;
  }

  async getProjects(userId: string): Promise<Project[]> {
    const db = this.getDb();
    const { results } = await db
      .prepare('SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC')
      .bind(userId)
      .all<Project>();
    return results;
  }

  async getProject(id: string, userId: string): Promise<Project | null> {
    const db = this.getDb();
    const result = await db
      .prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?')
      .bind(id, userId)
      .first<Project>();
    return result || null;
  }

  async getBudget(id: string): Promise<Budget | null> {
    const db = this.getDb();
    const result = await db
      .prepare('SELECT * FROM project_budgets WHERE id = ?')
      .bind(id)
      .first<Budget>();
    return result || null;
  }

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const db = this.getDb();
    const id = nanoid();
    const timestamp = new Date().toISOString();

    const { results } = await db
      .prepare(
        'INSERT INTO projects (id, user_id, name, description, expense_estimation, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) Returning *'
      )
      .bind(
        id,
        project.user_id,
        project.name,
        project.description,
        project.expense_estimation,
        timestamp,
        timestamp
      )
      .run();

    return results[0];
  }

  async updateProject(
    id: string,
    userId: string,
    updates: Pick<Project, 'name' | 'description' | 'expense_estimation'>
  ): Promise<Project | null> {
    const db = this.getDb();
    const timestamp = new Date().toISOString();

    const { results } = await db
      .prepare(
        'UPDATE projects SET name = ?, description = ?, expense_estimation = ?, updated_at = ? WHERE id = ? AND user_id = ? Returning *'
      )
      .bind(updates.name, updates.description, updates.expense_estimation, timestamp, id, userId)
      .run();

    return results[0] || null;
  }

  async deleteProject(id: string, userId: string): Promise<boolean> {
    const db = this.getDb();
    const { success } = await db
      .prepare('DELETE FROM projects WHERE id = ? AND user_id = ?')
      .bind(id, userId)
      .run();
    return success;
  }
} 