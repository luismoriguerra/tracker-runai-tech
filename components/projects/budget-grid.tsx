import Link from 'next/link';
import { BudgetCard } from './budget-card';

interface Budget {
  id: string;
  name: string;
  description: string | null;
  estimated_amount: number;
  total_paid?: number;
}

interface BudgetGridProps {
  projectId: string;
  budgets: Budget[];
}

export function BudgetGrid({ projectId, budgets }: BudgetGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {budgets && budgets.length > 0 && budgets?.map((budget) => (
        <BudgetCard
          key={budget.id}
          id={budget.id}
          projectId={projectId}
          name={budget.name}
          description={budget.description || ''}
          estimatedAmount={budget.estimated_amount}
          totalPaid={budget.total_paid}
        />
      ))}

      <Link
        href={`/projects/${projectId}/budgets/create`}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center min-h-[200px] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            Create new Budget
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create new budgets for this project
          </p>
        </div>
      </Link>
    </div>
  );
} 