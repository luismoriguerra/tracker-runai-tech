import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import DeleteBudgetButton from '@/app/projects/[id]/budgets/[budgetId]/DeleteBudgetButton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BudgetActionsProps {
    projectId: string;
    budgetId: string;
}

export function BudgetActions({ projectId, budgetId }: BudgetActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>
                    <DeleteBudgetButton projectId={projectId} budgetId={budgetId} />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 