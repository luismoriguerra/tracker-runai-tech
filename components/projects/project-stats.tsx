interface ProjectStatsProps {
  expenseEstimation: number;
  accumulatedBudget: number;
  totalsByStatus: { status: string; total_amount: number }[];
}

export function ProjectStats({ expenseEstimation, accumulatedBudget, totalsByStatus }: ProjectStatsProps) {
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
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {totalsByStatus.map((total) => (
              <div key={total.status} className="flex flex-col">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium capitalize">{total.status}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  ${new Intl.NumberFormat('en-US').format(total.total_amount)}
                </p>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ${new Intl.NumberFormat('en-US').format(totalsByStatus.reduce((acc, curr) => acc + curr.total_amount, 0))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 