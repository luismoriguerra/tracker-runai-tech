import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, ImageIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

interface AddExpenseFormProps {
    onSubmit: (expense: NewExpense, file?: File) => Promise<void>;
    onCancel: () => void;
}

interface NewExpense {
    name: string;
    description: string;
    expense_date: string;
    amount: number;
    status: 'paid' | 'pending';
}

const expenseSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    expense_date: z.string(),
    amount: z.number().positive(),
});

export function AddExpenseForm({ onSubmit, onCancel }: AddExpenseFormProps) {
    const [newExpense, setNewExpense] = useState<NewExpense>({
        name: '',
        description: '',
        expense_date: format(new Date(), 'yyyy-MM-dd'),
        amount: 0,
        status: 'paid',
    });
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async () => {
        try {
            const validatedData = expenseSchema.parse(newExpense);
            await onSubmit({ ...validatedData, status: newExpense.status }, file || undefined);
        } catch (error) {
            console.error('Error validating expense:', error);
        }
    };

    return (
        <Card>
            <CardContent className="space-y-4 p-4">
                <Input
                    value={newExpense.name}
                    onChange={(e) =>
                        setNewExpense({ ...newExpense, name: e.target.value })
                    }
                    placeholder="Name"
                />
                <Textarea
                    value={newExpense.description}
                    onChange={(e) =>
                        setNewExpense({ ...newExpense, description: e.target.value })
                    }
                    placeholder="Description"
                />
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full sm:w-[200px] justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newExpense.expense_date}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={parseISO(newExpense.expense_date)}
                                onSelect={(date) => {
                                    if (date) {
                                        const dateStr = format(date, 'yyyy-MM-dd');
                                        setNewExpense({
                                            ...newExpense,
                                            expense_date: dateStr,
                                        });
                                    }
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <Input
                        type="number"
                        value={newExpense.amount}
                        onChange={(e) =>
                            setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })
                        }
                        placeholder="Amount"
                        className="w-full sm:w-[200px]"
                    />
                </div>
                <div className="space-y-4">
                    <Label htmlFor="receipt">Receipt Image</Label>
                    <Input
                        id="receipt"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                    />
                    {previewUrl ? (
                        <div className="relative w-full max-w-[300px] h-[200px] rounded-lg overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={previewUrl}
                                alt="Receipt preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-full max-w-[300px] h-[200px] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <div className="text-gray-500 flex flex-col items-center">
                                <ImageIcon className="w-8 h-8 mb-2" />
                                <span>No image selected</span>
                            </div>
                        </div>
                    )}
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