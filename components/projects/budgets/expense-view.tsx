import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Expense } from '@/types/expense';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageService } from '@/services/image-service';
import Image from 'next/image';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

interface ExpenseViewProps {
    expense: Expense;
    onEdit: () => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, checked: boolean) => Promise<void>;
}

export function ExpenseView({ expense, onEdit, onDelete, onStatusChange }: ExpenseViewProps) {
    const [isStatusLoading, setIsStatusLoading] = useState(false);
    const { toast } = useToast();

    const handleStatusChange = async (id: string, checked: boolean) => {
        setIsStatusLoading(true);
        try {
            await onStatusChange(id, checked);
        } catch (error: unknown) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update expense status. Please try again.",
            });
        } finally {
            setIsStatusLoading(false);
        }
    };

    return (
        <Card>
            <CardContent className="p-4 flex items-center space-x-4">
                {/* Image Section */}
                {expense.file_path && (
                    <div className="group-image">
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="relative h-20 w-20 cursor-pointer">
                                    <Image
                                        src={ImageService.getImageUrl(expense.file_path)}
                                        alt="Expense Image"
                                        className="object-cover rounded-md"
                                        fill
                                    />
                                </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <div className="relative w-full aspect-[4/3]">
                                    <Image
                                        src={ImageService.getImageUrl(expense.file_path)}
                                        alt="Expense Image full view"
                                        className="w-full h-full object-contain"
                                        fill
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}

                {/* Details Section */}
                <div className="group-details flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <span className="font-medium">{expense.name}</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-gray-500">{expense.description}</p>
                        <span className="text-lg font-semibold block">
                            {formatCurrency(expense.amount)}
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-500">
                        <span>
                            {expense.expense_date ? format(parseISO(expense.expense_date), 'PP') : ''}
                        </span>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="group-actions flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={onEdit}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => onDelete(expense.id)}
                                    className="text-red-600"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            checked={expense.status === 'paid'}
                            onCheckedChange={(checked) => handleStatusChange(expense.id, checked as boolean)}
                            disabled={isStatusLoading}
                        />
                        <span className="text-sm text-gray-500">
                            {isStatusLoading ? 'Updating...' : expense.status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 