'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "./types";

interface ExpenseChartProps {
    expenses: Expense[];
}

export function ExpenseChart({ expenses }: ExpenseChartProps) {
    console.log(expenses);
    // Process expenses data for the chart
    const chartData = expenses.reduce((acc: { [key: string]: { amount: number, expenses: Expense[] } }, expense) => {
        try {
            if (!expense.expense_date) {
                console.warn('Expense missing expense_date:', expense);
                return acc;
            }

            // Validate date format (YYYY-MM-DD)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(expense.expense_date)) {
                console.warn('Invalid date format:', expense.expense_date);
                return acc;
            }

            const date = new Date(expense.expense_date);

            // Validate the date
            if (isNaN(date.getTime())) {
                console.warn('Invalid date:', expense.expense_date);
                return acc;
            }
            
            // Use the raw date string without timezone conversion
            const formattedDate = expense.expense_date;
            
            if (!acc[formattedDate]) {
                acc[formattedDate] = { amount: 0, expenses: [] };
            }
            acc[formattedDate].amount += Number(expense.amount);
            acc[formattedDate].expenses.push(expense);
        } catch (error) {
            console.error('Error processing expense:', error, expense);
        }
        return acc;
    }, {});

    // Convert to array and sort by date
    const data = Object.entries(chartData)
        .map(([date, data]) => ({
            date,
            amount: data.amount,
            expenses: data.expenses,
        }))
        .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA.getTime() - dateB.getTime();
        });

    if (data.length === 0) {
        return (
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Expenses Over Time</CardTitle>
                </CardHeader>
                <CardContent className="pl-2 flex items-center justify-center h-[200px] text-muted-foreground">
                    No expense data available
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Expenses Over Time</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => {
                                    // Format date for x-axis without timezone conversion
                                    const [, month, day] = value.split('-');
                                    return `${month}/${day}`;
                                }}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip 
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                <div className="font-medium">
                                                    {data.date}
                                                </div>
                                                <div className="mt-1 font-bold">
                                                    Total: ${data.amount.toFixed(2)}
                                                </div>
                                                <div className="mt-2">
                                                    <div className="text-sm font-medium">Expenses:</div>
                                                    {data.expenses.map((expense: Expense) => (
                                                        <div key={expense.id} className="text-sm text-muted-foreground">
                                                            ${expense.amount.toFixed(2)} - {expense.name} ({expense.description})
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar
                                dataKey="amount"
                                fill="currentColor"
                                radius={[4, 4, 0, 0]}
                                className="fill-primary"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
} 