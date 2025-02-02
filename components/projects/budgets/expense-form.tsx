import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ExpenseDateAndAmount } from './expense-date-amount';
import { Expense } from '@/types/expense';
import { useState, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ImageService } from '@/services/image-service';
import Image from 'next/image';

interface ExpenseFormProps {
    expense: Expense;
    onSave: (file?: File) => Promise<void>;
    onCancel: () => void;
    editExpense: Expense | null;
    setEditExpense: (expense: Expense) => void;
}

export function ExpenseForm({ expense, onSave, onCancel, editExpense, setEditExpense }: ExpenseFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        editExpense?.file_path ? ImageService.getImageUrl(editExpense.file_path) : null
    );

    // Cleanup object URLs when component unmounts
    useEffect(() => {
        return () => {
            if (file && previewUrl) {
                ImageService.cleanupLocalImageUrl(previewUrl);
            }
        };
    }, [file, previewUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const url = ImageService.createLocalImageUrl(selectedFile);
            setPreviewUrl(url);
            setEditExpense({
                ...expense,
                file_path: selectedFile.name,
            });
        }
    };

    const handleSave = () => {
        if (file) {
            onSave(file);
        } else {
            onSave();
        }
    };

    return (
        <Card>
            <CardContent className="flex-1 space-y-4 p-4">
                <Input
                    value={editExpense?.name}
                    onChange={(e) =>
                        setEditExpense({
                            ...expense,
                            name: e.target.value,
                        })
                    }
                    placeholder="Name"
                />
                <Textarea
                    value={editExpense?.description}
                    onChange={(e) =>
                        setEditExpense({
                            ...expense,
                            description: e.target.value,
                        })
                    }
                    placeholder="Description"
                />
                <ExpenseDateAndAmount
                    expense={expense}
                    editExpense={editExpense}
                    setEditExpense={setEditExpense}
                />
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
                            <Image
                                src={previewUrl}
                                alt="Receipt preview"
                                className="w-full h-full object-cover"
                                fill
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
                    <Button onClick={handleSave}>Save</Button>
                    <Button variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
} 