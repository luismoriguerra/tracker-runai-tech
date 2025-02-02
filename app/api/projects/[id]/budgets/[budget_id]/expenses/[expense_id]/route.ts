import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { BudgetExpenseService } from '@/server/domain/budget_expense';
import { revalidatePath } from 'next/cache';

export const runtime = 'edge';

const budgetExpenseService = new BudgetExpenseService();

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string; budget_id: string; expense_id: string } }
) {
    try {
        const session = await getSession();
        const userId = session?.user.sub;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const updateData = await request.json();

        // Validate status if it's being updated
        if (updateData.status && !['pending', 'paid'].includes(updateData.status)) {
            return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
        }

        console.log(JSON.stringify(updateData, null, 2));

        await budgetExpenseService.updateBudgetExpense(params.expense_id, updateData);

        revalidatePath(`/projects/${params.id}`);
        console.log('revalidated', `/projects/${params.id}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating budget expense:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string; budget_id: string; expense_id: string } }
) {
    try {
        const session = await getSession();
        const userId = session?.user.sub;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await budgetExpenseService.deleteBudgetExpense(params.expense_id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting budget expense:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 