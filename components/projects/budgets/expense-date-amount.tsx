import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Expense } from '@/types/expense';

interface ExpenseDateAndAmountProps {
    expense: Expense;
    editExpense: Expense | null;
    setEditExpense: (expense: Expense) => void;
}

export function ExpenseDateAndAmount({ expense, editExpense, setEditExpense }: ExpenseDateAndAmountProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-[200px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editExpense?.expense_date || expense.expense_date}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={parseISO(editExpense?.expense_date || expense.expense_date)}
                        onSelect={(date) => {
                            setEditExpense({
                                ...expense,
                                expense_date: format(date || new Date(), 'yyyy-MM-dd'),
                            })
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            <Input
                type="number"
                value={editExpense?.amount}
                onChange={(e) =>
                    setEditExpense({
                        ...expense,
                        amount: parseFloat(e.target.value),
                    })
                }
                className="w-full sm:w-[200px]"
            />
        </div>
    );
} 