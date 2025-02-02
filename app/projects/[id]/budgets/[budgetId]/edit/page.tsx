import { getSession } from '@auth0/nextjs-auth0/edge';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { SetBreadcrumb } from '@/components/set-breadcrumb';
import EditBudgetForm from './EditBudgetForm';
import { ProjectBudgetService } from '@/server/domain/budget';
import { ProjectsService } from '@/server/domain/projects';

export const runtime = 'edge';

async function getBudget(projectId: string, budgetId: string) {
  const session = await getSession();
  if (!session?.user) return null;

  const budgetService = new ProjectBudgetService();
  const projectsService = new ProjectsService();
  const project = await projectsService.getProject(projectId, session.user.sub);
  if (!project) return null;

  const budget = await budgetService.getBudget(budgetId, projectId);
  if (!budget) return null;

  return { project, budget };
}

export default async function EditBudgetPage({
  params,
}: {
  params: { id: string; budgetId: string };
}) {
  const data = await getBudget(params.id, params.budgetId);

  if (!data) {
    notFound();
  }

  const { project, budget } = data;

  return (
    <div className="container mx-auto px-4 py-8">
      <SetBreadcrumb
        breadcrumbs={[
          { route: '/projects', label: 'Projects' },
          { route: `/projects/${project.id}`, label: project.name },
          { route: `/projects/${project.id}/budgets/${budget.id}`, label: budget.name },
          { route: `/projects/${project.id}/budgets/${budget.id}/edit`, label: 'Edit Budget' },
        ]}
      />
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            href={`/projects/${project.id}/budgets/${budget.id}`}
            className="text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            ← Back to Budget
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Edit Budget
          </h1>
          <EditBudgetForm projectId={project.id} budgetId={budget.id} />
        </div>
      </div>
    </div>
  );
} 