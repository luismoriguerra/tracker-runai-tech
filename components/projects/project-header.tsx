import Link from 'next/link';
import { SetBreadcrumb } from '@/components/set-breadcrumb';

interface ProjectHeaderProps {
  projectId: string;
  projectName: string;
  projectDescription: string;
}

export function ProjectHeader({ projectId, projectName, projectDescription }: ProjectHeaderProps) {
  return (
    <div>
      <SetBreadcrumb breadcrumbs={[
        { route: '/projects', label: 'Projects' },
        { route: `/projects/${projectId}`, label: projectName }
      ]} />
      
      <Link
        href="/projects"
        className="text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
      >
        ← Back to Projects
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-2">
        {projectName}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        {projectDescription}
      </p>
    </div>
  );
} 