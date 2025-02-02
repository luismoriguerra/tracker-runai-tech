import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { BudgetExpense, BudgetExpenseService } from '@/server/domain/budget_expense';
import { revalidatePath } from 'next/cache';

export const runtime = 'edge';

const budgetExpenseService = new BudgetExpenseService();

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string; budget_id: string } }
) {
    try {
        const session = await getSession();
        const userId = session?.user.sub;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('params', params);

        const expenses = await budgetExpenseService.getBudgetExpenses(params.budget_id);
        return NextResponse.json(expenses);
    } catch (error) {
        console.error('Error fetching budget expenses:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string; budget_id: string } }
) {
    try {
        const session = await getSession();
        const userId = session?.user.sub;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body: Omit<BudgetExpense, 'id' | 'created_at' | 'updated_at'> = await request.json();
        const expense = await budgetExpenseService.createBudgetExpense({
            ...body,
            budget_id: params.budget_id,
        });

        revalidatePath(`/projects/${params.id}`);

        return NextResponse.json(expense, { status: 201 });
    } catch (error) {
        console.error('Error creating budget expense:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 