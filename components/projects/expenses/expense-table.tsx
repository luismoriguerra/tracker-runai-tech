import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { Expense } from "./types";
import Image from "next/image";
import { ImageService } from "@/services/image-service";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";

interface ExpenseTableProps {
    expenses: Expense[];
}

export function ExpenseTable({ expenses }: ExpenseTableProps) {
    return (
        <div className="hidden md:block">
            <Table>
                <TableCaption>A list of your recent expenses.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Receipt</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        {/* <TableHead className="w-[100px]">Actions</TableHead> */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expenses.map((expense) => (
                        <TableRow key={expense.id}>
                            <TableCell>
                                {expense.file_path ? (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div className="relative h-12 w-12 overflow-hidden rounded-md cursor-pointer hover:opacity-80 transition-opacity">
                                                <Image
                                                    src={ImageService.getImageUrl(expense.file_path)}
                                                    alt={`Receipt for ${expense.name}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="48px"
                                                />
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                            <div className="relative w-full aspect-[4/3]">
                                                <Image
                                                    src={ImageService.getImageUrl(expense.file_path)}
                                                    alt={`Receipt for ${expense.name} - Full View`}
                                                    className="object-contain"
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 800px"
                                                />
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                ) : (
                                    <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                                        <span className="text-xs text-muted-foreground">No receipt</span>
                                    </div>
                                )}
                            </TableCell>
                            <TableCell className="font-medium">{expense.name}</TableCell>
                            <TableCell>{expense.description}</TableCell>
                            <TableCell>{expense.budget.name}</TableCell>
                            <TableCell className="capitalize">{expense.status}</TableCell>
                            <TableCell>{format(parseISO(expense.expense_date), 'MMM dd, yyyy')}</TableCell>
                            <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
} 