import Link from 'next/link';
import { SetBreadcrumb } from '@/components/set-breadcrumb';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

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

      <div className="flex items-center justify-between mt-4 mb-2">
        <h1 className="text-2xl font-bold">
          {projectName}
        </h1>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/projects/${projectId}/edit`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Project
          </Link>
        </Button>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        {projectDescription}
      </p>
    </div>
  );
} 