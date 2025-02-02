import Link from 'next/link';

interface BudgetCardProps {
  id: string;
  projectId: string;
  name: string;
  description: string;
  estimatedAmount: number;
  totalPaid?: number;
}

export function BudgetCard({ id, projectId, name, description, estimatedAmount, totalPaid }: BudgetCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <Link
        href={`/projects/${projectId}/budgets/${id}`}
        className="block"
      >
        <h2 className="text-xl font-semibold mb-2">
          {name}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {description}
        </p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Estimated</p>
            <p className="text-lg font-semibold text-green-600">
              ${new Intl.NumberFormat('en-US').format(estimatedAmount)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Paid</p>
            <p className="text-lg font-semibold text-blue-600">
              ${totalPaid ? new Intl.NumberFormat('en-US').format(totalPaid) : '0'}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
} 