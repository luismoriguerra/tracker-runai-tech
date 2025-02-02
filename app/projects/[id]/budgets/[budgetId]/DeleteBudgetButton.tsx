'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteBudgetButtonProps {
  projectId: string;
  budgetId: string;
}

export default function DeleteBudgetButton({ projectId, budgetId }: DeleteBudgetButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/projects/${projectId}/budgets/${budgetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete budget');
      }

      router.refresh();
    } catch (error) {
      console.error('Error deleting budget:', error);
      alert('Failed to delete budget. Please try again.');
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 w-full cursor-pointer text-sm"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
        <span className="text-destructive">Delete budget</span>
      </div>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the budget and all its expenses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 