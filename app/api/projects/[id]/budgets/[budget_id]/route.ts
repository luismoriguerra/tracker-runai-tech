import { getSession } from '@auth0/nextjs-auth0/edge';
import { NextResponse } from 'next/server';
import { ProjectBudgetService } from '../../../../../../server/domain/budget';
import { ProjectsService } from '../../../../../../server/domain/projects';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: { id: string; budget_id: string } }
) {
  try {
    const session = await getSession();
    const userId = session?.user.sub;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const budgetService = new ProjectBudgetService();
    const budget = await budgetService.getBudget(params.budget_id, params.id);

    return NextResponse.json(budget);
  } catch (error) {
    console.error('Error fetching budget:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PUT /api/projects/[id]/budgets/[budget_id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string; budget_id: string } }
) {
  try {
    const session = await getSession();
    const userId = session?.user.sub;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Verify project ownership
    const projectsService = new ProjectsService();
    const project = await projectsService.getProject(params.id, userId);
    
    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }

    const body = await request.json();
    const { name, description, estimated_amount } = body;

    const budgetService = new ProjectBudgetService();
    const budget = await budgetService.updateBudget(params.budget_id, params.id, {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(estimated_amount !== undefined && { estimated_amount }),
    });

    if (!budget) {
      return new NextResponse('Budget not found', { status: 404 });
    }

    return NextResponse.json(budget);
  } catch (error) {
    console.error('Error updating budget:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE /api/projects/[id]/budgets/[budget_id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; budget_id: string } }
) {
  try {
    const session = await getSession();
    const userId = session?.user.sub;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Verify project ownership
    const projectsService = new ProjectsService();
    const project = await projectsService.getProject(params.id, userId);
    
    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }

    const budgetService = new ProjectBudgetService();
    const success = await budgetService.deleteBudget(params.budget_id, params.id);

    if (!success) {
      return new NextResponse('Budget not found', { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 