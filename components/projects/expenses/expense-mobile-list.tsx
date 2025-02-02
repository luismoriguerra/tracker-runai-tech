import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Expense } from "./types";
import Image from "next/image";
import { ImageService } from "@/services/image-service";

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
                        {expense.file_path && (
                            <div className="mt-4">
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
                    </CardContent>
                </Card>
            ))}
        </div>
    );
} 