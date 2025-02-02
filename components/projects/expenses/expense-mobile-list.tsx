import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Expense } from "./types";

interface ExpenseMobileListProps {
    expenses: Expense[];
}

export function ExpenseMobileList({ expenses }: ExpenseMobileListProps) {
    return (
        <div className="space-y-4 md:hidden">
            {expenses.map((expense) => (
                <Card key={expense.id}>
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold">{expense.name}</h3>
                                <p className="text-sm text-muted-foreground">{expense.description}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">Budget:</span>
                                <p>{expense.budget.name}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Status:</span>
                                <p className="capitalize">{expense.status}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Date:</span>
                                <p>{format(new Date(expense.expense_date), 'MMM dd, yyyy')}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Amount:</span>
                                <p className="font-semibold">${expense.amount.toFixed(2)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
} 