import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Budget } from "./types";

interface ExpenseFiltersProps {
    statusFilter: string;
    budgetFilter: string;
    onStatusChange: (value: string) => void;
    onBudgetChange: (value: string) => void;
    budgets: Budget[];
}

export function ExpenseFilters({
    statusFilter,
    budgetFilter,
    onStatusChange,
    onBudgetChange,
    budgets
}: ExpenseFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
            </Select>
            <Select value={budgetFilter} onValueChange={onBudgetChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by budget" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Budgets</SelectItem>
                    {budgets && budgets.map((budget) => (
                        <SelectItem key={budget.id} value={budget.id}>
                            {budget.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
} 