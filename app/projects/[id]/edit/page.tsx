import { getSession } from '@auth0/nextjs-auth0/edge';
import { notFound } from 'next/navigation';
import { ProjectsService } from '../../../../server/domain/projects';
import EditProjectForm from './EditProjectForm';
import { SetBreadcrumb } from '@/components/set-breadcrumb';
export const runtime = 'edge';

async function getProject(id: string) {
  const session = await getSession();
  if (!session?.user) return null;

  const projectsService = new ProjectsService();
  return projectsService.getProject(id, session.user.sub);
}

export default async function EditProjectPage({
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
      <SetBreadcrumb breadcrumbs={[
        { route: '/projects', label: 'Projects' },
        { route: `/projects/${project.id}`, label: project.name },
        { route: `/projects/${project.id}/edit`, label: 'Edit' }
      ]} />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Project</h1>
        <EditProjectForm project={project} />
      </div>
    </div>
  );
} 