interface ProjectStatsProps {
  expenseEstimation: number;
  accumulatedBudget: number;
  totalPaid: number;
}

export function ProjectStats({ expenseEstimation, accumulatedBudget, totalPaid }: ProjectStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Estimated Expenses</p>
        <p className="text-2xl font-bold">
          ${new Intl.NumberFormat('en-US').format(expenseEstimation)}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Accumulated Budget</p>
        <p className="text-2xl font-bold">
          ${new Intl.NumberFormat('en-US').format(accumulatedBudget)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Remaining: ${new Intl.NumberFormat('en-US').format(expenseEstimation - accumulatedBudget)}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Expenses in Progress</p>
        <p className="text-2xl font-bold">
          ${new Intl.NumberFormat('en-US').format(totalPaid)}
        </p>
      </div>
    </div>
  );
} 