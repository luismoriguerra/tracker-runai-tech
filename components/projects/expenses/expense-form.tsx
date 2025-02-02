import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parseISO } from 'date-fns';
import { z } from 'zod';

interface ExpenseFormData {
    name: string;
    description: string;
    expense_date: string;
    amount: number;
    status: 'pending' | 'paid';
}

interface ExpenseFormProps {
    initialData?: ExpenseFormData;
    onSubmit: (data: ExpenseFormData) => Promise<void>;
    onCancel: () => void;
}

const expenseSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    expense_date: z.string(),
    amount: z.number().positive(),
    status: z.enum(['pending', 'paid']),
});

export function ExpenseForm({ initialData, onSubmit, onCancel }: ExpenseFormProps) {
    const [formData, setFormData] = useState<ExpenseFormData>(
        initialData || {
            name: '',
            description: '',
            expense_date: format(new Date(), 'yyyy-MM-dd'),
            amount: 0,
            status: 'paid',
        }
    );

    const handleSubmit = async () => {
        try {
            const validatedData = expenseSchema.parse(formData);
            await onSubmit(validatedData);
        } catch (error) {
            console.error('Error validating form:', error);
        }
    };

    return (
        <Card>
            <CardContent className="space-y-4 p-4">
                <Input
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Name"
                />
                <Textarea
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Description"
                />
                <div className="flex items-center space-x-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.expense_date}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={parseISO(formData.expense_date)}
                                onSelect={(date) => {
                                    setFormData({
                                        ...formData,
                                        expense_date: format(date || new Date(), 'yyyy-MM-dd'),
                                    })
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <Input
                        type="number"
                        value={formData.amount}
                        onChange={(e) =>
                            setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                        }
                        placeholder="Amount"
                        className="w-[200px]"
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <Button onClick={handleSubmit}>Save</Button>
                    <Button variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
} 