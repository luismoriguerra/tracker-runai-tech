import { getSession } from '@auth0/nextjs-auth0/edge';
import Link from 'next/link';
import { ProjectsService } from '../../server/domain/projects';
export const runtime = 'edge';
async function getProjects() {
  const session = await getSession();
  if (!session?.user) return [];

  const projectsService = new ProjectsService();
  return projectsService.getProjects(session.user.sub);
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Projects</h1>
        <Link
          href="/projects/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Create New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <Link href={`/projects/${project.id}`}>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {project.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {project.description}
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Created: {new Date(project.created_at).toLocaleDateString()}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            You haven&apos;t created any projects yet.
          </p>
          <Link
            href="/projects/new"
            className="text-blue-500 hover:text-blue-400 font-medium mt-2 inline-block transition-colors"
          >
            Create your first project
          </Link>
        </div>
      )}
    </div>
  );
} 