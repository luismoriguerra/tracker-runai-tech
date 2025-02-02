import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { ExpensesService } from '@/server/domain/expenses';

export const runtime = 'edge';

const expensesService = new ExpensesService();

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        const userId = session?.user.sub;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const expenses = await expensesService.getProjectExpenses(params.id, userId);
        return NextResponse.json(expenses);
    } catch (error) {
        console.error('Error fetching project expenses:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        const userId = session?.user.sub;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const expense = await expensesService.createExpense({
            ...body,
            project_id: params.id,
            user_id: userId,
        });

        return NextResponse.json(expense, { status: 201 });
    } catch (error) {
        console.error('Error creating project expense:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
) {
    try {
        const session = await getSession();
        const userId = session?.user.sub;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { expenseId, ...updateData } = await request.json();

        // Validate status if it's being updated
        if (updateData.status && !['pending', 'paid'].includes(updateData.status)) {
            return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
        }

        await expensesService.updateExpense(expenseId, userId, updateData);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating project expense:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
) {
    try {
        const session = await getSession();
        const userId = session?.user.sub;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { expenseId } = await request.json();
        await expensesService.deleteExpense(expenseId, userId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting project expense:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 