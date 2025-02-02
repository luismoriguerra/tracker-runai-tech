import { getSession } from '@auth0/nextjs-auth0/edge';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProjectsService } from '../../../../../server/domain/projects';
import { SetBreadcrumb } from '@/components/set-breadcrumb';
import CreateBudgetForm from './CreateBudgetForm';

export const runtime = 'edge';

async function getProject(id: string) {
  const session = await getSession();
  if (!session?.user) return null;

  const projectsService = new ProjectsService();
  return projectsService.getProject(id, session.user.sub);
}

export default async function CreateBudgetPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProject(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SetBreadcrumb
        breadcrumbs={[
          { route: '/projects', label: 'Projects' },
          { route: `/projects/${project.id}`, label: project.name },
          { route: `/projects/${project.id}/budgets/create`, label: 'Create Budget' },
        ]}
      />
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            href={`/projects/${project.id}`}
            className="text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            ← Back to Project
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Create New Budget
          </h1>
          <CreateBudgetForm projectId={project.id} />
        </div>
      </div>
    </div>
  );
} 