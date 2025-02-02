import { Card, CardContent } from '@/components/ui/card';

interface BudgetStatsProps {
    estimatedAmount: number;
    totalExpenses: number;
    totalPaid: number;
}

const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

export function BudgetStats({ estimatedAmount, totalExpenses, totalPaid }: BudgetStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card>
                <CardContent className="p-4 flex flex-col">
                    <h3 className="text-sm font-medium text-gray-500">Estimated Amount</h3>
                    <p className="text-2xl font-bold mt-2">
                        {formatCurrency(estimatedAmount)}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4 flex flex-col">
                    <h3 className="text-sm font-medium text-gray-500">Expenses Planned</h3>
                    <p className="text-2xl font-bold mt-2">
                        {formatCurrency(totalExpenses)}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4 flex flex-col">
                    <h3 className="text-sm font-medium text-gray-500">Total Paid</h3>
                    <p className="text-2xl font-bold mt-2 text-green-600">
                        {formatCurrency(totalPaid)}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
} 