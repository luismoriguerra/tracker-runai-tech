import { getSession } from '@auth0/nextjs-auth0/edge';
import { notFound } from 'next/navigation';
import { ProjectsService } from '../../../server/domain/projects';
import { ProjectBudgetService } from '@/server/domain/budget';
import { ProjectHeader } from '@/components/projects/project-header';
import { ProjectStats } from '@/components/projects/project-stats';
import { BudgetGrid } from '@/components/projects/budget-grid';
import { RecentExpensesTable } from '@/components/projects/recent-expenses-table';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

async function getProject(id: string) {
  const session = await getSession();
  if (!session?.user) return null;

  const projectsService = new ProjectsService();
  return projectsService.getProject(id, session.user.sub);
}

async function getBudgets(id: string) {
  const session = await getSession();
  if (!session?.user) return null;

  const budgetsService = new ProjectBudgetService();
  return budgetsService.getBudgets(id);
}

async function getTotalPaidPerProject(projectId: string) {
  const budgetsService = new ProjectBudgetService();
  return await budgetsService.getTotalPaidPerProject(projectId);
}

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProject(params.id);
  const budgets = await getBudgets(params.id);
  const totalsByStatus = await getTotalPaidPerProject(params.id);
  
  if (!project) {
    notFound();
  }

  const accumulatedBudget = budgets?.reduce((acc, budget) => acc + budget.estimated_amount, 0) || 0;

  return (
    <div className="container mx-auto px-4">
      <ProjectHeader
        projectId={project.id}
        projectName={project.name}
        projectDescription={project.description}
      />

      <ProjectStats
        expenseEstimation={project.expense_estimation}
        accumulatedBudget={accumulatedBudget}
        totalsByStatus={totalsByStatus}
      />

      <BudgetGrid
        projectId={project.id}
        budgets={budgets || []}
      />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Expenses</h2>
        <RecentExpensesTable projectId={project.id} />
      </div>
    </div>
  );
} 
