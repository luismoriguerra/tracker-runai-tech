import { Card, CardContent } from '@/components/ui/card';

interface ExpenseStatsProps {
    expenses: Array<{
        amount: number;
        status: 'pending' | 'paid';
    }>;
}

export function ExpenseStats({ expenses }: ExpenseStatsProps) {
    const totalPaid = expenses
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);

    const totalAmount = expenses
        .reduce((sum, p) => sum + p.amount, 0);

    return (
        <Card className="mb-6">
            <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Total Paid</h3>
                        <p className="text-2xl font-bold text-green-600">
                            ${totalPaid.toFixed(2)}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                        <p className="text-2xl font-bold">
                            ${totalAmount.toFixed(2)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 